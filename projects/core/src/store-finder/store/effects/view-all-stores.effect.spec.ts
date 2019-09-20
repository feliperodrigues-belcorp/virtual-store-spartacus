import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { StoreCount } from '../../../model/store-finder.model';
import { OccConfig } from '../../../occ';
import { StoreFinderConnector } from '../../connectors/store-finder.connector';
import { StoreFinderActions } from '../actions/index';
import * as fromEffects from './view-all-stores.effect';
import createSpy = jasmine.createSpy;

const mockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: '',
      prefix: '',
    },
  },
};

const storesCountResult: StoreCount[] = [
  { count: 1, name: 'name1' },
  { count: 2, name: 'name2' },
];

const mockStoreFinderConnector = {
  getCounts: createSpy('connector.getCounts').and.returnValue(
    of(storesCountResult)
  ),
};

describe('ViewAllStores Effects', () => {
  let actions$: Observable<any>;
  let effects: fromEffects.ViewAllStoresEffect;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: StoreFinderConnector, useValue: mockStoreFinderConnector },
        { provide: OccConfig, useValue: mockOccModuleConfig },
        fromEffects.ViewAllStoresEffect,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get(fromEffects.ViewAllStoresEffect as Type<
      fromEffects.ViewAllStoresEffect
    >);
  });

  describe('viewAllStores$', () => {
    it('should return searchResult from ViewAllStoresSuccess', () => {
      const action = new StoreFinderActions.ViewAllStores();
      const completion = new StoreFinderActions.ViewAllStoresSuccess(
        storesCountResult
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.viewAllStores$).toBeObservable(expected);
    });
  });
});
