import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OccEndpointsService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchConsultant, SearchUbigeo } from '../model/belcorp-search-consultant.model';

@Injectable()
export class SearchConsultantService {
    constructor(private http: HttpClient, private occEndpointService: OccEndpointsService) { }

    public getBelcorpToken(): Observable<any> {
        const header = new HttpHeaders({ 'Content-Type': 'application' });
        return this.http.get(`${this.occEndpointService.getUrl('/consultant/oauth/token')}`);
    }

    public getSearchConsultant(form: any, type: string): Observable<SearchConsultant[]> {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyMywidXNyIjoiYXBwVlMiLCJpYXQiOjE1NzA4MTgyMjcsImV4cCI6MTU3MDkwNDYyN30.XZki6NBnmnWIF-vrld7_h2EnMTSaYzujFzFEAgCAx_A';
        const header = new HttpHeaders({ 'Content-Type': 'application', 'x-access-token': token });
        let params;
        if (type === 'PERSON') {
            params = new HttpParams()
                .set('first_name', form.firstname)
                .set('last_name', form.lastname)
            //.set('ubigeo', form.distrito);
        }
        if (type === 'CODE') {
            params = new HttpParams().set('consultant_code', form.code);
        }
        if (type === 'PHONE') {
            params = new HttpParams().set('phone', form.phone);
        }

        return this.http.get(`https://api-qa.belcorp.biz/consultants/PE?` + params, { headers: header }).pipe(
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

    public getUbigeo(): Observable<SearchUbigeo[]> {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyMywidXNyIjoiYXBwVlMiLCJpYXQiOjE1NzA4MTgyMjcsImV4cCI6MTU3MDkwNDYyN30.XZki6NBnmnWIF-vrld7_h2EnMTSaYzujFzFEAgCAx_A';
        const header = new HttpHeaders({ 'Content-Type': 'application', 'x-access-token': token });
        return this.http
            .get<SearchUbigeo[]>('https://api-qa.belcorp.biz/countries/PE?show_ubigeo=true', { headers: header })
            .pipe(
                map(response => {
                    return response;
                })
            );
    }
}
