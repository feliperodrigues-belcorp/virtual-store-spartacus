import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { Order } from '../../../model/order.model';
import { UserOrderAdapter } from '../../connectors/order/user-order.adapter';
import { UserOrderConnector } from '../../connectors/order/user-order.connector';
import { UserActions } from '../actions/index';
import * as fromOrderDetailsEffect from './order-details.effect';

const mockOrderDetails: Order = {};

const mockOrderDetailsParams = {
  userId: 'user15355363988711@ydev.hybris.com',
  orderCode: '00000386',
};

describe('Order Details effect', () => {
  let orderDetailsEffect: fromOrderDetailsEffect.OrderDetailsEffect;
  let orderConnector: UserOrderConnector;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        fromOrderDetailsEffect.OrderDetailsEffect,
        { provide: UserOrderAdapter, useValue: {} },
        provideMockActions(() => actions$),
      ],
    });

    actions$ = TestBed.get(Actions as Type<Actions>);
    orderDetailsEffect = TestBed.get(
      fromOrderDetailsEffect.OrderDetailsEffect as Type<
        fromOrderDetailsEffect.OrderDetailsEffect
      >
    );
    orderConnector = TestBed.get(UserOrderConnector as Type<
      UserOrderConnector
    >);
  });

  describe('loadOrderDetails$', () => {
    it('should load order details', () => {
      spyOn(orderConnector, 'get').and.returnValue(of(mockOrderDetails));
      const action = new UserActions.LoadOrderDetails(mockOrderDetailsParams);

      const completion = new UserActions.LoadOrderDetailsSuccess(
        mockOrderDetails
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(orderDetailsEffect.loadOrderDetails$).toBeObservable(expected);
    });

    it('should handle failures for load order details', () => {
      spyOn(orderConnector, 'get').and.returnValue(throwError('Error'));

      const action = new UserActions.LoadOrderDetails(mockOrderDetailsParams);

      const completion = new UserActions.LoadOrderDetailsFail('Error');

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(orderDetailsEffect.loadOrderDetails$).toBeObservable(expected);
    });
  });
});
