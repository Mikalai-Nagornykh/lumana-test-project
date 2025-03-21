import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  protected httpClient = inject(HttpClient);
  protected url = environment.baseApiUrl;
}
