import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsConfig, ConfigModule } from '@spartacus/core';
import { OutletModule } from '../../../cms-structure/outlet/index';
import { CarouselModule } from '../../../shared/components/carousel/index';
import { MediaModule } from '../../../shared/components/media/media.module';
import { ProductImagesComponent } from './product-images.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MediaModule,
    OutletModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ProductImagesComponent: {
          component: ProductImagesComponent,
        },
      },
    }),
    CarouselModule,
  ],
  declarations: [ProductImagesComponent],
  entryComponents: [ProductImagesComponent],
  exports: [ProductImagesComponent],
})
export class ProductImagesModule {}
