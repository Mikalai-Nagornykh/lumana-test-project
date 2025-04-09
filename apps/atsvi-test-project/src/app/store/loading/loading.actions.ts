import { LoadingType } from '@constants';
import { createActionGroup, emptyProps } from '@ngrx/store';

export const LoadingActions = createActionGroup({
  source: 'Loading',
  events: {
    addLoading: (loadingType: LoadingType) => ({ loadingType }),
    removeLoading: (loadingType: LoadingType) => ({ loadingType }),
    startRequest: emptyProps(),
    endRequest: emptyProps(),
  },
});
