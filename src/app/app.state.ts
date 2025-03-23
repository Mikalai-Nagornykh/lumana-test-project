import { ActionReducerMap } from '@ngrx/store';
import {
  artistsReducer,
  ArtistsState,
} from './pages/main/store/artists.reducers';
import { loadingReducer, LoadingState } from '@store';

export type AppState = {
  loading: LoadingState;
  artists: ArtistsState;
};

export const appReducers: ActionReducerMap<AppState> = {
  loading: loadingReducer,
  artists: artistsReducer.reducer,
};
