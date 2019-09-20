import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckoutAdapter } from './checkout.adapter';
import { Order } from '../../../model/order.model';
import { CheckoutDetails } from '../../models/checkout.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutConnector {
  constructor(protected adapter: CheckoutAdapter) {}

  public placeOrder(userId: string, cartId: string): Observable<Order> {
    return this.adapter.placeOrder(userId, cartId);
  }

  public loadCheckoutDetails(
    userId: string,
    cartId: string
  ): Observable<CheckoutDetails> {
    return this.adapter.loadCheckoutDetails(userId, cartId);
  }
}
