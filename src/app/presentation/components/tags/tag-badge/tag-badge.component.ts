import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMarkSolid } from '@ng-icons/heroicons/solid';
import { SeriesTagModel } from '../../../../features/tags/model/series-tag.model';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';

@Component({
  selector: 'app-tag-badge',
  templateUrl: './tag-badge.component.html',
  styleUrl: './tag-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle, NgIcon, NgClass],
  providers: [provideIcons({ heroXMarkSolid })],
})
export class TagBadgeComponent {
  readonly tag = input.required<SeriesTagModel | VolumeTagModel>();
  readonly showRemoveButton = input<boolean>();

  readonly removed = output<void>();
}
