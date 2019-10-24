import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SiteContextConfig } from '@spartacus/core';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs/operators';
import { SearchConsultantService } from '../app/belcorp/core/src/services/belcorp-search-consultant.service';

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
    private cookieService: CookieService,
    private searchConsultantService: SearchConsultantService
  ) {
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      console.log(event.url);
    });
  }

  ngOnInit() {
    this.cookieValue = this.cookieService.get('consultant_site');
    this.searchConsultantService.checkConsultantUrl(window.location.href).subscribe(data => {
      if (this.cookieValue.length > 0 && this.cookieValue === data.urlStore) {
        this.siteContextConfig.context.urlParameters[3] = 'replicatedSite';
        this.siteContextConfig.context[this.siteContextConfig.context.urlParameters[3]] = [this.cookieValue];
        this.router.navigate([`/`]);
      } else {
        this.cookieService.set('consultant_site', `${data.urlStore}`);
        this.cookieService.set('consultant_id', `${data.consultantId}`);
        this.cookieService.set('country_iso', `${data.country}`);
        this.siteContextConfig.context.urlParameters[3] = 'replicatedSite';
        this.siteContextConfig.context[this.siteContextConfig.context.urlParameters[3]] = [`${data.urlStore}`];
        this.router.navigate([`/`]);
      }
    });
  }
}
