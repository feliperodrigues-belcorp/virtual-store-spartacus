import { Cart } from '../../../model/cart.model';
import { CartActions } from '../actions/index';
import * as fromCart from './cart.reducer';

describe('Cart reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromCart;
      const action = {} as any;
      const state = fromCart.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('MERGE_CART action', () => {
    it('should set cartMergeComplete flag to false', () => {
      const { initialState } = fromCart;
      const action = new CartActions.MergeCart({});
      const state = fromCart.reducer(initialState, action);

      expect(state.cartMergeComplete).toEqual(false);
    });
  });

  describe('MERGE_CART_SUCCESS action', () => {
    it('should set cartMergeComplete and refresh flag to true ', () => {
      const { initialState } = fromCart;
      const action = new CartActions.MergeCartSuccess({});
      const state = fromCart.reducer(initialState, action);

      expect(state.cartMergeComplete).toEqual(true);
      expect(state.refresh).toEqual(true);
    });
  });

  describe('CREATE_CART_SUCCESS or LOAD_CART_SUCCESS action', () => {
    it('should create an empty cart', () => {
      const testCart: Cart = {
        code: 'xxx',
        guid: 'xxx',
        totalItems: 0,
        totalPrice: {
          currencyIso: 'USD',
          value: 0,
        },
        totalPriceWithTax: {
          currencyIso: 'USD',
          value: 0,
        },
      };
      const { initialState } = fromCart;

      const action = new CartActions.CreateCartSuccess(testCart);
      const state = fromCart.reducer(initialState, action);

      expect(state.content).toEqual(testCart);
      expect(state.entries).toEqual({});
      expect(state.refresh).toEqual(false);
    });

    it('should load an existing cart', () => {
      const testCart: Cart = {
        code: 'xxx',
        guid: 'xxx',
        totalItems: 0,
        entries: [{ entryNumber: 0, product: { code: '1234' } }],
        totalPrice: {
          currencyIso: 'USD',
          value: 0,
        },
        totalPriceWithTax: {
          currencyIso: 'USD',
          value: 0,
        },
      };

      const { initialState } = fromCart;

      const action = new CartActions.LoadCartSuccess(testCart);
      const state = fromCart.reducer(initialState, action);

      delete testCart['entries'];

      expect(state.content).toEqual(testCart);
      expect(state.entries).toEqual({
        '1234': { entryNumber: 0, product: { code: '1234' } },
      });
      expect(state.refresh).toEqual(false);
    });
  });

  describe('REMOVE_ENTRY_SUCCESS action', () => {
    it('should set refresh to true', () => {
      const { initialState } = fromCart;

      const action = new CartActions.CartRemoveEntrySuccess({});
      const state = fromCart.reducer(initialState, action);
      expect(state.refresh).toEqual(true);
    });
  });

  describe('ADD_ENTRY_SUCCESS action', () => {
    it('should set refresh to true', () => {
      const { initialState } = fromCart;

      const action = new CartActions.CartAddEntrySuccess({});
      const state = fromCart.reducer(initialState, action);
      expect(state.refresh).toEqual(true);
    });
  });

  describe('UPDATE_ENTRY_SUCCESS action', () => {
    it('should set refresh to true', () => {
      const { initialState } = fromCart;

      const action = new CartActions.CartUpdateEntrySuccess({});
      const state = fromCart.reducer(initialState, action);
      expect(state.refresh).toEqual(true);
    });
  });

  describe('RESET_CART_DETAILS', () => {
    it('should reset state apart from code and guid', () => {
      const { initialState } = fromCart;
      const guid = 'guid';
      const code = 'code';
      const modifiedState = { ...initialState, content: { code, guid } };
      const action = new CartActions.ResetCartDetails();
      const state = fromCart.reducer(modifiedState, action);
      expect(state.refresh).toEqual(false);
      expect(state.cartMergeComplete).toEqual(false);
      expect(state.entries).toEqual({});
      expect(state.content).toEqual({
        guid,
        code,
      });
    });
  });

  describe('CLEAR_CART', () => {
    it('should reset state', () => {
      const { initialState } = fromCart;
      const modifiedState = {
        ...initialState,
        refresh: true,
        cartMergeComplete: true,
      };
      const action = new CartActions.ClearCart();
      const state = fromCart.reducer(modifiedState, action);
      expect(state).toEqual(initialState);
    });
  });
});
