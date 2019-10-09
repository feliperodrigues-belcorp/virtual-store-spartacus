import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpMyaccountAddressBookComponent } from './belcorp-myaccount-address-book.component';

describe('BelcorpMyaccountAddressBookComponent', () => {
  let component: BelcorpMyaccountAddressBookComponent;
  let fixture: ComponentFixture<BelcorpMyaccountAddressBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpMyaccountAddressBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpMyaccountAddressBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
