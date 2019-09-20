import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthRedirectService } from './auth-redirect.service';
import { RoutingService } from '../../routing/facade/routing.service';
import { Router } from '@angular/router';

class MockRoutingService {
  go = jasmine.createSpy('go');
  goByUrl = jasmine.createSpy('goByUrl');
}

describe('AuthRedirectService', () => {
  let service: AuthRedirectService;
  let routingService: RoutingService;
  let router: Router;

  beforeEach(() => {
    const mockRouter = {
      url: '',
      getCurrentNavigation: () => {},
      serializeUrl: x => x,
    };

    TestBed.configureTestingModule({
      providers: [
        AuthRedirectService,
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [RouterTestingModule],
    });
    service = TestBed.get(AuthRedirectService as Type<AuthRedirectService>);
    routingService = TestBed.get(RoutingService as Type<RoutingService>);
    router = TestBed.get(Router as Type<Router>);
  });

  describe('redirect', () => {
    it('should redirect to the home page', () => {
      service.redirect();
      expect(routingService.go).toHaveBeenCalledWith('/');
    });

    describe(', when just opened url with NotAuthGuard,', () => {
      beforeEach(() => {
        router['url' as any] = '/test';
        spyOn(router, 'getCurrentNavigation').and.returnValue({
          id: 1,
          finalUrl: '/login',
        });
        service.reportNotAuthGuard();

        service.redirect();
      });

      it('should redirect to the previous url', () => {
        expect(routingService.goByUrl).toHaveBeenCalledWith('/test');
      });
    });

    describe(', when just opened sequentially two urls with NotAuthGuard,', () => {
      beforeEach(() => {
        spyOn(router, 'getCurrentNavigation').and.returnValues(
          { id: 1, finalUrl: '/login' },
          { id: 2, finalUrl: '/register' }
        );

        router['url' as any] = '/test';
        service.reportNotAuthGuard();
        router['url' as any] = '/login';
        service.reportNotAuthGuard();

        service.redirect();
      });

      it('should redirect to the very first url', () => {
        expect(routingService.goByUrl).toHaveBeenCalledWith('/test');
      });
    });

    describe(', when AuthGuard just blocked url and redirected to url with NotAuthGuard,', () => {
      beforeEach(() => {
        spyOn(router, 'getCurrentNavigation').and.returnValues(
          { id: 1, finalUrl: '/my-account' },
          { id: 2, finalUrl: '/register' }
        );
        router['url' as any] = '/test';
        service.reportAuthGuard();
        service.reportNotAuthGuard();

        service.redirect();
      });

      it('should redirect to the url blocked by AuthGuard', () => {
        expect(routingService.goByUrl).toHaveBeenCalledWith('/my-account');
      });
    });

    describe(', when AuthGuard blocked url, then opened manually different url, and then opened url with NotAuthGuard,', () => {
      beforeEach(() => {
        spyOn(router, 'getCurrentNavigation').and.returnValues(
          { id: 1, finalUrl: '/my-account' },
          { id: 3, finalUrl: '/register' } // id 3 matters here
        );

        router['url' as any] = '/test';
        service.reportAuthGuard();
        router['url' as any] = '/test2';
        service.reportNotAuthGuard();

        service.redirect();
      });

      it('should redirect to the previous url', () => {
        expect(routingService.goByUrl).toHaveBeenCalledWith('/test2');
      });
    });
  });
});
