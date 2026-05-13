import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { CreateVolumeTagModel } from '../../../../features/tags/model/create.volume-tag.model';
import { CreateSeriesTagModel } from '../../../../features/tags/model/create.series-tag.model';

interface TagFormData {
  label: string;
}

const DEFAULT_TAG_DATA: TagFormData = {
  label: '',
};

export enum TagType {
  SERIES = 'SERIES',
  VOLUME = 'VOLUME',
}

@Component({
  selector: 'app-tag-creation-form',
  templateUrl: './tag-creation-form.component.html',
  styleUrl: './tag-creation-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, FormsModule, FormField],
})
export class TagCreationFormComponent {
  readonly tagType = input.required<TagType>();

  readonly saved = output<CreateSeriesTagModel | CreateVolumeTagModel>();

  readonly tagFormData = signal<TagFormData>(DEFAULT_TAG_DATA);
  readonly tagForm = form(this.tagFormData, (schemaPath) => {
    required(schemaPath.label);
  });

  onSave(): void {
    if (this.tagForm().valid()) {
      switch (this.tagType()) {
        case TagType.SERIES:
          this.saved.emit(new CreateSeriesTagModel({ ...this.tagFormData() }));
          break;
        case TagType.VOLUME:
          this.saved.emit(new CreateVolumeTagModel({ ...this.tagFormData() }));
          break;
      }
      this.resetForm();
    }
  }

  public resetForm(): void {
    this.tagFormData.set(DEFAULT_TAG_DATA);
  }
}
