import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OccEndpointsService } from '../../../occ/services/occ-endpoints.service';
import { AuthConfig } from '../../config/auth-config';
import { UserToken } from '../../models/token-types.model';
import { UserAuthenticationTokenService } from './user-authentication-token.service';

const username = 'mockUsername';
const password = '1234';
const refreshToken = '5678';
const loginEndpoint = '/authorizationserver/oauth/token';

const token: UserToken = {
  access_token: 'mockToken',
  token_type: 'mock',
  refresh_token: refreshToken,
  expires_in: 12342,
  scope: ['mock', 'scope'],
  userId: 'dsfk32df34',
};

const MockAuthConfig: AuthConfig = {
  authentication: {
    client_id: '',
    client_secret: '',
  },
  backend: {
    occ: {
      baseUrl: '',
      prefix: '',
      endpoints: {
        login: loginEndpoint,
      },
    },
  },
};

class MockOccEndpointsService {
  getRawEndpoint(endpoint: string) {
    return (
      MockAuthConfig.backend.occ.baseUrl +
      MockAuthConfig.backend.occ.endpoints[endpoint]
    );
  }
}

describe('UserAuthenticationTokenService', () => {
  let authTokenService: UserAuthenticationTokenService;
  let httpMock: HttpTestingController;
  let occEndpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserAuthenticationTokenService,
        { provide: AuthConfig, useValue: MockAuthConfig },
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService,
        },
      ],
    });

    authTokenService = TestBed.get(UserAuthenticationTokenService as Type<
      UserAuthenticationTokenService
    >);
    httpMock = TestBed.get(HttpTestingController as Type<
      HttpTestingController
    >);
    occEndpointsService = TestBed.get(OccEndpointsService as Type<
      OccEndpointsService
    >);
    spyOn(occEndpointsService, 'getRawEndpoint').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authTokenService).toBeTruthy();
  });

  describe('load user token', () => {
    it('should load user token for given username and password', () => {
      authTokenService.loadToken(username, password).subscribe(result => {
        expect(result).toEqual(token);
      });

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'POST' && req.url === loginEndpoint;
      });

      expect(occEndpointsService.getRawEndpoint).toHaveBeenCalledWith('login');
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
    });
  });

  describe('refresh user token', () => {
    it('should refresh user token for a given refresh_token', () => {
      authTokenService.refreshToken(refreshToken).subscribe(result => {
        expect(result).toEqual(token);
      });

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'POST' && req.url === loginEndpoint;
      });

      expect(occEndpointsService.getRawEndpoint).toHaveBeenCalledWith('login');
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(token);
    });

    it('should catch refresh error', () => {
      authTokenService.refreshToken('invalid token').subscribe(
        _result => {},
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toEqual('Error');
        }
      );

      const mockReq: TestRequest = httpMock.expectOne(req => {
        return req.method === 'POST' && req.url === loginEndpoint;
      });

      expect(occEndpointsService.getRawEndpoint).toHaveBeenCalledWith('login');
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(
        { error: 'Invalid refresh token' },
        { status: 400, statusText: 'Error' }
      );
    });
  });
});
