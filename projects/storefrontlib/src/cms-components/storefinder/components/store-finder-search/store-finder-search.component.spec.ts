import { Pipe, PipeTransform, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule, RoutingService } from '@spartacus/core';
import { StoreFinderSearchComponent } from './store-finder-search.component';

const query = 'address';

const keyEvent = {
  key: 'Enter',
};
const badKeyEvent = {
  key: 'Enter95',
};

const mockActivatedRoute = {
  snapshot: {
    params: {},
  },
};

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

describe('StoreFinderSearchComponent', () => {
  let component: StoreFinderSearchComponent;
  let fixture: ComponentFixture<StoreFinderSearchComponent>;

  let routingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, I18nTestingModule],
      declarations: [StoreFinderSearchComponent, MockUrlPipe],
      providers: [
        {
          provide: RoutingService,
          useValue: { go: jasmine.createSpy() },
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreFinderSearchComponent);
    component = fixture.componentInstance;
    routingService = TestBed.get(RoutingService as Type<RoutingService>);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch new query', () => {
    component.searchBox.setValue(query);
    component.findStores(component.searchBox.value);
    expect(routingService.go).toHaveBeenCalledWith(
      ['find'],
      { query },
      { relativeTo: mockActivatedRoute }
    );
  });

  it('should call onKey and dispatch query', () => {
    component.searchBox.setValue(query);
    component.onKey(keyEvent);
    expect(routingService.go).toHaveBeenCalledWith(
      ['find'],
      { query },
      { relativeTo: mockActivatedRoute }
    );
  });

  it('should only call onKey', () => {
    component.onKey(badKeyEvent);
    expect(routingService.go).not.toHaveBeenCalled();
  });

  it('should view stores near by my location', () => {
    component.viewStoresWithMyLoc();
    expect(routingService.go).toHaveBeenCalledWith(
      ['find'],
      {
        useMyLocation: true,
      },
      { relativeTo: mockActivatedRoute }
    );
  });
});
