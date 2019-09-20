import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

import {
  Address,
  AddressValidation,
  CheckoutDeliveryService,
  Country,
  GlobalMessageService,
  GlobalMessageType,
  Region,
  Title,
  UserAddressService,
  UserService,
} from '@spartacus/core';
import { SuggestedAddressDialogComponent } from './suggested-addresses-dialog/suggested-addresses-dialog.component';
import {
  ModalRef,
  ModalService,
} from '../../../../../shared/components/modal/index';

@Component({
  selector: 'cx-address-form',
  templateUrl: './address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent implements OnInit, OnDestroy {
  countries$: Observable<Country[]>;
  titles$: Observable<Title[]>;
  regions$: Observable<Region[]>;
  selectedCountry$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Input()
  addressData: Address;

  @Input()
  actionBtnLabel: string;

  @Input()
  cancelBtnLabel: string;

  @Input()
  setAsDefaultField: boolean;

  @Input()
  showTitleCode: boolean;

  @Input()
  showCancelBtn = true;

  @Output()
  submitAddress = new EventEmitter<any>();

  @Output()
  backToAddress = new EventEmitter<any>();

  addressVerifySub: Subscription;
  suggestedAddressModalRef: ModalRef;

  address: FormGroup = this.fb.group({
    defaultAddress: [false],
    titleCode: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    town: ['', Validators.required],
    region: this.fb.group({
      isocode: [null, Validators.required],
    }),
    country: this.fb.group({
      isocode: [null, Validators.required],
    }),
    postalCode: ['', Validators.required],
    phone: '',
  });

  constructor(
    private fb: FormBuilder,
    protected checkoutDeliveryService: CheckoutDeliveryService,
    protected userService: UserService,
    protected userAddressService: UserAddressService,
    protected globalMessageService: GlobalMessageService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    // Fetching countries
    this.countries$ = this.userAddressService.getDeliveryCountries().pipe(
      tap(countries => {
        if (Object.keys(countries).length === 0) {
          this.userAddressService.loadDeliveryCountries();
        }
      })
    );

    // Fetching titles
    this.titles$ = this.userService.getTitles().pipe(
      tap(titles => {
        if (Object.keys(titles).length === 0) {
          this.userService.loadTitles();
        }
      }),
      map(titles => {
        const noneTitle = { code: '', name: 'Title' };
        return [noneTitle, ...titles];
      })
    );

    // Fetching regions
    this.regions$ = this.selectedCountry$.pipe(
      switchMap(country => this.userAddressService.getRegions(country)),
      tap(regions => {
        const regionControl = this.address.get('region.isocode');
        if (regions && regions.length > 0) {
          regionControl.enable();
        } else {
          regionControl.disable();
        }
      })
    );

    // verify the new added address
    this.addressVerifySub = this.checkoutDeliveryService
      .getAddressVerificationResults()
      .subscribe((results: AddressValidation) => {
        if (results === 'FAIL') {
          this.checkoutDeliveryService.clearAddressVerificationResults();
        } else if (results.decision === 'ACCEPT') {
          this.submitAddress.emit(this.address.value);
        } else if (results.decision === 'REJECT') {
          // TODO: Workaround: allow server for decide is titleCode mandatory (if yes, provide personalized message)
          if (
            results.errors.errors.some(error => error.subject === 'titleCode')
          ) {
            this.globalMessageService.add(
              { key: 'addressForm.titleRequired' },
              GlobalMessageType.MSG_TYPE_ERROR
            );
          } else {
            this.globalMessageService.add(
              { key: 'addressForm.invalidAddress' },
              GlobalMessageType.MSG_TYPE_ERROR
            );
          }
          this.checkoutDeliveryService.clearAddressVerificationResults();
        } else if (results.decision === 'REVIEW') {
          this.openSuggestedAddress(results);
        }
      });

    if (this.addressData) {
      this.address.patchValue(this.addressData);

      this.countrySelected(this.addressData.country);
      if (this.addressData.region) {
        this.regionSelected(this.addressData.region);
      }
    }
  }

  titleSelected(title: Title): void {
    this.address['controls'].titleCode.setValue(title.code);
  }

  countrySelected(country: Country): void {
    this.address['controls'].country['controls'].isocode.setValue(
      country.isocode
    );
    this.selectedCountry$.next(country.isocode);
  }

  regionSelected(region: Region): void {
    this.address['controls'].region['controls'].isocode.setValue(
      region.isocode
    );
  }

  toggleDefaultAddress(): void {
    this.address['controls'].defaultAddress.setValue(
      this.address.value.defaultAddress
    );
  }

  back(): void {
    this.backToAddress.emit();
  }

  verifyAddress(): void {
    this.checkoutDeliveryService.verifyAddress(this.address.value);
  }

  openSuggestedAddress(results: AddressValidation): void {
    if (!this.suggestedAddressModalRef) {
      this.suggestedAddressModalRef = this.modalService.open(
        SuggestedAddressDialogComponent,
        { centered: true, size: 'lg' }
      );
      this.suggestedAddressModalRef.componentInstance.enteredAddress = this.address.value;
      this.suggestedAddressModalRef.componentInstance.suggestedAddresses =
        results.suggestedAddresses;
      this.suggestedAddressModalRef.result
        .then(address => {
          this.checkoutDeliveryService.clearAddressVerificationResults();
          if (address) {
            address = Object.assign(
              {
                titleCode: this.address.value.titleCode,
                phone: this.address.value.phone,
                selected: true,
              },
              address
            );
            this.submitAddress.emit(address);
          }
          this.suggestedAddressModalRef = null;
        })
        .catch(() => {
          // this  callback is called when modal is closed with Esc key or clicking backdrop
          this.checkoutDeliveryService.clearAddressVerificationResults();
          const address = Object.assign(
            {
              selected: true,
            },
            this.address.value
          );
          this.submitAddress.emit(address);
          this.suggestedAddressModalRef = null;
        });
    }
  }

  ngOnDestroy() {
    this.checkoutDeliveryService.clearAddressVerificationResults();

    if (this.addressVerifySub) {
      this.addressVerifySub.unsubscribe();
    }
  }
}
