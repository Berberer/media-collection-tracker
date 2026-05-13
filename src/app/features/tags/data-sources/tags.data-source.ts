import { SeriesTagsRecord, VolumeTagsRecord } from '../../../../pocketbase-types';

export abstract class TagsDataSource {
  abstract getAllSeriesTags(): Promise<readonly SeriesTagsRecord[]>;

  abstract getAllVolumeTags(): Promise<readonly VolumeTagsRecord[]>;

  abstract createSeriesTag(model: { label: string }): Promise<SeriesTagsRecord>;

  abstract createVolumeTag(model: { label: string }): Promise<VolumeTagsRecord>;

  abstract deleteSeriesTag(id: string): Promise<boolean>;

  abstract deleteVolumeTag(id: string): Promise<boolean>;
}
