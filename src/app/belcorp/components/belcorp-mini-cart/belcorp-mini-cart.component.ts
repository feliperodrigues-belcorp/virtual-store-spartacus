import { Component } from '@angular/core';
import { CartService } from '@spartacus/core';
import { MiniCartComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-mini-cart',
  templateUrl: './belcorp-mini-cart.component.html',
  styleUrls: ['./belcorp-mini-cart.component.scss']
})
export class BelcorpMiniCartComponent extends MiniCartComponent {

  constructor(
    cartService: CartService
  ) {
    super(cartService);
  }



}
