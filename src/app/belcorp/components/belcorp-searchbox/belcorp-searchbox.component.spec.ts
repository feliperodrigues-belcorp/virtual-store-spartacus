import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpSearchboxComponent } from './belcorp-searchbox.component';

describe('BelcorpSearchboxComponent', () => {
  let component: BelcorpSearchboxComponent;
  let fixture: ComponentFixture<BelcorpSearchboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpSearchboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpSearchboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
