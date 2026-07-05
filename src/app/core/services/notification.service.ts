import { OnDestroy, Service, signal } from '@angular/core';

/**
 * Service for managing global notifications/errors.
 */
@Service()
export class NotificationService implements OnDestroy {
  private readonly errorsSignal = signal<unknown[]>([]);
  private readonly timers = new Map<unknown, ReturnType<typeof setTimeout>>();
  private readonly maxErrors = 5;

  /**
   * Read-only signal of current errors.
   */
  readonly errors = this.errorsSignal.asReadonly();

  ngOnDestroy(): void {
    // Clear all timers to prevent memory leaks
    for (const timerId of this.timers.values()) {
      clearTimeout(timerId);
    }
    this.timers.clear();
  }

  /**
   * Add an error to the notification list.
   * @param error The error to add.
   */
  addError(error: unknown): void {
    // If the error is already being displayed, just restart its timer
    if (this.timers.has(error)) {
      clearTimeout(this.timers.get(error));
    } else {
      // Enforce max limit by removing oldest error if needed
      const currentErrors = this.errorsSignal();
      if (currentErrors.length >= this.maxErrors) {
        const oldestError = currentErrors[0];
        this.removeError(oldestError);
      }
      this.errorsSignal.update((errors) => [...errors, error]);
    }

    const timerId = setTimeout(() => {
      this.removeError(error);
    }, 5000);
    this.timers.set(error, timerId);
  }

  /**
   * Remove an error from the notification list.
   * @param error The error to remove.
   */
  removeError(error: unknown): void {
    const timerId = this.timers.get(error);
    if (timerId) {
      clearTimeout(timerId);
      this.timers.delete(error);
    }
    this.errorsSignal.update((errors) => errors.filter((e) => e !== error));
  }
}
