import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CartService } from '@spartacus/core';
import { CartItemListComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-cart-item-list',
  templateUrl: './belcorp-cart-item-list.component.html',
  styleUrls: ['./belcorp-cart-item-list.component.scss']
})
export class BelcorpCartItemListComponent extends CartItemListComponent {

  constructor(
    cartService: CartService,
    fb: FormBuilder
  ) {
    super(cartService, fb)
  }



}
