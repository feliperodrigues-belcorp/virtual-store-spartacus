import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpMyaccountAddressBookCardComponent } from './belcorp-myaccount-address-book-card.component';

describe('BelcorpMyaccountAddressBookCardComponent', () => {
  let component: BelcorpMyaccountAddressBookCardComponent;
  let fixture: ComponentFixture<BelcorpMyaccountAddressBookCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpMyaccountAddressBookCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpMyaccountAddressBookCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
