import { Selector } from '@ngxs/store';
import { SeriesState } from './series.state';
import { SeriesStateModel } from './series.state.model';
import { SeriesModel } from '../model/series.model';

export abstract class SeriesStateSelectors {
  @Selector([SeriesState])
  static stateModel(stateModel: SeriesStateModel): SeriesStateModel {
    return stateModel;
  }

  @Selector([SeriesState])
  static series({ series }: SeriesStateModel): readonly SeriesModel[] {
    return series;
  }

  @Selector([SeriesState])
  static incompleteSeries({ incompleteSeries }: SeriesStateModel): readonly SeriesModel[] {
    return incompleteSeries;
  }

  @Selector([SeriesState])
  static orphanedSeries({ orphanedSeries }: SeriesStateModel): readonly SeriesModel[] {
    return orphanedSeries;
  }

  @Selector([SeriesState])
  static completedSeries({ completedSeries }: SeriesStateModel): readonly SeriesModel[] {
    return completedSeries;
  }
}
