import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { OrderHistoryList } from '../../../model/order.model';
import { StateLoaderActions } from '../../../state/utils/index';
import { UserOrderAdapter } from '../../connectors/order/user-order.adapter';
import { UserOrderConnector } from '../../connectors/order/user-order.connector';
import { UserActions } from '../actions/index';
import { USER_ORDERS } from '../user-state';
import * as fromUserOrdersEffect from './user-orders.effect';

const mockUserOrders: OrderHistoryList = {
  orders: [],
  pagination: {},
  sorts: [],
};

describe('User Orders effect', () => {
  let userOrdersEffect: fromUserOrdersEffect.UserOrdersEffect;
  let orderConnector: UserOrderConnector;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        fromUserOrdersEffect.UserOrdersEffect,
        { provide: UserOrderAdapter, useValue: {} },
        provideMockActions(() => actions$),
      ],
    });

    actions$ = TestBed.get(Actions);
    userOrdersEffect = TestBed.get(
      fromUserOrdersEffect.UserOrdersEffect as Type<
        fromUserOrdersEffect.UserOrdersEffect
      >
    );
    orderConnector = TestBed.get(UserOrderConnector as Type<
      UserOrderConnector
    >);
  });

  describe('loadUserOrders$', () => {
    it('should load user Orders', () => {
      spyOn(orderConnector, 'getHistory').and.returnValue(of(mockUserOrders));
      const action = new UserActions.LoadUserOrders({
        userId: 'test@sap.com',
        pageSize: 5,
      });

      const completion = new UserActions.LoadUserOrdersSuccess(mockUserOrders);

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(userOrdersEffect.loadUserOrders$).toBeObservable(expected);
    });

    it('should handle failures for load user Orders', () => {
      spyOn(orderConnector, 'getHistory').and.returnValue(throwError('Error'));

      const action = new UserActions.LoadUserOrders({
        userId: 'test@sap.com',
        pageSize: 5,
      });

      const completion = new UserActions.LoadUserOrdersFail('Error');

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(userOrdersEffect.loadUserOrders$).toBeObservable(expected);
    });
  });

  describe('resetUserOrders$', () => {
    it('should return a reset action', () => {
      const action: Action = {
        type: UserActions.CLEAR_USER_MISCS_DATA,
      };

      const completion = new StateLoaderActions.LoaderResetAction(USER_ORDERS);

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(userOrdersEffect.resetUserOrders$).toBeObservable(expected);
    });
  });
});
