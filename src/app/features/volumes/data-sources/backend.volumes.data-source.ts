import { ClientResponseError, RecordService } from 'pocketbase';

import {
  CollectedSeriesVolumesRecord,
  CollectedSeriesVolumesResponse,
  InDeliverySeriesVolumesRecord,
  InDeliverySeriesVolumesResponse,
  MediaSeriesRecord,
  MediaSeriesResponse,
  MissingSeriesVolumesRecord,
  MissingSeriesVolumesResponse,
  ReleasedSeriesVolumesRecord,
  ReleasedSeriesVolumesResponse,
  SeriesTagsRecord,
  SeriesTagsResponse,
  SeriesVolumesRecord,
  SeriesVolumesResponse,
  UpcomingSeriesVolumesRecord,
  UpcomingSeriesVolumesResponse,
  VolumeTagsRecord,
  VolumeTagsResponse,
} from '../../../../pocketbase-types';
import { SeriesModel } from '../../series/model/series.model';
import { VolumeTagModel } from '../../tags/model/volume-tag.model';
import { VolumeRecordNotFoundError } from '../errors';
import { VolumesDataSource } from './volumes.data-source';

interface VolumeSeriesAndTagsExpand {
  series: MediaSeriesResponse<{ tags: SeriesTagsResponse[] }>;
  tags: VolumeTagsResponse[];
}

export class BackendVolumesDataSource implements VolumesDataSource {
  constructor(
    private readonly volumesRecordService: RecordService<
      SeriesVolumesResponse<VolumeSeriesAndTagsExpand>
    >,
    private readonly inDeliveryVolumesRecordService: RecordService<
      InDeliverySeriesVolumesResponse<VolumeSeriesAndTagsExpand>
    >,
    private readonly releasedVolumesRecordService: RecordService<
      ReleasedSeriesVolumesResponse<VolumeSeriesAndTagsExpand>
    >,
    private readonly upcomingVolumesRecordService: RecordService<
      UpcomingSeriesVolumesResponse<VolumeSeriesAndTagsExpand>
    >,
    private readonly missingVolumesRecordService: RecordService<
      MissingSeriesVolumesResponse<VolumeSeriesAndTagsExpand>
    >,
    private readonly collectedVolumesRecordService: RecordService<
      CollectedSeriesVolumesResponse<VolumeSeriesAndTagsExpand>
    >,
  ) {}

  async getVolumeById(
    id: string,
  ): Promise<[SeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]]> {
    try {
      const record = await this.volumesRecordService.getOne(id, {
        expand: 'series,tags,series.tags',
      });
      return [
        record,
        record.expand.series,
        record.expand.tags ?? [],
        record.expand.series.expand?.tags ?? [],
      ];
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        throw new VolumeRecordNotFoundError(id);
      }
      throw error;
    }
  }

  async getVolumesBySeries(
    seriesId: string,
  ): Promise<[SeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]> {
    const records = await this.volumesRecordService.getFullList({
      expand: 'series,tags,series.tags',
      filter: `series = '${seriesId}'`,
    });
    return records.map((record) => [
      record,
      record.expand.series,
      record.expand.tags ?? [],
      record.expand.series.expand?.tags ?? [],
    ]);
  }

  async getMissingVolumes(): Promise<
    [MissingSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  > {
    const records = await this.missingVolumesRecordService.getFullList({
      expand: 'series,tags,series.tags',
    });
    return records.map((record) => [
      record,
      record.expand.series,
      record.expand.tags ?? [],
      record.expand.series.expand?.tags ?? [],
    ]);
  }

  async getInDeliveryVolumes(): Promise<
    [InDeliverySeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  > {
    const records = await this.inDeliveryVolumesRecordService.getFullList({
      expand: 'series,tags,series.tags',
    });
    return records.map((record) => [
      record,
      record.expand.series,
      record.expand.tags ?? [],
      record.expand.series.expand?.tags ?? [],
    ]);
  }

  async getReleasedVolumes(): Promise<
    [ReleasedSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  > {
    const records = await this.releasedVolumesRecordService.getFullList({
      expand: 'series,tags,series.tags',
    });
    return records.map((record) => [
      record,
      record.expand.series,
      record.expand.tags ?? [],
      record.expand.series.expand?.tags ?? [],
    ]);
  }

  async getUpcomingVolumes(): Promise<
    [UpcomingSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  > {
    const records = await this.upcomingVolumesRecordService.getFullList({
      expand: 'series,tags,series.tags',
    });
    return records.map((record) => [
      record,
      record.expand.series,
      record.expand.tags ?? [],
      record.expand.series.expand?.tags ?? [],
    ]);
  }

  async getCollectedVolumes(): Promise<
    [CollectedSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  > {
    const records = await this.collectedVolumesRecordService.getFullList({
      expand: 'series,tags,series.tags',
    });
    return records.map((record) => [
      record,
      record.expand.series,
      record.expand.tags ?? [],
      record.expand.series.expand?.tags ?? [],
    ]);
  }

  async createVolume(model: {
    series: SeriesModel;
    sequence_number: number;
    shopping_link?: string;
    release_date?: Date;
    in_delivery: boolean;
    purchase_date?: Date;
    volume_tags: VolumeTagModel[];
  }): Promise<[SeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]]> {
    const record = await this.volumesRecordService.create(
      {
        ...model,
        series: model.series.id,
        release_date: model.release_date?.toISOString() ?? '',
        purchase_date: model.purchase_date?.toISOString() ?? '',
        tags: model.volume_tags.map((tag) => tag.id),
      },
      { expand: 'series,tags,series.tags' },
    );
    return [
      record,
      record.expand.series,
      record.expand.tags ?? [],
      record.expand.series.expand?.tags ?? [],
    ];
  }

  async updateVolume(model: {
    id: string;
    series: SeriesModel;
    sequence_number: number;
    shopping_link?: string;
    release_date?: Date;
    in_delivery: boolean;
    purchase_date?: Date;
    volume_tags: VolumeTagModel[];
  }): Promise<[SeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]]> {
    try {
      const record = await this.volumesRecordService.update(
        model.id,
        {
          ...model,
          series: model.series.id,
          release_date: model.release_date?.toISOString() ?? '',
          purchase_date: model.purchase_date?.toISOString() ?? '',
          tags: model.volume_tags.map((tag) => tag.id),
        },
        { expand: 'series,tags,series.tags' },
      );
      return [
        record,
        record.expand.series,
        record.expand.tags ?? [],
        record.expand.series.expand?.tags ?? [],
      ];
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        throw new VolumeRecordNotFoundError(model.id);
      }
      throw error;
    }
  }

  async deleteVolume(id: string): Promise<boolean> {
    try {
      return await this.volumesRecordService.delete(id);
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        throw new VolumeRecordNotFoundError(id);
      }
      throw error;
    }
  }
}
