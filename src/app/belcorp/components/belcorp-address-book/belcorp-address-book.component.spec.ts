import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpAddressBookComponent } from './belcorp-address-book.component';

describe('BelcorpAddressBookComponent', () => {
  let component: BelcorpAddressBookComponent;
  let fixture: ComponentFixture<BelcorpAddressBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpAddressBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpAddressBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
