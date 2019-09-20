import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { StoreFinderConnector } from '../../connectors/store-finder.connector';
import { StoreFinderActions } from '../actions/index';

@Injectable()
export class ViewAllStoresEffect {
  constructor(
    private actions$: Actions,
    private storeFinderConnector: StoreFinderConnector
  ) {}

  @Effect()
  viewAllStores$: Observable<
    | StoreFinderActions.ViewAllStoresSuccess
    | StoreFinderActions.ViewAllStoresFail
  > = this.actions$.pipe(
    ofType(StoreFinderActions.VIEW_ALL_STORES),
    switchMap(() => {
      return this.storeFinderConnector.getCounts().pipe(
        map(data => new StoreFinderActions.ViewAllStoresSuccess(data)),
        catchError(error =>
          of(
            new StoreFinderActions.ViewAllStoresFail(
              makeErrorSerializable(error)
            )
          )
        )
      );
    })
  );
}
