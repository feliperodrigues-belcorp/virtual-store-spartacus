import * as productSearchFlow from '../../helpers/product-search';
import { formats } from '../../sample-data/viewports';

function enterProduct() {
  productSearchFlow.clickSearchIcon();
  cy.get('cx-searchbox input[aria-label="search"]').type('camera{enter}');
}

context(`${formats.mobile.width + 1}p resolution - Product search`, () => {
  before(() => {
    cy.viewport(formats.mobile.width, formats.mobile.height);
    cy.visit('/');
    enterProduct();
  });
  beforeEach(() => {
    cy.viewport(formats.mobile.width, formats.mobile.height);
  });

  describe('Search results', () => {
    it('should be able to search and get results', () => {
      productSearchFlow.searchResult();
    });
  });

  describe('Pagination', () => {
    it('should navigate to the next page and display results', () => {
      productSearchFlow.nextPage();
    });

    it('should be able navigate to the specified page number and display results', () => {
      productSearchFlow.choosePage();
    });

    it('should navigate to the previous page and display results', () => {
      productSearchFlow.previousPage();
    });
  });

  describe('product list view mode', () => {
    it('should be able to switch to grid mode', () => {
      productSearchFlow.viewMode();
    });
  });

  describe('Facets', () => {
    it('should filter results using facet filtering', () => {
      productSearchFlow.filterUsingFacetFiltering();
    });

    it('should be able to clear active facet', () => {
      productSearchFlow.clearActiveFacet('.cx-facet-mobile');
    });
  });

  describe('Sorting', () => {
    before(() => {
      cy.viewport(formats.mobile.width, formats.mobile.height);
      cy.visit('/');
      enterProduct();
    });

    beforeEach(() => {
      cy.server();
    });

    it('should be able to sort by lowest price', () => {
      productSearchFlow.sortByLowestPrice();
    });

    it('should be able to sort by highest price', () => {
      productSearchFlow.sortByHighestPrice();
    });

    it('should be able to sort by name ascending', () => {
      productSearchFlow.sortByNameAscending();
    });

    it('should be able to sort by name descending', () => {
      productSearchFlow.sortByNameDescending();
    });

    it('should be able to sort by relevance', () => {
      productSearchFlow.sortByRelevance();
    });

    it('should be able to sort by top rated', () => {
      productSearchFlow.sortByTopRated();
    });
  });
});
