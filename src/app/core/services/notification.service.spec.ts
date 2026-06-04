import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and remove errors', () => {
    const error = new Error('Test error');
    service.addError(error);
    expect(service.errors()).toContain(error);

    service.removeError(error);
    expect(service.errors()).not.toContain(error);
  });

  it('should automatically remove errors after 5 seconds', () => {
    const error = new Error('Test error');
    service.addError(error);
    expect(service.errors()).toContain(error);

    jest.advanceTimersByTime(5000);
    expect(service.errors()).not.toContain(error);
  });

  it('should not throw or re-introduce state if removed before timeout', () => {
    const error = new Error('Test error');
    service.addError(error);
    expect(service.errors()).toContain(error);

    service.removeError(error);
    expect(service.errors()).not.toContain(error);

    jest.advanceTimersByTime(5000);
    expect(service.errors()).not.toContain(error);
  });

  it('should handle duplicate-add by refreshing timer and not adding twice', () => {
    const error = new Error('Test error');
    service.addError(error);
    expect(service.errors().length).toBe(1);

    jest.advanceTimersByTime(3000);
    service.addError(error);
    expect(service.errors().length).toBe(1);

    // After 3 more seconds (total 6), it should still be there because timer was refreshed
    jest.advanceTimersByTime(3000);
    expect(service.errors()).toContain(error);

    // After 2 more seconds (total 8 from first add, 5 from second), it should be gone
    jest.advanceTimersByTime(2000);
    expect(service.errors()).not.toContain(error);
  });

  it('should handle immediate duplicate-add', () => {
    const error = new Error('Test error');
    service.addError(error);
    service.addError(error);
    expect(service.errors().length).toBe(1);
  });

  it('should enforce max error limit of 5', () => {
    const errors = Array.from({ length: 6 }, (_, i) => new Error(`Error ${i}`));
    errors.forEach((error) => service.addError(error));
    expect(service.errors().length).toBe(5);
    expect(service.errors()).not.toContain(errors[0]);
    expect(service.errors()).toContain(errors[5]);
  });

  it('should clean up timers on destroy', () => {
    const error = new Error('Test error');
    service.addError(error);
    expect(service.errors()).toContain(error);

    // Verify timer exists before destroy
    // @ts-expect-error - accessing private property for testing
    expect(service.timers.size).toBe(1);

    service.ngOnDestroy();

    // Verify timers are cleared immediately after destroy
    // @ts-expect-error - accessing private property for testing
    expect(service.timers.size).toBe(0);

    // Advance time past the auto-remove timeout - error should still be there
    jest.advanceTimersByTime(5000);
    expect(service.errors()).toContain(error);
  });
});
