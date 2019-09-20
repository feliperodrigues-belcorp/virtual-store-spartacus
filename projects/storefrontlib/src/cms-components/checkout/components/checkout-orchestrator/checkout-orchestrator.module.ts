import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthGuard, CmsConfig, Config, ConfigModule } from '@spartacus/core';
import { CheckoutConfig } from '../../config/checkout-config';
import { defaultCheckoutConfig } from '../../config/default-checkout-config';
import { CheckoutGuard } from '../../guards/checkout.guard';
import { CartNotEmptyGuard } from './../../../../cms-components/cart/cart-not-empty.guard';
import { CheckoutOrchestratorComponent } from './checkout-orchestrator.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(defaultCheckoutConfig),
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutOrchestrator: {
          component: CheckoutOrchestratorComponent,
          guards: [AuthGuard, CartNotEmptyGuard, CheckoutGuard],
        },
      },
    }),
  ],
  providers: [{ provide: CheckoutConfig, useExisting: Config }],
  declarations: [CheckoutOrchestratorComponent],
  entryComponents: [CheckoutOrchestratorComponent],
  exports: [CheckoutOrchestratorComponent],
})
export class CheckoutOrchestratorModule {}
