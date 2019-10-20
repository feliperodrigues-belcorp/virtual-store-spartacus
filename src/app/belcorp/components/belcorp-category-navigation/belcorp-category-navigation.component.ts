import { Component } from '@angular/core';
import { CmsNavigationComponent } from '@spartacus/core';
import { CategoryNavigationComponent, CmsComponentData, NavigationNode, NavigationService } from '@spartacus/storefront';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-belcorp-category-navigation',
  templateUrl: './belcorp-category-navigation.component.html',
  styleUrls: ['./belcorp-category-navigation.component.scss']
})

export class BelcorpCategoryNavigationComponent extends CategoryNavigationComponent {
  node$: Observable<NavigationNode> = this.service.getNavigationNode(
    this.componentData.data$
  );

  data$: Observable<CmsNavigationComponent> = this.componentData.data$;


  constructor(
    componentData: CmsComponentData<CmsNavigationComponent>,
    service: NavigationService
  ) {
    super(componentData, service)
  }



}
