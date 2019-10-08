import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoutingService, UserService } from '@spartacus/core';
import { ForgotPasswordComponent } from '@spartacus/storefront';


@Component({
  selector: 'app-belcorp-password',
  templateUrl: './belcorp-password.component.html',
  styleUrls: ['./belcorp-password.component.scss']
})

export class BelcorpPasswordComponent extends ForgotPasswordComponent {
  form: FormGroup;
  submited = false;
  constructor(
    fb: FormBuilder,
    userService: UserService,
    routingService: RoutingService
  ) {

    super(fb, userService, routingService);
  }


}

