import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CART_MODIFICATION_NORMALIZER } from '@spartacus/core';
import { FeatureConfigService } from 'projects/core/src/features-config';
import { Cart, CartModification } from '../../../model/cart.model';
import { ConverterService } from '../../../util/converter.service';
import { OccEndpointsService } from '../../services';
import { OccCartEntryAdapter } from './occ-cart-entry.adapter';

const userId = '123';
const cartId = '456';
const cartData: Cart = {
  store: 'electronics',
  guid: '1212121',
};
const cartModified: CartModification = {
  deliveryModeChanged: true,
};

class MockOccEndpointsService {
  getUrl(endpoint: string, _urlParams?: object, _queryParams?: object) {
    return this.getEndpoint(endpoint);
  }
  getEndpoint(url: string) {
    return url;
  }
}

class MockFeatureConfigService {
  isLevel(_featureLevel: string): boolean {
    return true;
  }
}

// Deprecated in 1.1
const usersEndpoint = 'users';
const cartsEndpoint = '/carts/';

describe('OccCartEntryAdapter', () => {
  let occCartEntryAdapter: OccCartEntryAdapter;
  let httpMock: HttpTestingController;
  let converterService: ConverterService;
  let occEnpointsService: OccEndpointsService;
  let featureConfigService: FeatureConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccCartEntryAdapter,
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },
        { provide: FeatureConfigService, useClass: MockFeatureConfigService },
      ],
    });

    occCartEntryAdapter = TestBed.get(OccCartEntryAdapter as Type<
      OccCartEntryAdapter
    >);
    httpMock = TestBed.get(HttpTestingController as Type<
      HttpTestingController
    >);
    converterService = TestBed.get(ConverterService as Type<ConverterService>);
    occEnpointsService = TestBed.get(OccEndpointsService as Type<
      OccEndpointsService
    >);
    featureConfigService = TestBed.get(FeatureConfigService as Type<
      FeatureConfigService
    >);

    spyOn(converterService, 'pipeable').and.callThrough();
    spyOn(occEnpointsService, 'getUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('add entry to cart', () => {
    it('should add entry to cart for given user id, cart id, product code and product quantity', () => {
      let result;
      occCartEntryAdapter
        .add(userId, cartId, '147852', 5)
        .subscribe(res => (result = res));

      const mockReq = httpMock.expectOne({ method: 'POST', url: 'addEntries' });

      expect(mockReq.request.headers.get('Content-Type')).toEqual(
        'application/x-www-form-urlencoded'
      );

      expect(occEnpointsService.getUrl).toHaveBeenCalledWith(
        'addEntries',
        {
          userId,
          cartId,
        },
        { code: '147852', qty: 5 }
      );

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(cartModified);
      expect(result).toEqual(cartModified);
      expect(converterService.pipeable).toHaveBeenCalledWith(
        CART_MODIFICATION_NORMALIZER
      );
    });
  });

  describe('update entry in a cart', () => {
    it('should update an entry in a cart for given user id, cart id, entryNumber and quantitiy', () => {
      let result;
      occCartEntryAdapter
        .update(userId, cartId, '12345', 5)
        .subscribe(res => (result = res));

      const mockReq = httpMock.expectOne({
        method: 'PATCH',
        url: 'updateEntries',
      });

      expect(mockReq.request.headers.get('Content-Type')).toEqual(
        'application/x-www-form-urlencoded'
      );

      expect(occEnpointsService.getUrl).toHaveBeenCalledWith(
        'updateEntries',
        {
          userId,
          cartId,
          entryNumber: '12345',
        },
        { qty: 5 }
      );
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(cartModified);
      expect(result).toEqual(cartModified);
      expect(converterService.pipeable).toHaveBeenCalledWith(
        CART_MODIFICATION_NORMALIZER
      );
    });

    it(`should handle 'pickupStore'`, () => {
      const pickupStore =
        'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France';
      occCartEntryAdapter
        .update(userId, cartId, '12345', 5, pickupStore)
        .subscribe()
        .unsubscribe();

      httpMock.expectOne({
        method: 'PATCH',
        url: 'updateEntries',
      });

      expect(occEnpointsService.getUrl).toHaveBeenCalledWith(
        'updateEntries',
        {
          userId,
          cartId,
          entryNumber: '12345',
        },
        { qty: 5, pickupStore }
      );
    });
  });

  describe('remove an entry from cart', () => {
    it('should remove entry from cart for given user id, cart id and entry number', () => {
      let result;
      occCartEntryAdapter
        .remove(userId, cartId, '147852')
        .subscribe(res => (result = res));

      const mockReq = httpMock.expectOne({
        method: 'DELETE',
        url: 'removeEntries',
      });

      expect(occEnpointsService.getUrl).toHaveBeenCalledWith('removeEntries', {
        userId,
        cartId,
        entryNumber: '147852',
      });
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(cartData);
      expect(result).toEqual(cartData);
    });
  });

  /**
   * @deprecated Since 1.1
   * Remove when legacy code is removed.
   */
  describe('legacy', () => {
    beforeEach(() => {
      spyOn(featureConfigService, 'isLevel').and.returnValue(false);
    });

    describe('add entry to cart', () => {
      it('should add entry to cart for given user id, cart id, product code and product quantity', () => {
        let result;
        occCartEntryAdapter
          .add(userId, cartId, '147852', 5)
          .subscribe(res => (result = res));

        const mockReq = httpMock.expectOne(req => {
          return (
            req.method === 'POST' &&
            req.url ===
              `${usersEndpoint}/${userId}${cartsEndpoint}${cartId}/entries`
          );
        });

        expect(mockReq.request.headers.get('Content-Type')).toEqual(
          'application/x-www-form-urlencoded'
        );

        expect(mockReq.request.params.get('code')).toEqual('147852');

        expect(mockReq.request.params.get('qty')).toEqual('5');

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.responseType).toEqual('json');
        mockReq.flush(cartModified);
        expect(result).toEqual(cartModified);
        expect(converterService.pipeable).toHaveBeenCalledWith(
          CART_MODIFICATION_NORMALIZER
        );
      });
    });

    describe('update entry in a cart', () => {
      it('should update an entry in a cart for given user id, cart id, entryNumber and quantitiy', () => {
        let result;
        occCartEntryAdapter
          .update(userId, cartId, '12345', 5)
          .subscribe(res => (result = res));

        const mockReq = httpMock.expectOne(req => {
          return (
            req.method === 'PATCH' &&
            req.url ===
              usersEndpoint +
                `/${userId}` +
                cartsEndpoint +
                cartId +
                '/entries/12345'
          );
        });

        expect(mockReq.request.headers.get('Content-Type')).toEqual(
          'application/x-www-form-urlencoded'
        );

        expect(mockReq.request.params.get('qty')).toEqual('5');
        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.responseType).toEqual('json');
        mockReq.flush(cartModified);
        expect(result).toEqual(cartModified);
        expect(converterService.pipeable).toHaveBeenCalledWith(
          CART_MODIFICATION_NORMALIZER
        );
      });

      it(`should handle 'pickupStore'`, () => {
        const pickupStore =
          'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France';
        occCartEntryAdapter
          .update(userId, cartId, '12345', 5, pickupStore)
          .subscribe()
          .unsubscribe();

        const mockReq = httpMock.expectOne(req => {
          console.log('req', req);
          return (
            req.method === 'PATCH' &&
            req.url ===
              usersEndpoint +
                `/${userId}` +
                cartsEndpoint +
                cartId +
                '/entries/12345'
          );
        });
        expect(mockReq.request.params.get('qty')).toEqual('5');
        expect(mockReq.request.params.get('pickupStore')).toEqual(pickupStore);
      });
    });

    describe('remove an entry from cart', () => {
      it('should remove entry from cart for given user id, cart id and entry number', () => {
        let result;
        occCartEntryAdapter
          .remove(userId, cartId, '147852')
          .subscribe(res => (result = res));

        const mockReq = httpMock.expectOne(req => {
          return (
            req.method === 'DELETE' &&
            req.url ===
              usersEndpoint +
                `/${userId}` +
                cartsEndpoint +
                cartId +
                '/entries/' +
                '147852'
          );
        });

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.responseType).toEqual('json');
        mockReq.flush(cartData);
        expect(result).toEqual(cartData);
      });
    });
  });
});
