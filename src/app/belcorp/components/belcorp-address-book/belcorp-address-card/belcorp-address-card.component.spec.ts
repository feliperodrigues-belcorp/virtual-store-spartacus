import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpAddressCardComponent } from './belcorp-address-card.component';

describe('BelcorpAddressCardComponent', () => {
  let component: BelcorpAddressCardComponent;
  let fixture: ComponentFixture<BelcorpAddressCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpAddressCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpAddressCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
