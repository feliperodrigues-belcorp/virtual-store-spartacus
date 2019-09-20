import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { CartDataService } from '../../cart/facade/cart-data.service';
import { Address, AddressValidation } from '../../model/address.model';
import { Cart } from '../../model/cart.model';
import { DeliveryMode } from '../../model/order.model';
import { CheckoutActions } from '../store/actions/index';
import { CheckoutState } from '../store/checkout-state';
import * as fromCheckoutReducers from '../store/reducers/index';
import { CheckoutDeliveryService } from './checkout-delivery.service';

describe('CheckoutDeliveryService', () => {
  let service: CheckoutDeliveryService;
  let cartData: CartDataServiceStub;
  let store: Store<CheckoutState>;
  const userId = 'testUserId';
  const cart: Cart = { code: 'testCartId', guid: 'testGuid' };

  class CartDataServiceStub {
    userId;
    cart;
    get cartId() {
      return this.cart.code;
    }
  }

  const address: Address = {
    firstName: 'John',
    lastName: 'Doe',
    titleCode: 'mr',
    line1: 'Toyosaki 2 create on cart',
    town: 'Montreal',
    postalCode: 'L6M1P9',
    country: { isocode: 'CA' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('checkout', fromCheckoutReducers.getReducers()),
      ],
      providers: [
        CheckoutDeliveryService,
        { provide: CartDataService, useClass: CartDataServiceStub },
      ],
    });

    service = TestBed.get(CheckoutDeliveryService as Type<
      CheckoutDeliveryService
    >);
    cartData = TestBed.get(CartDataService as Type<CartDataService>);
    store = TestBed.get(Store as Type<Store<CheckoutState>>);

    cartData.userId = userId;
    cartData.cart = cart;

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should CheckoutDeliveryService is injected', inject(
    [CheckoutDeliveryService],
    (checkoutService: CheckoutDeliveryService) => {
      expect(checkoutService).toBeTruthy();
    }
  ));

  it('should be able to get supported delivery modes if data exists', () => {
    store.dispatch(
      new CheckoutActions.LoadSupportedDeliveryModesSuccess([
        { code: 'mode1' },
        { code: 'mode2' },
      ])
    );

    let deliveryModes: DeliveryMode[];
    service
      .getSupportedDeliveryModes()
      .subscribe(data => {
        deliveryModes = data;
      })
      .unsubscribe();
    expect(deliveryModes).toEqual([{ code: 'mode1' }, { code: 'mode2' }]);
  });

  it('should be able to get supported delivery modes after trigger data loading when they do not exist', () => {
    spyOn(service, 'loadSupportedDeliveryModes').and.callThrough();

    let deliveryModes: DeliveryMode[];
    service
      .getSupportedDeliveryModes()
      .subscribe(data => {
        deliveryModes = data;
      })
      .unsubscribe();

    expect(deliveryModes).toEqual([]);
    expect(service.loadSupportedDeliveryModes).toHaveBeenCalled();
  });

  it('should be able to get selected delivery mode if data exist', () => {
    store.dispatch(
      new CheckoutActions.LoadSupportedDeliveryModesSuccess([
        { code: 'mode1' },
        { code: 'mode2' },
      ])
    );
    store.dispatch(new CheckoutActions.SetDeliveryModeSuccess('mode1'));

    let selectedMode: DeliveryMode;
    service.getSelectedDeliveryMode().subscribe(data => {
      selectedMode = data;
    });
    expect(selectedMode).toEqual({ code: 'mode1' });
  });

  it('should be able to get the code of selected delivery mode', () => {
    store.dispatch(
      new CheckoutActions.LoadSupportedDeliveryModesSuccess([
        { code: 'mode1' },
        { code: 'mode2' },
      ])
    );
    store.dispatch(new CheckoutActions.SetDeliveryModeSuccess('mode1'));

    let selectedModeCode: string;
    service.getSelectedDeliveryModeCode().subscribe(data => {
      selectedModeCode = data;
    });
    expect(selectedModeCode).toEqual('mode1');
  });

  it('should be able to get the delivery address', () => {
    store.dispatch(new CheckoutActions.SetDeliveryAddressSuccess(address));

    let deliveryAddress: Address;
    service
      .getDeliveryAddress()
      .subscribe(data => {
        deliveryAddress = data;
      })
      .unsubscribe();
    expect(deliveryAddress).toEqual(address);
  });

  it('should be able to get the address verification result', () => {
    store.dispatch(
      new CheckoutActions.VerifyAddressSuccess({ decision: 'DECLINE' })
    );

    let result: AddressValidation | string;
    service
      .getAddressVerificationResults()
      .subscribe(data => {
        result = data;
      })
      .unsubscribe();
    expect(result).toEqual({ decision: 'DECLINE' });
  });

  it('should be able to create and set address to cart', () => {
    service.createAndSetAddress(address);

    expect(store.dispatch).toHaveBeenCalledWith(
      new CheckoutActions.AddDeliveryAddress({
        userId: userId,
        cartId: cart.code,
        address: address,
      })
    );
  });

  it('should be able to load the supported delivery modes', () => {
    service.loadSupportedDeliveryModes();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CheckoutActions.LoadSupportedDeliveryModes({
        userId: userId,
        cartId: cart.code,
      })
    );
  });

  it('should be able to set the delivery mode', () => {
    const modeId = 'testId';
    service.setDeliveryMode(modeId);

    expect(store.dispatch).toHaveBeenCalledWith(
      new CheckoutActions.SetDeliveryMode({
        userId: userId,
        cartId: cart.code,
        selectedModeId: modeId,
      })
    );
  });

  it('should load address verification results', () => {
    service.verifyAddress(address);

    expect(store.dispatch).toHaveBeenCalledWith(
      new CheckoutActions.VerifyAddress({
        userId: userId,
        address,
      })
    );
  });

  it('should set delivery address', () => {
    service.setDeliveryAddress(address);

    expect(store.dispatch).toHaveBeenCalledWith(
      new CheckoutActions.SetDeliveryAddress({
        userId: userId,
        cartId: cartData.cart.code,
        address: address,
      })
    );
  });

  it('should be able to clear address verification result', () => {
    service.clearAddressVerificationResults();
    expect(store.dispatch).toHaveBeenCalledWith(
      new CheckoutActions.ClearAddressVerificationResults()
    );
  });
});
