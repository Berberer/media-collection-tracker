import { Provider } from '@angular/core';

import { Collections } from '../../../../pocketbase-types';
import { PocketBaseService } from '../../../core/services/pocket-base.service';
import { BackendVolumesDataSource } from './backend.volumes.data-source';
import { MockVolumesDataSource } from './mock.volumes.data-source';
import { VolumesDataSource } from './volumes.data-source';

const volumesDataSourceFactory = (pocketBaseService: PocketBaseService): VolumesDataSource => {
  const volumesPocketBaseService = pocketBaseService.getRecordService(Collections.SeriesVolumes);
  const inDeliveryVolumesPocketBaseService = pocketBaseService.getRecordService(
    Collections.InDeliverySeriesVolumes,
  );
  const releasedVolumesPocketBaseService = pocketBaseService.getRecordService(
    Collections.ReleasedSeriesVolumes,
  );
  const upcomingVolumesPocketBaseService = pocketBaseService.getRecordService(
    Collections.UpcomingSeriesVolumes,
  );
  const missingVolumesPocketBaseService = pocketBaseService.getRecordService(
    Collections.MissingSeriesVolumes,
  );
  const collectedVolumesPocketBaseService = pocketBaseService.getRecordService(
    Collections.CollectedSeriesVolumes,
  );

  if (
    volumesPocketBaseService &&
    inDeliveryVolumesPocketBaseService &&
    releasedVolumesPocketBaseService &&
    upcomingVolumesPocketBaseService &&
    missingVolumesPocketBaseService &&
    collectedVolumesPocketBaseService
  ) {
    return new BackendVolumesDataSource(
      volumesPocketBaseService,
      inDeliveryVolumesPocketBaseService,
      releasedVolumesPocketBaseService,
      upcomingVolumesPocketBaseService,
      missingVolumesPocketBaseService,
      collectedVolumesPocketBaseService,
    );
  } else {
    return new MockVolumesDataSource();
  }
};

export const volumesDataSourceProviders: Provider = {
  provide: VolumesDataSource,
  useFactory: volumesDataSourceFactory,
  deps: [PocketBaseService],
};
