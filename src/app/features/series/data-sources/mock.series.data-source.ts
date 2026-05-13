import { SeriesDataSource } from './series.data-source';
import {
  AllMediaSeriesRecord,
  AllMediaSeriesTypeOptions,
  CompletedMediaSeriesRecord,
  CompletedMediaSeriesTypeOptions,
  IncompleteMediaSeriesRecord,
  IncompleteMediaSeriesTypeOptions,
  IsoAutoDateString,
  MediaSeriesRecord,
  MediaSeriesTypeOptions,
  OrphanedMediaSeriesRecord,
  OrphanedMediaSeriesTypeOptions,
  SeriesTagsRecord,
} from '../../../../pocketbase-types';
import { SeriesTagModel } from '../../tags/model/series-tag.model';

export class MockSeriesDataSource extends SeriesDataSource {
  private idCounter = 5;

  getAllSeries(): Promise<readonly [AllMediaSeriesRecord<number>, SeriesTagsRecord[]][]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            [
              {
                id: '0',
                name: 'A Series of Unfortunate Events',
                single_volume: false,
                completed: false,
                type: AllMediaSeriesTypeOptions.Book,
                highest_volume_number: null,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [
                {
                  id: '0',
                  label: 'English',
                  created: new Date().toISOString() as IsoAutoDateString,
                  updated: new Date().toISOString() as IsoAutoDateString,
                },
              ],
            ],
            [
              {
                id: '1',
                name: 'Final Fantasy',
                single_volume: false,
                type: IncompleteMediaSeriesTypeOptions.Game,
                highest_volume_number: null,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [],
            ],
            [
              {
                id: '2',
                name: 'Berserk',
                single_volume: false,
                type: OrphanedMediaSeriesTypeOptions.Book,
                highest_volume_number: null,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [
                {
                  id: '1',
                  label: 'Deutsch',
                  created: new Date().toISOString() as IsoAutoDateString,
                  updated: new Date().toISOString() as IsoAutoDateString,
                },
              ],
            ],
            [
              {
                id: '3',
                name: 'Tetris',
                single_volume: true,
                type: CompletedMediaSeriesTypeOptions.Game,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [],
            ],
            [
              {
                id: '4',
                name: 'The Great Gatsby',
                single_volume: true,
                type: CompletedMediaSeriesTypeOptions.Book,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [
                {
                  id: '0',
                  label: 'English',
                  created: new Date().toISOString() as IsoAutoDateString,
                  updated: new Date().toISOString() as IsoAutoDateString,
                },
              ],
            ],
          ]),
        1000,
      );
    });
  }

  getIncompleteSeries(): Promise<
    readonly [IncompleteMediaSeriesRecord<number>, SeriesTagsRecord[]][]
  > {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            [
              {
                id: '1',
                name: 'Final Fantasy',
                single_volume: false,
                type: IncompleteMediaSeriesTypeOptions.Game,
                highest_volume_number: null,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [],
            ],
          ]),
        1000,
      );
    });
  }
  getOrphanedSeries(): Promise<readonly [OrphanedMediaSeriesRecord<number>, SeriesTagsRecord[]][]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            [
              {
                id: '2',
                name: 'Berserk',
                single_volume: false,
                type: OrphanedMediaSeriesTypeOptions.Book,
                highest_volume_number: null,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [
                {
                  id: '1',
                  label: 'Deutsch',
                  created: new Date().toISOString() as IsoAutoDateString,
                  updated: new Date().toISOString() as IsoAutoDateString,
                },
              ],
            ],
          ]),
        1000,
      );
    });
  }
  getCompletedSeries(): Promise<readonly [CompletedMediaSeriesRecord, SeriesTagsRecord[]][]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            [
              {
                id: '3',
                name: 'Tetris',
                single_volume: true,
                type: CompletedMediaSeriesTypeOptions.Game,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [],
            ],
            [
              {
                id: '4',
                name: 'The Great Gatsby',
                single_volume: true,
                type: CompletedMediaSeriesTypeOptions.Book,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [
                {
                  id: '0',
                  label: 'English',
                  created: new Date().toISOString() as IsoAutoDateString,
                  updated: new Date().toISOString() as IsoAutoDateString,
                },
              ],
            ],
          ]),
        1000,
      );
    });
  }

  createSeries(model: {
    name: string;
    single_volume: boolean;
    completed: boolean;
    type: MediaSeriesTypeOptions;
    seriesTags: SeriesTagModel[];
  }): Promise<[MediaSeriesRecord, SeriesTagsRecord[]]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            {
              ...model,
              id: (this.idCounter++).toString(),
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
              tags: model.seriesTags.map((tag) => tag.id),
            },
            model.seriesTags.map((tag) => ({
              ...tag,
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            })),
          ]),
        1000,
      );
    });
  }

  updateSeries(
    id: string,
    model: {
      name: string;
      single_volume: boolean;
      completed: boolean;
      type: MediaSeriesTypeOptions;
      seriesTags: SeriesTagModel[];
    },
  ): Promise<[MediaSeriesRecord, SeriesTagsRecord[]]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            {
              ...model,
              id,
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
              tags: model.seriesTags.map((tag) => tag.id),
            },
            model.seriesTags.map((tag) => ({
              ...tag,
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            })),
          ]),
        1000,
      );
    });
  }

  deleteSeries(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }
}
