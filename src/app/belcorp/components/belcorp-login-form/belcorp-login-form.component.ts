import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthRedirectService, AuthService, GlobalMessageService, WindowRef } from '@spartacus/core';
import { LoginFormComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-login-form',
  templateUrl: './belcorp-login-form.component.html',
  styleUrls: ['./belcorp-login-form.component.scss'],
})
export class BelcorpLoginFormComponent extends LoginFormComponent {
  loginAsGuest = false;
  constructor(
    auth: AuthService,
    globalMessageService: GlobalMessageService,
    fb: FormBuilder,
    authRedirectService: AuthRedirectService,
    winRef: WindowRef
  ) {
    super(auth, globalMessageService, fb, authRedirectService, winRef);
  }
}
