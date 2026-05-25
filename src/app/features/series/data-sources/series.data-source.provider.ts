import { Provider } from '@angular/core';

import { Collections } from '../../../../pocketbase-types';
import { PocketBaseService } from '../../../core/services/pocket-base.service';
import { BackendSeriesDataSource } from './backend.series.data-source';
import { MockSeriesDataSource } from './mock.series.data-source';
import { SeriesDataSource } from './series.data-source';

const seriesDataSourceFactory = (pocketBaseService: PocketBaseService): SeriesDataSource => {
  const seriesPocketBaseService = pocketBaseService.getRecordService(Collections.MediaSeries);
  const allSeriesPocketBaseService = pocketBaseService.getRecordService(Collections.AllMediaSeries);
  const incompleteSeriesPocketBaseService = pocketBaseService.getRecordService(
    Collections.IncompleteMediaSeries,
  );
  const orphanedSeriesPocketBaseService = pocketBaseService.getRecordService(
    Collections.OrphanedMediaSeries,
  );
  const completedSeriesPocketBaseService = pocketBaseService.getRecordService(
    Collections.CompletedMediaSeries,
  );

  if (
    seriesPocketBaseService &&
    allSeriesPocketBaseService &&
    incompleteSeriesPocketBaseService &&
    orphanedSeriesPocketBaseService &&
    completedSeriesPocketBaseService
  ) {
    return new BackendSeriesDataSource(
      seriesPocketBaseService,
      allSeriesPocketBaseService,
      incompleteSeriesPocketBaseService,
      orphanedSeriesPocketBaseService,
      completedSeriesPocketBaseService,
    );
  } else {
    return new MockSeriesDataSource();
  }
};

export const seriesDataSourceProvider: Provider = {
  provide: SeriesDataSource,
  useFactory: seriesDataSourceFactory,
  deps: [PocketBaseService],
};
