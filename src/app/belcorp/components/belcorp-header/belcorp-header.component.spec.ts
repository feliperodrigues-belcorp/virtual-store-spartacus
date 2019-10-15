import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpHeaderComponent } from './belcorp-header.component';

describe('BelcorpHeaderComponent', () => {
  let component: BelcorpHeaderComponent;
  let fixture: ComponentFixture<BelcorpHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
