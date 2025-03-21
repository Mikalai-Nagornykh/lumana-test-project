import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AUTH_STORAGE_KEYS } from '../api';
import { LocalStorageService } from '../common';

export const applyTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorage = inject(LocalStorageService);
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);

  if (token() && !req.url.includes('token')) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token()}`),
    });
  }

  return next(req);
};
