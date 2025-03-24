import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SelectedPolygonsModel } from '../models/selected-polygons.model';
import { Polygon } from '../utils/classes/canvas-polygon.class';
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

export const selectAllPolygons = createSelector(
  selectArtistsFeature,
  (state) => state.selectedPolygons,
);

export const selectPolygonsBySelectedArtist = (artistId: string) =>
  createSelector(
    selectAllPolygons,
    (selectedPolygons: SelectedPolygonsModel[]): Polygon[] => {
      return selectedPolygons
        .filter((sp) => sp.artistId === artistId)
        .map((selectedPolygons) => selectedPolygons.polygons)
        .flat() as Polygon[];
    },
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

export const selectSearchTokens = createSelector(
  selectArtistsFeature,
  (state) => state.searchTokens,
);

export const ArtistsSelectors = {
  selectAllArtists,
  selectLoadOptions,
  selectFilterOptions,
  selectMeta,
  selectSelectedArtist,
  selectAllPolygons,
  selectPolygonsBySelectedArtist,
  selectSearchTokens,
};
