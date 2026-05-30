import {
  AllMediaSeriesRecord,
  CompletedMediaSeriesRecord,
  IncompleteMediaSeriesRecord,
  MediaSeriesRecord,
  MediaSeriesTypeOptions,
  OrphanedMediaSeriesRecord,
  SeriesTagsRecord,
} from '../../../../pocketbase-types';
import { SeriesTagModel } from '../../tags/model/series-tag.model';

export abstract class SeriesDataSource {
  abstract getSeriesById(id: string): Promise<[MediaSeriesRecord, SeriesTagsRecord[]]>;

  abstract getAllSeries(): Promise<readonly [AllMediaSeriesRecord<number>, SeriesTagsRecord[]][]>;

  abstract getIncompleteSeries(): Promise<
    readonly [IncompleteMediaSeriesRecord<number>, SeriesTagsRecord[]][]
  >;

  abstract getOrphanedSeries(): Promise<
    readonly [OrphanedMediaSeriesRecord<number>, SeriesTagsRecord[]][]
  >;

  abstract getCompletedSeries(): Promise<
    readonly [CompletedMediaSeriesRecord, SeriesTagsRecord[]][]
  >;

  abstract createSeries(model: {
    name: string;
    single_volume: boolean;
    completed: boolean;
    type: MediaSeriesTypeOptions;
    seriesTags: SeriesTagModel[];
  }): Promise<[MediaSeriesRecord, SeriesTagsRecord[]]>;

  abstract updateSeries(
    id: string,
    model: {
      name: string;
      single_volume: boolean;
      completed: boolean;
      type: MediaSeriesTypeOptions;
      seriesTags: SeriesTagModel[];
    },
  ): Promise<[MediaSeriesRecord, SeriesTagsRecord[]]>;

  abstract deleteSeries(id: string): Promise<boolean>;
}
