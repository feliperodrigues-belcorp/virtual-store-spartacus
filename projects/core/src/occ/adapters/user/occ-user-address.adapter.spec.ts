import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ADDRESS_NORMALIZER,
  ADDRESS_SERIALIZER,
  ADDRESS_VALIDATION_NORMALIZER,
  ConverterService,
} from '@spartacus/core';
import { Address, AddressValidation } from '../../../model/address.model';
import { OccConfig } from '../../config/occ-config';
import { Occ } from '../../occ-models/occ.models';
import { OccEndpointsService } from '../../services';
import { OccUserAddressAdapter } from './occ-user-address.adapter';
import {
  MockOccEndpointsService,
  mockOccModuleConfig,
} from './unit-test.helper';

const username = 'mockUsername';

describe('OccUserAddressAdapter', () => {
  let occUserAddressAdapter: OccUserAddressAdapter;
  let httpMock: HttpTestingController;
  let converter: ConverterService;
  let occEnpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccUserAddressAdapter,
        { provide: OccConfig, useValue: mockOccModuleConfig },
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService,
        },
      ],
    });

    occUserAddressAdapter = TestBed.get(OccUserAddressAdapter as Type<
      OccUserAddressAdapter
    >);
    httpMock = TestBed.get(HttpTestingController as Type<
      HttpTestingController
    >);
    converter = TestBed.get(ConverterService as Type<ConverterService>);
    occEnpointsService = TestBed.get(OccEndpointsService as Type<
      OccEndpointsService
    >);
    spyOn(converter, 'pipeable').and.callThrough();
    spyOn(converter, 'pipeableMany').and.callThrough();
    spyOn(converter, 'convert').and.callThrough();
    spyOn(occEnpointsService, 'getUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('load address verification results', () => {
    it('should load address verification results for given user id and address', () => {
      const address: Address = {
        companyName: 'ACME',
        defaultAddress: true,
      };
      const suggestedAddresses: AddressValidation = {
        suggestedAddresses: [address],
      };

      occUserAddressAdapter.verify(username, address).subscribe(result => {
        expect(result).toEqual(suggestedAddresses);
      });

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'POST';
      });

      expect(occEnpointsService.getUrl).toHaveBeenCalledWith(
        'addressVerification',
        {
          userId: username,
        }
      );
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(suggestedAddresses);
    });

    it('should use converter', () => {
      const address: Address = {
        companyName: 'ACME',
        defaultAddress: true,
      };

      occUserAddressAdapter.verify(username, address).subscribe();
      httpMock
        .expectOne(req => {
          return req.method === 'POST';
        })
        .flush({});

      expect(converter.convert).toHaveBeenCalledWith(
        address,
        ADDRESS_SERIALIZER
      );
      expect(converter.pipeable).toHaveBeenCalledWith(
        ADDRESS_VALIDATION_NORMALIZER
      );
    });
  });

  describe('load user addresses', () => {
    it('should load user addresses for a given user id', () => {
      const mockAddress1: Address = {
        companyName: 'mockCompany1',
      };
      const mockAddress2: Address = {
        companyName: 'mockCompany2',
      };
      const mockUserAddresses: Occ.AddressList = {
        addresses: [mockAddress1, mockAddress2],
      };

      occUserAddressAdapter.loadAll(username).subscribe(result => {
        expect(result).toEqual(mockUserAddresses.addresses);
      });

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET';
      });

      expect(occEnpointsService.getUrl).toHaveBeenCalledWith('addresses', {
        userId: username,
      });
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(mockUserAddresses);
    });

    it('should use converter', () => {
      occUserAddressAdapter.loadAll(username).subscribe();
      httpMock
        .expectOne(req => {
          return req.method === 'GET';
        })
        .flush({});
      expect(converter.pipeableMany).toHaveBeenCalledWith(ADDRESS_NORMALIZER);
    });
  });
});
