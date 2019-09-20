import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, ConfigModule } from '../config/config.module';
import { StateModule } from '../state/index';
import { defaultSiteContextConfigFactory } from './config/default-site-context-config';
import { SiteContextConfig } from './config/site-context-config';
import { contextServiceMapProvider } from './providers/context-service-map';
import { contextServiceProviders } from './providers/context-service-providers';
import { siteContextParamsProviders } from './providers/site-context-params-providers';
import { SiteContextStoreModule } from './store/site-context-store.module';
import { provideConfigValidator } from '../config/utils/config-validator';
import { baseSiteConfigValidator } from './config/base-site-config-validator';

// @dynamic
@NgModule({
  imports: [
    ConfigModule.withConfigFactory(defaultSiteContextConfigFactory),
    StateModule,
    SiteContextStoreModule,
  ],
})
export class SiteContextModule {
  static forRoot(): ModuleWithProviders<SiteContextModule> {
    return {
      ngModule: SiteContextModule,
      providers: [
        contextServiceMapProvider,
        ...contextServiceProviders,
        ...siteContextParamsProviders,
        { provide: SiteContextConfig, useExisting: Config },
        provideConfigValidator(baseSiteConfigValidator),
      ],
    };
  }
}
