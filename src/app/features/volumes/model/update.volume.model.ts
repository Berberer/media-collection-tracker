import { RemoveMethods } from '../../../core/typing-utilities/remove-methods';
import { SeriesModel } from '../../series/model/series.model';
import { VolumeTagModel } from '../../tags/model/volume-tag.model';

export class UpdateVolumeModel {
  readonly id: string;
  readonly series: SeriesModel;
  readonly sequenceNumber: number;
  readonly shoppingLink: string | null;
  readonly releaseDate: Date | null;
  readonly inDelivery: boolean;
  readonly purchaseDate: Date | null;
  readonly volumeTags: VolumeTagModel[];

  constructor(model: RemoveMethods<UpdateVolumeModel>) {
    this.id = model.id;
    this.series = model.series;
    this.sequenceNumber = model.sequenceNumber;
    this.shoppingLink = model.shoppingLink;
    this.releaseDate = model.releaseDate;
    this.inDelivery = model.inDelivery;
    this.purchaseDate = model.purchaseDate;
    this.volumeTags = model.volumeTags;
  }
}
