import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { AuthService } from '../../facade/auth.service';
import { ClientToken } from '../../models/token-types.model';

@Injectable()
export class ClientErrorHandlingService {
  constructor(protected authService: AuthService) {}

  public handleExpiredClientToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    return this.authService.refreshClientToken().pipe(
      take(1),
      switchMap((token: ClientToken) => {
        return next.handle(this.createNewRequestWithNewToken(request, token));
      })
    );
  }

  protected createNewRequestWithNewToken(
    request: HttpRequest<any>,
    token: ClientToken
  ): HttpRequest<any> {
    request = request.clone({
      setHeaders: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
    });
    return request;
  }
}
