import { Component, ElementRef } from '@angular/core';
import { IconComponent, IconLoaderService } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-icon',
  templateUrl: './belcorp-icon.component.html',
  styleUrls: ['./belcorp-icon.component.scss']
})
export class BelcorpIconComponent extends IconComponent {

  constructor(
    iconLoader: IconLoaderService,
    elementRef: ElementRef<HTMLElement>
  ) {
    super(iconLoader, elementRef);
  }


}
