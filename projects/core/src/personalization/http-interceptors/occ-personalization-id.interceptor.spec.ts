import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { OccEndpointsService } from '../../occ/services/occ-endpoints.service';
import { WindowRef } from '../../window/window-ref';
import { PersonalizationConfig } from '../config/personalization-config';
import { OccPersonalizationIdInterceptor } from './occ-personalization-id.interceptor';

const mockPersonalizationConfig: PersonalizationConfig = {
  personalization: {
    enabled: true,
    httpHeaderName: {
      id: 'test-personalization-id',
      timestamp: 'test-personalization-time',
    },
  },
};

const store = {};
const MockWindowRef = {
  localStorage: {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string): void => {
      if (key in store) {
        store[key] = undefined;
      }
    },
  },
};
const endpoint = '/test';
class OccEndpointsServiceMock {
  getBaseEndpoint(): string {
    return endpoint;
  }
}
describe('OccPersonalizationIdInterceptor with personalization enabled', () => {
  let httpMock: HttpTestingController;
  let winRef: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: PersonalizationConfig, useValue: mockPersonalizationConfig },
        { provide: WindowRef, useValue: MockWindowRef },
        { provide: OccEndpointsService, useClass: OccEndpointsServiceMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: OccPersonalizationIdInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.get(HttpTestingController as Type<
      HttpTestingController
    >);
    winRef = TestBed.get(WindowRef as Type<WindowRef>);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add request header if the personalization-id exists', inject(
    [HttpClient],
    (http: HttpClient) => {
      winRef.localStorage.setItem('personalization-id', 'test id');

      http.get('https://localhost:9002/test').subscribe(result => {
        expect(result).toBeTruthy();
      });

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET';
      });

      const perHeader: string = mockReq.request.headers.get(
        'test-personalization-id'
      );
      expect(perHeader).toBeTruthy();
      expect(perHeader).toEqual('test id');

      mockReq.flush('someData');
    }
  ));

  it('should keep the new personalization-id, if it is different from the existing id ', inject(
    [HttpClient],
    (http: HttpClient) => {
      winRef.localStorage.setItem('personalization-id', 'old id');

      http.get('https://localhost:9002/test').subscribe(response => {
        expect(response).toEqual('');
      });

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET';
      });
      mockReq.flush('', { headers: { ['test-personalization-id']: 'new id' } });
      expect(winRef.localStorage.getItem('personalization-id')).toEqual(
        'new id'
      );
    }
  ));
});

describe('OccPersonalizationIdInterceptor with personalization disabled', () => {
  let httpMock: HttpTestingController;
  let winRef: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: PersonalizationConfig,
          useValue: {
            personalization: {
              enabled: false,
            },
          },
        },
        { provide: WindowRef, useValue: MockWindowRef },
        { provide: OccEndpointsService, useClass: OccEndpointsServiceMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: OccPersonalizationIdInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.get(HttpTestingController as Type<
      HttpTestingController
    >);
    winRef = TestBed.get(WindowRef as Type<WindowRef>);

    winRef.localStorage.setItem('personalization-id', 'test id');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should clear client-side personalization-id, and not send it in request header', inject(
    [HttpClient],
    (http: HttpClient) => {
      http.get('https://localhost:9002/test').subscribe(result => {
        expect(result).toBeTruthy();
      });
      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET';
      });
      const perHeader: string = mockReq.request.headers.get(
        'test-personalization-id'
      );
      expect(perHeader).toBeNull();
      mockReq.flush('someData');

      expect(winRef.localStorage.getItem('personalization-id')).toBeUndefined();
    }
  ));
});
