import { user } from '../sample-data/checkout-flow';
import { login } from './auth-forms';
import { checkBanner } from './homepage';
import { switchLanguage } from './language';

const orderHistoryLink = '/my-account/orders';

export function doPlaceOrder() {
  let stateAuth: any;

  return cy
    .window()
    .then(win => JSON.parse(win.localStorage.getItem('spartacus-local-data')))
    .then(({ auth }) => {
      stateAuth = auth;
      return cy.requireProductAddedToCart(stateAuth);
    })
    .then(({ cartId }) => {
      cy.requireShippingAddressAdded(user.address, stateAuth);
      cy.requireShippingMethodSelected(stateAuth);
      cy.requirePaymentDone(stateAuth);

      return cy.requirePlacedOrder(stateAuth, cartId);
    });
}

export const orderHistoryTest = {
  // no orders flow
  checkRedirectNotLoggedInUser() {
    it('should redirect to login page if user is not logged in', () => {
      cy.visit(orderHistoryLink);
      cy.url().should('contain', '/login');
      cy.get('cx-login').should('contain', 'Sign In / Register');
    });
  },
  checkRedirectLoggedInUser() {
    it('should go to Order History once user has logged in', () => {
      login(user.email, user.password);
      cy.url().should('contain', orderHistoryLink);
      cy.get('.cx-order-history-header h3').should('contain', 'Order history');
    });
  },
  checkStartShoppingButton() {
    it('should be able to start shopping from an empty Order History', () => {
      cy.get('.btn.btn-primary.btn-block.active')
        .getByText('Start Shopping')
        .click();

      checkBanner();
    });
  },
  // orders flow
  checkIfOrderIsDisplayed() {
    it('should display placed order in Order History', () => {
      doPlaceOrder().then(() => {
        doPlaceOrder().then((orderData: any) => {
          cy.visit('/my-account/orders');
          cy.get('cx-order-history h3').should('contain', 'Order history');
          cy.get('.cx-order-history-code > .cx-order-history-value').should(
            'contain',
            orderData.body.code
          );
          cy.get('.cx-order-history-total > .cx-order-history-value').should(
            'contain',
            orderData.body.totalPrice.formattedValue
          );
        });
      });
    });
  },
  checkSortingByCode() {
    it('should sort the orders table by given code', () => {
      cy.server();
      cy.route('GET', /sort=byOrderNumber/).as('query_order_asc');
      cy.visit('/my-account/orders');
      cy.get('.top cx-sorting .ng-select').ngSelect('Order Number');
      cy.wait('@query_order_asc');
      cy.get('.cx-order-history-code > .cx-order-history-value').then(
        $orders => {
          expect(parseInt($orders[0].textContent, 10)).to.be.lessThan(
            parseInt($orders[1].textContent, 10)
          );
        }
      );
    });
  },
  checkCorrectDateFormat(isMobile?: boolean) {
    it('should show correct date format', () => {
      cy.server();
      cy.route(
        'GET',
        `/rest/v2/electronics-spa/cms/pages?*/my-account/orders*`
      ).as('getOrderHistoryPage');

      // to compare two dates (EN and DE) we have to compare day numbers
      // EN: "June 15, 2019"
      // DE: "15. Juni, 2019"

      const getDayNumber = (element: any) =>
        element
          .text()
          .replace(',', '')
          .replace('.', '')
          .split(' ');
      let dayNumberEN: string;
      cy.visit('/my-account/orders');
      cy.wait('@getOrderHistoryPage');
      switchLanguage('en', isMobile);

      cy.get('.cx-order-history-placed > .cx-order-history-value')
        .first()
        .then(element => {
          dayNumberEN = getDayNumber(element)[1];
        });

      switchLanguage('de', isMobile);

      cy.get('.cx-order-history-placed > .cx-order-history-value')
        .first()
        .then(element => {
          expect(getDayNumber(element)[0]).to.eq(dayNumberEN);
        });

      switchLanguage('en', isMobile); // switch language back
    });
  },
};
