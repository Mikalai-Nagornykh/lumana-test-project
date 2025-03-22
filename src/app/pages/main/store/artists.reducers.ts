import {
  ArtistModel,
  FilterOptionsModel,
  LoadOptionsModel,
  Meta,
} from '@models';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ArtistsActions } from './artists.actions';

export interface ArtistsState extends EntityState<ArtistModel> {
  meta: Meta | null;
  loadOptions: LoadOptionsModel;
  filterOptions: FilterOptionsModel | null;
}

export const artistsEntityAdapter: EntityAdapter<ArtistModel> =
  createEntityAdapter<ArtistModel>({
    selectId: (artist) => artist.id,
  });

const initialState: ArtistsState = artistsEntityAdapter.getInitialState({
  meta: null,
  loadOptions: {
    limit: 50,
    offset: 1,
  },
  filterOptions: null,
  entities: [],
});

export const artistsReducer = createReducer(
  initialState,
  on(ArtistsActions.getArtistsSuccess, (state, { paginationResult }) =>
    artistsEntityAdapter.setAll(paginationResult.items, {
      ...state,
      meta: paginationResult.meta,
    }),
  ),
  on(ArtistsActions.setLoadOptions, (state, { loadOptions }) => ({
    ...state,
    loadOptions,
  })),
  on(ArtistsActions.setFilterOptions, (state, { filterOptions }) => ({
    ...state,
    filterOptions,
  })),
);
