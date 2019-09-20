import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  Address,
  I18nTestingModule,
  UserAddressService,
} from '@spartacus/core';

import { AddressCardComponent } from './address-card.component';

class MockUserAddressService {}

const mockAddress: Address = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  titleCode: 'mr',
  line1: 'Toyosaki 2 create on cart',
  line2: 'line2',
  town: 'town',
  region: { isocode: 'JP-27' },
  postalCode: 'zip',
  country: { isocode: 'JP' },
  defaultAddress: false,
};

describe('AddressCardComponent', () => {
  let component: AddressCardComponent;
  let fixture: ComponentFixture<AddressCardComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [AddressCardComponent],
      providers: [
        { provide: UserAddressService, useClass: MockUserAddressService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressCardComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display address data', () => {
    component.address = mockAddress;
    fixture.detectChanges();
    const element = el.query(By.css('.cx-address-data'));
    expect(element.nativeElement.textContent).toContain(
      mockAddress.firstName &&
        mockAddress.lastName &&
        mockAddress.line1 &&
        mockAddress.line2 &&
        mockAddress.town &&
        mockAddress.country.isocode &&
        mockAddress.postalCode
    );
  });

  it('should display default label on address default', () => {
    component.address = mockAddress;
    component.address.defaultAddress = true;
    fixture.detectChanges();
    const element = el.query(By.css('.card-header'));
    expect(element.nativeElement.textContent).toContain(
      ' ✓ addressCard.default '
    );
  });
});
