import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Address,
  CheckoutService,
  DeliveryMode,
  Order,
  PaymentDetails,
  TranslationService,
} from '@spartacus/core';
import { Observable, combineLatest } from 'rxjs';
import { Card } from '../../../../shared/components/card/card.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cx-order-confirmation-overview',
  templateUrl: './order-confirmation-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderConfirmationOverviewComponent implements OnInit, OnDestroy {
  order$: Observable<Order>;

  constructor(
    protected checkoutService: CheckoutService,
    private translation: TranslationService
  ) {}

  ngOnInit() {
    this.order$ = this.checkoutService.getOrderDetails();
  }

  ngOnDestroy() {
    this.checkoutService.clearCheckoutData();
  }

  getAddressCardContent(deliveryAddress: Address): Observable<Card> {
    return this.translation.translate('addressCard.shipTo').pipe(
      map(textTitle => ({
        title: textTitle,
        textBold: `${deliveryAddress.firstName} ${deliveryAddress.lastName}`,
        text: [
          deliveryAddress.line1,
          deliveryAddress.line2,
          `${deliveryAddress.town}, ${deliveryAddress.country.isocode}, ${
            deliveryAddress.postalCode
          }`,
          deliveryAddress.phone,
        ],
      }))
    );
  }

  getDeliveryModeCardContent(deliveryMode: DeliveryMode): Observable<Card> {
    return this.translation.translate('checkoutShipping.shippingMethod').pipe(
      map(textTitle => ({
        title: textTitle,
        textBold: deliveryMode.name,
        text: [deliveryMode.description],
      }))
    );
  }

  getBillingAddressCardContent(billingAddress: Address): Observable<Card> {
    return this.translation.translate('addressCard.billTo').pipe(
      map(textTitle => ({
        title: textTitle,
        textBold: `${billingAddress.firstName} ${billingAddress.lastName}`,
        text: [
          billingAddress.line1,
          billingAddress.line2,
          `${billingAddress.town}, ${billingAddress.country.isocode}, ${
            billingAddress.postalCode
          }`,
          billingAddress.phone,
        ],
      }))
    );
  }

  getPaymentInfoCardContent(payment: PaymentDetails): Observable<Card> {
    return combineLatest([
      this.translation.translate('paymentForm.payment'),
      this.translation.translate('paymentCard.expires', {
        month: payment.expiryMonth,
        year: payment.expiryYear,
      }),
    ]).pipe(
      map(([textTitle, textExpires]) => ({
        title: textTitle,
        textBold: payment.accountHolderName,
        text: [payment.cardNumber, textExpires],
      }))
    );
  }
}
