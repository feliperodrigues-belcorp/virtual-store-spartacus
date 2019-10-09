import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpMyaccountAddressFormComponent } from './belcorp-myaccount-address-form.component';

describe('BelcorpMyaccountAddressFormComponent', () => {
  let component: BelcorpMyaccountAddressFormComponent;
  let fixture: ComponentFixture<BelcorpMyaccountAddressFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpMyaccountAddressFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpMyaccountAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
