import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpCartDetailsComponent } from './belcorp-cart-details.component';

describe('BelcorpCartDetailsComponent', () => {
  let component: BelcorpCartDetailsComponent;
  let fixture: ComponentFixture<BelcorpCartDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpCartDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpCartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
