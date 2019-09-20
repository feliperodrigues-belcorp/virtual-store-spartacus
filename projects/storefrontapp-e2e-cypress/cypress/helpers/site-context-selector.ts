import { user } from '../sample-data/checkout-flow';
import { switchSiteContext } from '../support/utils/switch-site-context';

export const LANGUAGES = 'languages';
export const CURRENCIES = 'currencies';
export const PAGES = 'pages';
export const TITLES = 'titles';
export const CART = 'cart';

export const LANGUAGE_LABEL = 'Language';
export const CURRENCY_LABEL = 'Currency';

export const BASE_URL = Cypress.config().baseUrl;
export const CONTENT_CATALOG = 'electronics-spa';
export const CURRENCY_USD = 'USD';
export const CURRENCY_JPY = 'JPY';
export const LANGUAGE_EN = 'en';
export const LANGUAGE_DE = 'de';
export const CART_REQUEST_ALIAS = 'cart_request_alias';

export const LANGUAGE_REQUEST = `${Cypress.env(
  'API_URL'
)}/rest/v2/${CONTENT_CATALOG}/languages?lang=${LANGUAGE_EN}&curr=${CURRENCY_USD}`;
export const CURRENCY_REQUEST = `${Cypress.env(
  'API_URL'
)}/rest/v2/${CONTENT_CATALOG}/currencies?lang=${LANGUAGE_EN}&curr=${CURRENCY_USD}`;

export const CART_REQUEST = `${Cypress.env(
  'API_URL'
)}/rest/v2/${CONTENT_CATALOG}/users/current/carts/*`;

export const PAGE_REQUEST = `${Cypress.env(
  'API_URL'
)}/rest/v2/${CONTENT_CATALOG}/cms/pages?fields=DEFAULT&pageType=CategoryPage&code=574&lang=${LANGUAGE_DE}&curr=${CURRENCY_USD}`;

export const TITLE_REQUEST = `${Cypress.env(
  'API_URL'
)}/rest/v2/${CONTENT_CATALOG}/titles?lang=${LANGUAGE_EN}&curr=${CURRENCY_USD}`;

export const FULL_BASE_URL_EN_USD = `${BASE_URL}/${CONTENT_CATALOG}/${LANGUAGE_EN}/${CURRENCY_USD}`;
export const FULL_BASE_URL_EN_JPY = `${BASE_URL}/${CONTENT_CATALOG}/${LANGUAGE_EN}/${CURRENCY_JPY}`;
export const FULL_BASE_URL_DE_USD = `${BASE_URL}/${CONTENT_CATALOG}/${LANGUAGE_DE}/${CURRENCY_USD}`;

const PRODUCT_ID_1 = '280916';
const PRODUCT_ID_2 = '1687508';
export const PRODUCT_NAME_CART_DE = 'Digitalkamera';
export const PRODUCT_NAME_DETAILS_DE = 'Stativ mit Fernbedienung';
export const PRODUCT_NAME_SEARCH_DE =
  'FUN Einwegkamera mit Blitz, 27+12 Bilder';
export const TITLE_DE = 'Herr';
export const MONTH_DE = new Date().toLocaleDateString('de-DE', {
  month: 'long',
});

export const PRODUCT_PATH_1 = `/product/${PRODUCT_ID_1}`;
export const PRODUCT_PATH_2 = `/product/${PRODUCT_ID_2}`;
export const CART_PATH = '/cart';
const myAccount = 'my-account';
export const ADDRESS_BOOK_PATH = `/${myAccount}/address-book`;
export const CLOSE_ACCOUNT_PATH = `/${myAccount}/close-account`;
export const CONSENT_MANAGEMENT_PATH = `/${myAccount}/consents`;
export const ORDER_PATH = `/${myAccount}/orders`;
export const PAYMENT_DETAILS_PATH = `/${myAccount}/payment-details`;
export const PERSONAL_DETAILS_PATH = `/${myAccount}/update-profile`;
export const UPDATE_EMAIL_PATH = `/${myAccount}/update-email`;
export const UPDATE_PASSWORD_PATH = `/${myAccount}/update-password`;
export const PRODUCT_SEARCH_PATH =
  '/Open-Catalogue/Cameras/Film-Cameras/c/574?pageSize=10&categoryCode=574&query=:relevance:category:574';
export const REGISTRATION_PATH = '/login/register';
export const CHECKOUT_SHIPPING_ADDRESS_PATH = '/checkout/shipping-address';
export const CHECKOUT_DELIVERY_MODE_PATH = '/checkout/delivery-mode';
export const CHECKOUT_PAYMENT_DETAILS_PATH = '/checkout/payment-details';
export const CHECKOUT_REVIEW_ORDER_PATH = '/checkout/review-order';

export function doPlaceOrder() {
  cy.window().then(win => {
    const savedState = JSON.parse(
      win.localStorage.getItem('spartacus-local-data')
    );
    cy.requireProductAddedToCart(savedState.auth).then(resp => {
      cy.requireShippingAddressAdded(user.address, savedState.auth);
      cy.requireShippingMethodSelected(savedState.auth);
      cy.requirePaymentDone(savedState.auth);
      cy.requirePlacedOrder(savedState.auth, resp.cartId);
    });
  });
}

export function addressBookNextStep() {
  cy.get('cx-shipping-address .cx-card-link').click({ force: true });
  cy.get('cx-shipping-address .btn-primary').click({ force: true });
}

export function deliveryModeNextStep() {
  cy.get('cx-delivery-mode #deliveryMode-standard-gross').click({
    force: true,
  });
  cy.get('cx-delivery-mode .btn-primary').click({ force: true });
}

export function paymentDetailsNextStep() {
  cy.get('cx-payment-method .cx-card-link').click({
    force: true,
  });
  cy.get('cx-payment-method .btn-primary').click({ force: true });
}

export function createRoute(request: string, alias: string): void {
  cy.route(request).as(alias);
}

export function stub(request: string, alias: string): void {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.server();
    createRoute(request, alias);
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });
}

export function assertSiteContextChange(testPath: string): void {
  cy.url().should('eq', testPath);
}

export function siteContextChange(
  pagePath: string,
  alias: string,
  selectedOption: string,
  label: string
): void {
  cy.visit(FULL_BASE_URL_EN_USD + pagePath);

  cy.wait(`@${alias}`);

  cy.route('GET', `*${selectedOption}*`).as('switchedContext');
  switchSiteContext(selectedOption, label);
  cy.wait('@switchedContext');
}

export function verifySiteContextChangeUrl(
  pagePath: string,
  alias: string,
  selectedOption: string,
  label: string,
  testPath: string
): void {
  siteContextChange(pagePath, alias, selectedOption, label);
  assertSiteContextChange(testPath);
}
