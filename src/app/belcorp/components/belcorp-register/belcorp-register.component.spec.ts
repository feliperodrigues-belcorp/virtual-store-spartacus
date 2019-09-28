import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BelcorpRegisterComponent } from './belcorp-register.component';

describe('BelcorpRegisterComponent', () => {
  let component: BelcorpRegisterComponent;
  let fixture: ComponentFixture<BelcorpRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BelcorpRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelcorpRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
