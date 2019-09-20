import { Injector } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CmsPageGuard } from '../../guards/cms-page.guard';
import { PageLayoutComponent } from '../../page/index';

const cmsRoute: Route = {
  path: '**',
  canActivate: [CmsPageGuard],
  component: PageLayoutComponent,
};

export function addCmsRoute(injector: Injector) {
  const result = () => {
    const router = injector.get(Router);
    router.config.push(cmsRoute);
  };
  return result;
}
