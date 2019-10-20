import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpInfoConsultantComponent } from './belcorp-info-consultant.component';

describe('BelcorpInfoConsultantComponent', () => {
  let component: BelcorpInfoConsultantComponent;
  let fixture: ComponentFixture<BelcorpInfoConsultantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpInfoConsultantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpInfoConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
