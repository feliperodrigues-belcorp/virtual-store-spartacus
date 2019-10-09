import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchConsultant, SearchUbigeo } from '../model/belcorp-search-consultant.model';


@Injectable()
export class SearchConsultantService {

    constructor(private http: HttpClient) {}

    public getSearchConsultant(form: any): Observable<SearchConsultant[]> {
        const params = new HttpParams().set('_page', form.firstname.value).set('_limit', form.lastname.value);
        return this.http.get<SearchConsultant[]>('http://fakerestapi.azurewebsites.net/api/Users', {params} );
    }

    public getUbigeo(): Observable<SearchUbigeo[]> {
        return this.http.get<SearchUbigeo[]>('http://fakerestapi.azurewebsites.net/api/Users' );
    }
}
