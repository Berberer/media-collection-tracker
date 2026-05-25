import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

import { SeriesTagModel } from '../../../../features/tags/model/series-tag.model';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';
import { TagAssignmentComponent } from '../tag-assignment/tag-assignment.component';

@Component({
  selector: 'app-tag-assignment-form-control',
  templateUrl: './tag-assignment-form-control.component.html',
  styleUrl: './tag-assignment-form-control.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagAssignmentComponent],
})
export class TagAssignmentFormControlComponent implements FormValueControl<
  readonly SeriesTagModel[] | readonly VolumeTagModel[]
> {
  readonly value = model<readonly SeriesTagModel[] | readonly VolumeTagModel[]>([]);
  readonly dirty = model(false);
  readonly touched = model(false);

  readonly allTags = input.required<readonly SeriesTagModel[] | readonly VolumeTagModel[]>();
  readonly dropdownPlacement = input<'start' | 'center' | 'end'>('start');

  onTagAdded(tag: SeriesTagModel | VolumeTagModel): void {
    this.value.update((tags) => [...tags.map((t) => t.clone()), tag.clone()]);
    this.dirty.set(true);
    this.touched.set(true);
  }

  onTagRemoved(tag: SeriesTagModel | VolumeTagModel): void {
    this.value.update((tags) => tags.filter((t) => t.id !== tag.id));
    this.dirty.set(true);
    this.touched.set(true);
  }
}
