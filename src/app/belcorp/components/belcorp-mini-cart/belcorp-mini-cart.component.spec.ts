import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpMiniCartComponent } from './belcorp-mini-cart.component';

describe('BelcorpMiniCartComponent', () => {
  let component: BelcorpMiniCartComponent;
  let fixture: ComponentFixture<BelcorpMiniCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpMiniCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpMiniCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
