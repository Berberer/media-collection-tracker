import { PocketBaseService } from '../../../core/services/pocket-base.service';
import { TagsDataSource } from './tags.data-source';
import { Collections } from '../../../../pocketbase-types';
import { Provider } from '@angular/core';
import { MockTagsDataSource } from './mock.tags.data-source';
import { BackendTagsDataSource } from './backend.tags.data-source';

const tagsDataSourceFactory = (pocketBaseService: PocketBaseService): TagsDataSource => {
  const seriesTagsPocketBaseService = pocketBaseService.getRecordService(Collections.SeriesTags);
  const volumesTagsPocketBaseService = pocketBaseService.getRecordService(Collections.VolumeTags);

  if (seriesTagsPocketBaseService && volumesTagsPocketBaseService) {
    return new BackendTagsDataSource(seriesTagsPocketBaseService, volumesTagsPocketBaseService);
  } else {
    return new MockTagsDataSource();
  }
};

export const tagsDataSourceProviders: Provider = {
  provide: TagsDataSource,
  useFactory: tagsDataSourceFactory,
  deps: [PocketBaseService],
};
