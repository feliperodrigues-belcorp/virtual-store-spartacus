import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpCartItemComponent } from './belcorp-cart-item.component';

describe('BelcorpCartItemComponent', () => {
  let component: BelcorpCartItemComponent;
  let fixture: ComponentFixture<BelcorpCartItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpCartItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpCartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
