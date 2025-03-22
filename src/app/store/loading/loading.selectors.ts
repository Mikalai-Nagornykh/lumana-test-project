import { LoadingType } from '@constants';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoadingState } from './loading.reducers';

const loadingFeatureSelector = createFeatureSelector<LoadingState>('loading');

export const selectLoadingTypes = createSelector(
  loadingFeatureSelector,
  (state: LoadingState) => state.types,
);

export const selectLoading = createSelector(
  selectLoadingTypes,
  (types: LoadingType[], props: { type: LoadingType }) =>
    types.includes(props.type),
);

export const selectInRequest = createSelector(
  loadingFeatureSelector,
  (state) => state.inRequestQueue > 0,
);

export const LoadingSelectors = {
  selectLoading,
  selectInRequest,
};
