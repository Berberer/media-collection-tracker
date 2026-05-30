import { ClientResponseError, RecordService } from 'pocketbase';

import { SeriesTagsRecord, VolumeTagsRecord } from '../../../../pocketbase-types';
import { TagRecordNotFoundError } from '../errors';
import { TagsDataSource } from './tags.data-source';

export class BackendTagsDataSource implements TagsDataSource {
  constructor(
    private readonly seriesTagsRecordService: RecordService<SeriesTagsRecord>,
    private readonly volumeTagsRecordService: RecordService<VolumeTagsRecord>,
  ) {}

  getAllSeriesTags(): Promise<readonly SeriesTagsRecord[]> {
    return this.seriesTagsRecordService.getFullList();
  }

  getAllVolumeTags(): Promise<readonly VolumeTagsRecord[]> {
    return this.volumeTagsRecordService.getFullList();
  }

  createSeriesTag(model: { label: string }): Promise<SeriesTagsRecord> {
    return this.seriesTagsRecordService.create(model);
  }

  createVolumeTag(model: { label: string }): Promise<VolumeTagsRecord> {
    return this.volumeTagsRecordService.create(model);
  }

  deleteSeriesTag(id: string): Promise<boolean> {
    try {
      return this.seriesTagsRecordService.delete(id);
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        throw new TagRecordNotFoundError(id);
      }
      throw error;
    }
  }

  deleteVolumeTag(id: string): Promise<boolean> {
    try {
      return this.volumeTagsRecordService.delete(id);
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        throw new TagRecordNotFoundError(id);
      }
      throw error;
    }
  }
}
