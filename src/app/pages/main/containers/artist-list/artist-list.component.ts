import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ArtistModel } from '@models';

import { ArtistService } from '@services';
import { MATRIX_BREAKPOINTS } from '../../constants/virtuall-scroll-matrix-breakpoints.const';
import { ArtistCardComponent } from '../../ui/artist-card/artist-card.component';

@Component({
  selector: 'app-artist-list',
  imports: [ArtistCardComponent, ScrollingModule],
  templateUrl: './artist-list.component.html',
  styleUrl: './artist-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistListComponent {
  private virtualScrollViewport = viewChild(CdkVirtualScrollViewport);

  private heroesService = inject(ArtistService);

  protected readonly artists = toSignal(this.heroesService.getArtists());

  protected artistsMatrix = signal<ArtistModel[][]>([]);

  constructor() {
    effect(() => {
      const artists = this.artists()?.items;
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
  }

  public trackByIndex(index: number): number {
    return index;
  }

  protected nextBatch(index: number): void {
    const total = this.virtualScrollViewport()?.getDataLength() ?? 0;
    if (index > total / 1.9) {
      console.log('true');
    }
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
              this.artists()?.items ?? [],
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
