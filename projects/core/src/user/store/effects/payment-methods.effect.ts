import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { PaymentDetails } from '../../../model/cart.model';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { UserPaymentConnector } from '../../connectors/payment/user-payment.connector';
import { UserActions } from '../actions/index';

@Injectable()
export class UserPaymentMethodsEffects {
  @Effect()
  loadUserPaymentMethods$: Observable<Action> = this.actions$.pipe(
    ofType(UserActions.LOAD_USER_PAYMENT_METHODS),
    map((action: UserActions.LoadUserPaymentMethods) => action.payload),
    mergeMap(payload => {
      return this.userPaymentMethodConnector.getAll(payload).pipe(
        map((payments: PaymentDetails[]) => {
          return new UserActions.LoadUserPaymentMethodsSuccess(payments);
        }),
        catchError(error =>
          of(
            new UserActions.LoadUserPaymentMethodsFail(
              makeErrorSerializable(error)
            )
          )
        )
      );
    })
  );

  @Effect()
  setDefaultUserPaymentMethod$: Observable<Action> = this.actions$.pipe(
    ofType(UserActions.SET_DEFAULT_USER_PAYMENT_METHOD),
    map((action: UserActions.SetDefaultUserPaymentMethod) => action.payload),
    mergeMap(payload => {
      return this.userPaymentMethodConnector
        .setDefault(payload.userId, payload.paymentMethodId)
        .pipe(
          switchMap(data => [
            new UserActions.SetDefaultUserPaymentMethodSuccess(data),
            new UserActions.LoadUserPaymentMethods(payload.userId),
          ]),
          catchError(error =>
            of(
              new UserActions.SetDefaultUserPaymentMethodFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  );
  @Effect()
  deleteUserPaymentMethod$: Observable<Action> = this.actions$.pipe(
    ofType(UserActions.DELETE_USER_PAYMENT_METHOD),
    map((action: UserActions.DeleteUserPaymentMethod) => action.payload),
    mergeMap(payload => {
      return this.userPaymentMethodConnector
        .delete(payload.userId, payload.paymentMethodId)
        .pipe(
          switchMap(data => [
            new UserActions.DeleteUserPaymentMethodSuccess(data),
            new UserActions.LoadUserPaymentMethods(payload.userId),
          ]),
          catchError(error =>
            of(
              new UserActions.DeleteUserPaymentMethodFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  );

  constructor(
    private actions$: Actions,
    private userPaymentMethodConnector: UserPaymentConnector
  ) {}
}
