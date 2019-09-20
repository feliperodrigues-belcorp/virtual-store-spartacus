import { Component, OnInit } from '@angular/core';
import { AuthService, User, UserService } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'cx-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  user$: Observable<User>;

  constructor(private auth: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.user$ = this.auth.getUserToken().pipe(
      switchMap(token => {
        if (token && !!token.access_token) {
          return this.userService.get();
        } else {
          return of(undefined);
        }
      })
    );
  }
}
