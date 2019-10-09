import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CheckoutDeliveryService, GlobalMessageService, UserAddressService, UserService } from '@spartacus/core';
import { AddressFormComponent, ModalService } from '@spartacus/storefront';


@Component({
  selector: 'app-belcorp-myaccount-address-form',
  templateUrl: './belcorp-myaccount-address-form.component.html',
  styleUrls: ['./belcorp-myaccount-address-form.component.scss']
})
export class BelcorpMyaccountAddressFormComponent extends AddressFormComponent {

  constructor(
    fb: FormBuilder,
    checkoutDeliveryService: CheckoutDeliveryService,
    userService: UserService,
    userAddressService: UserAddressService,
    globalMessageService: GlobalMessageService,
    modalService: ModalService
  ) {
    super(fb, checkoutDeliveryService, userService, userAddressService, globalMessageService, modalService)
  }


}
