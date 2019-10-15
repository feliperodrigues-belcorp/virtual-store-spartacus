import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpItemCounterComponent } from './belcorp-item-counter.component';

describe('BelcorpItemCounterComponent', () => {
  let component: BelcorpItemCounterComponent;
  let fixture: ComponentFixture<BelcorpItemCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpItemCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpItemCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
