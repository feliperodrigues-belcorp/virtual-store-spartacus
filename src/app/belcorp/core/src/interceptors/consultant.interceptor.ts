import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
@Injectable()
export class ConsultantInterceptor implements HttpInterceptor {
  public cookieValueConsultant;
  public cookieValueConsultantIso;
  constructor(private cookieService: CookieService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.cookieValueConsultant = this.cookieService.get('consultant_id');
    this.cookieValueConsultantIso = this.cookieService.get('consultant_iso');

    if (this.cookieValueConsultant.length > 0) {
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
