import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { CarouselModule } from '../../../../shared/components/carousel/carousel.module';
import { MediaModule } from '../../../../shared/components/media/media.module';
import { ProductReferencesComponent } from './product-references.component';

@NgModule({
  imports: [
    CommonModule,
    CarouselModule,
    MediaModule,
    RouterModule,
    UrlModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ProductReferencesComponent: {
          component: ProductReferencesComponent,
        },
      },
    }),
  ],
  declarations: [ProductReferencesComponent],
  entryComponents: [ProductReferencesComponent],
  exports: [ProductReferencesComponent],
})
export class ProductReferencesModule {}
