import {
  CollectedSeriesVolumesRecord,
  IncompleteMediaSeriesTypeOptions,
  InDeliverySeriesVolumesRecord,
  IsoAutoDateString,
  MediaSeriesRecord,
  MissingSeriesVolumesRecord,
  ReleasedSeriesVolumesRecord,
  SeriesTagsRecord,
  SeriesVolumesRecord,
  UpcomingSeriesVolumesRecord,
  VolumeTagsRecord,
} from '../../../../pocketbase-types';
import { SeriesMediaTypes } from '../../series/model/media-type.model';
import { SeriesModel } from '../../series/model/series.model';
import { VolumeTagModel } from '../../tags/model/volume-tag.model';
import { VolumesDataSource } from './volumes.data-source';

export class MockVolumesDataSource implements VolumesDataSource {
  private volumesIdCounter = 5;

  getMissingVolumes(): Promise<
    [MissingSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  > {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            [
              {
                id: '1',
                release_date: undefined,
                sequence_number: 10,
                series: '1',
                shopping_link: undefined,
                tags: [],
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              {
                id: '1',
                name: 'Final Fantasy',
                single_volume: false,
                type: IncompleteMediaSeriesTypeOptions.Game,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [],
              [],
            ],
          ]),
        1000,
      );
    });
  }

  getInDeliveryVolumes(): Promise<
    [InDeliverySeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  > {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            [
              {
                id: '2',
                release_date: new Date().toISOString(),
                sequence_number: 11,
                series: '1',
                shopping_link: undefined,
                tags: [],
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              {
                id: '1',
                name: 'Final Fantasy',
                single_volume: false,
                type: IncompleteMediaSeriesTypeOptions.Game,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [],
              [],
            ],
          ]),
        1000,
      );
    });
  }

  getReleasedVolumes(): Promise<
    [ReleasedSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  > {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            [
              {
                id: '3',
                release_date: new Date().toISOString(),
                sequence_number: 8,
                series: '1',
                shopping_link: undefined,
                tags: [],
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              {
                id: '1',
                name: 'Final Fantasy',
                single_volume: false,
                type: IncompleteMediaSeriesTypeOptions.Game,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [],
              [],
            ],
          ]),
        1000,
      );
    });
  }

  getUpcomingVolumes(): Promise<
    [UpcomingSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  > {
    const upcomingDate = new Date();
    upcomingDate.setMonth(upcomingDate.getMonth() + 1);

    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            [
              {
                id: '4',
                release_date: upcomingDate.toISOString(),
                sequence_number: 12,
                series: '1',
                shopping_link: undefined,
                tags: [],
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              {
                id: '1',
                name: 'Final Fantasy',
                single_volume: false,
                type: IncompleteMediaSeriesTypeOptions.Game,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [],
              [],
            ],
          ]),
        1000,
      );
    });
  }

  getCollectedVolumes(): Promise<
    [CollectedSeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]][]
  > {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            [
              {
                id: '0',
                release_date: new Date().toISOString(),
                purchase_date: new Date().toISOString(),
                sequence_number: 9,
                series: '1',
                shopping_link: undefined,
                tags: [],
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              {
                id: '1',
                name: 'Final Fantasy',
                single_volume: false,
                type: IncompleteMediaSeriesTypeOptions.Game,
                created: new Date().toISOString() as IsoAutoDateString,
                updated: new Date().toISOString() as IsoAutoDateString,
              },
              [],
              [],
            ],
          ]),
        1000,
      );
    });
  }

  createVolume(model: {
    series: SeriesModel;
    sequence_number: number;
    shopping_link?: string;
    release_date?: Date;
    in_delivery: boolean;
    purchase_date?: Date;
    volume_tags: VolumeTagModel[];
  }): Promise<[SeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            {
              ...model,
              id: (this.volumesIdCounter++).toString(),
              series: model.series.id,
              release_date: model.release_date?.toISOString(),
              purchase_date: model.purchase_date?.toISOString(),
              tags: model.volume_tags.map((tag) => tag.id),
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            },
            {
              ...model.series,
              type: SeriesMediaTypes.fromEnum(model.series.mediaType),
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
              tags: model.series.seriesTags.map((tag) => tag.id),
            },
            model.volume_tags.map((tag) => ({
              ...tag,
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            })),
            model.series.seriesTags.map((tag) => ({
              ...tag,
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            })),
          ]),
        1000,
      );
    });
  }

  updateVolume(model: {
    id: string;
    series: SeriesModel;
    sequence_number: number;
    shopping_link?: string;
    release_date?: Date;
    in_delivery: boolean;
    purchase_date?: Date;
    volume_tags: VolumeTagModel[];
  }): Promise<[SeriesVolumesRecord, MediaSeriesRecord, VolumeTagsRecord[], SeriesTagsRecord[]]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            {
              ...model,
              id: model.id,
              series: model.series.id,
              release_date: model.release_date?.toISOString(),
              purchase_date: model.purchase_date?.toISOString(),
              tags: model.volume_tags.map((tag) => tag.id),
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            },
            {
              ...model.series,
              type: SeriesMediaTypes.fromEnum(model.series.mediaType),
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
              tags: model.series.seriesTags.map((tag) => tag.id),
            },
            model.volume_tags.map((tag) => ({
              ...tag,
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            })),
            model.series.seriesTags.map((tag) => ({
              ...tag,
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            })),
          ]),
        1000,
      );
    });
  }

  deleteVolume(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }
}
