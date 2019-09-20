import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { CmsComponent, PageType } from '../../../model/cms.model';
import { RoutingService } from '../../../routing/index';
import { CmsComponentConnector } from '../../connectors/component/cms-component.connector';
import { CmsActions } from '../actions/index';
import * as fromEffects from './component.effect';

const router = {
  state: {
    url: '/',
    queryParams: {},
    params: {},
    context: { id: '1', type: PageType.PRODUCT_PAGE },
    cmsRequired: false,
  },
};

class MockRoutingService {
  getRouterState(): Observable<any> {
    return of(router);
  }
}

class MockCmsComponentConnector {
  get(_uid, _pageContext): Observable<any> {
    return of({});
  }
}

describe('Component Effects', () => {
  let actions$: Observable<any>;
  let service: CmsComponentConnector;
  let effects: fromEffects.ComponentEffects;

  const component: CmsComponent = {
    uid: 'comp1',
    typeCode: 'SimpleBannerComponent',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        { provide: CmsComponentConnector, useClass: MockCmsComponentConnector },
        fromEffects.ComponentEffects,
        provideMockActions(() => actions$),
        { provide: RoutingService, useClass: MockRoutingService },
      ],
    });

    service = TestBed.get(CmsComponentConnector as Type<CmsComponentConnector>);
    effects = TestBed.get(fromEffects.ComponentEffects as Type<
      fromEffects.ComponentEffects
    >);
  });

  describe('loadComponent$', () => {
    it('should return a component from LoadComponentSuccess', () => {
      const action = new CmsActions.LoadCmsComponent('comp1');
      const completion = new CmsActions.LoadCmsComponentSuccess(component);
      spyOn(service, 'get').and.returnValue(of(component));

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadComponent$).toBeObservable(expected);
    });

    it('should process only one ongoing request for multiple load component dispatches for the same uid', () => {
      const action = new CmsActions.LoadCmsComponent('comp1');
      const completion = new CmsActions.LoadCmsComponentSuccess(component);
      spyOn(service, 'get').and.returnValue(cold('---c', { c: component }));

      actions$ = hot('-aaa------a', { a: action });
      const expected = cold('------b------b', { b: completion });

      expect(effects.loadComponent$).toBeObservable(expected);
    });
  });
});
