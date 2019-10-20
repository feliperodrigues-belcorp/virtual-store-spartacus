import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpCategoryNavigationComponent } from './belcorp-category-navigation.component';

describe('BelcorpCategoryNavigationComponent', () => {
  let component: BelcorpCategoryNavigationComponent;
  let fixture: ComponentFixture<BelcorpCategoryNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpCategoryNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpCategoryNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
