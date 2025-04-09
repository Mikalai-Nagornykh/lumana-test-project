import { HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ACCOUNT_API_URL_TOKEN,
  BaseApiService,
  CLIENT_ID_TOKEN,
  CLIENT_SECRET_TOKEN,
} from '@services';
import { Observable } from 'rxjs';
import { TokenResponseModel } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private accountUrl = inject(ACCOUNT_API_URL_TOKEN);
  private clientId = inject(CLIENT_ID_TOKEN);
  private clientSecret = inject(CLIENT_SECRET_TOKEN);

  getAccessToken(): Observable<TokenResponseModel> {
    const params = new HttpParams().set('grant_type', 'client_credentials');
    const authHeader = `Basic ${this.encodedCredentials}`;
    const headers = new HttpHeaders()
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient.post<TokenResponseModel>(
      `${this.accountUrl}/api/token`,
      params,
      {
        headers,
      },
    );
  }

  private get encodedCredentials(): string {
    return btoa(`${this.clientId}:${this.clientSecret}`);
  }
}
