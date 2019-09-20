import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Cart, CartService, RoutingService } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CartNotEmptyGuard } from './cart-not-empty.guard';

const CART_EMPTY = Object.freeze({ totalItems: 0 });
const CART_NOT_EMPTY = Object.freeze({ totalItems: 1 });
const CART_NOT_CREATED = Object.freeze({});

const mockRoutingService = { go: () => {} };

class CartServiceStub {
  getActive(): Observable<Cart> {
    return of();
  }
  isEmpty(_cart: any): boolean {
    return false;
  }
}

describe('CartNotEmptyGuard', () => {
  let cartNotEmptyGuard: CartNotEmptyGuard;
  let routingService: RoutingService;
  let cartService: CartServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RoutingService,
          useValue: mockRoutingService,
        },
        {
          provide: CartService,
          useClass: CartServiceStub,
        },
      ],
      imports: [RouterTestingModule],
    });

    cartNotEmptyGuard = TestBed.get(CartNotEmptyGuard as Type<
      CartNotEmptyGuard
    >);
    routingService = TestBed.get(RoutingService as Type<RoutingService>);
    cartService = TestBed.get(CartService as Type<CartService>);
  });

  describe('canActivate:', () => {
    beforeEach(() => {
      spyOn(routingService, 'go');
    });

    describe('when cart is loaded', () => {
      describe(', and when cart is NOT created', () => {
        beforeEach(() => {
          spyOn(cartService, 'getActive').and.returnValue(of(CART_NOT_CREATED));
        });

        it('then Router should redirect to main page', () => {
          spyOn(cartService, 'isEmpty').and.returnValue(of(true));
          cartNotEmptyGuard
            .canActivate()
            .subscribe()
            .unsubscribe();
          expect(routingService.go).toHaveBeenCalledWith({
            cxRoute: 'home',
          });
        });

        it('then returned observable should emit false', () => {
          spyOn(cartService, 'isEmpty').and.returnValue(of(true));
          let emittedValue: any = 'nothing was emitted';
          cartNotEmptyGuard
            .canActivate()
            .subscribe(result => (emittedValue = result))
            .unsubscribe();
          expect(emittedValue).toBe(false);
        });
      });

      describe(', and when cart is empty', () => {
        beforeEach(() => {
          spyOn(cartService, 'getActive').and.returnValue(of(CART_EMPTY));
        });

        it('then Router should redirect to main page', () => {
          spyOn(cartService, 'isEmpty').and.returnValue(of(true));
          cartNotEmptyGuard
            .canActivate()
            .subscribe()
            .unsubscribe();
          expect(routingService.go).toHaveBeenCalledWith({
            cxRoute: 'home',
          });
        });

        it('then returned observable should emit false', () => {
          spyOn(cartService, 'isEmpty').and.returnValue(of(true));
          let emittedValue: any = 'nothing was emitted';
          cartNotEmptyGuard
            .canActivate()
            .subscribe(result => (emittedValue = result))
            .unsubscribe();
          expect(emittedValue).toBe(false);
        });
      });

      describe(', and when cart is NOT empty', () => {
        beforeEach(() => {
          spyOn(cartService, 'getActive').and.returnValue(of(CART_NOT_EMPTY));
        });

        it('then Router should NOT redirect', () => {
          cartNotEmptyGuard
            .canActivate()
            .subscribe()
            .unsubscribe();
          expect(routingService.go).not.toHaveBeenCalled();
        });

        it('then returned observable should emit true', () => {
          let emittedValue: any = 'nothing was emitted';
          cartNotEmptyGuard
            .canActivate()
            .subscribe(result => (emittedValue = result))
            .unsubscribe();
          expect(emittedValue).toBe(true);
        });
      });
    });
  });
});
