import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthRedirectService, AuthService, GlobalMessageService, WindowRef } from '@spartacus/core';
import { CheckoutConfigService, LoginFormComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-login-form',
  templateUrl: './belcorp-login-form.component.html',
  styleUrls: ['./belcorp-login-form.component.scss'],
})
export class BelcorpLoginFormComponent extends LoginFormComponent {
  loginAsGuest = false;
  hide = true;
  constructor(
    auth: AuthService,
    globalMessageService: GlobalMessageService,
    fb: FormBuilder,
    authRedirectService: AuthRedirectService,
    winRef: WindowRef,
    activatedRoute: ActivatedRoute,
    checkoutConfigService: CheckoutConfigService
  ) {
    super(auth, globalMessageService, fb, authRedirectService, winRef, activatedRoute, checkoutConfigService);
  }
}
