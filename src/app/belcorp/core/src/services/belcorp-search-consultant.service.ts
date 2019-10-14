import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OccEndpointsService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchUbigeo } from '../model/belcorp-search-consultant.model';
@Injectable()
export class SearchConsultantService {
  constructor(
    private http: HttpClient,
    private occEndpointService: OccEndpointsService,
    protected config: AuthConfig
  ) {}

  public getBelcorpToken(): Observable<any> {
    const headers = new HttpHeaders({
      'cx-use-client-token': 'true',
    });
    console.log();
    return this.http.get(this.occEndpointService.getUrl('/consultant/oauth/token'), {
      headers,
    });
  }

  public countrySelector(): any {
    const url = this.occEndpointService
      .getBaseEndpoint()
      .substring(this.occEndpointService.getBaseEndpoint().lastIndexOf('/') + 1);
    if (url === 'belcorp-pe') {
      return 'PE';
    }
    return 'CL';
  }

  public sendConsultantCodeToHybris(consultantCode: string, countryIso: string): Observable<any> {
    const headers = new HttpHeaders({
      'cx-use-client-token': 'true',
    });
    return this.http.post(
      this.occEndpointService.getUrl(`/consultant/choose/`),
      {
        consultantCode,
        countryIso,
      },
      {
        headers,
      }
    );
  }

  public getSearchConsultant(form: any, type: string, token: string): Observable<any[]> {
    const header = new HttpHeaders({ 'Content-Type': 'application', 'x-access-token': token });
    let params;
    if (type === 'PERSON') {
      if (form.distrito.length > 0) {
        params = new HttpParams()
          .set('first_name', form.firstname)
          .set('last_name', form.lastname)
          .set('ubegeo', form.distrito);
      } else {
        params = new HttpParams().set('first_name', form.firstname).set('last_name', form.lastname);
      }
    }
    if (type === 'CODE') {
      params = new HttpParams().set('consultant_code', form.code);
    }
    if (type === 'PHONE') {
      params = new HttpParams().set('phone', form.phone);
    }

    return this.http
      .get(`https://api-qa.belcorp.biz/consultants/${this.countrySelector()}?` + params, { headers: header })
      .pipe(
        map((response: any) => {
          if (Array.isArray(response)) {
            return response;
          }
          if (Object.keys(response).length === 0 && response.constructor === Object) {
            return Array();
          }
          return Array(response);
        })
      );
  }

  public getUbigeo(token: string): Observable<SearchUbigeo[]> {
    const header = new HttpHeaders({ 'Content-Type': 'application', 'x-access-token': token });
    return this.http
      .get<SearchUbigeo[]>(`https://api-qa.belcorp.biz/countries/${this.countrySelector()}?show_ubigeo=true`, {
        headers: header,
      })
      .pipe(
        map(response => {
          return response;
        })
      );
  }
}
