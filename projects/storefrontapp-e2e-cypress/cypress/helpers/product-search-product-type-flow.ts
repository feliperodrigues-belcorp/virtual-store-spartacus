import { PRODUCT_LISTING } from './data-configuration';
import {
  clickSearchIcon,
  productItemSelector,
  createProductQuery,
  createProductFacetQuery,
} from './product-search';

import { checkFirstItem } from './product-search';

export const resultsTitle = 'cx-breadcrumb h1';

export function productTypeFlow(mobile?: string) {
  cy.server();

  createProductQuery('query');

  clickSearchIcon();

  cy.get('cx-searchbox input[aria-label="search"]').type('sony{enter}');

  cy.get(resultsTitle).should('contain', '131 results for "sony"');

  cy.get(productItemSelector).should(
    'have.length',
    PRODUCT_LISTING.PRODUCTS_PER_PAGE
  );

  checkFirstItem('10.2 Megapixel D-SLR with Standard Zoom Lens');

  // Filter by brand
  createProductFacetQuery('brand', 'sony', 'brand_query');

  clickFacet('Brand');

  cy.wait('@brand_query');

  cy.get(resultsTitle).should('contain', '86 results for "sony"');

  createProductQuery('query1');

  clearSelectedFacet(mobile);

  cy.wait('@query1');

  cy.get(resultsTitle).should('contain', '131 results for "sony"');

  // Filter by price
  createProductFacetQuery('price', 'sony', 'price_query');

  clickFacet('Price');

  cy.wait('@price_query')
    .its('url')
    .should('include', 'sony:relevance:price');

  cy.get(resultsTitle).should('contain', '16 results for "sony"');

  checkFirstItem('MSHX8A');

  createProductQuery('query2');

  clearSelectedFacet(mobile);

  cy.wait('@query2');

  cy.get(resultsTitle).should('contain', '131 results for "sony"');

  // Filter by category
  createProductFacetQuery('category', 'sony', 'category_query');

  clickFacet('Category');

  cy.wait('@category_query')
    .its('url')
    .should('include', 'sony:relevance:category');

  cy.get(resultsTitle).should('contain', '95 results for "sony"');

  checkFirstItem('10.2 Megapixel D-SLR with Standard Zoom Lens');

  createProductQuery('query3');

  clearSelectedFacet(mobile);

  cy.wait('@query3');

  cy.get(resultsTitle).should('contain', '131 results for "sony"');

  // Filter by color
  createProductFacetQuery('Colour', 'sony', 'color_query');

  clickFacet('Color');

  cy.wait('@color_query')
    .its('url')
    .should('include', 'sony:relevance:Colour');

  cy.get(resultsTitle).should('contain', '7 results for "sony"');

  checkFirstItem('NP-FV 70');

  createProductQuery('query4');

  clearSelectedFacet(mobile);

  cy.wait('@query4');

  cy.get(resultsTitle).should('contain', '131 results for "sony"');
}

function clearSelectedFacet(mobile: string) {
  if (mobile) {
    cy.get(
      `cx-product-facet-navigation ${mobile} .cx-facet-filter-pill .close:first`
    ).click({ force: true });
  } else {
    cy.get(
      'cx-product-facet-navigation .cx-facet-filter-container .cx-facet-filter-pill .close:first'
    ).click({ force: true });
  }
}

function clickFacet(header: string) {
  cy.get('.cx-facet-header')
    .contains(header)
    .parents('.cx-facet-group')
    .within(() => {
      cy.get('.cx-facet-checkbox')
        .first()
        .click({ force: true });
    });
}
