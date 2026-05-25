import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { SeriesMediaTypes } from '../../../../features/series/model/media-type.model';

@Component({
  selector: 'app-media-type-badge',
  templateUrl: './media-type-badge.component.html',
  styleUrl: './media-type-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
})
export class MediaTypeBadgeComponent {
  protected readonly SeriesMediaType = SeriesMediaTypes.SeriesMediaType;
  readonly mediaType = input.required<SeriesMediaTypes.SeriesMediaType>();
}
