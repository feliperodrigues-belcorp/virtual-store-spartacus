import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpAddressFormComponent } from './belcorp-address-form.component';

describe('BelcorpAddressFormComponent', () => {
  let component: BelcorpAddressFormComponent;
  let fixture: ComponentFixture<BelcorpAddressFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpAddressFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
