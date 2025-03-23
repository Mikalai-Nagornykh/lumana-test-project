import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  artistsEntityAdapter,
  artistsFeatureKey,
  ArtistsState,
} from './artists.reducers';

const selectArtistsFeature =
  createFeatureSelector<ArtistsState>(artistsFeatureKey);

export const selectAllArtists = createSelector(
  selectArtistsFeature,
  artistsEntityAdapter.getSelectors().selectAll,
);

export const selectSelectedArtist = createSelector(
  selectArtistsFeature,
  (state) =>
    state.selectedArtistId ? state.entities[state.selectedArtistId] : null,
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
  selectSelectedArtist,
};
