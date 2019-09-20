import { createSelector, MemoizedSelector } from '@ngrx/store';
import { Address } from '../../../model/address.model';
import { StateLoaderSelectors } from '../../../state/utils/index';
import { LoaderState } from '../../../state/utils/loader/loader-state';
import { StateWithUser, UserState } from '../user-state';
import { getUserState } from './feature.selector';

export const getAddressesLoaderState: MemoizedSelector<
  StateWithUser,
  LoaderState<Address[]>
> = createSelector(
  getUserState,
  (state: UserState) => state.addresses
);

export const getAddresses: MemoizedSelector<
  StateWithUser,
  Address[]
> = createSelector(
  getAddressesLoaderState,
  (state: LoaderState<Address[]>) =>
    StateLoaderSelectors.loaderValueSelector(state)
);

export const getAddressesLoading: MemoizedSelector<
  StateWithUser,
  boolean
> = createSelector(
  getAddressesLoaderState,
  (state: LoaderState<Address[]>) =>
    StateLoaderSelectors.loaderLoadingSelector(state)
);
