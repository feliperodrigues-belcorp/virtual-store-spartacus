import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CountryType } from '@spartacus/core';
import { of } from 'rxjs/internal/observable/of';
import { SiteAdapter } from './site.adapter';
import { SiteConnector } from './site.connector';

import createSpy = jasmine.createSpy;

const mockLanguages = ['l', 'a', 'n', 'g'];
const mockCurrencies = ['c', 'u', 'r', 'r'];
const mockBaseSite = { uid: 'test-uid' };

class MockSiteAdapter implements SiteAdapter {
  loadCurrencies = createSpy('SiteAdapter.loadCurrencies').and.callFake(() =>
    of(mockCurrencies)
  );

  loadLanguages = createSpy('SiteAdapter.loadLanguages').and.callFake(() =>
    of(mockLanguages)
  );

  loadCountries = createSpy('SiteAdapter.loadCountries').and.returnValue(
    of([])
  );

  loadRegions = createSpy('SiteAdapter.loadRegions').and.callFake(countryCode =>
    of(`loadRegions-${countryCode}`)
  );

  loadBaseSite = createSpy('SiteAdapter.loadBaseSite').and.callFake(() =>
    of(mockBaseSite)
  );
}

describe('SiteConnector', () => {
  let service: SiteConnector;
  let adapter: SiteAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SiteAdapter, useClass: MockSiteAdapter }],
    });

    service = TestBed.get(SiteConnector as Type<SiteConnector>);
    adapter = TestBed.get(SiteAdapter as Type<SiteAdapter>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getLanguages should call adapter', () => {
    let result;
    service.getLanguages().subscribe(res => (result = res));
    expect(result).toBe(mockLanguages);
    expect(adapter.loadLanguages).toHaveBeenCalled();
  });

  it('getCurrencies should call adapter', () => {
    let result;
    service.getCurrencies().subscribe(res => (result = res));
    expect(result).toBe(mockCurrencies);
    expect(adapter.loadCurrencies).toHaveBeenCalled();
  });

  it('getCountries should call adapter', () => {
    let result;
    service.getCountries(CountryType.SHIPPING).subscribe(res => (result = res));
    expect(result).toEqual([]);
    expect(adapter.loadCountries).toHaveBeenCalledWith(CountryType.SHIPPING);
  });

  it('getRegions should call adapter', () => {
    let result;
    service.getRegions('CA').subscribe(res => (result = res));
    expect(result).toEqual('loadRegions-CA');
    expect(adapter.loadRegions).toHaveBeenCalledWith('CA');
  });

  it('getBaseSite should call adapter', () => {
    let result;
    service.getBaseSite().subscribe(res => (result = res));
    expect(result).toBe(mockBaseSite);
    expect(adapter.loadBaseSite).toHaveBeenCalled();
  });
});
