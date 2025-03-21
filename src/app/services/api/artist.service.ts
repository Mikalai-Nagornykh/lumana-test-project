import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArtistModel, CommonPaginationResponse } from '@models';
import { map, Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class ArtistService extends BaseApiService {
  public getArtists(
    query: string = 't',
    limit: number = 50,
    offset: number = 0,
  ): Observable<CommonPaginationResponse<ArtistModel>> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'artist')
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.httpClient
      .get<{
        artists: CommonPaginationResponse<ArtistModel>;
      }>(`${this.url}/v1/search`, { params })
      .pipe(map((response) => response.artists));
  }
}
