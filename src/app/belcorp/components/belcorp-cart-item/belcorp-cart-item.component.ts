import { Component, Input } from '@angular/core';
import { CartItemComponent, Item } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-cart-item',
  templateUrl: './belcorp-cart-item.component.html',
  styleUrls: ['./belcorp-cart-item.component.scss'],
})
export class BelcorpCartItemComponent extends CartItemComponent {
  constructor() {
    super();
  }
  @Input()
  item: ItemBelcorp;

  getMinNumber(x: any, y: any): any {
    return Math.min(x, y);
  }
}

interface ItemBelcorp extends Item {
  actualQuantity?: any;
}
