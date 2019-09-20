import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UrlModule } from '@spartacus/core';
import { LoginFormModule } from './login-form/login-form.module';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { RegisterComponentModule } from './register/register.module';

@NgModule({
  imports: [
    CommonModule,
    LoginModule,
    LoginFormModule,
    LogoutModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    RegisterComponentModule,
  ],
})
export class UserComponentModule {}
