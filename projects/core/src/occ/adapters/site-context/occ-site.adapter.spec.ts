import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ConverterService,
  CountryType,
  COUNTRY_NORMALIZER,
  OccSiteAdapter,
  REGION_NORMALIZER,
} from '@spartacus/core';
import {
  CURRENCY_NORMALIZER,
  LANGUAGE_NORMALIZER,
} from '../../../site-context/connectors/converters';
import { OccConfig } from '../../config/occ-config';
import { Occ } from '../../occ-models/occ.models';
import { OccEndpointsService } from '../../services';

const MockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: 'base-url',
      prefix: '/rest/v2/',
    },
  },

  context: {
    baseSite: ['test-site'],
  },
};

class MockOccEndpointsService {
  getUrl(endpoint: string, _urlParams?: object, _queryParams?: object) {
    return this.getEndpoint(endpoint);
  }
  getEndpoint(url: string) {
    return url;
  }
  getBaseEndpoint() {
    return (
      MockOccModuleConfig.backend.occ.baseUrl +
      MockOccModuleConfig.backend.occ.prefix +
      MockOccModuleConfig.context.baseSite
    );
  }
}

describe('OccSiteAdapter', () => {
  let occSiteAdapter: OccSiteAdapter;
  let converterService: ConverterService;
  let httpMock: HttpTestingController;
  let occEndpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccSiteAdapter,
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService,
        },
      ],
    });
    occSiteAdapter = TestBed.get(OccSiteAdapter as Type<OccSiteAdapter>);
    httpMock = TestBed.get(HttpTestingController as Type<
      HttpTestingController
    >);
    converterService = TestBed.get(ConverterService as Type<ConverterService>);
    occEndpointsService = TestBed.get(OccEndpointsService as Type<
      OccEndpointsService
    >);
    spyOn(converterService, 'pipeableMany').and.callThrough();
    spyOn(occEndpointsService, 'getUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('load languages', () => {
    it('should retrieve two languages', () => {
      const languages: Occ.LanguageList = {
        languages: [{ isocode: 'en' }, { isocode: 'de' }],
      };

      occSiteAdapter.loadLanguages().subscribe(result => {
        expect(result).toEqual(languages.languages);
      });

      const mockRequest: TestRequest = httpMock.expectOne({
        method: 'GET',
        url: 'languages',
      });

      expect(mockRequest.cancelled).toBeFalsy();
      expect(mockRequest.request.responseType).toEqual('json');
      expect(occEndpointsService.getUrl).toHaveBeenCalledWith('languages');
      mockRequest.flush(languages);
    });

    it('should use converter', () => {
      occSiteAdapter.loadLanguages().subscribe();
      httpMock.expectOne('languages').flush([]);
      expect(converterService.pipeableMany).toHaveBeenCalledWith(
        LANGUAGE_NORMALIZER
      );
    });
  });

  describe('load currencies', () => {
    it('should retrieve two currencies', () => {
      const currencies: Occ.CurrencyList = {
        currencies: [{ isocode: 'USD' }, { isocode: 'JPY' }],
      };

      occSiteAdapter.loadCurrencies().subscribe(result => {
        expect(result).toEqual(currencies.currencies);
      });
      const mockReq: TestRequest = httpMock.expectOne({
        method: 'GET',
        url: 'currencies',
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(occEndpointsService.getUrl).toHaveBeenCalledWith('currencies');
      mockReq.flush(currencies);
    });

    it('should use converter', () => {
      occSiteAdapter.loadCurrencies().subscribe();
      httpMock.expectOne('currencies').flush([]);
      expect(converterService.pipeableMany).toHaveBeenCalledWith(
        CURRENCY_NORMALIZER
      );
    });
  });

  describe('loadCountries', () => {
    it('should return delivery countries list', () => {
      const countryList: Occ.CountryList = {
        countries: [
          {
            isocode: 'AL',
            name: 'Albania',
          },
          {
            isocode: 'AD',
            name: 'Andorra',
          },
        ],
      };

      occSiteAdapter.loadCountries().subscribe(result => {
        expect(result).toEqual(countryList.countries);
      });

      const mockReq = httpMock.expectOne(
        req => req.method === 'GET' && req.url === 'countries'
      );

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(countryList);
    });

    it('should take type into account', () => {
      occSiteAdapter.loadCountries(CountryType.BILLING).subscribe();
      httpMock
        .expectOne(req => req.method === 'GET' && req.url === 'countries')
        .flush({});
      expect(occEndpointsService.getUrl).toHaveBeenCalledWith(
        'countries',
        undefined,
        { type: CountryType.BILLING }
      );
    });

    it('should use converter', () => {
      occSiteAdapter.loadCountries().subscribe();
      httpMock.expectOne('countries').flush({});
      expect(converterService.pipeableMany).toHaveBeenCalledWith(
        COUNTRY_NORMALIZER
      );
    });
  });

  describe('loadRegions', () => {
    it('should return regions', () => {
      const countryIsoCode = 'CA';
      const regions: Occ.RegionList = {
        regions: [
          {
            isocode: 'CA-AB',
            name: 'Alberta',
          },
          {
            isocode: 'CA-BC',
            name: 'British Columbia',
          },
          {
            isocode: 'CA-MB',
            name: 'Manitoba',
          },
        ],
      };

      occSiteAdapter.loadRegions(countryIsoCode).subscribe(result => {
        expect(result).toEqual(regions.regions);
      });

      const mockReq = httpMock.expectOne(
        req => req.method === 'GET' && req.url === 'regions'
      );

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(occEndpointsService.getUrl).toHaveBeenCalledWith('regions', {
        isoCode: countryIsoCode,
      });
      mockReq.flush(regions);
    });

    it('should use converter', () => {
      occSiteAdapter.loadRegions('CA').subscribe();
      httpMock.expectOne('regions').flush({});
      expect(converterService.pipeableMany).toHaveBeenCalledWith(
        REGION_NORMALIZER
      );
    });
  });

  describe('load the active base site data', () => {
    it('should retrieve the active base site', () => {
      const baseSite = {
        uid: 'test-site',
        defaultPreviewCategoryCode: 'test category code',
        defaultPreviewProductCode: 'test product code',
      };

      occSiteAdapter.loadBaseSite().subscribe(result => {
        expect(result).toEqual(baseSite);
      });
      const mockReq: TestRequest = httpMock.expectOne({
        method: 'GET',
        url: 'base-url/rest/v2/basesites?fields=FULL',
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush({ baseSites: [baseSite] });
    });
  });
});
