import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule, MatInputModule, MatSelectModule } from '@angular/material';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { translationChunksConfig, translations } from '@spartacus/assets';
import { I18nModule, UrlModule } from '@spartacus/core';
import { B2cStorefrontModule, SpinnerModule } from '@spartacus/storefront';
import { AppComponent } from './app.component';
import { BelcorpLoginFormComponent } from './belcorp/components/belcorp-login-form/belcorp-login-form.component';
import { BelcorpRegisterComponent } from './belcorp/components/belcorp-register/belcorp-register.component';
@NgModule({
  declarations: [AppComponent, BelcorpLoginFormComponent, BelcorpRegisterComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    I18nModule,
    UrlModule,
    RouterModule,
    SpinnerModule,
    BrowserModule.withServerTransition({ appId: 'spartacus-app' }),
    BrowserTransferStateModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,

    B2cStorefrontModule.withConfig({
      backend: {
        occ: {
          baseUrl: 'https://keyrusbelcorp.com',
          prefix: '/belcorpws/v2/',
          legacy: false,
        },
      },
      context: {
        urlParameters: ['baseSite', 'language', 'currency'],
        baseSite: ['belcorp-pe', 'belcorp-cl'],
        currency: ['PEN', 'CLP'],
        // urlParameters: ['baseSite', 'language', 'currency'],
        // baseSite: ['electronics-spa', 'electronics', 'apparel-de', 'apparel-uk'],
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
        resources: translations,
        chunks: translationChunksConfig,
        fallbackLang: 'en',
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

    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
