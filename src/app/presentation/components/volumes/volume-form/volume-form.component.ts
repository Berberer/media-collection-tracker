import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import {
  ChildFieldContext,
  form,
  FormField,
  required,
  validate,
  min,
  disabled,
} from '@angular/forms/signals';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SeriesModel } from '../../../../features/series/model/series.model';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';
import { CreateVolumeModel } from '../../../../features/volumes/model/create.volume.model';
import { UpdateVolumeModel } from '../../../../features/volumes/model/update.volume.model';
import { TagAssignmentFormControlComponent } from '../../tags/tag-assignment-form-control/tag-assignment-form-control.component';
import { DropdownControlComponent } from '../../core/dropdown-control/dropdown-control.component';

interface VolumeFormData {
  series: SeriesModel | null;
  sequenceNumber: number;
  shoppingLink: string;
  releaseDate: Date | null;
  inDelivery: boolean;
  purchaseDate: Date | null;
  volumeTags: VolumeTagModel[];
}

@Component({
  selector: 'app-volume-form',
  templateUrl: './volume-form.component.html',
  styleUrl: './volume-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    TranslatePipe,
    FormsModule,
    TagAssignmentFormControlComponent,
    DropdownControlComponent,
    NgClass,
  ],
})
export class VolumeFormComponent {
  readonly volume = input.required<Partial<CreateVolumeModel> | UpdateVolumeModel>();
  readonly allSeries = input.required<readonly SeriesModel[]>();
  readonly allVolumeTags = input.required<readonly VolumeTagModel[]>();

  readonly saved = output<CreateVolumeModel | UpdateVolumeModel>();

  private readonly lastValidVolume = signal<Partial<CreateVolumeModel> | UpdateVolumeModel | null>(
    null,
  );

  readonly volumeFormData = signal<VolumeFormData>({
    series: null,
    sequenceNumber: 1,
    shoppingLink: '',
    releaseDate: null,
    inDelivery: false,
    purchaseDate: null,
    volumeTags: [],
  });

  readonly volumeForm = form(this.volumeFormData, (schemaPath) => {
    required(schemaPath.series);
    required(schemaPath.sequenceNumber);
    required(schemaPath.purchaseDate, {
      when: (context) => context.valueOf(schemaPath.inDelivery),
    });

    min(schemaPath.sequenceNumber, 1);
    validate(schemaPath.shoppingLink, VolumeFormComponent.validateShoppingLinkUrl);

    disabled(schemaPath.series, () => this.lastValidVolume()?.series !== undefined);
    disabled(schemaPath.sequenceNumber, () => this.lastValidVolume() instanceof UpdateVolumeModel);
  });

  constructor() {
    effect(() => {
      const v = this.volume();

      if (v) {
        this.lastValidVolume.set(v);
        this.volumeFormData.set({
          series: v.series?.clone() ?? null,
          sequenceNumber: v.sequenceNumber ?? 1,
          shoppingLink: v.shoppingLink ?? '',
          releaseDate: v.releaseDate ?? null,
          inDelivery: v.inDelivery ?? false,
          purchaseDate: v.purchaseDate ?? null,
          volumeTags: v.volumeTags?.map((t) => t.clone()) ?? [],
        });
      }
    });
  }

  onSave(): void {
    if (this.volumeForm().valid()) {
      const volume = this.volume();

      if (volume instanceof UpdateVolumeModel) {
        this.saved.emit(
          new UpdateVolumeModel({
            ...this.volumeFormData(),
            id: volume.id,
            series: this.volumeFormData().series!,
            shoppingLink: this.volumeFormData().shoppingLink.trim() ?? null,
          }),
        );
      } else {
        this.saved.emit(
          new CreateVolumeModel({
            ...this.volumeFormData(),
            series: this.volumeFormData().series!,
            shoppingLink: this.volumeFormData().shoppingLink.trim() ?? null,
          }),
        );
      }
    }
  }

  private static validateShoppingLinkUrl({
    value,
  }: ChildFieldContext<string | null>): { kind: string } | null {
    const shoppingLinkInput = value()?.trim();

    if (!shoppingLinkInput) {
      return null;
    }

    return /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$/.test(
      shoppingLinkInput,
    )
      ? null
      : { kind: 'invalidUrl' };
  }
}
