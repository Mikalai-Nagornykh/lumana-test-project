import {
  ArtistModel,
  FilterOptionsModel,
  LoadOptionsModel,
  Meta,
} from '@models';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SelectedPolygonsModel } from '../models/selected-polygons.model';
import { ArtistActions, ArtistsActions } from './artists.actions';

export interface ArtistsState extends EntityState<ArtistModel> {
  meta: Meta | null;
  loadOptions: LoadOptionsModel;
  filterOptions: FilterOptionsModel | null;
  selectedArtistId: string | null;
  selectedPolygons: SelectedPolygonsModel[];
  searchTokens: string[];
}

export const artistsEntityAdapter: EntityAdapter<ArtistModel> =
  createEntityAdapter<ArtistModel>({
    selectId: (artist) => artist.id,
  });

const initialLoadOptions: LoadOptionsModel = {
  limit: 50,
  offset: 1,
};

const initialState: ArtistsState = artistsEntityAdapter.getInitialState({
  meta: {
    limit: 0,
    offset: 0,
    total: 0,
    href: '',
    next: null,
    previous: null,
  },
  loadOptions: initialLoadOptions,
  filterOptions: null,
  entities: [],
  selectedArtistId: '',
  selectedPolygons: [],
  searchTokens: [],
});

export const artistsFeatureKey = 'artists';

export const artistsReducer = createFeature({
  name: artistsFeatureKey,
  reducer: createReducer(
    initialState,
    on(ArtistsActions.getArtistsSuccess, (state, { paginationResult }) =>
      artistsEntityAdapter.addMany(paginationResult.items, {
        ...state,
        meta: {
          limit: paginationResult.limit,
          offset: paginationResult.offset,
          total: paginationResult.total,
          href: paginationResult.href,
          next: paginationResult.next,
          previous: paginationResult.previous,
        },
      }),
    ),
    on(ArtistsActions.setFilterOptions, (state, { filterOptions }) =>
      artistsEntityAdapter.removeAll({
        ...state,
        filterOptions,
      }),
    ),
    on(ArtistActions.setSelectedArtistId, (state, { id }) => ({
      ...state,
      selectedArtistId: id,
    })),
    on(ArtistActions.setPolygons, (state, { polygons }) => {
      const artistId = polygons.artistId;
      const existingIndex = state.selectedPolygons.findIndex(
        (sp) => sp.artistId === artistId,
      );

      if (existingIndex !== -1) {
        const updatedPolygons = state.selectedPolygons.map((sp, index) => {
          if (index === existingIndex) {
            return { artistId, polygons: polygons.polygons };
          }
          return sp;
        });

        return {
          ...state,
          selectedPolygons: updatedPolygons,
        };
      } else {
        return {
          ...state,
          selectedPolygons: [...state.selectedPolygons, polygons],
        };
      }
    }),
    on(ArtistsActions.addSearchTokens, (state, { tokens }) => ({
      ...state,
      searchTokens: Array.from(new Set([...state.searchTokens, ...tokens])),
    })),
  ),
});
