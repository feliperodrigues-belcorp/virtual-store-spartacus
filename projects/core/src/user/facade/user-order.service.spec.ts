import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Order, OrderHistoryList } from '../../model/order.model';
import { USERID_CURRENT } from '../../occ/utils/occ-constants';
import { PROCESS_FEATURE } from '../../process/store/process-state';
import * as fromProcessReducers from '../../process/store/reducers';
import { UserActions } from '../store/actions/index';
import * as fromStoreReducers from '../store/reducers/index';
import { StateWithUser, USER_FEATURE } from '../store/user-state';
import { UserOrderService } from './user-order.service';

describe('UserOrderService', () => {
  let service: UserOrderService;
  let store: Store<StateWithUser>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(USER_FEATURE, fromStoreReducers.getReducers()),
        StoreModule.forFeature(
          PROCESS_FEATURE,
          fromProcessReducers.getReducers()
        ),
      ],
      providers: [UserOrderService],
    });

    store = TestBed.get(Store as Type<Store<StateWithUser>>);
    spyOn(store, 'dispatch').and.callThrough();
    service = TestBed.get(UserOrderService as Type<UserOrderService>);
  });

  it('should UserOrderService is injected', inject(
    [UserOrderService],
    (userOrderService: UserOrderService) => {
      expect(userOrderService).toBeTruthy();
    }
  ));

  it('should be able to get order details', () => {
    store.dispatch(
      new UserActions.LoadOrderDetailsSuccess({ code: 'testOrder' })
    );

    let order: Order;
    service
      .getOrderDetails()
      .subscribe(data => {
        order = data;
      })
      .unsubscribe();
    expect(order).toEqual({ code: 'testOrder' });
  });

  it('should be able to load order details', () => {
    service.loadOrderDetails('orderCode');
    expect(store.dispatch).toHaveBeenCalledWith(
      new UserActions.LoadOrderDetails({
        userId: USERID_CURRENT,
        orderCode: 'orderCode',
      })
    );
  });

  it('should be able to clear order details', () => {
    service.clearOrderDetails();
    expect(store.dispatch).toHaveBeenCalledWith(
      new UserActions.ClearOrderDetails()
    );
  });

  it('should be able to get order history list', () => {
    store.dispatch(
      new UserActions.LoadUserOrdersSuccess({
        orders: [],
        pagination: {},
        sorts: [],
      })
    );

    let orderList: OrderHistoryList;
    service
      .getOrderHistoryList(1)
      .subscribe(data => {
        orderList = data;
      })
      .unsubscribe();
    expect(orderList).toEqual({
      orders: [],
      pagination: {},
      sorts: [],
    });
  });

  it('should be able to get order list loaded flag', () => {
    store.dispatch(new UserActions.LoadUserOrdersSuccess({}));

    let orderListLoaded: boolean;
    service
      .getOrderHistoryListLoaded()
      .subscribe(data => {
        orderListLoaded = data;
      })
      .unsubscribe();
    expect(orderListLoaded).toEqual(true);
  });

  it('should be able to load order list data', () => {
    service.loadOrderList(10, 1, 'byDate');
    expect(store.dispatch).toHaveBeenCalledWith(
      new UserActions.LoadUserOrders({
        userId: USERID_CURRENT,
        pageSize: 10,
        currentPage: 1,
        sort: 'byDate',
      })
    );
  });

  it('should be able to clear order list', () => {
    service.clearOrderList();
    expect(store.dispatch).toHaveBeenCalledWith(
      new UserActions.ClearUserOrders()
    );
  });
});
