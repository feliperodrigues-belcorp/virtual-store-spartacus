import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Address, AddressValidation } from '../../../model/address.model';
import {
  ADDRESS_NORMALIZER,
  ADDRESS_SERIALIZER,
  ADDRESS_VALIDATION_NORMALIZER,
} from '../../../user/connectors/address/converters';
import { UserAddressAdapter } from '../../../user/connectors/address/user-address.adapter';
import { ConverterService } from '../../../util/converter.service';
import { Occ } from '../../occ-models/occ.models';
import { OccEndpointsService } from '../../services/occ-endpoints.service';

@Injectable()
export class OccUserAddressAdapter implements UserAddressAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  loadAll(userId: string): Observable<Address[]> {
    const url = this.occEndpoints.getUrl('addresses', { userId });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<Occ.AddressList>(url, { headers }).pipe(
      catchError((error: any) => throwError(error)),
      map(addressList => addressList.addresses),
      this.converter.pipeableMany(ADDRESS_NORMALIZER)
    );
  }

  add(userId: string, address: Address): Observable<{}> {
    const url = this.occEndpoints.getUrl('addresses', { userId });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    address = this.converter.convert(address, ADDRESS_SERIALIZER);

    return this.http
      .post(url, address, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(userId: string, addressId: string, address: Address): Observable<{}> {
    const url = this.occEndpoints.getUrl('addressDetail', {
      userId,
      addressId,
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    address = this.converter.convert(address, ADDRESS_SERIALIZER);

    return this.http
      .patch(url, address, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  verify(userId: string, address: Address): Observable<AddressValidation> {
    const url = this.occEndpoints.getUrl('addressVerification', { userId });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    address = this.converter.convert(address, ADDRESS_SERIALIZER);

    return this.http.post<AddressValidation>(url, address, { headers }).pipe(
      catchError((error: any) => throwError(error)),
      this.converter.pipeable(ADDRESS_VALIDATION_NORMALIZER)
    );
  }

  delete(userId: string, addressId: string): Observable<{}> {
    const url = this.occEndpoints.getUrl('addressDetail', {
      userId,
      addressId,
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .delete(url, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
