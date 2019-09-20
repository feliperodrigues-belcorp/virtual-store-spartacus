import { Injectable } from '@angular/core';
import {
  GlobalMessageService,
  GlobalMessageType,
  WindowRef,
} from '@spartacus/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PWAModuleConfig } from '../pwa.module-config';

@Injectable()
export class AddToHomeScreenService {
  private deferredEvent: any;

  private canPrompt = new BehaviorSubject<boolean>(false);

  canPrompt$: Observable<boolean> = this.canPrompt.asObservable();

  constructor(
    private config: PWAModuleConfig,
    private globalMessageService: GlobalMessageService,
    private winRef: WindowRef
  ) {
    if (this.config.pwa.addToHomeScreen) {
      this.init();
    }
  }

  init() {
    if (this.winRef.nativeWindow) {
      this.winRef.nativeWindow.addEventListener(
        'beforeinstallprompt',
        event => {
          event.preventDefault();
          this.deferredEvent = event;
          this.enableAddToHomeScreen();
        }
      );

      this.winRef.nativeWindow.addEventListener('appinstalled', () => {
        this.globalMessageService.add(
          { key: 'pwa.addedToHomeScreen' },
          GlobalMessageType.MSG_TYPE_CONFIRMATION
        );

        this.disableAddToHomeScreen();
        this.deferredEvent = null;
      });
    }
  }

  enableAddToHomeScreen(): void {
    this.canPrompt.next(true);
  }

  disableAddToHomeScreen(): void {
    this.canPrompt.next(false);
  }

  firePrompt(): void {
    if (this.deferredEvent) {
      this.deferredEvent.prompt();
    }
  }
}
