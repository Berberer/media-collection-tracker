import { Injectable } from '@angular/core';
import { NgxsUnhandledErrorHandler } from '@ngxs/store';
import { logError } from './error.utils';

@Injectable({ providedIn: 'root' })
export class GlobalNgxsErrorHandler extends NgxsUnhandledErrorHandler {
  override handleError(error: unknown): void {
    logError(error);
  }
}
