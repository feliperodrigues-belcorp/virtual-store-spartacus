import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { ConsentTemplate } from '@spartacus/core';
import { LoaderState } from '../../../state';
import { UserActions } from '../actions/index';
import * as fromReducers from '../reducers/index';
import { UsersSelectors } from '../selectors/index';
import { StateWithUser, USER_FEATURE } from '../user-state';

const consents: ConsentTemplate[] = [{ id: 'xxx' }];

describe('User consents selectors', () => {
  let store: Store<StateWithUser>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(USER_FEATURE, fromReducers.getReducers()),
      ],
    });

    store = TestBed.get(Store as Type<Store<StateWithUser>>);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getConsentsState', () => {
    it('should return consents', () => {
      store.dispatch(new UserActions.LoadUserConsentsSuccess(consents));

      let result: LoaderState<ConsentTemplate[]>;
      store
        .pipe(select(UsersSelectors.getConsentsState))
        .subscribe(value => (result = value))
        .unsubscribe();

      expect(result).toEqual({
        loading: false,
        error: false,
        success: true,
        value: consents,
      });
    });
  });
  describe('getConsentsValue', () => {
    it('should return the value', () => {
      store.dispatch(new UserActions.LoadUserConsentsSuccess(consents));

      let result: ConsentTemplate[];
      store
        .pipe(select(UsersSelectors.getConsentsValue))
        .subscribe(value => (result = value))
        .unsubscribe();

      expect(result).toEqual(consents);
    });
  });
  describe('getConsentsLoading', () => {
    it('should return the loading flag', () => {
      store.dispatch(new UserActions.LoadUserConsents('xxx@xxx.xxx'));

      let result = false;
      store
        .pipe(select(UsersSelectors.getConsentsLoading))
        .subscribe(value => (result = value))
        .unsubscribe();

      expect(result).toEqual(true);
    });
  });
  describe('getConsentsSuccess', () => {
    it('should return the success value', () => {
      store.dispatch(new UserActions.LoadUserConsentsSuccess([]));

      let result = false;
      store
        .pipe(select(UsersSelectors.getConsentsSuccess))
        .subscribe(value => (result = value))
        .unsubscribe();

      expect(result).toEqual(true);
    });
  });
  describe('getConsentsError', () => {
    it('should return the error flag', () => {
      store.dispatch(new UserActions.LoadUserConsentsFail('error'));

      let result = false;
      store
        .pipe(select(UsersSelectors.getConsentsError))
        .subscribe(value => (result = value))
        .unsubscribe();

      expect(result).toEqual(true);
    });
  });
});
