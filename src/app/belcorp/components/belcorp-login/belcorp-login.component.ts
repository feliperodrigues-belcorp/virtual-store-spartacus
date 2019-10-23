import { Component } from '@angular/core';
import { AuthService, UserService } from '@spartacus/core';
import { LoginComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-belcorp-login',
  templateUrl: './belcorp-login.component.html',
  styleUrls: ['./belcorp-login.component.scss']
})
export class BelcorpLoginComponent extends LoginComponent {

  constructor(
    auth: AuthService,
    userService: UserService
  ) {
    super(auth, userService)
  }



}
