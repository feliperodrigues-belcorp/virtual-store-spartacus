import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LoaderState } from '../../state/utils/loader/loader-state';
import { ClientToken, UserToken } from '../models/token-types.model';
import { AuthActions } from '../store/actions/index';
import { StateWithAuth } from '../store/auth-state';
import { AuthSelectors } from '../store/selectors/index';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(protected store: Store<StateWithAuth>) {}

  /**
   * Loads a new user token
   * @param userId
   * @param password
   */
  authorize(userId: string, password: string): void {
    this.store.dispatch(
      new AuthActions.LoadUserToken({
        userId: userId,
        password: password,
      })
    );
  }

  /**
   * Returns the user's token
   */
  getUserToken(): Observable<UserToken> {
    return this.store.pipe(select(AuthSelectors.getUserToken));
  }

  /**
   * Refreshes the user token
   * @param token a user token to refresh
   */
  refreshUserToken(token: UserToken): void {
    this.store.dispatch(
      new AuthActions.RefreshUserToken({
        refreshToken: token.refresh_token,
      })
    );
  }

  /**
   * Store the provided token
   */
  authorizeWithToken(token: UserToken): void {
    this.store.dispatch(new AuthActions.LoadUserTokenSuccess(token));
  }

  /**
   * Logout
   */
  logout(): void {
    this.store.dispatch(new AuthActions.Logout());
  }

  /**
   * Returns a client token.  The client token from the store is returned if there is one.
   * Otherwise, an new token is fetched from the backend and saved in the store.
   */
  getClientToken(): Observable<ClientToken> {
    return this.store.pipe(
      select(AuthSelectors.getClientTokenState),
      filter((state: LoaderState<ClientToken>) => {
        if (this.isClientTokenLoaded(state)) {
          return true;
        } else {
          if (!state.loading) {
            this.store.dispatch(new AuthActions.LoadClientToken());
          }
          return false;
        }
      }),
      map((state: LoaderState<ClientToken>) => state.value)
    );
  }

  /**
   * Fetches a clientToken from the backend ans saves it in the store where getClientToken can use it.
   * The new clientToken is returned.
   */
  refreshClientToken(): Observable<ClientToken> {
    this.store.dispatch(new AuthActions.LoadClientToken());

    return this.store.pipe(
      select(AuthSelectors.getClientTokenState),
      filter((state: LoaderState<ClientToken>) =>
        this.isClientTokenLoaded(state)
      ),
      map((state: LoaderState<ClientToken>) => state.value)
    );
  }

  protected isClientTokenLoaded(state: LoaderState<ClientToken>): boolean {
    return (state.success || state.error) && !state.loading;
  }
}
