import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import * as ngrxStore from '@ngrx/store';
import { Store, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { PageType } from '../../model/cms.model';
import { PageContext, RoutingService } from '../../routing/index';
import { LoaderState } from '../../state';
import { ContentSlotData } from '../model/content-slot-data.model';
import { NodeItem } from '../model/node-item.model';
import { Page } from '../model/page.model';
import { CmsActions } from '../store/actions/index';
import { StateWithCms } from '../store/cms-state';
import * as fromReducers from '../store/reducers/index';
import { CmsService } from './cms.service';
import createSpy = jasmine.createSpy;

class MockRoutingService {
  getPageContext(): Observable<PageContext> {
    return of();
  }
  isNavigating(): Observable<boolean> {
    return of(false);
  }
}

const mockContentSlot: ContentSlotData = {
  components: [
    { uid: 'comp1', typeCode: 'SimpleBannerComponent' },
    { uid: 'comp2', typeCode: 'CMSLinkComponent' },
    { uid: 'comp3', typeCode: 'NavigationComponent' },
  ],
};

const testPageContext: PageContext = {
  type: PageType.CONTENT_PAGE,
  id: 'homepage',
};

describe('CmsService', () => {
  let store: Store<StateWithCms>;
  let routingService: RoutingService;

  const page: Page = {
    pageId: 'homepage',
    name: 'testPage',
    slots: {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('cms', fromReducers.getReducers()),
      ],
      providers: [
        CmsService,
        { provide: RoutingService, useClass: MockRoutingService },
      ],
    });

    store = TestBed.get(Store as Type<Store<StateWithCms>>);
    routingService = TestBed.get(RoutingService as Type<RoutingService>);
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should be created', inject([CmsService], (service: CmsService) => {
    expect(service).toBeTruthy();
  }));

  it('getComponentData should call the store and trigger component load', inject(
    [CmsService],
    (service: CmsService) => {
      spyOn(service, 'getCurrentPage').and.returnValue(of(page));

      const testUid = 'test_uid';
      const mockSelect = createSpy('select').and.returnValue(() => of({}));
      spyOnProperty(ngrxStore, 'select').and.returnValue(mockSelect);

      service
        .getComponentData(testUid)
        .pipe(take(1))
        .subscribe(() => {})
        .unsubscribe();

      expect(mockSelect).toHaveBeenCalled();

      expect(store.dispatch).toHaveBeenCalledWith(
        new CmsActions.LoadCmsComponent(testUid)
      );
    }
  ));

  it('getContentSlot should be able to get content slot by position', inject(
    [CmsService],
    (service: CmsService) => {
      spyOnProperty(ngrxStore, 'select').and.returnValue(() => () =>
        of(mockContentSlot)
      );
      spyOn(routingService, 'getPageContext').and.returnValue(
        of({ id: 'test' })
      );

      let contentSlotReturned: ContentSlotData;
      service
        .getContentSlot('Section1')
        .subscribe(value => {
          contentSlotReturned = value;
        })
        .unsubscribe();

      expect(contentSlotReturned).toBe(mockContentSlot);
    }
  ));

  it('getNavigationEntryItems should be able to get navigation entry items by navigationNodeUid', inject(
    [CmsService],
    (service: CmsService) => {
      const testUid = 'test_uid';
      const mockNodeItem: NodeItem = {
        testUid: 'test',
      };
      const mockSelect = createSpy('select').and.returnValue(() =>
        of(mockNodeItem)
      );
      spyOnProperty(ngrxStore, 'select').and.returnValue(mockSelect);

      let result: NodeItem;
      service
        .getNavigationEntryItems(testUid)
        .subscribe(value => (result = value))
        .unsubscribe();

      expect(result).toEqual(mockNodeItem);
    }
  ));

  it('loadNavigationItems should be able to dispatch load navigation items action', inject(
    [CmsService],
    (service: CmsService) => {
      service.loadNavigationItems('rootId', []);
      expect(store.dispatch).toHaveBeenCalledWith(
        new CmsActions.LoadCmsNavigationItems({
          nodeId: 'rootId',
          items: [],
        })
      );
    }
  ));

  it('getCurrentPage should expose the current page', inject(
    [CmsService],
    (service: CmsService) => {
      spyOn(routingService, 'getPageContext').and.returnValue(
        of(testPageContext)
      );

      store.dispatch(
        new CmsActions.LoadCmsPageDataSuccess(testPageContext, page)
      );

      let result: Page;
      service
        .getCurrentPage()
        .subscribe(value => {
          result = value;
        })
        .unsubscribe();

      expect(result).toEqual(page);
    }
  ));

  it('should be able to refresh the latest cms page', inject(
    [CmsService],
    (service: CmsService) => {
      spyOn(routingService, 'getPageContext').and.returnValue(
        of(testPageContext)
      );

      service.refreshLatestPage();
      expect(store.dispatch).toHaveBeenCalledWith(
        new CmsActions.LoadCmsPageData(testPageContext)
      );
    }
  ));

  it('should be able to refresh cms page by id', inject(
    [CmsService],
    (service: CmsService) => {
      service.refreshPageById('testPageId');
      expect(store.dispatch).toHaveBeenCalledWith(
        new CmsActions.LoadCmsPageData({ id: 'testPageId' })
      );
    }
  ));

  it('should be able to refresh the cms component by uid', inject(
    [CmsService],
    (service: CmsService) => {
      service.refreshComponent('test_uid');
      expect(store.dispatch).toHaveBeenCalledWith(
        new CmsActions.LoadCmsComponent('test_uid')
      );
    }
  ));

  it('getPageState should select correct page state', inject(
    [CmsService],
    (service: CmsService) => {
      const pageContext = { id: '/test', type: PageType.CONTENT_PAGE };
      const pageData: Page = {
        slots: {},
      };
      store.dispatch(
        new CmsActions.LoadCmsPageDataSuccess(pageContext, pageData)
      );

      let result;
      service.getPageState(pageContext).subscribe(res => (result = res));
      expect(result).toEqual(pageData);
    }
  ));

  it('getPageComponentTypes should return correct components', inject(
    [CmsService],
    (service: CmsService) => {
      const pageContext = { id: '/test', type: PageType.CONTENT_PAGE };
      const pageData: Page = {
        slots: {
          a: {
            components: [{ flexType: 'test1' }, { flexType: 'test2' }],
          },
          b: {
            components: [{ flexType: 'test2' }, { flexType: 'test3' }],
          },
        },
      };
      store.dispatch(
        new CmsActions.LoadCmsPageDataSuccess(pageContext, pageData)
      );

      let result: string[];
      service
        .getPageComponentTypes(pageContext)
        .subscribe(res => (result = res));
      expect(result).toEqual(['test1', 'test2', 'test3']);
    }
  ));

  describe('hasPage', () => {
    it('should dispatch a load action if the load was not attempted', inject(
      [CmsService],
      (service: CmsService) => {
        const mockedEntity: LoaderState<string> = {};
        const mockSelect = createSpy('select').and.returnValue(() =>
          of(mockedEntity)
        );
        spyOnProperty(ngrxStore, 'select').and.returnValue(mockSelect);

        service
          .hasPage(testPageContext)
          .subscribe(_ => _)
          .unsubscribe();

        expect(store.dispatch).toHaveBeenCalledWith(
          new CmsActions.LoadCmsPageData(testPageContext)
        );
      }
    ));

    it('should NOT dispatch a load action if the load was attempted', inject(
      [CmsService],
      (service: CmsService) => {
        const mockedEntity: LoaderState<string> = { success: true };
        const mockSelect = createSpy('select').and.returnValue(() =>
          of(mockedEntity)
        );
        spyOnProperty(ngrxStore, 'select').and.returnValue(mockSelect);

        service
          .hasPage(testPageContext)
          .subscribe(_ => _)
          .unsubscribe();

        expect(store.dispatch).not.toHaveBeenCalledWith(
          new CmsActions.LoadCmsPageData(testPageContext)
        );
      }
    ));

    describe('forceReload', () => {
      it('should dispatch a load action if the load was not attempted', inject(
        [CmsService],
        (service: CmsService) => {
          const mockedEntity: LoaderState<string> = {};
          const mockSelect = createSpy('select').and.returnValue(() =>
            of(mockedEntity)
          );
          spyOnProperty(ngrxStore, 'select').and.returnValue(mockSelect);

          service
            .hasPage(testPageContext, true)
            .subscribe(_ => _)
            .unsubscribe();

          expect(store.dispatch).toHaveBeenCalledWith(
            new CmsActions.LoadCmsPageData(testPageContext)
          );
        }
      ));

      it('should dispatch a load action with if the load was attempted', inject(
        [CmsService],
        (service: CmsService) => {
          const mockedEntity: LoaderState<string> = { success: true };
          const mockSelect = createSpy('select').and.returnValue(() =>
            of(mockedEntity)
          );
          spyOnProperty(ngrxStore, 'select').and.returnValue(mockSelect);

          service
            .hasPage(testPageContext, true)
            .subscribe(_ => _)
            .unsubscribe();

          expect(store.dispatch).toHaveBeenCalledWith(
            new CmsActions.LoadCmsPageData(testPageContext)
          );
        }
      ));
    });

    it('should return true if the load was successful', inject(
      [CmsService],
      (service: CmsService) => {
        const mockedEntity: LoaderState<string> = { success: true, value: '' };
        const mockSelect = createSpy('select').and.returnValue(() =>
          of(mockedEntity)
        );
        spyOnProperty(ngrxStore, 'select').and.returnValue(mockSelect);

        let result: boolean;
        service
          .hasPage(testPageContext)
          .subscribe(value => (result = value))
          .unsubscribe();

        expect(result).toEqual(true);
      }
    ));

    it('should return false if the there was an error', inject(
      [CmsService],
      (service: CmsService) => {
        const mockedEntity: LoaderState<string> = {
          success: false,
          error: true,
          value: undefined,
        };
        const mockSelect = createSpy('select').and.returnValue(() =>
          of(mockedEntity)
        );
        spyOnProperty(ngrxStore, 'select').and.returnValue(mockSelect);

        let result: boolean;
        service
          .hasPage(testPageContext)
          .subscribe(value => (result = value))
          .unsubscribe();

        expect(result).toEqual(false);
      }
    ));
  });

  describe('getPage', () => {
    let pageContext: PageContext;

    beforeEach(() => {
      pageContext = { id: 'testId' };
    });

    it('should call "hasPage"', inject([CmsService], (service: CmsService) => {
      spyOn(service, 'hasPage').and.returnValue(of(false));
      service.getPage(pageContext, true);
      expect(service.hasPage).toHaveBeenCalledWith(pageContext, true);
    }));

    it('should return result of "getPageState" when page exists', inject(
      [CmsService],
      (service: CmsService) => {
        spyOn(service, 'hasPage').and.returnValue(of(true));
        spyOn(service, 'getPageState').and.returnValue(
          of({ pageId: 'testId' })
        );

        let result;
        service.getPage(pageContext, true).subscribe(res => (result = res));
        expect(service.getPageState).toHaveBeenCalledWith(pageContext);
        expect(result).toEqual({ pageId: 'testId' });
      }
    ));

    it('should emit null when page does not exist', inject(
      [CmsService],
      (service: CmsService) => {
        spyOn(service, 'hasPage').and.returnValue(of(false));
        spyOn(service, 'getPageState');

        let result;
        service.getPage(pageContext, true).subscribe(res => (result = res));
        expect(service.getPageState).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      }
    ));
  });

  it('getPageIndex should select correct page state', inject(
    [CmsService],
    (service: CmsService) => {
      const pageContext = { id: '/test', type: PageType.CONTENT_PAGE };
      const pageData: Page = {
        pageId: 'testUid',
        slots: {},
      };
      store.dispatch(
        new CmsActions.LoadCmsPageDataSuccess(pageContext, pageData)
      );

      let result;
      service.getPageIndex(pageContext).subscribe(res => (result = res));
      expect(result).toEqual('testUid');
    }
  ));

  it('setPageFailIndex should dispatch proper action', inject(
    [CmsService],
    (service: CmsService) => {
      const pageContext = { id: '/test', type: PageType.CONTENT_PAGE };
      service.setPageFailIndex(pageContext, 'test_uid');
      expect(store.dispatch).toHaveBeenCalledWith(
        new CmsActions.CmsSetPageFailIndex(pageContext, 'test_uid')
      );
    }
  ));
});
