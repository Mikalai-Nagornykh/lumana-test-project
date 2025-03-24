import { LoadingType } from '@constants';
import { createReducer, on } from '@ngrx/store';
import { LoadingActions } from './loading.actions';

export interface LoadingState {
  types: LoadingType[];
  inRequestQueue: number;
}

const initialState: LoadingState = {
  types: [],
  inRequestQueue: 0,
};

export const loadingReducer = createReducer(
  initialState,
  on(LoadingActions.addLoading, (state, { loadingType }) => ({
    ...state,
    types: [...state.types, loadingType],
  })),
  on(LoadingActions.removeLoading, (state, { loadingType }) => ({
    ...state,
    types: state.types.filter((type) => type !== loadingType),
  })),
  on(LoadingActions.startRequest, (state) => ({
    ...state,
    inRequestQueue: state.inRequestQueue + 1,
  })),
  on(LoadingActions.endRequest, (state) => ({
    ...state,
    inRequestQueue: state.inRequestQueue - 1,
  })),
);
