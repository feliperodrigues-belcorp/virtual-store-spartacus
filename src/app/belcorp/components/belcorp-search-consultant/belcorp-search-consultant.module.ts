import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  ConfigModule,
  I18nModule,
  NotAuthGuard,
  UrlModule,
} from '@spartacus/core';
import { SearchConsultantComponent } from './belcorp-search-consultant.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        BelcorpSearchConsultantComponent: {
          component: SearchConsultantComponent,
          guards: [NotAuthGuard],
        },
      },
    }),
    I18nModule,
  ],
  declarations: [SearchConsultantComponent],
  exports: [SearchConsultantComponent],
  entryComponents: [SearchConsultantComponent],
})
export class SearchConsultantModule {}