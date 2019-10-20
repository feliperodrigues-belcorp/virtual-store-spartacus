import { Component } from '@angular/core';
import { HamburgerMenuComponent, HamburgerMenuService } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-hamburger-menu',
  templateUrl: './belcorp-hamburger-menu.component.html',
  styleUrls: ['./belcorp-hamburger-menu.component.scss']
})
export class BelcorpHamburgerMenuComponent extends HamburgerMenuComponent {

  constructor(
    hamburgerMenuService: HamburgerMenuService
  ) {
    super(hamburgerMenuService)
  }


}
