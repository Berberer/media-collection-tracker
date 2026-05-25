import {
  CollectedSeriesVolumesRecord,
  InDeliverySeriesVolumesRecord,
  MediaSeriesRecord,
  MissingSeriesVolumesRecord,
  ReleasedSeriesVolumesRecord,
  SeriesTagsRecord,
  SeriesVolumesRecord,
  UpcomingSeriesVolumesRecord,
  VolumeTagsRecord,
} from '../../../../pocketbase-types';
import { SeriesModel } from '../../series/model/series.model';
import { VolumeTagModel } from '../../tags/model/volume-tag.model';

export abstract class VolumesDataSource {
  abstract getMissingVolumes(): Promise<
    [MissingSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  >;

  abstract getInDeliveryVolumes(): Promise<
    [InDeliverySeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  >;

  abstract getReleasedVolumes(): Promise<
    [ReleasedSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  >;

  abstract getUpcomingVolumes(): Promise<
    [UpcomingSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  >;

  abstract getCollectedVolumes(): Promise<
    [CollectedSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  >;

  abstract createVolume(model: {
    series: SeriesModel;
    sequence_number: number;
    shopping_link?: string;
    release_date?: Date;
    in_delivery: boolean;
    purchase_date?: Date;
    volume_tags: VolumeTagModel[];
  }): Promise<[SeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]]>;

  abstract updateVolume(model: {
    id: string;
    series: SeriesModel;
    sequence_number?: number;
    shopping_link?: string;
    release_date?: Date;
    in_delivery?: boolean;
    purchase_date?: Date;
    volume_tags?: VolumeTagModel[];
  }): Promise<[SeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]]>;

  abstract deleteVolume(id: string): Promise<boolean>;
}
