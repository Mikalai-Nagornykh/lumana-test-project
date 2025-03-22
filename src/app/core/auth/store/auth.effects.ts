import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LocalStorageService } from '@services';
import { catchError, exhaustMap, map, of, switchMap, tap, timer } from 'rxjs';
import { AUTH_STORAGE_KEYS } from '../constants';
import { TokenResponseModel } from '../models';
import { AuthService } from '../services/api/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions = inject(Actions);
  private authService = inject(AuthService);
  private localStorage = inject(LocalStorageService);

  getAccessToken = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActions.getAccessToken),
      switchMap(() =>
        this.authService.getAccessToken().pipe(
          tap((response) => this.storeToken(response)),
          map((response) => AuthActions.getAccessTokenSuccess(response)),
          catchError(() => of()),
        ),
      ),
    ),
  );

  refreshAccessToken = createEffect(() =>
    this.actions.pipe(
      ofType(
        AuthActions.getAccessTokenSuccess,
        AuthActions.refreshAccessTokenSuccess,
      ),
      switchMap(({ response }) =>
        timer((response.expires_in - 120) * 1000).pipe(
          exhaustMap(() =>
            this.authService.getAccessToken().pipe(
              tap((newResponse) => this.storeToken(newResponse)),
              map((newResponse) =>
                AuthActions.refreshAccessTokenSuccess(newResponse),
              ),
              catchError(() => of()),
            ),
          ),
        ),
      ),
    ),
  );

  private storeToken(response: TokenResponseModel) {
    this.localStorage.setItem(
      AUTH_STORAGE_KEYS.ACCESS_TOKEN,
      response.access_token,
    );
    this.localStorage.setItem(
      AUTH_STORAGE_KEYS.EXPIRES_IN,
      response.expires_in.toString(),
    );
  }
}
