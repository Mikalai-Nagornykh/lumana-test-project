import { createActionGroup, emptyProps } from '@ngrx/store';
import { TokenResponseModel } from '../models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    getAccessToken: emptyProps(),
    getAccessTokenSuccess: (response: TokenResponseModel) => ({
      response,
    }),
    refreshAccessToken: emptyProps(),
    refreshAccessTokenSuccess: (response: TokenResponseModel) => ({ response }),
  },
});
