import { Component } from '@angular/core';
import { AddressBookComponent, AddressBookComponentService } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-address-book',
  templateUrl: './belcorp-address-book.component.html',
  styleUrls: ['./belcorp-address-book.component.scss']
})
export class BelcorpAddressBookComponent extends AddressBookComponent {

  constructor(
    service: AddressBookComponentService) {

    super(service);
  }

}

