import { Component, Optional } from '@angular/core';
import { CmsSearchBoxComponent } from '@spartacus/core';
import { CmsComponentData, SearchBoxComponent, SearchBoxComponentService } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-search-box',
  templateUrl: './belcorp-search-box.component.html',
  styleUrls: ['./belcorp-search-box.component.scss']
})
export class BelcorpSearchBoxComponent extends SearchBoxComponent {

  constructor(
    searchBoxComponentService: SearchBoxComponentService,
    @Optional()
    componentData: CmsComponentData<CmsSearchBoxComponent>
  ) {
    super(searchBoxComponentService, componentData)
  }


}
