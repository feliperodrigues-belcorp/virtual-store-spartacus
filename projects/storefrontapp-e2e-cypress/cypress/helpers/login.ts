import { user } from '../sample-data/checkout-flow';
import { login, register } from './auth-forms';
import * as alerts from './global-message';

export const userGreetSelector = 'cx-login .cx-login-greet';
export const loginLinkSelector = 'cx-login [role="link"]';

export function registerUser() {
  cy.get(loginLinkSelector).click();
  cy.get('cx-page-layout')
    .getByText('Register')
    .click();
  register(user);
  return user;
}

export function signOutUser() {
  cy.selectUserMenuOption({
    option: 'Sign Out',
  });

  cy.get(userGreetSelector).should('not.exist');
}

export function loginUser() {
  login(user.email, user.password);
}

export function loginWithBadCredentials() {
  cy.get(loginLinkSelector).click();

  login(user.email, 'Password321');

  cy.get(userGreetSelector).should('not.exist');

  alerts
    .getErrorAlert()
    .should('contain', 'Bad credentials. Please login again');
}
