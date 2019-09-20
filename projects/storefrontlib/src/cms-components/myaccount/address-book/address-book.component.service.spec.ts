import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Address, User, UserAddressService } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { AddressBookComponentService } from './address-book.component.service';

const mockAddresses: Address[] = [
  {
    id: '111',
    line1: 'Street Name 111',
    country: { isocode: 'PL' },
  },
  {
    id: '222',
    line1: 'Street Name 222',
    country: { isocode: 'PL' },
  },
];

const mockUser: User = {
  uid: '1234',
};

class MockUserAddressService {
  loadAddresses = jasmine.createSpy();
  addUserAddress = jasmine.createSpy();
  updateUserAddress = jasmine.createSpy();

  getAddresses(): Observable<Address[]> {
    return of(mockAddresses);
  }
  getAddressesLoading(): Observable<boolean> {
    return of(false);
  }
  get(): Observable<User> {
    return of(mockUser);
  }
}

describe('AddressBookComponentService', () => {
  let service: AddressBookComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressBookComponentService,
        {
          provide: UserAddressService,
          useClass: MockUserAddressService,
        },
      ],
    });

    service = TestBed.get(AddressBookComponentService as Type<
      AddressBookComponentService
    >);
  });

  it('should service be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAddresses() return addresses', () => {
    service
      .getAddresses()
      .pipe(take(1))
      .subscribe((addresses: Address[]) => {
        expect(addresses).toEqual(mockAddresses);
      });
  });

  it('should getAddressesStateLoading() return loading state', () => {
    service
      .getAddressesStateLoading()
      .pipe(take(1))
      .subscribe((state: boolean) => {
        expect(state).toEqual(false);
      });
  });
});
