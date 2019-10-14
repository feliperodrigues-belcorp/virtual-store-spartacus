import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpCartItemListComponent } from './belcorp-cart-item-list.component';

describe('BelcorpCartItemListComponent', () => {
  let component: BelcorpCartItemListComponent;
  let fixture: ComponentFixture<BelcorpCartItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpCartItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpCartItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
