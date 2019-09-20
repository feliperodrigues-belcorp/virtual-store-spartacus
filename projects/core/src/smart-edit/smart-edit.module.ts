import { NgModule, ModuleWithProviders } from '@angular/core';

import { interceptors } from './http-interceptors/index';

@NgModule({})
export class SmartEditModule {
  static forRoot(): ModuleWithProviders<SmartEditModule> {
    return {
      ngModule: SmartEditModule,
      providers: [...interceptors],
    };
  }
}
