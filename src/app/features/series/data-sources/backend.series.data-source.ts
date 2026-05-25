import { RecordService } from 'pocketbase';

import {
  AllMediaSeriesRecord,
  AllMediaSeriesResponse,
  CompletedMediaSeriesResponse,
  IncompleteMediaSeriesRecord,
  IncompleteMediaSeriesResponse,
  MediaSeriesRecord,
  MediaSeriesResponse,
  MediaSeriesTypeOptions,
  OrphanedMediaSeriesRecord,
  OrphanedMediaSeriesResponse,
  SeriesTagsRecord,
  SeriesTagsResponse,
} from '../../../../pocketbase-types';
import { SeriesTagModel } from '../../tags/model/series-tag.model';
import { SeriesDataSource } from './series.data-source';

interface SeriesTagsExpand {
  tags: SeriesTagsResponse[];
}

export class BackendSeriesDataSource implements SeriesDataSource {
  constructor(
    private readonly seriesRecordService: RecordService<MediaSeriesResponse<SeriesTagsExpand>>,
    private readonly allSeriesRecordService: RecordService<
      AllMediaSeriesResponse<number, SeriesTagsExpand>
    >,
    private readonly incompleteSeriesRecordService: RecordService<
      IncompleteMediaSeriesResponse<number, SeriesTagsExpand>
    >,
    private readonly orphanedSeriesRecordService: RecordService<
      OrphanedMediaSeriesResponse<number, SeriesTagsExpand>
    >,
    private readonly completedSeriesRecordService: RecordService<
      CompletedMediaSeriesResponse<SeriesTagsExpand>
    >,
  ) {}

  async getAllSeries(): Promise<readonly [AllMediaSeriesRecord<number>, SeriesTagsRecord[]][]> {
    const records = await this.allSeriesRecordService.getFullList({
      expand: 'tags',
      sort: '+name',
    });
    return records.map((record) => [record, record.expand.tags ?? []]);
  }

  async getIncompleteSeries(): Promise<
    readonly [IncompleteMediaSeriesRecord<number>, SeriesTagsRecord[]][]
  > {
    const records = await this.incompleteSeriesRecordService.getFullList({
      expand: 'tags',
      sort: '+name',
    });
    return records.map((record) => [record, record.expand.tags ?? []]);
  }
  async getOrphanedSeries(): Promise<
    readonly [OrphanedMediaSeriesRecord<number>, SeriesTagsRecord[]][]
  > {
    const records = await this.orphanedSeriesRecordService.getFullList({
      expand: 'tags',
      sort: '+name',
    });
    return records.map((record) => [record, record.expand.tags ?? []]);
  }
  async getCompletedSeries(): Promise<
    readonly [CompletedMediaSeriesResponse, SeriesTagsRecord[]][]
  > {
    const records = await this.completedSeriesRecordService.getFullList({
      expand: 'tags',
      sort: '+name',
    });
    return records.map((record) => [record, record.expand.tags ?? []]);
  }

  async createSeries(model: {
    name: string;
    single_volume: boolean;
    completed: boolean;
    type: MediaSeriesTypeOptions;
    seriesTags: SeriesTagModel[];
  }): Promise<[MediaSeriesRecord, SeriesTagsRecord[]]> {
    const record = await this.seriesRecordService.create(
      {
        tags: model.seriesTags.map((tag) => tag.id),
        ...model,
      },
      { expand: 'tags' },
    );
    return [record, record.expand.tags ?? []];
  }

  async updateSeries(
    id: string,
    model: {
      name: string;
      single_volume: boolean;
      completed: boolean;
      type: MediaSeriesTypeOptions;
      seriesTags: SeriesTagModel[];
    },
  ): Promise<[MediaSeriesRecord, SeriesTagsRecord[]]> {
    const record = await this.seriesRecordService.update(
      id,
      {
        tags: model.seriesTags.map((tag) => tag.id),
        ...model,
      },
      { expand: 'tags' },
    );
    return [record, record.expand.tags ?? []];
  }

  async deleteSeries(id: string): Promise<boolean> {
    return await this.seriesRecordService.delete(id);
  }
}
