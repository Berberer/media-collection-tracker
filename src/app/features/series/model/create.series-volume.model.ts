import { VolumeTagModel } from '../../tags/model/volume-tag.model';
import { RemoveMethods } from '../../../core/typing-utilities/remove-methods';

export class CreateSeriesVolumeModel {
  readonly sequenceNumber: number;
  readonly shoppingLink: string | null;
  readonly releaseDate: Date | null;
  readonly inDelivery: boolean;
  readonly purchaseDate: Date | null;
  readonly volumeTags: VolumeTagModel[];

  constructor(model: RemoveMethods<CreateSeriesVolumeModel>) {
    this.sequenceNumber = model.sequenceNumber;
    this.shoppingLink = model.shoppingLink;
    this.releaseDate = model.releaseDate;
    this.inDelivery = model.inDelivery;
    this.purchaseDate = model.purchaseDate;
    this.volumeTags = model.volumeTags;
  }
}
