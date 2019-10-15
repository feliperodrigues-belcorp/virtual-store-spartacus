import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRedirectService, AuthService, GlobalMessageService, UserService } from '@spartacus/core';
import { RegisterComponent } from '@spartacus/storefront';
import { BelcorpUserSignUp } from '../../core/src/model/belcorp.misc.model';
import { CustomFormValidators } from '../../utils/validators/custom-form-validators';

@Component({
  selector: 'app-belcorp-register',
  templateUrl: './belcorp-register.component.html',
  styleUrls: ['./belcorp-register.component.scss'],
})
export class BelcorpRegisterComponent extends RegisterComponent {
  userRegistrationForm: FormGroup = this.fb.group(
    {
      firstName: ['', [Validators.required, CustomFormValidators.nameValidator]],
      lastName: ['', [Validators.required, CustomFormValidators.nameValidator]],
      phone: ['', Validators.pattern('^[0-9]+$')],
      email: ['', [Validators.required, CustomFormValidators.emailValidator]],
      password: [
        '',
        [Validators.required, CustomFormValidators.passwordValidator],
      ],
      passwordconf: ['', Validators.required],
      newsletter: [false],
      terms: [false, Validators.requiredTrue],
    },
    { validator: CustomFormValidators.matchPassword }
  );


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
    const { firstName, lastName, email, password, titleCode, phone, terms } = formData;

    return {
      firstName,
      lastName,
      uid: email.toLowerCase(),
      password,
      titleCode,
      terms,
      phone
    };
  }
}
