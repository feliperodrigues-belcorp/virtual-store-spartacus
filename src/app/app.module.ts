import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { translationChunksConfig, translations } from '@spartacus/assets';
import { B2cStorefrontModule } from '@spartacus/storefront';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterAccountComponent } from './register-account/register-account.component';


@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterAccountComponent],
  imports: [
    BrowserModule,
    B2cStorefrontModule.withConfig({
      backend: {
        occ: {
          baseUrl: 'https://localhost:9002',
          prefix: '/belcorpws/v2/',
          legacy: false,
        },
      },
      authentication: {
        client_id: 'mobile_android',
        client_secret: 'secret',
      },
      context: {
        urlParameters: ['baseSite', 'language', 'currency'],

        baseSite: [
          'belcorp-pe',
          'belcorp-cl',
        ],
        currency: ['PEN', 'CLP']

      },
      i18n: {
        resources: translations,
        chunks: translationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule { }
