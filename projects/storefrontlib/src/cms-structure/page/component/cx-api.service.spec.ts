import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import {
  AuthService,
  BaseSiteService,
  CartDataService,
  CartService,
  CheckoutDeliveryService,
  CheckoutPaymentService,
  CheckoutService,
  CmsService,
  CurrencyService,
  FeatureConfigService,
  GlobalMessageService,
  KymaService,
  LanguageService,
  OccEndpointsService,
  PageMetaService,
  ProductReferenceService,
  ProductReviewService,
  ProductSearchService,
  ProductService,
  RoutingService,
  SearchboxService,
  TranslationService,
  UserAddressService,
  UserConsentService,
  UserOrderService,
  UserPaymentService,
  UserService,
} from '@spartacus/core';
import { CxApiService } from './cx-api.service';

class MockAuthService {}
class MockCartService {}
class MockCartDataService {}
class MockCheckoutService {}
class MockCheckoutDeliveryService {}
class MockCheckoutPaymentService {}
class MockCmsService {}
class MockPageMetaService {}
class MockFeatureConfigService {}
class MockGlobalMessageService {}
class MockTranslationService {}
class MockKymaService {}
class MockOccEndpointsService {}
class MockProductService {}
class MockProductSearchService {}
class MockProductReviewService {}
class MockProductReferenceService {}
class MockSearchboxService {}
class MockRoutingService {}
class MockCurrencyService {}
class MockLanguageService {}
class MockBaseSiteService {}
class MockUserService {}
class MockUserAddressService {}
class MockUserConsentService {}
class MockUserOrderService {}
class MockUserPaymentService {}

describe('CxApiService', () => {
  let authService: AuthService;
  let cmsService: CmsService;
  let routingService: RoutingService;
  let currencyService: CurrencyService;
  let languageService: LanguageService;
  let productService: ProductService;
  let productSearchService: ProductSearchService;
  let productReviewService: ProductReviewService;
  let translationService: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CxApiService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: CartService, useClass: MockCartService },
        { provide: CartDataService, useClass: MockCartDataService },
        { provide: CheckoutService, useClass: MockCheckoutService },
        {
          provide: CheckoutDeliveryService,
          useClass: MockCheckoutDeliveryService,
        },
        {
          provide: CheckoutPaymentService,
          useClass: MockCheckoutPaymentService,
        },

        { provide: CmsService, useClass: MockCmsService },

        { provide: PageMetaService, useClass: MockPageMetaService },
        { provide: FeatureConfigService, useClass: MockFeatureConfigService },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },

        { provide: TranslationService, useClass: MockTranslationService },

        { provide: KymaService, useClass: MockKymaService },
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },

        { provide: ProductService, useClass: MockProductService },
        { provide: ProductSearchService, useClass: MockProductSearchService },
        { provide: ProductReviewService, useClass: MockProductReviewService },
        {
          provide: ProductReferenceService,
          useClass: MockProductReferenceService,
        },
        { provide: SearchboxService, useClass: MockSearchboxService },

        { provide: RoutingService, useClass: MockRoutingService },
        { provide: CurrencyService, useClass: MockCurrencyService },
        { provide: LanguageService, useClass: MockLanguageService },
        { provide: BaseSiteService, useClass: MockBaseSiteService },
        { provide: UserService, useClass: MockUserService },
        { provide: UserAddressService, useClass: MockUserAddressService },
        { provide: UserConsentService, useClass: MockUserConsentService },
        { provide: UserOrderService, useClass: MockUserOrderService },
        { provide: UserPaymentService, useClass: MockUserPaymentService },
      ],
    });

    authService = TestBed.get(AuthService as Type<AuthService>);
    cmsService = TestBed.get(CmsService as Type<CmsService>);
    routingService = TestBed.get(RoutingService as Type<RoutingService>);
    currencyService = TestBed.get(CurrencyService as Type<CurrencyService>);
    languageService = TestBed.get(LanguageService as Type<LanguageService>);
    productService = TestBed.get(ProductService as Type<ProductService>);
    productSearchService = TestBed.get(ProductSearchService as Type<
      ProductSearchService
    >);
    productReviewService = TestBed.get(ProductReviewService as Type<
      ProductReviewService
    >);
    translationService = TestBed.get(TranslationService as Type<
      TranslationService
    >);
  });

  it('should be created', inject([CxApiService], (service: CxApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should provide specific facades', inject(
    [CxApiService],
    (service: CxApiService) => {
      expect(service.auth).toEqual(authService);
      expect(service.cms).toEqual(cmsService);
      expect(service.routing).toEqual(routingService);
      expect(service.currency).toEqual(currencyService);
      expect(service.language).toEqual(languageService);
      expect(service.product).toEqual(productService);
      expect(service.productSearch).toEqual(productSearchService);
      expect(service.productReview).toEqual(productReviewService);
      expect(service.translation).toEqual(translationService);
      expect(service.ngZone).toBeTruthy();
    }
  ));
});
