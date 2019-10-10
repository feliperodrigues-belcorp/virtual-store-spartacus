import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { CheckoutDeliveryService, GlobalMessageService, UserAddressService, UserService } from '@spartacus/core';
import { AddressFormComponent, ModalService } from '@spartacus/storefront';
import { BelcorpAddress } from '../../core/src/model/belcorp.misc.model';

@Component({
  selector: 'app-belcorp-address-form',
  templateUrl: './belcorp-address-form.component.html',
  styleUrls: ['./belcorp-address-form.component.scss']
})
export class BelcorpAddressFormComponent extends AddressFormComponent {
  fb2: FormBuilder;

  constructor(
    fb: FormBuilder,
    checkoutDeliveryService: CheckoutDeliveryService,
    userService: UserService,
    userAddressService: UserAddressService,
    globalMessageService: GlobalMessageService,
    modalService: ModalService
  ) {
    super(fb, checkoutDeliveryService, userService, userAddressService, globalMessageService, modalService);
    this.address.removeControl('postalCode');
    this.address.addControl('reference', new FormControl(''));
  }
  verifyAddress(): void {
    console.log(this.address.value);
    this.userAddressService.addUserAddress(this.collectDataFromAddressForm(this.address.value));
  }
  collectDataFromAddressForm(formData: any): BelcorpAddress {
    const {
      firstName,
      country,
      defaultAddress,
      email,
      formattedAddress,
      id,
      lastName,
      line1,
      line2,
      phone,
      region,
      shippingAddress,
      title,
      titleCode,
      town,
      visibleInAddressBook,
      reference,
    } = formData;
    return {
      firstName,
      country,
      defaultAddress,
      email,
      formattedAddress,
      id,
      lastName,
      line1,
      line2,
      phone,
      region,
      shippingAddress,
      title,
      titleCode,
      town,
      visibleInAddressBook,
      reference,
    };
  }
}
