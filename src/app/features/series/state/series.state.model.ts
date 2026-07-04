import { SeriesModel } from '../model/series.model';

export interface SeriesStateModel {
  currentSeries: SeriesModel | null;
  series: SeriesModel[];
  incompleteSeries: SeriesModel[];
  orphanedSeries: SeriesModel[];
  completedSeries: SeriesModel[];
}

export const defaultSeriesStateModel: SeriesStateModel = {
  currentSeries: null,
  series: [],
  incompleteSeries: [],
  orphanedSeries: [],
  completedSeries: [],
};
