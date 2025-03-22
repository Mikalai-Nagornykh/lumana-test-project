import { inject, Injectable } from '@angular/core';
import { LoadingType } from '@constants';
import { LoadOptionsModel } from '@models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { ArtistService } from '@services';
import { LoadingActions } from '@store';
import { filter, map, switchMap } from 'rxjs';

import { ArtistsActions } from './artists.actions';
import { ArtistsState } from './artists.reducers';
import { ArtistsSelectors } from './artists.selectors';

@Injectable()
export class ArtistsEffect {
  private artistsStore = inject<Store<ArtistsState>>(Store<ArtistsState>);
  private actions = inject(Actions);
  private artistService = inject(ArtistService);

  getArtists = createEffect(() =>
    this.actions.pipe(
      ofType(ArtistsActions.getArtists, ArtistsActions.setFilterOptions),
      concatLatestFrom(() => [
        this.artistsStore.select(ArtistsSelectors.selectLoadOptions),
        this.artistsStore.select(ArtistsSelectors.selectFilterOptions),
      ]),
      switchMap(([, loadOptions, filterOptions]) =>
        this.artistService
          .getArtists(loadOptions, filterOptions)
          .pipe(map((response) => ArtistsActions.getArtistsSuccess(response))),
      ),
    ),
  );

  loadMoreArtists = createEffect(() =>
    this.actions.pipe(
      ofType(ArtistsActions.loadMoreArtists),
      concatLatestFrom(() => [
        this.artistsStore
          .select(ArtistsSelectors.selectMeta)
          .pipe(filter(Boolean)),
        this.artistsStore.select(ArtistsSelectors.selectFilterOptions),
      ]),
      switchMap(([, meta, filterOptions]) => {
        const loadOptions: LoadOptionsModel = {
          limit: meta.limit,
          offset: meta.offset + meta.limit,
        };
        return this.artistService
          .getArtists(loadOptions, filterOptions)
          .pipe(map((response) => ArtistsActions.getArtistsSuccess(response)));
      }),
    ),
  );

  addLoading = createEffect(() =>
    this.actions.pipe(
      ofType(
        ArtistsActions.setFilterOptions,
        ArtistsActions.getArtists,
        ArtistsActions.loadMoreArtists,
      ),
      map(() => {
        return LoadingActions.addLoading(LoadingType.ARTISTS_LIST);
      }),
    ),
  );

  removeLoading = createEffect(() =>
    this.actions.pipe(
      ofType(ArtistsActions.getArtistsSuccess, ArtistsActions.getArtistsError),
      map(() => LoadingActions.removeLoading(LoadingType.ARTISTS_LIST)),
    ),
  );
}
