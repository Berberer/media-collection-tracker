import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-confirmation-prompt',
  templateUrl: './confirmation-prompt.component.html',
  styleUrl: './confirmation-prompt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, ModalDialogComponent],
})
export class ConfirmationPromptComponent {
  readonly open = input.required<boolean>();
  readonly loading = input.required<boolean>();
  readonly prompt = input.required<string>();

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
