import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  ExternalRoutesModule,
  OccModule,
  PersonalizationModule,
  provideConfig,
  SiteContextModule,
  SmartEditModule,
} from '@spartacus/core';
import { ProductDetailsPageModule } from '../cms-pages/product-details-page/product-details-page.module';
import { ProductListingPageModule } from '../cms-pages/product-listing-page/product-listing-page.module';
import { MainModule } from '../layout/main/main.module';
import { StorefrontConfig } from '../storefront-config';
import { StorefrontFoundationModule } from './storefront-foundation.module';

@NgModule({
  imports: [
    RouterModule.forRoot([], {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),

    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictStateSerializability: true,
          strictActionImmutability: true,
          strictActionSerializability: true,
        },
      }
    ),
    EffectsModule.forRoot([]),

    StorefrontFoundationModule,
    MainModule,
    SiteContextModule.forRoot(), // should be imported after RouterModule.forRoot, because it overwrites UrlSerializer

    SmartEditModule.forRoot(), // should be custom
    PersonalizationModule.forRoot(), // should be custom

    // opt-in explicitly
    OccModule.forRoot(),
    ProductDetailsPageModule,
    ProductListingPageModule,
    ExternalRoutesModule.forRoot(),
  ],
  exports: [MainModule, StorefrontFoundationModule],
})
export class StorefrontModule {
  static withConfig(
    config?: StorefrontConfig
  ): ModuleWithProviders<StorefrontModule> {
    return {
      ngModule: StorefrontModule,
      providers: [provideConfig(config)],
    };
  }
}
