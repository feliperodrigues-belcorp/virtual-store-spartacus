import { user } from '../sample-data/checkout-flow';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Make sure you have payment done. Returns payment object.
       *
       * @memberof Cypress.Chainable
       *
       * @example
        ```
        cy.requirePaymentDone(auth);
        ```
       */
      requirePaymentDone: (auth: {}) => Cypress.Chainable<{}>;
    }
  }
}
Cypress.Commands.add('requirePaymentDone', auth => {
  const apiUrl = Cypress.env('API_URL');
  function getResponseUrl() {
    return cy.request({
      method: 'GET',
      url: `${apiUrl}/rest/v2/electronics/users/current/carts/current/payment/sop/request?responseUrl=sampleUrl`,
      form: false,
      headers: {
        Authorization: `bearer ${auth.userToken.token.access_token}`,
      },
    });
  }

  function doVerification(data) {
    data = prepareCardData(data);
    return cy.request({
      method: 'POST',
      url: `${apiUrl}/acceleratorservices/sop-mock/process`,
      body: data,
      form: true,
      headers: {
        Authorization: `bearer ${auth.userToken.token.access_token}`,
      },
    });
  }

  function doPayment(data, subId, subIdSign) {
    // prepare request body
    data = prepareCardData(data);
    data.decision = 'ACCEPT';
    data.paySubscriptionCreateReply_subscriptionID = subId;
    data.paySubscriptionCreateReply_subscriptionIDPublicSignature = subIdSign;
    data.defaultPayment = false;
    data.savePaymentInfo = true;
    data.reasonCode = '100';

    return cy.request({
      method: 'POST',
      url: `${apiUrl}/rest/v2/electronics/users/current/carts/current/payment/sop/response`,
      body: data,
      form: true,
      headers: {
        Authorization: `bearer ${auth.userToken.token.access_token}`,
      },
    });
  }

  function convertToMap(paramList: { key; value }[]) {
    return paramList.reduce(function(result, item) {
      const key = item.key;
      result[key] = item.value;
      return result;
    }, {});
  }

  function prepareCardData(data) {
    data.card_cardType = user.payment.card;
    data.card_accountNumber = user.payment.number;
    data.card_expirationMonth = user.payment.expires.month;
    data.card_expirationYear = user.payment.expires.year;
    data.card_nameOnCard = `${user.firstName} ${user.lastName}`;
    data.card_cvNumber = user.payment.cvv;
    return data;
  }

  cy.server();

  getResponseUrl().then(resp => {
    doVerification(convertToMap(resp.body.parameters.entry)).then(respV => {
      const sidRe = /name="paySubscriptionCreateReply_subscriptionID" value="(.+)"/gm;
      const sid = sidRe.exec(respV.body)[1];
      const sidSigRe = /name="paySubscriptionCreateReply_subscriptionIDPublicSignature" value="(.+)"/gm;
      const sidSig = sidSigRe.exec(respV.body)[1];
      doPayment(convertToMap(resp.body.parameters.entry), sid, sidSig);
    });
  });
});
