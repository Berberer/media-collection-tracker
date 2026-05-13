import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormField, validate } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { SeriesMediaTypes } from '../../../../features/series/model/media-type.model';
import { CreateSeriesModel } from '../../../../features/series/model/create.series.model';
import { UpdateSeriesModel } from '../../../../features/series/model/update.series.model';
import { SeriesTagModel } from '../../../../features/tags/model/series-tag.model';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';
import { TagAssignmentFormControlComponent } from '../../tags/tag-assignment-form-control/tag-assignment-form-control.component';
import { MediaTypeBadgeComponent } from '../../core/media-type-badge/media-type-badge.component';
import { DropdownControlComponent } from '../../core/dropdown-control/dropdown-control.component';
import { NgClass } from '@angular/common';
import { CreateSeriesVolumeModel } from '../../../../features/series/model/create.series-volume.model';

interface SeriesFormData {
  name: string;
  singleVolume: boolean;
  completed: boolean;
  mediaType: SeriesMediaTypes.SeriesMediaType;
  seriesTags: SeriesTagModel[];
  volumeShoppingLink: string;
  volumeReleaseDate: Date | null;
  volumeInDelivery: boolean;
  volumePurchaseDate: Date | null;
  volumeTags: VolumeTagModel[];
}

@Component({
  selector: 'app-series-form',
  templateUrl: './series-form.component.html',
  styleUrl: './series-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    TranslatePipe,
    FormsModule,
    MediaTypeBadgeComponent,
    TagAssignmentFormControlComponent,
    DropdownControlComponent,
    NgClass,
  ],
})
export class SeriesFormComponent {
  readonly series = input.required<CreateSeriesModel | UpdateSeriesModel>();
  readonly allSeriesTags = input.required<readonly SeriesTagModel[]>();
  readonly allVolumeTags = input.required<readonly VolumeTagModel[]>();

  readonly saved = output<CreateSeriesModel | UpdateSeriesModel>();

  readonly isCreationMode = signal(false);
  readonly showVolumeFields = computed(
    () => this.isCreationMode() && this.seriesFormData().singleVolume,
  );

  readonly seriesFormData = signal<SeriesFormData>({
    name: '',
    singleVolume: false,
    completed: false,
    mediaType: SeriesMediaTypes.SeriesMediaType.BOOK,
    seriesTags: [],
    volumeShoppingLink: '',
    volumeReleaseDate: null,
    volumeInDelivery: false,
    volumePurchaseDate: null,
    volumeTags: [],
  });
  readonly seriesForm = form(this.seriesFormData, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.mediaType);

    // Volume fields validation (only for creation mode with singleVolume)
    if (this.showVolumeFields()) {
      if (this.seriesFormData().completed) {
        required(schemaPath.volumePurchaseDate);
      }

      validate(schemaPath.volumeShoppingLink, SeriesFormComponent.validateShoppingLinkUrl);
      validate(schemaPath.volumePurchaseDate, ({ value }) => {
        if (
          (this.seriesFormData().completed || this.seriesFormData().volumeInDelivery) &&
          !value()
        ) {
          return { kind: 'requiredField' };
        }
        return null;
      });
    }
  });

  readonly mediaTypeValues = [
    SeriesMediaTypes.SeriesMediaType.BOOK,
    SeriesMediaTypes.SeriesMediaType.GAME,
    SeriesMediaTypes.SeriesMediaType.MOVIE,
    SeriesMediaTypes.SeriesMediaType.SHOW,
  ];

  constructor() {
    effect(() => {
      const s = this.series();
      this.seriesFormData.set({
        ...s,
        seriesTags: s.seriesTags?.map((t) => t.clone()) ?? [],
        volumeShoppingLink: '',
        volumeReleaseDate: null,
        volumeInDelivery: false,
        volumePurchaseDate: null,
        volumeTags: [],
      });
      this.isCreationMode.set(s instanceof CreateSeriesModel);
    });
  }

  onSave(): void {
    if (this.seriesForm().valid()) {
      const s = this.series();
      const formData = this.seriesFormData();

      if (s instanceof UpdateSeriesModel) {
        this.saved.emit(
          new UpdateSeriesModel({
            id: s.id,
            name: formData.name,
            singleVolume: formData.singleVolume,
            completed: formData.completed,
            mediaType: formData.mediaType,
            seriesTags: formData.seriesTags,
          }),
        );
      } else {
        // For creation mode, include volume data if singleVolume is true
        let volumeModel: CreateSeriesVolumeModel | null = null;

        if (formData.singleVolume) {
          volumeModel = new CreateSeriesVolumeModel({
            sequenceNumber: 1,
            shoppingLink: formData.volumeShoppingLink.trim() ?? null,
            releaseDate: formData.volumeReleaseDate,
            inDelivery: formData.volumeInDelivery,
            purchaseDate: formData.volumePurchaseDate,
            volumeTags: formData.volumeTags,
          });
        }

        const createModel = new CreateSeriesModel({
          name: formData.name,
          singleVolume: formData.singleVolume,
          completed: formData.completed,
          mediaType: formData.mediaType,
          seriesTags: formData.seriesTags,
          volumeModel,
        });

        this.saved.emit(new CreateSeriesModel(createModel));
      }
    }
  }

  private static validateShoppingLinkUrl({
    value,
  }: {
    value: () => string | null;
  }): { kind: string } | null {
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
