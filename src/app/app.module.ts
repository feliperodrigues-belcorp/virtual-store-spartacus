import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
} from '@angular/material';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { translationChunksConfig, translations } from '@spartacus/assets';
import { I18nModule, UrlModule } from '@spartacus/core';
import { B2cStorefrontModule, SpinnerModule } from '@spartacus/storefront';
import { NgxMaskModule } from 'ngx-mask';
import { AppComponent } from './app.component';
import { BelcorpAddressBookComponent } from './belcorp/components/belcorp-address-book/belcorp-address-book.component';
import { BelcorpAddressCardComponent } from './belcorp/components/belcorp-address-book/belcorp-address-card/belcorp-address-card.component';
import { BelcorpAddressFormComponent } from './belcorp/components/belcorp-address-form/belcorp-address-form.component';
import { BelcorpCartDetailsComponent } from './belcorp/components/belcorp-cart-details/belcorp-cart-details.component';
import { BelcorpCartItemListComponent } from './belcorp/components/belcorp-cart-item-list/belcorp-cart-item-list.component';
import { BelcorpCartItemComponent } from './belcorp/components/belcorp-cart-item/belcorp-cart-item.component';
import { BelcorpIconComponent } from './belcorp/components/belcorp-icon/belcorp-icon.component';
import { BelcorpItemCounterComponent } from './belcorp/components/belcorp-item-counter/belcorp-item-counter.component';
import { BelcorpLoginFormComponent } from './belcorp/components/belcorp-login-form/belcorp-login-form.component';
import { BelcorpMediaComponent } from './belcorp/components/belcorp-media/belcorp-media.component';
import { BelcorpMiniCartComponent } from './belcorp/components/belcorp-mini-cart/belcorp-mini-cart.component';
import { BelcorpPasswordComponent } from './belcorp/components/belcorp-password/belcorp-password.component';
import { BelcorpPromotionsComponent } from './belcorp/components/belcorp-promotions/belcorp-promotions.component';
import { BelcorpRegisterComponent } from './belcorp/components/belcorp-register/belcorp-register.component';
import { SearchConsultantModule } from './belcorp/components/belcorp-search-consultant/belcorp-search-consultant.module';

@NgModule({
  declarations: [
    AppComponent,
    BelcorpLoginFormComponent,
    BelcorpRegisterComponent,
    BelcorpPasswordComponent,
    BelcorpAddressBookComponent,
    BelcorpAddressCardComponent,
    BelcorpAddressFormComponent,
    BelcorpMiniCartComponent,
    BelcorpIconComponent,
    BelcorpItemCounterComponent,
    BelcorpCartDetailsComponent,
    BelcorpPromotionsComponent,
    BelcorpCartItemListComponent,
    BelcorpCartItemComponent,
    BelcorpMediaComponent,
  ],
  imports: [
    B2cStorefrontModule.withConfig({
      backend: {
        occ: {
          baseUrl: 'https://localhost:9002',
          prefix: '/belcorpws/v2/',
          legacy: false,
        },
      },
      authentication: {
        client_id: 'belcorp_esb',
        client_secret: 'secret',
      },
      checkout: {
        express: true,
        guest: true,
      },
      view: {
        infiniteScroll: {
          active: true,
          productLimit: 500,
          showMoreButton: false,
        },
      },
      context: {
        urlParameters: ['baseSite', 'language', 'currency'],
        baseSite: ['belcorp-pe', 'belcorp-cl'],
        currency: ['PEN', 'CLP'],
        language: ['es']
      },

      // custom routing configuration for e2e testing
      routing: {
        routes: {
          product: {
            paths: ['product/:productCode/:name', 'product/:productCode'],
          },
        },
      },
      // we bring in static translations to be up and running soon right away
      i18n: {
        backend: {
          loadPath: '../assets/i18n-assets/{{lng}}//{{ns}}.json',
        },
        resources: translations,
        chunks: translationChunksConfig,
        fallbackLang: 'es',
      },
      features: {
        level: '1.2',
      },
      cmsComponents: {
        RegisterComponent: {
          component: BelcorpRegisterComponent,
        },
        LoginFormComponent: {
          component: BelcorpLoginFormComponent,
        },
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    I18nModule,
    UrlModule,
    NgxMaskModule.forRoot({}),
    RouterModule,
    SpinnerModule,
    BrowserModule.withServerTransition({ appId: 'spartacus-app' }),
    BrowserTransferStateModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    SearchConsultantModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatRadioModule,
    NgSelectModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
