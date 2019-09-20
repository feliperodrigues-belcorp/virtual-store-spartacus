import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Address, UserAddressService } from '@spartacus/core';

@Component({
  selector: 'cx-address-card',
  templateUrl: './address-card.component.html',
})
export class AddressCardComponent {
  editMode: boolean;
  isDefault: boolean;

  @Input() address: Address;

  @Output() editEvent = new EventEmitter<any>();

  constructor(private userAddressService: UserAddressService) {}

  openEditFormEvent(): void {
    this.editEvent.emit();
  }

  cancelEdit(): void {
    this.editMode = false;
  }

  setEditMode(): void {
    this.editMode = true;
  }

  setAddressAsDefault(addressId: string): void {
    this.userAddressService.setAddressAsDefault(addressId);
  }

  deleteAddress(addressId: string): void {
    this.userAddressService.deleteUserAddress(addressId);
  }
}
