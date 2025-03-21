import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ACCOUNT_API_URL_TOKEN, BaseApiService } from '@services';
import { Observable } from 'rxjs';
import { TokenRequestModel, TokenResponseModel } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private accountUrl = inject(ACCOUNT_API_URL_TOKEN);

  getAccessToken(payload: TokenRequestModel): Observable<TokenResponseModel> {
    const headers = new HttpHeaders({
      Authorization:
        'Basic ' + btoa(`${payload.client_id}:${payload.client_secret}`),
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
}
