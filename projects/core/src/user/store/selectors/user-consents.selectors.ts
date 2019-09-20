import { createSelector, MemoizedSelector } from '@ngrx/store';
import { ConsentTemplate } from '../../../model/consent.model';
import { StateLoaderSelectors } from '../../../state/utils/index';
import { LoaderState } from '../../../state/utils/loader/loader-state';
import { StateWithUser, UserState } from '../user-state';
import { getUserState } from './feature.selector';

export const getConsentsState: MemoizedSelector<
  StateWithUser,
  LoaderState<ConsentTemplate[]>
> = createSelector(
  getUserState,
  (state: UserState) => state.consents
);

export const getConsentsValue: MemoizedSelector<
  StateWithUser,
  ConsentTemplate[]
> = createSelector(
  getConsentsState,
  StateLoaderSelectors.loaderValueSelector
);

export const getConsentsLoading: MemoizedSelector<
  StateWithUser,
  boolean
> = createSelector(
  getConsentsState,
  StateLoaderSelectors.loaderLoadingSelector
);

export const getConsentsSuccess: MemoizedSelector<
  StateWithUser,
  boolean
> = createSelector(
  getConsentsState,
  StateLoaderSelectors.loaderSuccessSelector
);

export const getConsentsError: MemoizedSelector<
  StateWithUser,
  boolean
> = createSelector(
  getConsentsState,
  StateLoaderSelectors.loaderErrorSelector
);
