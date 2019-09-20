import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  CmsComponent,
  ProductSearchPage,
  RoutingService,
  SearchboxService,
  Suggestion,
  TranslationService,
  WindowRef,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';
import { SearchBoxComponentService } from './search-box-component.service';
import { SearchBoxConfig, SearchResults } from './search-box.model';
import createSpy = jasmine.createSpy;

const mockQueryString = '?query=mockQuery';

const searchBoxConfig: SearchBoxConfig = {
  minCharactersBeforeRequest: 1,
  displayProducts: true,
  displaySuggestions: true,
  maxProducts: 5,
  maxSuggestions: 5,
  displayProductImages: false,
};

class MockSearchboxService {
  getSuggestionResults(): Observable<Suggestion[]> {
    return of();
  }
  getResults(): Observable<ProductSearchPage> {
    return of();
  }
}

const mockRouterState = {
  state: {
    params: {
      query: 'test',
    },
  },
};

const MockRoutingService = {
  go: createSpy('go'),
  getRouterState() {
    return of(mockRouterState);
  },
};
const MockComponentData = <CmsComponentData<CmsComponent>>{
  data$: of({}),
};

class MockTranslationService {
  translate(value: string, options: any) {
    return of(value + (options ? JSON.stringify(options) : ''));
  }
}

const mockSearchResults: ProductSearchPage = {
  products: [
    {
      code: '123',
    },
    {
      code: '456',
    },
  ],
  freeTextSearch: 'query',
};

describe('SearchBoxComponentService', () => {
  let service: SearchBoxComponentService;
  let searchBoxservice: SearchboxService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CmsComponentData,
          useValue: MockComponentData,
        },
        {
          provide: RoutingService,
          useValue: MockRoutingService,
        },
        {
          provide: SearchboxService,
          useClass: MockSearchboxService,
        },
        { provide: TranslationService, useClass: MockTranslationService },
        SearchBoxComponentService,
        WindowRef,
      ],
    });
    service = TestBed.get(SearchBoxComponentService as Type<
      SearchBoxComponentService
    >);
    searchBoxservice = TestBed.get(SearchboxService as Type<SearchboxService>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate at launchSearchPage(query: string)', () => {
    spyOn(service, 'launchSearchPage').and.callThrough();

    service.launchSearchPage(mockQueryString);
    expect(service.launchSearchPage).toHaveBeenCalled();
    expect(MockRoutingService.go).toHaveBeenCalledWith({
      cxRoute: 'search',
      params: { query: mockQueryString },
    });
  });

  it('should get suggestions from search)', () => {
    const searchConfig = { pageSize: 5 };
    service.getResults(searchBoxConfig).subscribe(() => {
      expect(searchBoxservice.searchSuggestions).toHaveBeenCalledWith(
        'testQuery',
        searchConfig
      );
    });
  });

  it('should return 2 products', () => {
    let result: SearchResults;
    spyOn(searchBoxservice, 'getResults').and.returnValue(
      of(mockSearchResults)
    );
    spyOn(searchBoxservice, 'getSuggestionResults').and.returnValue(of([]));
    service
      .getResults(searchBoxConfig)
      .subscribe(results => (result = results));
    expect(result.products.length).toEqual(2);
  });

  it('should not return products when config.displayProducts = false', () => {
    spyOn(searchBoxservice, 'getSuggestionResults').and.returnValue(
      of(['sug1', 'sug2'])
    );

    let result: SearchResults;
    service
      .getResults({ displaySuggestions: true, displayProducts: false })
      .subscribe(results => (result = results));
    expect(result.products).toBeFalsy();
  });

  describe('search result suggestions', () => {
    let result: SearchResults;
    beforeEach(() => {
      spyOn(searchBoxservice, 'getResults').and.returnValue(
        of(mockSearchResults)
      );
    });

    it('should return 2 suggestions', () => {
      spyOn(searchBoxservice, 'getSuggestionResults').and.returnValue(
        of(['sug1', 'sug2'])
      );

      service
        .getResults(searchBoxConfig)
        .subscribe(results => (result = results));
      expect(result.suggestions.length).toEqual(2);
    });

    it('should not return suggestions when config.displaySuggestions = false', () => {
      spyOn(searchBoxservice, 'getSuggestionResults').and.returnValue(
        of(['sug1', 'sug2'])
      );

      service
        .getResults({ displaySuggestions: false, displayProducts: true })
        .subscribe(results => (result = results));
      expect(result.suggestions.length).toEqual(0);
    });

    it('should have exact match suggestion when there are no suggestions but at least one product', () => {
      spyOn(searchBoxservice, 'getSuggestionResults').and.returnValue(of([]));

      service
        .getResults(searchBoxConfig)
        .subscribe(results => (result = results));
      expect(result.suggestions).toEqual([
        'searchBox.help.exactMatch{"term":"query"}',
      ]);
    });

    it('should not get an exact match suggestion when there are suggestions returned', () => {
      spyOn(searchBoxservice, 'getSuggestionResults').and.returnValue(
        of(['sug1'])
      );

      service
        .getResults(searchBoxConfig)
        .subscribe(results => (result = results));
      expect(result.suggestions).not.toContain(
        'searchBox.help.exactMatch{"term":"query"}'
      );
    });
  });

  describe('search result message', () => {
    let result: SearchResults;

    it('should not get a message when there are no results ', () => {
      spyOn(searchBoxservice, 'getResults').and.returnValue(of({}));
      spyOn(searchBoxservice, 'getSuggestionResults').and.returnValue(of([]));

      service.getResults(searchBoxConfig).subscribe(r => (result = r));
      expect(result.message).toBeFalsy();
    });

    it('should get a not found message when there are no products and suggestions ', () => {
      spyOn(searchBoxservice, 'getResults').and.returnValue(
        of({ products: [] })
      );
      spyOn(searchBoxservice, 'getSuggestionResults').and.returnValue(of([]));

      service.getResults(searchBoxConfig).subscribe(r => (result = r));
      expect(result.message).toBeTruthy();

      expect(result.message).toEqual('searchBox.help.noMatch');
    });

    it('should not get a message when there are products ', () => {
      spyOn(searchBoxservice, 'getResults').and.returnValue(
        of(mockSearchResults)
      );
      spyOn(searchBoxservice, 'getSuggestionResults').and.returnValue(of([]));

      service.getResults(searchBoxConfig).subscribe(r => (result = r));
      expect(result.message).toBeFalsy();
    });

    it('should not get a message when there are suggestions ', () => {
      spyOn(searchBoxservice, 'getResults').and.returnValue(of());
      spyOn(searchBoxservice, 'getSuggestionResults').and.returnValue(
        of(['sug1'])
      );

      service.getResults(searchBoxConfig).subscribe(r => (result = r));
      expect(result.message).toBeFalsy();
    });
  });
});
