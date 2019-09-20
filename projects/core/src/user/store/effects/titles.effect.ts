import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Title } from '../../../model/misc.model';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { UserConnector } from '../../connectors/user/user.connector';
import { UserActions } from '../actions/index';

@Injectable()
export class TitlesEffects {
  @Effect()
  loadTitles$: Observable<UserActions.TitlesAction> = this.actions$.pipe(
    ofType(UserActions.LOAD_TITLES),
    switchMap(() => {
      return this.userAccountConnector.getTitles().pipe(
        map(titles => {
          const sortedTitles = this.sortTitles(titles);
          return new UserActions.LoadTitlesSuccess(sortedTitles);
        }),
        catchError(error =>
          of(new UserActions.LoadTitlesFail(makeErrorSerializable(error)))
        )
      );
    })
  );

  private sortTitles(titles: Title[]) {
    const drTitle = { code: 'dr', name: 'Dr.' };
    const revTitle = { code: 'rev', name: 'Rev.' };

    const filteredTitles = titles.filter(
      t => t.code !== 'dr' && t.code !== 'rev'
    );
    const sortedTitles = [...filteredTitles, drTitle, revTitle];
    return sortedTitles;
  }

  constructor(
    private actions$: Actions,
    private userAccountConnector: UserConnector
  ) {}
}
