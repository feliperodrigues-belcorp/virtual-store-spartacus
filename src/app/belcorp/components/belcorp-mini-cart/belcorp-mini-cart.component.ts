import { Component } from '@angular/core';
import { CartService } from '@spartacus/core';
import { MiniCartComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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

  quantity$: Observable<number> = this.cartService.getActive().pipe(
    startWith({ deliveryItemsQuantity: 0 }),
    map(cart => cart.deliveryItemsQuantity || 0)
  );

}
