import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TagBadgeComponent } from '../tag-badge/tag-badge.component';
import { heroPlusSolid } from '@ng-icons/heroicons/solid';
import { SeriesTagModel } from '../../../../features/tags/model/series-tag.model';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tag-assignment',
  templateUrl: './tag-assignment.component.html',
  styleUrl: './tag-assignment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, TagBadgeComponent, NgClass],
  providers: [provideIcons({ heroPlusSolid })],
})
export class TagAssignmentComponent {
  readonly selectedTags = input.required<readonly SeriesTagModel[] | readonly VolumeTagModel[]>();
  readonly allTags = input.required<readonly SeriesTagModel[] | readonly VolumeTagModel[]>();
  readonly readonly = input<boolean>(false);
  readonly dropdownPlacement = input<'start' | 'center' | 'end'>('start');

  readonly tagAdded = output<SeriesTagModel | VolumeTagModel>();
  readonly tagRemoved = output<SeriesTagModel | VolumeTagModel>();

  readonly availableTags = computed(() =>
    this.allTags()
      .filter((t) => this.selectedTags().find((v) => v.id === t.id) === undefined)
      .sort((t1, t2) => t1.label.localeCompare(t2.label)),
  );

  onTagAdded(tag: SeriesTagModel | VolumeTagModel): void {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    this.tagAdded.emit(tag);
  }

  onTagRemoved(tag: SeriesTagModel | VolumeTagModel): void {
    this.tagRemoved.emit(tag);
  }
}
