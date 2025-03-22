import { inject, Injectable } from '@angular/core';
import { LoadingType } from '@constants';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { ArtistService } from '@services';
import { map, switchMap } from 'rxjs';
import { LoadingActions } from '../../../store/loading/loading.actions';

import { ArtistsActions } from './artists.actions';
import { ArtistsState } from './artists.reducers';
import { ArtistsSelectors } from './artists.selectors';

@Injectable()
export class ArtistsEffect {
  private store = inject(Store<ArtistsState>);
  private actions = inject(Actions);
  private artistService = inject(ArtistService);

  getArtists = createEffect(() =>
    this.actions.pipe(
      ofType(
        ArtistsActions.getArtists,
        ArtistsActions.setLoadOptions,
        ArtistsActions.setFilterOptions,
      ),
      concatLatestFrom(() => [
        this.store.select(ArtistsSelectors.selectLoadOptions),
        this.store.select(ArtistsSelectors.selectFilterOptions),
      ]),
      switchMap(([, loadOptions, filterOptions]) =>
        this.artistService
          .getArtists(loadOptions, filterOptions)
          .pipe(map((response) => ArtistsActions.getArtistsSuccess(response))),
      ),
    ),
  );

  addLoading = createEffect(() =>
    this.actions.pipe(
      ofType(ArtistsActions.setFilterOptions, ArtistsActions.getArtists),
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
