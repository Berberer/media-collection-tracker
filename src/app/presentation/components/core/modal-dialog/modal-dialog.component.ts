import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';

import { BaseError } from '../../../../core/errors';
import { ErrorTranslatePipe } from '../../../../core/pipes/error-translate.pipe';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrl: './modal-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle, ErrorTranslatePipe, NgIcon],
  providers: [provideIcons({ heroXMark })],
})
export class ModalDialogComponent {
  readonly open = input.required<boolean>();
  readonly loading = input.required<boolean>();
  readonly errors = input<BaseError[]>([]);

  readonly closed = output<void>();
  readonly errorDismissed = output<BaseError>();

  readonly modalContent = viewChild<ElementRef<HTMLElement>>('modalContent');
  readonly contentWidth = signal('unset');
  readonly contentHeight = signal('unset');

  readonly backdropClicked = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.backdropClicked.set(false);
        this.updateContentDimensions();
      }
    });
  }

  private updateContentDimensions(): void {
    if (this.modalContent()) {
      const contentElement = this.modalContent()!.nativeElement;
      this.contentWidth.set(`${contentElement.clientWidth}px`);
      this.contentHeight.set(`${contentElement.clientHeight}px`);
    }
  }

  onClose(): void {
    this.backdropClicked.set(true);
    this.closed.emit();
  }
}
