import { createFeatureSelector, createSelector } from '@ngrx/store';
import { artistsEntityAdapter, ArtistsState } from './artists.reducers';

const selectArtistsFeature = createFeatureSelector<ArtistsState>('artists');

export const selectAllArtists = createSelector(
  selectArtistsFeature,
  artistsEntityAdapter.getSelectors().selectAll,
);

export const selectLoadOptions = createSelector(
  selectArtistsFeature,
  (state) => state.loadOptions,
);

export const selectFilterOptions = createSelector(
  selectArtistsFeature,
  (state) => state.filterOptions,
);

export const selectMeta = createSelector(
  selectArtistsFeature,
  (state) => state.meta,
);

export const ArtistsSelectors = {
  selectAllArtists,
  selectLoadOptions,
  selectFilterOptions,
  selectMeta,
};
