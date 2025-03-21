import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_API_URL_TOKEN } from '../tokens';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  protected httpClient = inject(HttpClient);
  protected url = inject(BASE_API_URL_TOKEN);
}
