import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BelcorpLoginFormComponent } from './belcorp-login-form.component';

describe('BelcorpLoginFormComponent', () => {
  let component: BelcorpLoginFormComponent;
  let fixture: ComponentFixture<BelcorpLoginFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BelcorpLoginFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
