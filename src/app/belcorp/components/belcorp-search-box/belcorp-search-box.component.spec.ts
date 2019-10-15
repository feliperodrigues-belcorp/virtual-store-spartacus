import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpSearchBoxComponent } from './belcorp-search-box.component';

describe('BelcorpSearchBoxComponent', () => {
  let component: BelcorpSearchBoxComponent;
  let fixture: ComponentFixture<BelcorpSearchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpSearchBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
