import { Component, Optional } from '@angular/core';
import { CmsSearchBoxComponent } from '@spartacus/core';
import { CmsComponentData, SearchBoxComponent, SearchBoxComponentService, SearchBoxConfig } from '@spartacus/storefront';

// const DEFAULT_SEARCHBOX_CONFIG: SearchBoxConfig = {
//   minCharactersBeforeRequest: 1,
//   displayProducts: true,
//   displaySuggestions: true,
//   maxProducts: 5,
//   maxSuggestions: 5,
//   displayProductImages: true,
// };

@Component({
  selector: 'app-belcorp-searchbox',
  templateUrl: './belcorp-searchbox.component.html',
  styleUrls: ['./belcorp-searchbox.component.scss']
})
export class BelcorpSearchboxComponent extends SearchBoxComponent {
  config: SearchBoxConfig;

  constructor(
    searchBoxComponentService: SearchBoxComponentService,
    @Optional()
    componentData: CmsComponentData<CmsSearchBoxComponent>

  ) {
    super(searchBoxComponentService, componentData)
  }

  

}
