import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { CheckoutPaymentConnector } from '../../connectors/payment/checkout-payment.connector';
import { CheckoutActions } from '../actions/index';

@Injectable()
export class CardTypesEffects {
  @Effect()
  loadCardTypes$: Observable<
    CheckoutActions.LoadCardTypesSuccess | CheckoutActions.LoadCardTypesFail
  > = this.actions$.pipe(
    ofType(CheckoutActions.LOAD_CARD_TYPES),
    switchMap(() => {
      return this.checkoutPaymentConnector.getCardTypes().pipe(
        map(cardTypes => new CheckoutActions.LoadCardTypesSuccess(cardTypes)),
        catchError(error =>
          of(
            new CheckoutActions.LoadCardTypesFail(makeErrorSerializable(error))
          )
        )
      );
    })
  );

  constructor(
    private actions$: Actions,
    private checkoutPaymentConnector: CheckoutPaymentConnector
  ) {}
}
