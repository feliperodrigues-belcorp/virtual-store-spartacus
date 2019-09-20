import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CartAdapter } from '../../../cart/connectors/cart/cart.adapter';
import { CART_NORMALIZER } from '../../../cart/connectors/cart/converters';
import { CartEntryAdapter } from '../../../cart/connectors/entry/cart-entry.adapter';
import { ConfigModule } from '../../../config/config.module';
import { OccCartNormalizer } from './converters/occ-cart-normalizer';
import { defaultOccCartConfig } from './default-occ-cart-config';
import { OccCartEntryAdapter } from './occ-cart-entry.adapter';
import { OccCartAdapter } from './occ-cart.adapter';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultOccCartConfig),
  ],
  providers: [
    {
      provide: CartAdapter,
      useClass: OccCartAdapter,
    },
    {
      provide: CART_NORMALIZER,
      useClass: OccCartNormalizer,
      multi: true,
    },
    {
      provide: CartEntryAdapter,
      useClass: OccCartEntryAdapter,
    },
  ],
})
export class CartOccModule {}
