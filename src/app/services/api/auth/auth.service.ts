import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LocalStorageService } from '../../common';
import { BaseApiService } from '../base-api.service';
import { AUTH_STORAGE_KEYS } from './constants/auth.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private clientId = '93348706b7914a789db78b5e2b5ccb93';
  private clientSecret = '46935b1c0f4f4981b30b6b1a8210bea1';
  private tokenUrl = 'https://accounts.spotify.com/api/token';
  private localStorage = inject(LocalStorageService);

  getAccessToken(): Observable<{ access_token: string; expires_in: number }> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');

    return this.httpClient
      .post<{
        access_token: string;
        expires_in: number;
      }>(`${this.tokenUrl}`, body.toString(), { headers })
      .pipe(
        tap((response) => {
          this.saveToken(response.access_token, response.expires_in);
        }),
      );
  }

  private saveToken(token: string, expiresIn: number): void {
    const expiresAt = Date.now() + expiresIn * 1000; // время истечения токена
    this.localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem('spotify_token_expires', expiresAt.toString());
  }
}
