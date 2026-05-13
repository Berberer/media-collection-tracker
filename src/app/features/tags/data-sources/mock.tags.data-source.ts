import { TagsDataSource } from './tags.data-source';
import {
  IsoAutoDateString,
  SeriesTagsRecord,
  VolumeTagsRecord,
} from '../../../../pocketbase-types';

export class MockTagsDataSource implements TagsDataSource {
  private seriesTagsIdCounter = 2;
  private volumeTagsIdCounter = 1;

  getAllSeriesTags(): Promise<readonly SeriesTagsRecord[]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            {
              id: '0',
              label: 'English',
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            },
            {
              id: '1',
              label: 'Deutsch',
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            },
          ]),
        1000,
      );
    });
  }

  getAllVolumeTags(): Promise<readonly VolumeTagsRecord[]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            {
              id: '0',
              label: 'Amazon',
              created: new Date().toISOString() as IsoAutoDateString,
              updated: new Date().toISOString() as IsoAutoDateString,
            },
          ]),
        1000,
      );
    });
  }

  createSeriesTag(model: { label: string }): Promise<SeriesTagsRecord> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            id: (this.seriesTagsIdCounter++).toString(),
            label: model.label,
            created: new Date().toISOString() as IsoAutoDateString,
            updated: new Date().toISOString() as IsoAutoDateString,
          }),
        1000,
      );
    });
  }

  createVolumeTag(model: { label: string }): Promise<VolumeTagsRecord> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            id: (this.volumeTagsIdCounter++).toString(),
            label: model.label,
            created: new Date().toISOString() as IsoAutoDateString,
            updated: new Date().toISOString() as IsoAutoDateString,
          }),
        1000,
      );
    });
  }

  deleteSeriesTag(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  deleteVolumeTag(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }
}
