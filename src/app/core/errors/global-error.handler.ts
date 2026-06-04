import { inject, Injectable } from '@angular/core';
import { NgxsUnhandledErrorHandler } from '@ngxs/store';

import { NotificationService } from '../services/notification.service';
import { isHandled, logError } from './error.utils';

@Injectable({ providedIn: 'root' })
export class GlobalNgxsErrorHandler extends NgxsUnhandledErrorHandler {
  private readonly notificationService = inject(NotificationService);

  override handleError(error: unknown): void {
    if (isHandled(error)) {
      // eslint-disable-next-line no-console
      console.debug('Error already handled:', error);
      return;
    }

    logError(error);
    this.notificationService.addError(error);
  }
}
