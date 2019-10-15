import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpMediaComponent } from './belcorp-media.component';

describe('BelcorpMediaComponent', () => {
  let component: BelcorpMediaComponent;
  let fixture: ComponentFixture<BelcorpMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
