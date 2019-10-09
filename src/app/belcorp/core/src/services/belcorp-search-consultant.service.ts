import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchConsultant } from '../model/belcorp-search-consultant.model';


@Injectable()
export class SearchConsultantService {

    constructor(private http: HttpClient) {}

    public getSearchConsultant(teste: any): Observable<SearchConsultant[]> {
        const  params = new HttpParams().set('_page', teste.firstname.value).set('_limit', teste.lastname.value);
        return this.http.get<SearchConsultant[]>('http://fakerestapi.azurewebsites.net/api/Users', {params} );
    }
}
