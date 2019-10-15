import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpPromotionsComponent } from './belcorp-promotions.component';

describe('BelcorpPromotionsComponent', () => {
  let component: BelcorpPromotionsComponent;
  let fixture: ComponentFixture<BelcorpPromotionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpPromotionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
