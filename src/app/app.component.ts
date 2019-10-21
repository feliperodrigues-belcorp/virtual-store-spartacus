import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SiteContextConfig } from '@spartacus/core';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'mystore';
  public cookieValue;

  constructor(
    private router: Router,
    private siteContextConfig: SiteContextConfig,
    private cookieService: CookieService
  ) {
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      console.log(event.url);
    });
  }

  ngOnInit() {
    this.cookieValue = this.cookieService.get('consultant_site');
    if (this.cookieValue.length > 0) {
      this.siteContextConfig.context.urlParameters[3] = 'replicatedSite';
      this.siteContextConfig.context[this.siteContextConfig.context.urlParameters[3]] = [this.cookieValue];
      this.router.navigate([`/`]);
    } else {

     //make to back end side
     this.router.navigate([`/consultant/search`]);
    }
  }
}
