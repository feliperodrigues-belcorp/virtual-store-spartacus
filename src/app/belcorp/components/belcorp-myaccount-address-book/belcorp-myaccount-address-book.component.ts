import { Component } from '@angular/core';
import { AddressBookComponent, AddressBookComponentService } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-myaccount-address-book',
  templateUrl: './belcorp-myaccount-address-book.component.html',
  styleUrls: ['./belcorp-myaccount-address-book.component.scss']
})
export class BelcorpMyaccountAddressBookComponent extends AddressBookComponent {

  constructor(
    service: AddressBookComponentService) {

    super(service);
  }

}
