import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
} from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { CookieService } from 'ngx-cookie-service';
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
    MatProgressSpinnerModule,
    ConfigModule.withConfig({
      cmsComponents: {
        BelcorpSearchConsultantComponent: {
          component: SearchConsultantComponent,
        },
      },
    }),
    I18nModule,
  ],
  providers: [CookieService],
  declarations: [SearchConsultantComponent],
  exports: [SearchConsultantComponent],
  entryComponents: [SearchConsultantComponent],
})
export class SearchConsultantModule {}
