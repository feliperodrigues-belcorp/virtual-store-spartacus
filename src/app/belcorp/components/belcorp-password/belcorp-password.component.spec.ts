import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpPasswordComponent } from './belcorp-password.component';

describe('BelcorpPasswordComponent', () => {
  let component: BelcorpPasswordComponent;
  let fixture: ComponentFixture<BelcorpPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
