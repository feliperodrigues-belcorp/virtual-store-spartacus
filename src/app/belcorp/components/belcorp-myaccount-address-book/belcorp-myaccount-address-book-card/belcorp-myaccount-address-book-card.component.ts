import { Component } from '@angular/core';
import { UserAddressService } from '@spartacus/core';
import { AddressCardComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-myaccount-address-book-card',
  templateUrl: './belcorp-myaccount-address-book-card.component.html',
  styleUrls: ['./belcorp-myaccount-address-book-card.component.scss']
})
export class BelcorpMyaccountAddressBookCardComponent extends AddressCardComponent {

  constructor(
    userAddressService: UserAddressService
  ) {
    super(userAddressService);

  }



}
