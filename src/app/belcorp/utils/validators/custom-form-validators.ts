
import { AbstractControl, ValidationErrors } from '@angular/forms';

export const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // tslint:disable-line

export const PASSWORD_PATTERN = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^*()_\-+{};:.,]).{6,}$/;

export class CustomFormValidators {
  static emailDomainValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const email = control.value as string;

    return email.match('[.][a-zA-Z]+$') ? null : { InvalidEmail: true };
  }

  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value as string;

    return email.match(EMAIL_PATTERN) ? null : { InvalidEmail: true };
  }

  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value as string;
    return password.match(PASSWORD_PATTERN) ? null : { InvalidPassword: true };
  }

  static matchPassword(control: AbstractControl): { NotEqual: boolean } {
    if (control.get('password').value !== control.get('passwordconf').value) {
      return { NotEqual: true };
    }
    return null;
  }
}

