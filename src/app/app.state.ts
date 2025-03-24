import { ActionReducerMap } from '@ngrx/store';

import { loadingReducer, LoadingState } from '@store';
import {
  artistsReducer,
  ArtistsState,
} from './pages/artists/store/artists.reducers';

export type AppState = {
  loading: LoadingState;
  artists: ArtistsState;
};

export const appReducers: ActionReducerMap<AppState> = {
  loading: loadingReducer,
  artists: artistsReducer.reducer,
};
