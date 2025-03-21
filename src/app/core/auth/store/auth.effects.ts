import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LocalStorageService } from '@services';
import { catchError, map, of, switchMap } from 'rxjs';
import { AUTH_STORAGE_KEYS } from '../constants';
import { AuthService } from '../services/api/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private store = inject(Store);
  private actions = inject(Actions);
  private authService = inject(AuthService);
  private localStorage = inject(LocalStorageService);

  getAccessToken = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActions.getAccessToken),
      switchMap(({ payload }) =>
        this.authService.getAccessToken(payload).pipe(
          map((response) => {
            this.localStorage.setItem(
              AUTH_STORAGE_KEYS.ACCESS_TOKEN,
              response.access_token,
            );
            return AuthActions.getAccessTokenSuccess(response);
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // this.store.dispatch(refreshTokenRequest());
            }
            return of();
          }),
        ),
      ),
    ),
  );
}
