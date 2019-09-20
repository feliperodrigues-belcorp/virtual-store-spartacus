import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  CONSENT_TEMPLATE_NORMALIZER,
  ConverterService,
  Occ,
} from '@spartacus/core';
import { ConsentTemplate } from '../../../model/consent.model';
import { OccConfig } from '../../config/occ-config';
import { OccEndpointsService } from '../../services';
import { OccUserConsentAdapter } from './occ-user-consent.adapter';
import {
  MockOccEndpointsService,
  mockOccModuleConfig,
} from './unit-test.helper';

describe('OccUserConsentAdapter', () => {
  let occUserConsentAdapter: OccUserConsentAdapter;
  let httpMock: HttpTestingController;
  let converter: ConverterService;
  let occEnpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccUserConsentAdapter,
        { provide: OccConfig, useValue: mockOccModuleConfig },
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService,
        },
      ],
    });

    occUserConsentAdapter = TestBed.get(OccUserConsentAdapter as Type<
      OccUserConsentAdapter
    >);
    httpMock = TestBed.get(HttpTestingController as Type<
      HttpTestingController
    >);
    converter = TestBed.get(ConverterService as Type<ConverterService>);
    occEnpointsService = TestBed.get(OccEndpointsService as Type<
      OccEndpointsService
    >);
    spyOn(converter, 'pipeableMany').and.callThrough();
    spyOn(converter, 'pipeable').and.callThrough();
    spyOn(occEnpointsService, 'getUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('loadConsents', () => {
    it('should retrive user consents for the given user id', () => {
      const userId = 'xxx@xxx.xxx';
      const mockConsentTemplateList: Occ.ConsentTemplateList = {
        consentTemplates: [{ id: 'xxx' }],
      };

      occUserConsentAdapter.loadConsents(userId).subscribe(result => {
        expect(result).toEqual(mockConsentTemplateList.consentTemplates);
      });

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET';
      });

      expect(occEnpointsService.getUrl).toHaveBeenCalledWith(
        'consentTemplates',
        {
          userId,
        }
      );
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(mockConsentTemplateList);
    });

    it('should use converter', () => {
      const userId = 'xxx@xxx.xxx';
      occUserConsentAdapter.loadConsents(userId).subscribe();
      httpMock
        .expectOne(req => {
          return req.method === 'GET';
        })
        .flush([]);
      expect(converter.pipeableMany).toHaveBeenCalledWith(
        CONSENT_TEMPLATE_NORMALIZER
      );
    });
  });

  describe('giveConsent', () => {
    it('should give the user consent', () => {
      const consentTemplateId = 'xxx';
      const consentTemplateVersion = 1;
      const userId = 'xxx@xxx.xxx';

      const expectedConsentTemplate: ConsentTemplate = {
        id: consentTemplateId,
        version: consentTemplateVersion,
        currentConsent: {
          consentGivenDate: new Date(),
        },
      };
      occUserConsentAdapter
        .giveConsent(userId, consentTemplateId, consentTemplateVersion)
        .subscribe(result => expect(result).toEqual(expectedConsentTemplate));

      const mockReq = httpMock.expectOne(
        req =>
          req.method === 'POST' &&
          req.serializeBody() ===
            `consentTemplateId=${consentTemplateId}&consentTemplateVersion=${consentTemplateVersion}`
      );
      expect(occEnpointsService.getUrl).toHaveBeenCalledWith('consents', {
        userId,
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.headers.get('Content-Type')).toEqual(
        'application/x-www-form-urlencoded'
      );
      mockReq.flush(expectedConsentTemplate);
    });

    it('should use converter', () => {
      const userId = 'xxx@xxx.xxx';

      occUserConsentAdapter.giveConsent(userId, 'xxx', 1).subscribe();
      httpMock.expectOne(req => req.method === 'POST').flush({});
      expect(converter.pipeable).toHaveBeenCalledWith(
        CONSENT_TEMPLATE_NORMALIZER
      );
    });
  });

  describe('withdrawConsent', () => {
    it('should withdraw the user consent', () => {
      occUserConsentAdapter
        .withdrawConsent('xxx@xxx.xxx', 'xxx')
        .subscribe(result => expect(result).toEqual(''));

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'DELETE';
      });

      expect(occEnpointsService.getUrl).toHaveBeenCalledWith('consentDetail', {
        userId: 'xxx@xxx.xxx',
        consentId: 'xxx',
      });
      expect(mockReq.cancelled).toBeFalsy();
      mockReq.flush('');
    });
  });
});
