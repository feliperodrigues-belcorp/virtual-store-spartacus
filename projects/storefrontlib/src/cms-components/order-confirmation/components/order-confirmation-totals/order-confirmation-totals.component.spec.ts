import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Cart,
  CheckoutService,
  I18nTestingModule,
  Order,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { OrderConfirmationTotalsComponent } from './order-confirmation-totals.component';

import createSpy = jasmine.createSpy;
import { By } from '@angular/platform-browser';

@Component({ selector: 'cx-order-summary', template: '' })
class MockOrderSummaryComponent {
  @Input()
  cart: Cart;
}

class MockCheckoutService {
  clearCheckoutData = createSpy();

  getOrderDetails(): Observable<Order> {
    return of({
      code: 'test-code-412',
    });
  }
}

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationTotalsComponent;
  let fixture: ComponentFixture<OrderConfirmationTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        OrderConfirmationTotalsComponent,
        MockOrderSummaryComponent,
      ],
      providers: [{ provide: CheckoutService, useClass: MockCheckoutService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConfirmationTotalsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should display order-summary', () => {
    const getOrderSummary = () =>
      fixture.debugElement.query(By.css('cx-order-summary'));
    component.ngOnInit();
    fixture.detectChanges();
    expect(getOrderSummary()).toBeTruthy();
  });
});
