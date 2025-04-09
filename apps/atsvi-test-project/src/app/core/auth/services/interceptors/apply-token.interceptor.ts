import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '@services';
import { AUTH_STORAGE_KEYS } from '../../constants';

export const applyTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(LocalStorageService).getItem(
    AUTH_STORAGE_KEYS.ACCESS_TOKEN,
  );

  if (token() && !req.url.includes('token')) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token()}`),
    });
  }

  return next(req);
};
