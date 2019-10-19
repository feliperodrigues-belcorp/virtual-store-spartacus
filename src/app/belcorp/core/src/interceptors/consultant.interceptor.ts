import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
@Injectable()
export class ConsultantInterceptor implements HttpInterceptor {
  public cookieValue;
  constructor(private cookieService: CookieService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.cookieValue = this.cookieService.get('consultant_site');
    if (this.cookieValue.length > 0) {
      request = request.clone({
        setHeaders: {
          consultant: this.cookieValue,
        },
      });
    }
    return next.handle(request);
  }
}
