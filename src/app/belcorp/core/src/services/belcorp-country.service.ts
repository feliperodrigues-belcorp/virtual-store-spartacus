import { Injectable } from '@angular/core';
import { OccEndpointsService } from '@spartacus/core';

@Injectable()
export class BelcorpCountryService {
  constructor(
    private occEndpointService: OccEndpointsService
  ) { }

  public getCountry(): any {
    const url = this.occEndpointService
      .getBaseEndpoint()
      .substring(this.occEndpointService.getBaseEndpoint().lastIndexOf('/') + 1);
    if (url === 'belcorp-pe') {
      return 'PE';
    }
    return 'CL';
  }
}
