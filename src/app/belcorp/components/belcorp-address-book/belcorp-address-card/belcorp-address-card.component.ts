import { Component } from '@angular/core';
import { UserAddressService } from '@spartacus/core';
import { AddressCardComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-address-card',
  templateUrl: './belcorp-address-card.component.html',
  styleUrls: ['./belcorp-address-card.component.scss']
})
export class BelcorpAddressCardComponent extends AddressCardComponent {

  constructor(
    userAddressService: UserAddressService
  ) {
    super(userAddressService);

  }



}