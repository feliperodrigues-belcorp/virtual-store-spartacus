import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OccEndpointsService } from '../../../occ/services/occ-endpoints.service';
import { AuthConfig } from '../../config/auth-config';
import { UserToken } from '../../models/token-types.model';

@Injectable()
export class UserAuthenticationTokenService {
  constructor(
    http: HttpClient,
    config: AuthConfig,
    // tslint:disable-next-line:unified-signatures
    occEndpointsService: OccEndpointsService
  );

  /**
   * @deprecated since version 1.1
   * Use constructor(http: HttpClient, config: AuthConfig, occEndpointsService: OccEndpointsService) instead
   */
  constructor(http: HttpClient, config: AuthConfig);
  constructor(
    protected http: HttpClient,
    protected config: AuthConfig,
    protected occEndpointsService?: OccEndpointsService
  ) {}

  loadToken(userId: string, password: string): Observable<UserToken> {
    const url = this.occEndpointsService.getRawEndpoint('login');
    const params = new HttpParams()
      .set('client_id', this.config.authentication.client_id)
      .set('client_secret', this.config.authentication.client_secret)
      .set('grant_type', 'password')
      .set('username', userId)
      .set('password', password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<UserToken>(url, params, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  refreshToken(refreshToken: string): Observable<UserToken> {
    const url = this.occEndpointsService.getRawEndpoint('login');
    const params = new HttpParams()
      .set(
        'client_id',
        encodeURIComponent(this.config.authentication.client_id)
      )
      .set(
        'client_secret',
        encodeURIComponent(this.config.authentication.client_secret)
      )
      .set('refresh_token', encodeURI(refreshToken))
      .set('grant_type', 'refresh_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<UserToken>(url, params, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
