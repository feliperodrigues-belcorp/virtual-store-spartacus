import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ConfigModule } from '../../config/config.module';
import {
  StateConfig,
  StateTransferType,
} from '../../state/config/state-config';
import { StateModule } from '../../state/state.module';
import { CMS_FEATURE } from './cms-state';
import { effects } from './effects/index';
import { metaReducers, reducerProvider, reducerToken } from './reducers/index';

export function cmsStoreConfigFactory(): StateConfig {
  // if we want to reuse CMS_FEATURE const in config, we have to use factory instead of plain object
  const config: StateConfig = {
    state: {
      ssrTransfer: {
        keys: { [CMS_FEATURE]: StateTransferType.TRANSFER_STATE },
      },
    },
  };
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StateModule,
    StoreModule.forFeature(CMS_FEATURE, reducerToken, { metaReducers }),
    EffectsModule.forFeature(effects),
    ConfigModule.withConfigFactory(cmsStoreConfigFactory),
  ],
  providers: [reducerProvider],
})
export class CmsStoreModule {}
