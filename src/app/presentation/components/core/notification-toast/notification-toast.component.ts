import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';

import { ErrorTranslatePipe } from '../../../../core/pipes/error-translate.pipe';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.component.html',
  styleUrl: './notification-toast.component.css',
  standalone: true,
  imports: [NgIcon, ErrorTranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ heroXMark })],
})
export class NotificationToastComponent {
  private readonly notificationService = inject(NotificationService);
  readonly errors = this.notificationService.errors;

  onDismiss(error: unknown): void {
    this.notificationService.removeError(error);
  }
}
