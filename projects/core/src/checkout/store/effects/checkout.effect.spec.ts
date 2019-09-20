import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { AuthActions } from '../../../auth/store/actions/index';
import { CartDataService } from '../../../cart/facade/cart-data.service';
import { CartActions } from '../../../cart/store/actions/index';
import {
  CheckoutDeliveryConnector,
  CheckoutPaymentConnector,
} from '../../../checkout/connectors';
import { Address } from '../../../model/address.model';
import { PaymentDetails } from '../../../model/cart.model';
import { DeliveryMode, Order } from '../../../model/order.model';
import { SiteContextActions } from '../../../site-context/store/actions/index';
import { UserActions } from '../../../user/store/actions/index';
import { CheckoutConnector } from '../../connectors/checkout';
import { CheckoutDetails } from '../../models/checkout.model';
import { CheckoutActions } from '../actions/index';
import * as fromEffects from './checkout.effect';
import createSpy = jasmine.createSpy;

const userId = 'testUserId';
const cartId = 'testCartId';
const address: Address = {
  id: 'testAddressId',
  firstName: 'John',
  lastName: 'Doe',
  titleCode: 'mr',
  line1: 'Toyosaki 2 create on cart',
  town: 'Montreal',
  postalCode: 'L6M1P9',
  country: { isocode: 'CA' },
};
const modes: DeliveryMode[] = [{ code: 'code1' }, { code: 'code2' }];
const orderDetails: Order = { entries: [] };

const details: CheckoutDetails = {
  deliveryAddress: address,
};

const paymentDetails: PaymentDetails = {
  accountHolderName: 'test',
  defaultPayment: false,
  billingAddress: {
    line1: '123 Montreal',
  },
};

class MockCheckoutDeliveryConnector {
  createAddress = createSpy().and.returnValue(of(address));
  setAddress = createSpy().and.returnValue(of({}));
  getSupportedModes = createSpy().and.returnValue(of(modes));
  setMode = createSpy().and.returnValue(of({}));
}

class MockCartDataService {
  cartId = 'cartId';
  userId = 'userId';
}

class MockCheckoutPaymentConnector {
  set = createSpy().and.returnValue(of({}));
  create = createSpy().and.returnValue(of(paymentDetails));
}

class MockCheckoutConnector {
  loadCheckoutDetails = createSpy().and.returnValue(of(details));
  placeOrder = () => of({});
}

describe('Checkout effect', () => {
  let checkoutConnector: CheckoutConnector;
  let entryEffects: fromEffects.CheckoutEffects;
  let actions$: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CheckoutPaymentConnector,
        {
          provide: CheckoutDeliveryConnector,
          useClass: MockCheckoutDeliveryConnector,
        },
        {
          provide: CheckoutPaymentConnector,
          useClass: MockCheckoutPaymentConnector,
        },
        { provide: CheckoutConnector, useClass: MockCheckoutConnector },
        { provide: CartDataService, useClass: MockCartDataService },
        fromEffects.CheckoutEffects,
        provideMockActions(() => actions$),
      ],
    });

    entryEffects = TestBed.get(fromEffects.CheckoutEffects as Type<
      fromEffects.CheckoutEffects
    >);
    checkoutConnector = TestBed.get(CheckoutConnector as Type<
      CheckoutConnector
    >);

    spyOn(checkoutConnector, 'placeOrder').and.returnValue(of(orderDetails));
  });

  describe('addDeliveryAddress$', () => {
    it('should add delivery address to cart', () => {
      const action = new CheckoutActions.AddDeliveryAddress({
        userId: userId,
        cartId: cartId,
        address: address,
      });

      const completion1 = new UserActions.LoadUserAddresses(userId);
      const completion2 = new CheckoutActions.SetDeliveryAddress({
        userId: userId,
        cartId: cartId,
        address: address,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: completion1, c: completion2 });

      expect(entryEffects.addDeliveryAddress$).toBeObservable(expected);
    });
  });

  describe('setDeliveryAddress$', () => {
    it('should set delivery address to cart', () => {
      const action = new CheckoutActions.SetDeliveryAddress({
        userId: userId,
        cartId: cartId,
        address: address,
      });
      const completion = new CheckoutActions.SetDeliveryAddressSuccess(address);
      const completion2 = new CheckoutActions.LoadSupportedDeliveryModes({
        userId,
        cartId,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: completion, c: completion2 });

      expect(entryEffects.setDeliveryAddress$).toBeObservable(expected);
    });
  });

  describe('loadSupportedDeliveryModes$', () => {
    it('should load all supported delivery modes from cart', () => {
      const action = new CheckoutActions.LoadSupportedDeliveryModes({
        userId: userId,
        cartId: cartId,
      });
      const completion = new CheckoutActions.LoadSupportedDeliveryModesSuccess(
        modes
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(entryEffects.loadSupportedDeliveryModes$).toBeObservable(expected);
    });
  });

  describe('clearCheckoutMiscsDataOnLanguageChange$', () => {
    it('should dispatch checkout clear miscs data action on language change', () => {
      const action = new SiteContextActions.LanguageChange();
      const completion = new CheckoutActions.CheckoutClearMiscsData();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(
        entryEffects.clearCheckoutMiscsDataOnLanguageChange$
      ).toBeObservable(expected);
    });
  });

  describe('clearDeliveryModesOnCurrencyChange$', () => {
    it('should dispatch clear supported delivery modes action on currency change', () => {
      const action = new SiteContextActions.CurrencyChange();
      const completion = new CheckoutActions.ClearSupportedDeliveryModes();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(entryEffects.clearDeliveryModesOnCurrencyChange$).toBeObservable(
        expected
      );
    });
  });

  describe('clearCheckoutDataOnLogout$', () => {
    it('should dispatch clear checkout data action on logout', () => {
      const action = new AuthActions.Logout();
      const completion = new CheckoutActions.ClearCheckoutData();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(entryEffects.clearCheckoutDataOnLogout$).toBeObservable(expected);
    });
  });

  describe('setDeliveryMode$', () => {
    it('should set delivery mode for cart', () => {
      const action = new CheckoutActions.SetDeliveryMode({
        userId: userId,
        cartId: cartId,
        selectedModeId: 'testSelectedModeId',
      });
      const setDeliveryModeSuccess = new CheckoutActions.SetDeliveryModeSuccess(
        'testSelectedModeId'
      );
      const loadCart = new CartActions.LoadCart({
        userId,
        cartId,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bc)', {
        b: setDeliveryModeSuccess,
        c: loadCart,
      });

      expect(entryEffects.setDeliveryMode$).toBeObservable(expected);
    });
  });

  describe('createPaymentDetails$', () => {
    it('should create payment details for cart', () => {
      const mockPaymentDetails: PaymentDetails = {
        accountHolderName: 'test test',
        cardNumber: '4111111111111111',
        cardType: {
          code: 'visa',
        },
        defaultPayment: false,
        expiryMonth: '01',
        expiryYear: '2019',
        cvn: '123',
        billingAddress: {
          firstName: 'test',
          lastName: 'test',
          line1: 'line1',
          line2: 'line2',
          postalCode: '12345',
          town: 'MainCity',
          country: {
            isocode: 'US',
          },
        },
      };

      const action = new CheckoutActions.CreatePaymentDetails({
        userId: userId,
        cartId: cartId,
        paymentDetails: mockPaymentDetails,
      });
      const completion1 = new UserActions.LoadUserPaymentMethods(userId);
      const completion2 = new CheckoutActions.CreatePaymentDetailsSuccess(
        paymentDetails
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: completion1, c: completion2 });

      expect(entryEffects.createPaymentDetails$).toBeObservable(expected);
    });
  });

  describe('setPaymentDetails$', () => {
    it('should set payment details', () => {
      const action = new CheckoutActions.SetPaymentDetails({
        userId: userId,
        cartId: cartId,
        paymentDetails,
      });
      const completion = new CheckoutActions.SetPaymentDetailsSuccess(
        paymentDetails
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(entryEffects.setPaymentDetails$).toBeObservable(expected);
    });
  });

  describe('placeOrder$', () => {
    it('should place order', () => {
      const action = new CheckoutActions.PlaceOrder({
        userId: userId,
        cartId: cartId,
      });
      const completion1 = new CheckoutActions.PlaceOrderSuccess(orderDetails);

      actions$ = hot('-a', { a: action });
      const expected = cold('-(b)', { b: completion1 });

      expect(entryEffects.placeOrder$).toBeObservable(expected);
    });
  });

  describe('loadCheckoutDetails$', () => {
    it('should load checkout details from cart', () => {
      const action = new CheckoutActions.LoadCheckoutDetails({
        userId: userId,
        cartId: cartId,
      });
      const completion = new CheckoutActions.LoadCheckoutDetailsSuccess(
        details
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(entryEffects.loadCheckoutDetails$).toBeObservable(expected);
    });
  });
});
