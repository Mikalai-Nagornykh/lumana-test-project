import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoadingType } from '@constants';
import { ScrollEndDirective } from '@directives';
import { ArtistModel } from '@models';
import { Store } from '@ngrx/store';
import { LoadingSelectors, LoadingState } from '@store';
import { combineLatest, debounceTime, map, startWith, Subject } from 'rxjs';
import { MATRIX_BREAKPOINTS } from '../../constants/virtuall-scroll-matrix-breakpoints.const';
import { DialogWithCanvasComponent } from '../../features/dialog-with-canvas/dialog-with-canvas.component';
import { SelectedPolygonsModel } from '../../models/selected-polygons.model';
import { ArtistActions, ArtistsActions } from '../../store/artists.actions';
import { ArtistsState } from '../../store/artists.reducers';
import { ArtistsSelectors } from '../../store/artists.selectors';
import { ArtistCardComponent } from '../../ui/artist-card/artist-card.component';
import { AutocompleteSearchComponent } from '../../ui/autocomplete-search/autocomplete-search.component';
import { Polygon } from '../../utils/classes/canvas-polygon.class';

@Component({
  selector: 'app-artist-list',
  imports: [
    ScrollingModule,
    ReactiveFormsModule,
    ArtistCardComponent,
    NgTemplateOutlet,
    AutocompleteSearchComponent,
    DialogWithCanvasComponent,
    ScrollEndDirective,
  ],
  templateUrl: './artist-list.component.html',
  styleUrl: './artist-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistListComponent implements OnInit {
  private virtualScrollViewport = viewChild(CdkVirtualScrollViewport);

  private artistsStore = inject<Store<ArtistsState>>(Store<ArtistsState>);
  private loadingStore = inject<Store<LoadingState>>(Store<LoadingState>);

  private recheckArtistsTrigger = new Subject<number>();

  protected readonly artistsWithPolygonsIndicator = toSignal(
    combineLatest([
      this.artistsStore.select(ArtistsSelectors.selectAllArtists),
      this.artistsStore.select(ArtistsSelectors.selectAllPolygons),
      this.recheckArtistsTrigger.pipe(startWith(1)),
    ]).pipe(
      map(([artists, polygons]) => {
        if (polygons?.length) {
          const artistsWithPolygons = new Set(
            polygons.map((sp) => sp.polygons.length && sp.artistId),
          );

          return (
            artists?.map((artist) => ({
              ...artist,
              hasPolygons: artistsWithPolygons.has(artist.id),
            })) ?? []
          );
        }
        return artists;
      }),
    ),
  );

  protected readonly searchTokens = toSignal(
    this.artistsStore.select(ArtistsSelectors.selectSearchTokens),
  );

  protected readonly loading = toSignal(
    this.loadingStore.select(
      LoadingSelectors.selectLoadingByType(LoadingType.ARTISTS_LIST),
    ),
  );

  protected readonly selectedArtist = toSignal(
    this.artistsStore.select(ArtistsSelectors.selectSelectedArtist),
  );

  protected readonly searchControl = new FormControl<string | null>(null);
  protected readonly Array = Array;

  protected readonly artistsMatrix = signal<ArtistModel[][]>([]);
  protected readonly polygonsBySelectedArtist = signal<Polygon[]>([]);
  protected readonly isShowModal = signal<boolean>(false);

  private scrollEndEmit = new Subject<void>();

  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const artists = this.artistsWithPolygonsIndicator();
      if (artists) {
        untracked(() => {
          this.artistsMatrix.set(this.changeMatrixSizes(artists, 5));
        });
      }
    });

    effect(() => {
      const viewport = this.virtualScrollViewport();
      if (viewport) {
        this.initializeObserver(viewport);
      }
    });

    effect(() => {
      const artist = this.selectedArtist();
      if (artist) {
        untracked(() => {
          this.artistsStore
            .select(ArtistsSelectors.selectPolygonsBySelectedArtist(artist.id))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((polygons) => {
              this.polygonsBySelectedArtist.set(polygons);
            });
        });
      }
    });
  }

  ngOnInit() {
    this.artistsStore.dispatch(ArtistsActions.getArtists());

    this.scrollEndEmit
      .pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.artistsStore.dispatch(ArtistsActions.loadMoreArtists());
      });

    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value),
        debounceTime(500),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.artistsStore.dispatch(
          ArtistsActions.setFilterOptions({ search: value }),
        );
      });
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  protected scrollEnd(): void {
    this.scrollEndEmit.next();
  }

  protected selectArtist(artistId: string): void {
    this.isShowModal.set(true);
    this.artistsStore.dispatch(ArtistActions.setSelectedArtistId(artistId));
  }

  protected closeDialog(isClose: boolean): void {
    this.isShowModal.set(!isClose);
  }

  protected onSavePolygons(polygons: Polygon[], artistId: string): void {
    const selectedPolygons: SelectedPolygonsModel = {
      artistId,
      polygons: polygons,
    };
    this.artistsStore.dispatch(ArtistActions.setPolygons(selectedPolygons));
    this.isShowModal.set(false);
    this.recheckArtistsTrigger.next(1);
  }

  private initializeObserver(viewport: CdkVirtualScrollViewport): void {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;

        const breakpoint = MATRIX_BREAKPOINTS.find(
          (breakpoint) =>
            width >= (breakpoint.minWidth || 0) &&
            width <= (breakpoint.maxWidth || Infinity),
        );

        if (breakpoint) {
          this.artistsMatrix.set(
            this.changeMatrixSizes(
              this.artistsWithPolygonsIndicator() ?? [],
              breakpoint.columns,
            ),
          );
        }
      }
    });

    resizeObserver.observe(viewport.elementRef.nativeElement);
  }

  private changeMatrixSizes(
    movies: ArtistModel[],
    size: number,
  ): ArtistModel[][] {
    return Array.from({ length: Math.ceil(movies.length / size) }, (_, i) =>
      movies.slice(i * size, (i + 1) * size),
    );
  }
}
