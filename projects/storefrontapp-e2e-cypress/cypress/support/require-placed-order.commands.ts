declare namespace Cypress {
  interface Chainable {
    /**
       * Make sure you have placed the order. Returns new order data.
       *
       * @memberof Cypress.Chainable
       *
       * @example
        ```
        cy.requirePlacedOrder(auth, address);
        ```
       */
    requirePlacedOrder: (token: {}, cartId: {}) => Cypress.Chainable<{}>;
  }
}

Cypress.Commands.add('requirePlacedOrder', (auth, cartId) => {
  const apiUrl = Cypress.env('API_URL');

  function placeOrder() {
    return cy.request({
      method: 'POST',
      url: `${apiUrl}/rest/v2/electronics/users/current/orders?cartId=${cartId}`,
      form: false,
      headers: {
        Authorization: `bearer ${auth.userToken.token.access_token}`,
      },
    });
  }

  cy.server();
  placeOrder().then(resp => cy.wrap(resp));
});
