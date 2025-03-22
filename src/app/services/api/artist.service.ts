import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ArtistModel,
  FilterOptionsModel,
  LoadOptionsModel,
  PaginationResult,
} from '@models';
import { map, Observable } from 'rxjs';
import { BaseApiService } from '../common';

@Injectable({
  providedIn: 'root',
})
export class ArtistService extends BaseApiService {
  public getArtists(
    loadOptions: LoadOptionsModel,
    filterOptions: FilterOptionsModel | null,
  ): Observable<PaginationResult<ArtistModel>> {
    const params = new HttpParams()
      .set('type', 'artist')
      .set('q', `artist:${filterOptions?.search}`)
      .set('limit', loadOptions.limit.toString())
      .set('offset', loadOptions.offset.toString());

    return this.httpClient
      .get<{
        artists: PaginationResult<ArtistModel>;
      }>(`${this.url}/v1/search`, { params })
      .pipe(map((response) => response.artists));
  }
}
