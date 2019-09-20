import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreFinderComponent } from './store-finder.component';

@Component({
  selector: 'cx-store-finder-header',
  template: '',
})
export class MockStoreFinderHeaderComponent {}

describe('StoreFinderComponent', () => {
  let component: StoreFinderComponent;
  let fixture: ComponentFixture<StoreFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [StoreFinderComponent, MockStoreFinderHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
