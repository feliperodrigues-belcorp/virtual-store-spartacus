import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpLoginComponent } from './belcorp-login.component';

describe('BelcorpLoginComponent', () => {
  let component: BelcorpLoginComponent;
  let fixture: ComponentFixture<BelcorpLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
