import { SeriesModel } from '../model/series.model';

export interface SeriesStateModel {
  series: SeriesModel[];
  incompleteSeries: SeriesModel[];
  orphanedSeries: SeriesModel[];
  completedSeries: SeriesModel[];
}

export const defaultSeriesStateModel: SeriesStateModel = {
  series: [],
  incompleteSeries: [],
  orphanedSeries: [],
  completedSeries: [],
};
