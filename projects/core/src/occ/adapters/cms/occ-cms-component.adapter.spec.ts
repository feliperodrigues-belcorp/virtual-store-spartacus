import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CMS_COMPONENT_NORMALIZER } from '../../../cms/connectors/component/converters';
import { CmsStructureConfigService } from '../../../cms/services';
import { CmsComponent, PageType } from '../../../model/cms.model';
import { PageContext } from '../../../routing';
import { ConverterService } from '../../../util/converter.service';
import { Occ } from '../../occ-models/occ.models';
import { OccEndpointsService } from '../../services/occ-endpoints.service';
import { OccCmsComponentAdapter } from './occ-cms-component.adapter';

const components: CmsComponent[] = [
  { uid: 'comp1', typeCode: 'SimpleBannerComponent' },
  { uid: 'comp2', typeCode: 'CMSLinkComponent' },
  { uid: 'comp3', typeCode: 'NavigationComponent' },
];

const component: CmsComponent = components[1];

const componentList: Occ.ComponentList = {
  component: [{ uid: 'comp_uid1' }, { uid: 'comp_uid2' }],
};

class CmsStructureConfigServiceMock {}

const endpoint = '/cms';

class OccEndpointsServiceMock {
  getEndpoint(): string {
    return endpoint;
  }
  getUrl(_endpoint: string, _urlParams?: any, _queryParams?: any): string {
    return '';
  }
}

const context: PageContext = {
  id: '123',
  type: PageType.PRODUCT_PAGE,
};

const ids = ['comp_uid1', 'comp_uid2'];

const spyOnLoadEndpint =
  endpoint + `/components/comp1?productCode=${context.id}`;
// const spyOnNormalizerEndpoint = endpoint + '/components';
const spyOnGetEndpoint =
  endpoint +
  `/components?componentIds=${ids.toString()}&productCode=${context.id}`;
const spyOnPostEndpoint = endpoint + `/components?productCode=${context.id}`;

describe('OccCmsComponentAdapter', () => {
  let service: OccCmsComponentAdapter;
  let httpMock: HttpTestingController;
  let converter: ConverterService;
  let endpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccCmsComponentAdapter,
        { provide: OccEndpointsService, useClass: OccEndpointsServiceMock },
        {
          provide: CmsStructureConfigService,
          useClass: CmsStructureConfigServiceMock,
        },
      ],
    });
    service = TestBed.get(OccCmsComponentAdapter as Type<
      OccCmsComponentAdapter
    >);
    httpMock = TestBed.get(HttpTestingController as Type<
      HttpTestingController
    >);
    converter = TestBed.get(ConverterService as Type<ConverterService>);
    endpointsService = TestBed.get(OccEndpointsService as Type<
      OccEndpointsService
    >);

    spyOn(converter, 'pipeable').and.callThrough();
    spyOn(converter, 'pipeableMany').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('load', () => {
    it('should get cms component data', () => {
      spyOnEndpoint(spyOnLoadEndpint);

      service.load('comp1', context).subscribe(result => {
        expect(result).toEqual(component);
      });

      const testRequest = mockHttpRequest('GET', spyOnLoadEndpint);

      expect(endpointsService.getUrl).toHaveBeenCalledWith(
        'component',
        { id: 'comp1' },
        { productCode: '123' }
      );

      assertTestRequest(testRequest, component);
    });

    it('should use normalizer', () => {
      spyOnEndpoint(spyOnLoadEndpint);

      service.load('comp1', context).subscribe();

      assertNormalizer(spyOnLoadEndpint);

      expect(converter.pipeable).toHaveBeenCalledWith(CMS_COMPONENT_NORMALIZER);
    });
  });

  describe('load list of cms component data using GET request', () => {
    it('should get a list of cms component data using GET request without pagination parameters', () => {
      spyOnEndpoint(spyOnGetEndpoint);

      assertGetSubscription(service);

      const testRequest = mockHttpRequest('GET', spyOnGetEndpoint);

      assertGetRequestGetUrl('DEFAULT', '2');

      assertTestRequest(testRequest, componentList);
    });

    it('should get a list of cms component data using GET request with pagination parameters', () => {
      spyOnEndpoint(spyOnGetEndpoint);

      assertGetSubscription(service, 'FULL', 0, 5);

      const testRequest = mockHttpRequest('GET', spyOnGetEndpoint);

      assertGetRequestGetUrl('FULL', '5');

      assertTestRequest(testRequest, componentList);
    });

    it('should use normalizer', () => {
      spyOnEndpoint(spyOnGetEndpoint);

      assertGetSubscription(service);

      assertNormalizer(spyOnGetEndpoint);
      assertConverterPipeableMany();
    });
  });

  describe('load list of cms component data using POST request', () => {
    it('should get a list of cms component data using POST request without pagination parameters', () => {
      spyOnEndpoint(spyOnPostEndpoint);

      assertPostSubscription(service);

      const testRequest = mockHttpRequest('POST', spyOnPostEndpoint);

      assertPostTestRequestBody(testRequest);

      assertPostRequestGetUrl('DEFAULT', '2');

      assertTestRequest(testRequest, componentList);
    });

    it('should get a list of cms component data using POST request with pagination parameters', () => {
      spyOnEndpoint(spyOnPostEndpoint);

      assertPostSubscription(service, 'FULL', 0, 5);

      const testRequest = mockHttpRequest('POST', spyOnPostEndpoint);

      assertPostTestRequestBody(testRequest);

      assertPostRequestGetUrl('FULL', '5');

      assertTestRequest(testRequest, componentList);
    });

    it('should use normalizer', () => {
      spyOnEndpoint(spyOnPostEndpoint);

      assertPostSubscription(service);

      assertNormalizer(spyOnPostEndpoint);
      assertConverterPipeableMany();
    });
  });

  function spyOnEndpoint(requestUrl: string): jasmine.Spy {
    return spyOn(endpointsService, 'getUrl').and.returnValue(requestUrl);
  }

  function mockHttpRequest(
    requestMethod: string,
    requestUrl: string
  ): TestRequest {
    return httpMock.expectOne(req => {
      return req.method === requestMethod && req.url === requestUrl;
    });
  }

  function assertPostTestRequestBody(testRequest: TestRequest) {
    expect(testRequest.request.body).toEqual({ idList: ids });
  }

  function assertTestRequest(
    testRequest: TestRequest,
    componentObj: CmsComponent | Occ.ComponentList
  ) {
    expect(testRequest.cancelled).toBeFalsy();
    expect(testRequest.request.responseType).toEqual('json');
    testRequest.flush(componentObj);
  }

  function assertPostRequestGetUrl(fields: string, pageSize: string) {
    expect(endpointsService.getUrl).toHaveBeenCalledWith(
      'components',
      {},
      { fields, productCode: '123', currentPage: '0', pageSize }
    );
  }

  function assertGetRequestGetUrl(fields: string, pageSize: string) {
    expect(endpointsService.getUrl).toHaveBeenCalledWith(
      'components',
      {},
      {
        fields,
        componentIds: ids.toString(),
        productCode: '123',
        currentPage: '0',
        pageSize,
      }
    );
  }

  function assertConverterPipeableMany() {
    expect(converter.pipeableMany).toHaveBeenCalledWith(
      CMS_COMPONENT_NORMALIZER
    );
  }

  function assertNormalizer(requestUrl: string) {
    httpMock.expectOne(req => req.url === requestUrl).flush(componentList);
  }

  function assertPostSubscription(
    adapter: OccCmsComponentAdapter,
    fields?: string,
    currentPage?: number,
    pageSize?: number
  ) {
    adapter
      .findComponentsByIdsLegacy(ids, context, fields, currentPage, pageSize)
      .subscribe(result => {
        expect(result).toEqual(componentList.component);
      });
  }

  function assertGetSubscription(
    adapter: OccCmsComponentAdapter,
    fields?: string,
    currentPage?: number,
    pageSize?: number
  ) {
    adapter
      .findComponentsByIds(ids, context, fields, currentPage, pageSize)
      .subscribe(result => {
        expect(result).toEqual(componentList.component);
      });
  }
});
