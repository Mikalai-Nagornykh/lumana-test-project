import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { applyTokenInterceptor, AuthEffects } from '@auth';
import { environment } from '@environments';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import {
  ACCOUNT_API_URL_TOKEN,
  BASE_API_URL_TOKEN,
  CLIENT_ID_TOKEN,
  CLIENT_SECRET_TOKEN,
} from '@services';

import { routes } from './app.routes';
import { appReducers } from './app.state';
import { ArtistsEffect } from './pages/artists/store/artists.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([applyTokenInterceptor])),
    provideCharts(withDefaultRegisterables()),
    provideStore(appReducers),
    provideEffects([AuthEffects, ArtistsEffect]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
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
