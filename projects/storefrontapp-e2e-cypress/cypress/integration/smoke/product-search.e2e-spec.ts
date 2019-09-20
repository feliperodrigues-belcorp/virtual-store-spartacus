import * as productSearchFlow from '../../helpers/product-search';

function enterProduct() {
  cy.get('cx-searchbox input').type('camera{enter}');
}

context('Product search', () => {
  before(() => {
    cy.visit('/');
    enterProduct();
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
      productSearchFlow.clearActiveFacet();
    });
  });

  describe('Sorting', () => {
    before(() => {
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
