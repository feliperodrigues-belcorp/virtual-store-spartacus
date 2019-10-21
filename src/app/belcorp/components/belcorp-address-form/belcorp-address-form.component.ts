import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { CheckoutDeliveryService, GlobalMessageService, UserAddressService, UserService } from '@spartacus/core';
import { AddressFormComponent, ModalService } from '@spartacus/storefront';
import { BelcorpAddress } from '../../core/src/model/belcorp.misc.model';
import { BelcorpCountryService } from '../../core/src/services/belcorp-country.service';

@Component({
  selector: 'app-belcorp-address-form',
  templateUrl: './belcorp-address-form.component.html',
  styleUrls: ['./belcorp-address-form.component.scss'],
  providers: [BelcorpCountryService],
})
export class BelcorpAddressFormComponent extends AddressFormComponent {

  private belcorpCountryService: BelcorpCountryService;
  private siteCountry: string;

  @Output()
  submitAddress = new EventEmitter<any>();
  constructor(
    fb: FormBuilder,
    checkoutDeliveryService: CheckoutDeliveryService,
    userService: UserService,
    userAddressService: UserAddressService,
    globalMessageService: GlobalMessageService,
    modalService: ModalService,
    belcorpCountryService: BelcorpCountryService
  ) {
    super(fb, checkoutDeliveryService, userService, userAddressService, globalMessageService, modalService);
    this.address.removeControl('postalCode');
    this.address.removeControl('town');
    this.address.removeControl('title');
    this.address.removeControl('firstName');
    this.address.removeControl('lastName');

    this.address.addControl('reference', new FormControl(''));
    this.address.addControl('addressName', new FormControl(''));

    this.belcorpCountryService = belcorpCountryService;
    this.siteCountry = this.belcorpCountryService.getCountry();

    if (this.siteCountry === 'PE') {
      this.address.addControl('department', new FormControl(''));
      this.address.addControl('province', new FormControl(''));
      this.address.addControl('district', new FormControl(''));

      this.address.removeControl('region');
    }

    if (this.siteCountry === 'CL') {
      this.address.addControl('commune', new FormControl(''));
      this.address.addControl('locality', new FormControl(''));
    }
  }

  verifyAddress(): void {
    console.log(this.address.value);
    // TODO: Uncomment and fix this validation
    // if (this.address.dirty) {
    //   this.checkoutDeliveryService.verifyAddress(this.collectDataFromAddressForm(this.address.value));
    // } else {
      // address form value not changed
      // ignore duplicate address
      this.submitAddress.emit(this.collectDataFromAddressForm(this.address.value));
    // }
  }
  collectDataFromAddressForm(formData: any): BelcorpAddress {
    const {
      addressName,
      country,
      defaultAddress,
      email,
      formattedAddress,
      id,
      line1,
      line2,
      phone,
      department,
      province,
      district,
      region,
      commune,
      locality,
      shippingAddress,
      titleCode,
      visibleInAddressBook,
      reference,
    } = formData;
    return {
      addressName,
      country,
      defaultAddress,
      email,
      formattedAddress,
      id,
      line1,
      line2,
      phone,
      department,
      province,
      district,
      region,
      commune,
      locality,
      shippingAddress,
      titleCode,
      visibleInAddressBook,
      reference,
      title: '00',
      firstName: '00',
      lastName: '00',
      town: '00',
      postalCode: '00',
    };
  }
}
