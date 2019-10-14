import { Component } from '@angular/core';
import { CartItemComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-cart-item',
  templateUrl: './belcorp-cart-item.component.html',
  styleUrls: ['./belcorp-cart-item.component.scss']
})
export class BelcorpCartItemComponent extends CartItemComponent {

  constructor() {
    super()
  }



}
