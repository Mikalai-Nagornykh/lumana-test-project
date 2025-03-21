import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { applyTokenInterceptor, AuthEffects } from '@auth';
import { environment } from '@environments';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import {
  ACCOUNT_API_URL_TOKEN,
  BASE_API_URL_TOKEN,
  CLIENT_ID_TOKEN,
  CLIENT_SECRET_TOKEN,
} from '@services';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([applyTokenInterceptor])),
    provideStore(),
    provideEffects([AuthEffects]),
    {
      provide: BASE_API_URL_TOKEN,
      useValue: environment.baseApiUrl,
    },
    {
      provide: ACCOUNT_API_URL_TOKEN,
      useValue: environment.accountUrl,
    },
    {
      provide: CLIENT_ID_TOKEN,
      useValue: environment.clientId,
    },
    {
      provide: CLIENT_SECRET_TOKEN,
      useValue: environment.clientSecret,
    },
  ],
};
