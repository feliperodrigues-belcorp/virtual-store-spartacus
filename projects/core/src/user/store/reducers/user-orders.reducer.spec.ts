import { PaginationModel, SortModel } from '../../../model/misc.model';
import { OrderHistory, OrderHistoryList } from '../../../model/order.model';
import { UserActions } from '../actions/index';
import * as fromUserOrdersReducer from './user-orders.reducer';

describe('User Orders Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromUserOrdersReducer;
      const action = {} as UserActions.UserOrdersAction;
      const state = fromUserOrdersReducer.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LOAD_USER_ORDERS_SUCCESS action', () => {
    it('should populate the user Orders state entities', () => {
      const orders: OrderHistory[] = [{ code: '01' }, { code: '02' }];
      const pagination: PaginationModel = {
        currentPage: 1,
        totalPages: 5,
        pageSize: 5,
      };
      const sorts: SortModel[] = [{ code: 'byDate' }];
      const mockUserOrders: OrderHistoryList = {
        orders,
        pagination,
        sorts,
      };

      const { initialState } = fromUserOrdersReducer;
      const action = new UserActions.LoadUserOrdersSuccess(mockUserOrders);
      const state = fromUserOrdersReducer.reducer(initialState, action);

      expect(state).toEqual(mockUserOrders);
    });
  });

  describe('LOAD_USER_ORDERS_FAIL action', () => {
    it('should return the initial state', () => {
      const { initialState } = fromUserOrdersReducer;
      const action = new UserActions.LoadUserOrdersFail('error');
      const state = fromUserOrdersReducer.reducer(initialState, action);
      expect(state).toEqual(initialState);
    });
  });
});
