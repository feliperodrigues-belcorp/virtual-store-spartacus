import { IconConfig, IconResourceType } from './icon.model';

export const fontawesomeIconConfig: IconConfig = {
  icon: {
    symbols: {
      SEARCH: 'fas fa-search',
      CART: 'fas fa-shopping-cart',
      INFO: 'fas fa-info-circle',
      STAR: 'fas fa-star',
      GRID: 'fas fa-th-large',
      LIST: 'fas fa-bars',
      CARET_DOWN: 'fas fa-angle-down',
      CARET_RIGHT: 'fas fa-angle-right',
      CARET_LEFT: 'fas fa-angle-left',
      ERROR: 'fas fa-exclamation-circle',
      WARNING: 'fas fa-exclamation-triangle',
      SUCCESS: 'fas fa-check-circle',
      CLOSE: 'fas fa-times',
      VISA: 'fab fa-cc-visa',
      MASTER_CARD: 'fab fa-cc-mastercard',
      AMEX: 'fab fa-cc-amex',
      DINERS_CLUB: 'fab fa-cc-diners-club',
      CREDIT_CARD: 'fas fa-credit-card',
      COLLAPSE: 'fas fa-minus',
      EXPAND: 'fas fa-plus',
      RESET: 'fas fa-times-circle',
      CIRCLE: 'fas fa-circle',
    },
    resources: [
      {
        type: IconResourceType.LINK,
        url: 'https://use.fontawesome.com/releases/v5.8.1/css/all.css',
      },
    ],
  },
};
