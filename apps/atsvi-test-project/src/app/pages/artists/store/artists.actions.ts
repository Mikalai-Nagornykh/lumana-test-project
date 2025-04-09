import { HttpErrorResponse } from '@angular/common/http';
import { ArtistModel, FilterOptionsModel, PaginationResult } from '@models';
import { createActionGroup, emptyProps } from '@ngrx/store';
import { SelectedPolygonsModel } from '../models/selected-polygons.model';

export const ArtistsActions = createActionGroup({
  source: 'Artists Page',
  events: {
    getArtists: emptyProps(),
    getArtistsSuccess: (paginationResult: PaginationResult<ArtistModel>) => ({
      paginationResult,
    }),
    getArtistsError: (error: HttpErrorResponse) => ({ error }),
    setFilterOptions: (filterOptions: FilterOptionsModel) => ({
      filterOptions,
    }),
    loadMoreArtists: emptyProps(),
    addSearchTokens: (tokens: string[]) => ({ tokens }),
  },
});

export const ArtistActions = createActionGroup({
  source: 'Artist Page',
  events: {
    setSelectedArtistId: (id: string | null) => ({ id }),
    setPolygons: (polygons: SelectedPolygonsModel) => ({ polygons }),
  },
});
