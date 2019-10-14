import { Component } from '@angular/core';
import { CartService } from '@spartacus/core';
import { CartDetailsComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-cart-details',
  templateUrl: './belcorp-cart-details.component.html',
  styleUrls: ['./belcorp-cart-details.component.scss']
})
export class BelcorpCartDetailsComponent extends CartDetailsComponent {

  constructor(
    cartService: CartService
  ) {
    super(cartService)
  }





}
