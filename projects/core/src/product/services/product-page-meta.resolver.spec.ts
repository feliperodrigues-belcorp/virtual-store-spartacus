import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import {
  CmsService,
  Page,
  PageMeta,
  PageMetaResolver,
  PageMetaService,
} from '../../cms';
import { I18nTestingModule } from '../../i18n';
import { PageType } from '../../model/cms.model';
import { RoutingService } from '../../routing';
import { ProductService } from '../facade';
import { ProductPageMetaResolver } from './product-page-meta.resolver';

const mockProductPage: Page = {
  type: PageType.PRODUCT_PAGE,
  title: 'content page title',
  slots: {},
};

class MockCmsService {
  getCurrentPage(): Observable<Page> {
    return of(mockProductPage);
  }
}

class MockRoutingService {
  getRouterState() {
    return of({
      state: {
        params: {
          productCode: '1234',
        },
      },
    });
  }
}

class MockProductService {
  get(code: string) {
    return of(<any>{
      code: code,
      name: 'Product title',
      summary: 'Product summary',
      categories: [
        {
          code: '123',
          name: 'one two three',
        },
      ],
      images: {
        PRIMARY: {
          zoom: {
            url: 'https://storefront.com/image',
          },
        },
      },
      manufacturer: 'Canon',
    });
  }
}

describe('ProductPageMetaResolver', () => {
  let service: PageMetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      providers: [
        PageMetaService,
        { provide: CmsService, useClass: MockCmsService },
        { provide: ProductService, useClass: MockProductService },
        { provide: RoutingService, useClass: MockRoutingService },
        {
          provide: PageMetaResolver,
          useExisting: ProductPageMetaResolver,
          multi: true,
        },
      ],
    });

    service = TestBed.get(PageMetaService as Type<PageMetaService>);
  });

  it('ProductTitleService should be created', inject(
    [PageMetaService],
    (pageTitleService: PageMetaService) => {
      expect(pageTitleService).toBeTruthy();
    }
  ));

  it('should resolve product page heading', () => {
    let result: PageMeta;
    service
      .getMeta()
      .subscribe(value => {
        result = value;
      })
      .unsubscribe();

    expect(result.heading).toEqual(
      'pageMetaResolver.product.heading heading:Product title'
    );
  });

  it('should resolve product page title', () => {
    let result: PageMeta;
    service
      .getMeta()
      .subscribe(value => {
        result = value;
      })
      .unsubscribe();

    expect(result.title).toEqual(
      'pageMetaResolver.product.title title:Product title | one two three | Canon'
    );
  });

  it('should resolve product description', () => {
    let result: PageMeta;
    service
      .getMeta()
      .subscribe(value => {
        result = value;
      })
      .unsubscribe();

    expect(result.description).toEqual(
      'pageMetaResolver.product.description description:Product summary'
    );
  });

  it('should resolve 2 breadcrumbs', () => {
    let result: PageMeta;
    service
      .getMeta()
      .subscribe(value => {
        result = value;
      })
      .unsubscribe();

    expect(result.breadcrumbs.length).toEqual(2);
  });

  it('should resolve 2nd breadcrumbs with category name', () => {
    let result: PageMeta;
    service
      .getMeta()
      .subscribe(value => {
        result = value;
      })
      .unsubscribe();

    expect(result.breadcrumbs[1].label).toEqual('one two three');
  });

  it('should resolve product image', () => {
    let result: PageMeta;
    service
      .getMeta()
      .subscribe(value => {
        result = value;
      })
      .unsubscribe();

    expect(result.image).toEqual('https://storefront.com/image');
  });
});
