import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import * as ngrxStore from '@ngrx/store';
import { Store, StoreModule } from '@ngrx/store';
import { SiteContextConfig } from '@spartacus/core';
import { of } from 'rxjs';
import { Currency } from '../../model/misc.model';
import { SiteConnector } from '../connectors/site.connector';
import { SiteContextActions } from '../store/actions/index';
import { SiteContextStoreModule } from '../store/site-context-store.module';
import { StateWithSiteContext } from '../store/state';
import { CurrencyService } from './currency.service';
import createSpy = jasmine.createSpy;

const mockCurrencies: Currency[] = [
  { active: false, isocode: 'USD', name: 'US Dollar', symbol: '$' },
];

const mockActiveCurr = 'USD';

const mockSiteContextConfig: SiteContextConfig = {
  context: {
    currency: ['USD'],
  },
};

class MockSiteConnector {
  getCurrencies() {
    return of([]);
  }

  getLanguages() {
    return of([]);
  }
}

describe('CurrencyService', () => {
  const mockSelect0 = createSpy('select').and.returnValue(() => of(undefined));
  const mockSelect1 = createSpy('select').and.returnValue(() =>
    of(mockCurrencies)
  );
  const mockSelect2 = createSpy('select').and.returnValue(() =>
    of(mockActiveCurr)
  );

  let service: CurrencyService;
  let store: Store<StateWithSiteContext>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        SiteContextStoreModule,
      ],
      providers: [
        CurrencyService,
        { provide: SiteConnector, useClass: MockSiteConnector },
        { provide: SiteContextConfig, useValue: mockSiteContextConfig },
      ],
    });

    store = TestBed.get(Store as Type<Store<StateWithSiteContext>>);
    spyOn(store, 'dispatch').and.callThrough();
    service = TestBed.get(CurrencyService as Type<CurrencyService>);
  });

  it('should CurrencyService is injected', inject(
    [CurrencyService],
    (currencyService: CurrencyService) => {
      expect(currencyService).toBeTruthy();
    }
  ));

  it('should not load currencies when service is constructed', () => {
    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

  it('should be able to load currencies', () => {
    spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect0);
    service.getAll().subscribe();
    expect(store.dispatch).toHaveBeenCalledWith(
      new SiteContextActions.LoadCurrencies()
    );
  });

  it('should be able to get currencies', () => {
    spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect1);

    service.getAll().subscribe(results => {
      expect(results).toEqual(mockCurrencies);
    });
  });

  it('should be able to get active currencies', () => {
    spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect2);
    service.getActive().subscribe(results => {
      expect(results).toEqual(mockActiveCurr);
    });
  });

  describe('setActive(isocode)', () => {
    it('should be able to set active currency', () => {
      spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect2);
      service.setActive('EUR');
      expect(store.dispatch).toHaveBeenCalledWith(
        new SiteContextActions.SetActiveCurrency('EUR')
      );
    });

    it('should not dispatch action if isocode is currenyly actuve', () => {
      spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect2);
      service.setActive(mockActiveCurr);
      expect(store.dispatch).not.toHaveBeenCalledWith(
        new SiteContextActions.SetActiveCurrency(mockActiveCurr)
      );
    });
  });
});
