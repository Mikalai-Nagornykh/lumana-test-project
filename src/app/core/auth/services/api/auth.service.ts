import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ACCOUNT_API_URL_TOKEN,
  BaseApiService,
  CLIENT_ID_TOKEN,
  CLIENT_SECRET_TOKEN,
} from '@services';
import { Observable } from 'rxjs';
import { TokenRequestModel, TokenResponseModel } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private accountUrl = inject(ACCOUNT_API_URL_TOKEN);
  private clientId = inject(CLIENT_ID_TOKEN);
  private clientSecret = inject(CLIENT_SECRET_TOKEN);

  getAccessToken(): Observable<TokenResponseModel> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');

    return this.httpClient.post<TokenResponseModel>(
      `${this.accountUrl}/api/token`,
      body,
      {
        headers,
      },
    );
  }

  private refreshToken() {}
}
