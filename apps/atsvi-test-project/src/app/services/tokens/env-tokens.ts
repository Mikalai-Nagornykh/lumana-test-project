import { InjectionToken } from '@angular/core';

export const BASE_API_URL_TOKEN = new InjectionToken<string>('BASE_API_URL');
export const ACCOUNT_API_URL_TOKEN = new InjectionToken<string>(
  'ACCOUNT_API_URL',
);
export const CLIENT_ID_TOKEN = new InjectionToken<string>('CLIENT_ID');
export const CLIENT_SECRET_TOKEN = new InjectionToken<string>('CLIENT_SECRET');
