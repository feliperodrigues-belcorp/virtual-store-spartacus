import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchConsultant, SearchUbigeo } from '../model/belcorp-search-consultant.model';


@Injectable()
export class SearchConsultantService {

    constructor(private http: HttpClient) { }

    public getSearchConsultant(form: any, type: string): Observable<SearchConsultant[]> {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyMywidXNyIjoiYXBwVlMiLCJpYXQiOjE1NzA3MzE0OTUsImV4cCI6MTU3MDgxNzg5NX0.VlVv8RGs_rIBN9CP0R05Om4LyoxMGrY874PXo9s5yPk';
        const header = new HttpHeaders({ 'Content-Type': 'application', 'x-access-token': token });
        let params;
        if (type === 'PERSON') {
            params = new HttpParams().set('first_name', form.firstname).set('last_name', form.lastname).set('ubigeo', '000015000001000013');
        } if (type === 'CODE') {
            params = new HttpParams().set('consultant_code', form.code);
        } if (type === 'PHONE') {
            params = new HttpParams().set('phone', form.phone);
        }

        return this.http.get<SearchConsultant[]>(`https://api-qa.belcorp.biz/consultants/PE?` + params, { headers: header })
            .pipe(map(response => {
                return response
            }));;
    }

    public getUbigeo(): Observable<SearchUbigeo[]> {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyMywidXNyIjoiYXBwVlMiLCJpYXQiOjE1NzA3MzE0OTUsImV4cCI6MTU3MDgxNzg5NX0.VlVv8RGs_rIBN9CP0R05Om4LyoxMGrY874PXo9s5yPk';
        const header = new HttpHeaders({ 'Content-Type': 'application', 'x-access-token': token });
        return this.http.get<SearchUbigeo[]>('https://api-qa.belcorp.biz/countries/PE?show_ubigeo=true', { headers: header })
            .pipe(map(response => {
                let confirmArray = Array.isArray(response) ? response : response;
                return confirmArray;
            }));
    }
}