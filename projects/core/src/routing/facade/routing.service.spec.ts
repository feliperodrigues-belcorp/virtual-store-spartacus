import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as NgrxStore from '@ngrx/store';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { PageType } from '../../model/cms.model';
import { SemanticPathService } from '../configurable-routes/url-translation/semantic-path.service';
import { PageContext } from '../models/page-context.model';
import { RoutingActions } from '../store/actions/index';
import { RouterState } from '../store/routing-state';
import { RoutingSelector } from '../store/selectors/index';
import { RoutingService } from './routing.service';
import createSpy = jasmine.createSpy;

describe('RoutingService', () => {
  let store: Store<RouterState>;
  let service: RoutingService;
  let urlService: SemanticPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        RoutingService,
        { provide: SemanticPathService, useValue: { transform: () => {} } },
      ],
    });

    store = TestBed.get(Store as Type<Store<RouterState>>);
    service = TestBed.get(RoutingService as Type<RoutingService>);
    urlService = TestBed.get(SemanticPathService as Type<SemanticPathService>);
    spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('go', () => {
    it('should dispatch navigation action with generated path', () => {
      spyOn(urlService, 'transform').and.returnValue(['generated', 'path']);
      service.go([]);
      expect(store.dispatch).toHaveBeenCalledWith(
        new RoutingActions.RouteGoAction({
          path: ['generated', 'path'],
          query: undefined,
          extras: undefined,
        })
      );
    });

    it('should call url service service with given array of commands', () => {
      spyOn(urlService, 'transform');
      const commands = ['testString', { cxRoute: 'testRoute' }];
      service.go(commands);
      expect(urlService.transform).toHaveBeenCalledWith(commands);
    });
  });

  describe('goByUrl', () => {
    it('should dispatch GoByUrl action', () => {
      service.goByUrl('test');
      expect(store.dispatch).toHaveBeenCalledWith(
        new RoutingActions.RouteGoByUrlAction('test')
      );
    });
  });

  describe('back', () => {
    it('should dispatch back action', () => {
      service.back();
      expect(store.dispatch).toHaveBeenCalledWith(
        new RoutingActions.RouteBackAction()
      );
    });

    it('should go to homepage on back action when referer is not from the app', () => {
      spyOnProperty(document, 'referrer', 'get').and.returnValue(
        'http://foobar.com'
      );
      spyOn(urlService, 'transform').and.callFake(x => x);
      service.back();
      expect(store.dispatch).toHaveBeenCalledWith(
        new RoutingActions.RouteGoAction({
          path: ['/'],
          query: undefined,
          extras: undefined,
        })
      );
    });
  });

  describe('forward', () => {
    it('should dispatch forward action', () => {
      service.forward();
      expect(store.dispatch).toHaveBeenCalledWith(
        new RoutingActions.RouteForwardAction()
      );
    });
  });

  it('should expose whole router state', () => {
    const mockRouterState = createSpy().and.returnValue(() => of({}));
    spyOnProperty(NgrxStore, 'select').and.returnValue(mockRouterState);

    let routerState: any;
    service.getRouterState().subscribe(state => (routerState = state));
    expect(mockRouterState).toHaveBeenCalledWith(
      RoutingSelector.getRouterState
    );
    expect(routerState).toEqual({});
  });

  it('should return only page context from the state', () => {
    const pageContext: PageContext = {
      id: 'homepage',
      type: PageType.CATALOG_PAGE,
    };
    const mockRouterState = createSpy().and.returnValue(() => of(pageContext));
    spyOnProperty(NgrxStore, 'select').and.returnValue(mockRouterState);

    let result: PageContext;
    service
      .getPageContext()
      .subscribe(value => (result = value))
      .unsubscribe();

    expect(result).toEqual(pageContext);
  });

  it('getNextPageContext should return nextPageContext state', () => {
    const pageContext: PageContext = {
      id: 'homepage',
      type: PageType.CATALOG_PAGE,
    };
    const mockRouterState = createSpy().and.returnValue(() => of(pageContext));
    spyOnProperty(NgrxStore, 'select').and.returnValue(mockRouterState);

    let result: PageContext;
    service
      .getNextPageContext()
      .subscribe(value => (result = value))
      .unsubscribe();

    expect(result).toEqual(pageContext);
    expect(NgrxStore.select).toHaveBeenCalledWith(
      RoutingSelector.getNextPageContext
    );
  });

  it('isNavigating should return isNavigating state', () => {
    const isNavigating = true;
    const mockRouterState = createSpy().and.returnValue(() => of(isNavigating));
    spyOnProperty(NgrxStore, 'select').and.returnValue(mockRouterState);

    let result: boolean;
    service
      .isNavigating()
      .subscribe(value => (result = value))
      .unsubscribe();

    expect(result).toEqual(isNavigating);
    expect(NgrxStore.select).toHaveBeenCalledWith(RoutingSelector.isNavigating);
  });
});
