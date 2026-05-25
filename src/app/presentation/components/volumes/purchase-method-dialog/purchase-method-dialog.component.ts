import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';

import { ModalDialogComponent } from '../../core/modal-dialog/modal-dialog.component';

enum PurchaseMethod {
  DIRECT = 'direct',
  DELIVERY = 'delivery',
}

interface PurchaseMethodFormData {
  readonly purchaseMethod: PurchaseMethod;
  readonly purchaseDate: Date;
}

@Component({
  selector: 'app-purchase-method-dialog',
  templateUrl: './purchase-method-dialog.component.html',
  styleUrl: './purchase-method-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, ModalDialogComponent, FormsModule, FormField],
})
export class PurchaseMethodDialogComponent {
  readonly open = input.required<boolean>();
  readonly loading = input.required<boolean>();

  readonly confirmed = output<{ purchaseDate: Date; inDelivery: boolean }>();
  readonly cancelled = output<void>();

  readonly purchaseMethodFormData = signal<PurchaseMethodFormData>({
    purchaseMethod: PurchaseMethod.DIRECT,
    purchaseDate: new Date(),
  });
  readonly purchaseMethodForm = form(this.purchaseMethodFormData, (schemaPath) => {
    required(schemaPath.purchaseMethod);
    required(schemaPath.purchaseDate);
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        this.purchaseMethodFormData.set({
          purchaseMethod: PurchaseMethod.DIRECT,
          purchaseDate: new Date(),
        });
      }
    });
  }

  onConfirm(): void {
    if (this.purchaseMethodForm().valid()) {
      this.confirmed.emit({
        purchaseDate: this.purchaseMethodFormData().purchaseDate,
        inDelivery: this.purchaseMethodFormData().purchaseMethod === PurchaseMethod.DELIVERY,
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
