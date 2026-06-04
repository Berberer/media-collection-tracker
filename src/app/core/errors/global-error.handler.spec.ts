import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NotificationService } from '../services/notification.service';
import { BaseError } from './base.error';
import { markAsHandled } from './error.utils';
import { GlobalNgxsErrorHandler } from './global-error.handler';

describe('GlobalNgxsErrorHandler', () => {
  let handler: GlobalNgxsErrorHandler;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(() => {
    notificationService = {
      addError: jest.fn(),
      removeError: jest.fn(),
      errors: signal([]).asReadonly(),
    } as unknown as jest.Mocked<NotificationService>;

    TestBed.configureTestingModule({
      providers: [
        GlobalNgxsErrorHandler,
        { provide: NotificationService, useValue: notificationService },
      ],
    });

    handler = TestBed.inject(GlobalNgxsErrorHandler);
    jest.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally empty
    });
    jest.spyOn(console, 'debug').mockImplementation(() => {
      // Intentionally empty
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log all errors', () => {
    const error = new Error('Test error');
    handler.handleError(error);
    expect(console.error).toHaveBeenCalled();
  });

  it('should add BaseError to notification service', () => {
    class TestError extends BaseError {
      constructor() {
        super('Test error', 'test-code', ['test']);
      }
    }
    const error = new TestError();
    handler.handleError(error);
    expect(notificationService.addError).toHaveBeenCalledWith(error);
  });

  it('should add regular Error to notification service', () => {
    const error = new Error('Test error');
    handler.handleError(error);
    expect(notificationService.addError).toHaveBeenCalledWith(error);
  });

  it('should not add error to notification service if it is marked as handled and log at debug level', () => {
    const error = new Error('Test error');
    markAsHandled(error);
    handler.handleError(error);
    expect(notificationService.addError).not.toHaveBeenCalled();
    // eslint-disable-next-line no-console
    expect(console.debug).toHaveBeenCalledWith('Error already handled:', error);
  });

  it('should not add BaseError to notification service if it is marked as handled', () => {
    class TestError extends BaseError {
      constructor() {
        super('Test error', 'test-code', ['test']);
      }
    }
    const error = new TestError();
    markAsHandled(error);
    handler.handleError(error);
    expect(notificationService.addError).not.toHaveBeenCalled();
  });
});
