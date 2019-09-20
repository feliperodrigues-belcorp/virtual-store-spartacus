import { Component, Input, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AuthService,
  GlobalMessageService,
  I18nTestingModule,
  RoutingService,
  UserService,
  UserToken,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { ICON_TYPE } from '../../../../../cms-components/misc/index';
import { ModalService } from '../../../../../shared/components/modal/index';
import { CloseAccountModalComponent } from './close-account-modal.component';

import createSpy = jasmine.createSpy;

class MockGlobalMessageService {
  add = createSpy();
}

class MockModalService {
  dismissActiveModal(): void {}
}

class MockUserService {
  remove(_userId: string): void {}
  getRemoveUserResultSuccess(): Observable<Boolean> {
    return of();
  }

  getRemoveUserResultError(): Observable<Boolean> {
    return of();
  }

  getRemoveUserResultLoading(): Observable<Boolean> {
    return of(false);
  }

  resetRemoveUserProcessState(): void {}
}

class MockAuthService {
  getUserToken(): Observable<UserToken> {
    return of();
  }
}

class MockRoutingService {
  go() {}
}

@Component({
  selector: 'cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}

@Component({
  selector: 'cx-spinner',
  template: '',
})
class MockCxSpinnerComponent {}

describe('CloseAccountModalComponent', () => {
  let component: CloseAccountModalComponent;
  let fixture: ComponentFixture<CloseAccountModalComponent>;
  let userService: UserService;
  let routingService: RoutingService;
  let globalMessageService: any;
  let mockModalService: MockModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        CloseAccountModalComponent,
        MockCxSpinnerComponent,
        MockCxIconComponent,
      ],
      providers: [
        {
          provide: UserService,
          useClass: MockUserService,
        },
        {
          provide: GlobalMessageService,
          useClass: MockGlobalMessageService,
        },
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: ModalService,
          useClass: MockModalService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseAccountModalComponent);
    component = fixture.componentInstance;

    userService = TestBed.get(UserService as Type<UserService>);
    routingService = TestBed.get(RoutingService as Type<RoutingService>);
    globalMessageService = TestBed.get(GlobalMessageService as Type<
      GlobalMessageService
    >);
    mockModalService = TestBed.get(ModalService as Type<ModalService>);

    spyOn(routingService, 'go').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close account', () => {
    spyOn(userService, 'remove');

    component.closeAccount();

    expect(userService.remove).toHaveBeenCalled();
  });

  it('should navigate away and dismiss modal when account is closed', () => {
    spyOn(userService, 'getRemoveUserResultSuccess').and.returnValue(of(true));
    spyOn(component, 'onSuccess').and.callThrough();
    spyOn(mockModalService, 'dismissActiveModal').and.callThrough();

    component.ngOnInit();

    expect(component.onSuccess).toHaveBeenCalledWith(true);
    expect(globalMessageService.add).toHaveBeenCalled();
    expect(routingService.go).toHaveBeenCalledWith({ cxRoute: 'home' });
    expect(mockModalService.dismissActiveModal).toHaveBeenCalled();
  });

  it('should dismiss modal when account failed to close', () => {
    spyOn(userService, 'getRemoveUserResultError').and.returnValue(of(true));
    spyOn(component, 'onError').and.callThrough();
    spyOn(mockModalService, 'dismissActiveModal').and.callThrough();

    component.ngOnInit();

    expect(component.onError).toHaveBeenCalledWith(true);
    expect(globalMessageService.add).toHaveBeenCalled();
    expect(mockModalService.dismissActiveModal).toHaveBeenCalled();
  });
});
