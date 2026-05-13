import { SeriesModel } from '../../series/model/series.model';
import { VolumeTagModel } from '../../tags/model/volume-tag.model';
import { RemoveMethods } from '../../../core/typing-utilities/remove-methods';
import {
  MissingSeriesVolumesRecord,
  InDeliverySeriesVolumesRecord,
  ReleasedSeriesVolumesRecord,
  SeriesVolumesRecord,
  CollectedSeriesVolumesRecord,
  UpcomingSeriesVolumesRecord,
} from '../../../../pocketbase-types';

export class VolumeModel {
  readonly id: string;
  readonly series: SeriesModel;
  readonly sequenceNumber: number;
  readonly shoppingLink: string | null;
  readonly releaseDate: Date | null;
  readonly inDelivery: boolean;
  readonly purchaseDate: Date | null;
  readonly volumeTags: VolumeTagModel[];

  constructor(model: RemoveMethods<VolumeModel>) {
    this.id = model.id;
    this.series = model.series;
    this.sequenceNumber = model.sequenceNumber;
    this.shoppingLink = model.shoppingLink;
    this.releaseDate = model.releaseDate;
    this.inDelivery = model.inDelivery;
    this.purchaseDate = model.purchaseDate;
    this.volumeTags = model.volumeTags;
  }

  static fromSeriesVolumeRecord(
    record: SeriesVolumesRecord,
    series: SeriesModel,
    tags: VolumeTagModel[],
  ): VolumeModel {
    return new VolumeModel({
      ...record,
      series,
      sequenceNumber: record.sequence_number,
      shoppingLink: record.shopping_link ?? null,
      releaseDate: record.release_date ? new Date(record.release_date) : null,
      purchaseDate: record.purchase_date ? new Date(record.purchase_date) : null,
      inDelivery: record.in_delivery ?? false,
      volumeTags: tags,
    });
  }

  static fromCollectedSeriesVolumeRecord(
    record: CollectedSeriesVolumesRecord,
    series: SeriesModel,
    tags: VolumeTagModel[],
  ): VolumeModel {
    return new VolumeModel({
      ...record,
      series,
      sequenceNumber: record.sequence_number,
      shoppingLink: record.shopping_link ?? null,
      releaseDate: record.release_date ? new Date(record.release_date) : null,
      purchaseDate: record.purchase_date ? new Date(record.purchase_date) : null,
      inDelivery: false,
      volumeTags: tags,
    });
  }

  static fromMissingSeriesVolumeRecord(
    record: MissingSeriesVolumesRecord,
    series: SeriesModel,
    tags: VolumeTagModel[],
  ): VolumeModel {
    return new VolumeModel({
      ...record,
      series,
      sequenceNumber: record.sequence_number,
      shoppingLink: record.shopping_link ?? null,
      releaseDate: record.release_date ? new Date(record.release_date) : null,
      purchaseDate: null,
      inDelivery: false,
      volumeTags: tags,
    });
  }

  static fromInDeliverySeriesVolumeRecord(
    record: InDeliverySeriesVolumesRecord,
    series: SeriesModel,
    tags: VolumeTagModel[],
  ): VolumeModel {
    return new VolumeModel({
      ...record,
      series,
      sequenceNumber: record.sequence_number,
      shoppingLink: record.shopping_link ?? null,
      releaseDate: record.release_date ? new Date(record.release_date) : null,
      purchaseDate: record.purchase_date ? new Date(record.purchase_date) : null,
      inDelivery: true,
      volumeTags: tags,
    });
  }

  static fromReleasedSeriesVolumeRecord(
    record: ReleasedSeriesVolumesRecord,
    series: SeriesModel,
    tags: VolumeTagModel[],
  ): VolumeModel {
    return new VolumeModel({
      ...record,
      series,
      sequenceNumber: record.sequence_number,
      shoppingLink: record.shopping_link ?? null,
      releaseDate: record.release_date ? new Date(record.release_date) : null,
      purchaseDate: null,
      inDelivery: false,
      volumeTags: tags,
    });
  }

  static fromUpcomingSeriesVolumeRecord(
    record: UpcomingSeriesVolumesRecord,
    series: SeriesModel,
    tags: VolumeTagModel[],
  ): VolumeModel {
    return new VolumeModel({
      ...record,
      series,
      sequenceNumber: record.sequence_number,
      shoppingLink: record.shopping_link ?? null,
      releaseDate: record.release_date ? new Date(record.release_date) : null,
      purchaseDate: null,
      inDelivery: false,
      volumeTags: tags,
    });
  }
}
