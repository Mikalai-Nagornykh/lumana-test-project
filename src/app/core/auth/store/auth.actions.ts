import { createActionGroup } from '@ngrx/store';
import { TokenRequestModel, TokenResponseModel } from '../models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Get Access Token': (payload: TokenRequestModel) => ({ payload }),
    'Get Access Token Success': (response: TokenResponseModel) => ({
      response,
    }),
  },
});
