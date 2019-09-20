import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CheckoutDeliveryAdapter } from './checkout-delivery.adapter';
import { CheckoutDeliveryConnector } from './checkout-delivery.connector';
import createSpy = jasmine.createSpy;

describe('CheckoutDeliveryDeliveryConnector', () => {
  class MockCheckoutDeliveryAdapter implements CheckoutDeliveryAdapter {
    createAddress = createSpy().and.returnValue(of({}));
    setAddress = createSpy().and.returnValue(of({}));
    setMode = createSpy().and.returnValue(of({}));
    getMode = createSpy().and.returnValue(of({}));
    getSupportedModes = createSpy().and.returnValue(of({}));
  }

  describe('CheckoutDeliveryConnector', () => {
    let service: CheckoutDeliveryConnector;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: CheckoutDeliveryAdapter,
            useClass: MockCheckoutDeliveryAdapter,
          },
        ],
      });

      service = TestBed.get(CheckoutDeliveryConnector as Type<
        CheckoutDeliveryConnector
      >);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('createAddress should call adapter', () => {
      const adapter = TestBed.get(CheckoutDeliveryAdapter as Type<
        CheckoutDeliveryAdapter
      >);
      service.createAddress('1', '2', {}).subscribe();
      expect(adapter.createAddress).toHaveBeenCalledWith('1', '2', {});
    });

    it('setAddress should call adapter', () => {
      const adapter = TestBed.get(CheckoutDeliveryAdapter as Type<
        CheckoutDeliveryAdapter
      >);
      service.setAddress('1', '2', '3').subscribe();
      expect(adapter.setAddress).toHaveBeenCalledWith('1', '2', '3');
    });

    it('setMode should call adapter', () => {
      const adapter = TestBed.get(CheckoutDeliveryAdapter as Type<
        CheckoutDeliveryAdapter
      >);
      service.setMode('1', '2', '3').subscribe();
      expect(adapter.setMode).toHaveBeenCalledWith('1', '2', '3');
    });

    it('getMode should call adapter', () => {
      const adapter = TestBed.get(CheckoutDeliveryAdapter as Type<
        CheckoutDeliveryAdapter
      >);
      service.getMode('1', '2').subscribe();
      expect(adapter.getMode).toHaveBeenCalledWith('1', '2');
    });

    it('getSupportedModes should call adapter', () => {
      const adapter = TestBed.get(CheckoutDeliveryAdapter as Type<
        CheckoutDeliveryAdapter
      >);
      service.getSupportedModes('1', '2').subscribe();
      expect(adapter.getSupportedModes).toHaveBeenCalledWith('1', '2');
    });
  });
});
