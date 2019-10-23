import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
@Injectable()
export class ConsultantInterceptor implements HttpInterceptor {
  public cookieValueConsultant;
  public cookieValueConsultantIso;
  public navigateUrl;
  constructor(private cookieService: CookieService, private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.cookieValueConsultant = this.cookieService.get('consultant_id');
    this.cookieValueConsultantIso = this.cookieService.get('country_iso');
    const str = this.router.url;
    const n = str.lastIndexOf('/');
    const result = str.substring(n + 1);

    if (this.cookieValueConsultant.length > 0 && result !== 'search') {
      request = request.clone({
        setHeaders: {
          consultant_id: this.cookieValueConsultant,
          country_iso: this.cookieValueConsultantIso,
        },
      });
    }
    return next.handle(request);
  }
}
