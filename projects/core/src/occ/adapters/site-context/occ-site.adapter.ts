import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country, CountryType, Region } from '../../../model/address.model';
import { BaseSite, Currency, Language } from '../../../model/misc.model';
import {
  COUNTRY_NORMALIZER,
  CURRENCY_NORMALIZER,
  LANGUAGE_NORMALIZER,
  REGION_NORMALIZER,
} from '../../../site-context/connectors/converters';
import { SiteAdapter } from '../../../site-context/connectors/site.adapter';
import { ConverterService } from '../../../util/converter.service';
import { Occ } from '../../occ-models/occ.models';
import { OccEndpointsService } from '../../services/occ-endpoints.service';

@Injectable()
export class OccSiteAdapter implements SiteAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpointsService: OccEndpointsService,
    protected converterService: ConverterService
  ) {}

  loadLanguages(): Observable<Language[]> {
    return this.http
      .get<Occ.LanguageList>(this.occEndpointsService.getUrl('languages'))
      .pipe(
        map(languageList => languageList.languages),
        this.converterService.pipeableMany(LANGUAGE_NORMALIZER)
      );
  }

  loadCurrencies(): Observable<Currency[]> {
    return this.http
      .get<Occ.CurrencyList>(this.occEndpointsService.getUrl('currencies'))
      .pipe(
        map(currencyList => currencyList.currencies),
        this.converterService.pipeableMany(CURRENCY_NORMALIZER)
      );
  }

  loadCountries(type?: CountryType): Observable<Country[]> {
    return this.http
      .get<Occ.CountryList>(
        this.occEndpointsService.getUrl(
          'countries',
          undefined,
          type ? { type } : undefined
        )
      )
      .pipe(
        map(countryList => countryList.countries),
        this.converterService.pipeableMany(COUNTRY_NORMALIZER)
      );
  }

  loadRegions(countryIsoCode: string): Observable<Region[]> {
    return this.http
      .get<Occ.RegionList>(
        this.occEndpointsService.getUrl('regions', { isoCode: countryIsoCode })
      )
      .pipe(
        map(regionList => regionList.regions),
        this.converterService.pipeableMany(REGION_NORMALIZER)
      );
  }

  loadBaseSite(): Observable<BaseSite> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    const urlSplits = baseUrl.split('/');
    const activeSite = urlSplits.pop();
    const url = urlSplits.join('/') + '/basesites';

    const params = new HttpParams({
      fromString: 'fields=FULL',
    });

    return this.http
      .get<{ baseSites: BaseSite[] }>(url, { params: params })
      .pipe(
        map(siteList => {
          return siteList.baseSites.find(site => site.uid === activeSite);
        })
      );
  }
}
