import { RemoveMethods } from '../../../core/typing-utilities/remove-methods';
import {
  AllMediaSeriesRecord,
  CompletedMediaSeriesRecord,
  IncompleteMediaSeriesRecord,
  MediaSeriesRecord,
  OrphanedMediaSeriesRecord,
} from '../../../../pocketbase-types';
import { SeriesMediaTypes } from './media-type.model';
import { HashedTextColors } from '../../../core/hashed-text-colors';
import { ExcludeSuperProperties } from '../../../core/typing-utilities/exclude-super-properties';
import { SeriesTagModel } from '../../tags/model/series-tag.model';

export class SeriesModel extends HashedTextColors<SeriesModel> {
  readonly id: string;
  readonly name: string;
  readonly abbreviation: string;
  readonly singleVolume: boolean;
  readonly completed: boolean;
  readonly mediaType: SeriesMediaTypes.SeriesMediaType;
  readonly highestVolumeNumber: number | null;
  readonly seriesTags: SeriesTagModel[];

  constructor(
    model: RemoveMethods<ExcludeSuperProperties<HashedTextColors<SeriesModel>, SeriesModel>>,
  ) {
    super();
    this.id = model.id;
    this.name = model.name;
    this.abbreviation = model.abbreviation;
    this.singleVolume = model.singleVolume;
    this.completed = model.completed;
    this.mediaType = model.mediaType;
    this.highestVolumeNumber = model.highestVolumeNumber;
    this.seriesTags = model.seriesTags;
  }

  getColorHashingTextBasis(): string {
    return this.name;
  }

  clone(): SeriesModel {
    return new SeriesModel({
      ...this,
      seriesTags: this.seriesTags.map((t) => t.clone()),
    });
  }

  static fromMediaSeriesRecord(record: MediaSeriesRecord, tags: SeriesTagModel[]): SeriesModel {
    return new SeriesModel({
      ...record,
      abbreviation: SeriesModel.abbreviateName(record.name),
      singleVolume: record.single_volume ?? false,
      completed: record.completed ?? false,
      mediaType: SeriesMediaTypes.toEnum(record.type),
      highestVolumeNumber: null,
      seriesTags: tags,
    });
  }

  static fromAllMediaSeriesRecord(
    record: AllMediaSeriesRecord<number>,
    tags: SeriesTagModel[],
  ): SeriesModel {
    return new SeriesModel({
      ...record,
      abbreviation: SeriesModel.abbreviateName(record.name),
      singleVolume: record.single_volume ?? false,
      completed: record.completed ?? false,
      mediaType: SeriesMediaTypes.toEnum(record.type),
      highestVolumeNumber:
        record.highest_volume_number !== undefined ? record.highest_volume_number : null,
      seriesTags: tags,
    });
  }

  static fromIncompleteMediaSeriesRecord(
    record: IncompleteMediaSeriesRecord<number>,
    tags: SeriesTagModel[],
  ): SeriesModel {
    return new SeriesModel({
      ...record,
      abbreviation: SeriesModel.abbreviateName(record.name),
      singleVolume: record.single_volume ?? false,
      completed: false,
      mediaType: SeriesMediaTypes.toEnum(record.type),
      highestVolumeNumber:
        record.highest_volume_number !== undefined ? record.highest_volume_number : null,
      seriesTags: tags,
    });
  }

  static fromOrphanedMediaSeriesRecord(
    record: OrphanedMediaSeriesRecord<number>,
    tags: SeriesTagModel[],
  ): SeriesModel {
    return new SeriesModel({
      ...record,
      abbreviation: SeriesModel.abbreviateName(record.name),
      singleVolume: record.single_volume ?? false,
      completed: false,
      mediaType: SeriesMediaTypes.toEnum(record.type),
      highestVolumeNumber:
        record.highest_volume_number !== undefined ? record.highest_volume_number : null,
      seriesTags: tags,
    });
  }

  static fromCompletedMediaSeriesRecord(
    record: CompletedMediaSeriesRecord,
    tags: SeriesTagModel[],
  ): SeriesModel {
    return new SeriesModel({
      ...record,
      abbreviation: SeriesModel.abbreviateName(record.name),
      singleVolume: record.single_volume ?? false,
      completed: true,
      mediaType: SeriesMediaTypes.toEnum(record.type),
      highestVolumeNumber: null,
      seriesTags: tags,
    });
  }

  private static abbreviateName(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    } else if (words.length === 2) {
      return words[0].substring(0, 2).toUpperCase() + words[1].substring(0, 1).toUpperCase();
    } else {
      return (
        words[0].substring(0, 1).toUpperCase() +
        words[1].substring(0, 1).toUpperCase() +
        words[2].substring(0, 1).toUpperCase()
      );
    }
  }
}
