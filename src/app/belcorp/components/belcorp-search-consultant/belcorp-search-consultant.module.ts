import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    MatExpansionModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule
 } from '@angular/material';
import { ConfigModule, I18nModule, NotAuthGuard, UrlModule } from '@spartacus/core';
import { SearchConsultantComponent } from './belcorp-search-consultant.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    MatExpansionModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    ConfigModule.withConfig({
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
