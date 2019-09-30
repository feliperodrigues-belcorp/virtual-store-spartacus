import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthRedirectService, AuthService, GlobalMessageService, UserService } from '@spartacus/core';
import { RegisterComponent } from '@spartacus/storefront';
import { BelcorpUserSignUp } from '../../core/src/model/belcorp.misc.model';

@Component({
  selector: 'app-belcorp-register',
  templateUrl: './belcorp-register.component.html',
  styleUrls: ['./belcorp-register.component.scss'],
})
export class BelcorpRegisterComponent extends RegisterComponent {
  constructor(
    auth: AuthService,
    authRedirectService: AuthRedirectService,
    userService: UserService,
    globalMessageService: GlobalMessageService,
    fb: FormBuilder
  ) {
    super(auth, authRedirectService, userService, globalMessageService, fb);
  }

  submit(): void {
    this.userService.register(this.collectDataFromRegisterForm(this.userRegistrationForm.value));
  }

  // DATA TO BE SEND
  collectDataFromRegisterForm(formData: any): BelcorpUserSignUp {
    const { firstName, lastName, email, password, titleCode, termsandconditions } = formData;

    return {
      firstName,
      lastName,
      uid: email.toLowerCase(),
      password,
      titleCode,
      termsandconditions,
    };
  }
}
