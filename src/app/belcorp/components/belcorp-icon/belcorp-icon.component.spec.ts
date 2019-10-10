import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpIconComponent } from './belcorp-icon.component';

describe('BelcorpIconComponent', () => {
  let component: BelcorpIconComponent;
  let fixture: ComponentFixture<BelcorpIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
