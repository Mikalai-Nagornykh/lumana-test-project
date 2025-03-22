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
});

export const artistsReducer = createReducer(
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
);
