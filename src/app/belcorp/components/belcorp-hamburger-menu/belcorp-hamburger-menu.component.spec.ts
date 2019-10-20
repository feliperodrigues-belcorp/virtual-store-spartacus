import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelcorpHamburgerMenuComponent } from './belcorp-hamburger-menu.component';

describe('BelcorpHamburgerMenuComponent', () => {
  let component: BelcorpHamburgerMenuComponent;
  let fixture: ComponentFixture<BelcorpHamburgerMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelcorpHamburgerMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpHamburgerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
