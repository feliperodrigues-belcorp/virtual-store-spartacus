import { Injectable } from '@angular/core';
import { GlobalMessageType } from '../../models/global-message.model';
import { HttpResponseStatus } from '../../models/response-status.model';
import { HttpErrorHandler } from './http-error.handler';

@Injectable({
  providedIn: 'root',
})
export class InternalServerErrorHandler extends HttpErrorHandler {
  responseStatus = HttpResponseStatus.INTERNAL_SERVER_ERROR;

  handleError() {
    this.globalMessageService.add(
      { key: 'httpHandlers.internalServerError' },
      GlobalMessageType.MSG_TYPE_ERROR
    );
  }
}
