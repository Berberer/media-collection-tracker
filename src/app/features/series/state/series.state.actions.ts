import { CreateSeriesModel } from '../model/create.series.model';
import { CreateSeriesVolumeModel } from '../model/create.series-volume.model';
import { SeriesModel } from '../model/series.model';
import { UpdateSeriesModel } from '../model/update.series.model';

const ACTION_SCOPE = '[Series]';

export namespace Series {
  export class GetAll {
    static readonly type = `${ACTION_SCOPE} Get All`;
  }

  export class GetIncomplete {
    static readonly type = `${ACTION_SCOPE} Get Incomplete`;
  }

  export class GetOrphaned {
    static readonly type = `${ACTION_SCOPE} Get Orphaned`;
  }

  export class GetCompleted {
    static readonly type = `${ACTION_SCOPE} Get Completed`;
  }

  export class Create {
    static readonly type = `${ACTION_SCOPE} Create`;
    constructor(readonly createModel: CreateSeriesModel) {}
  }

  export class Update {
    static readonly type = `${ACTION_SCOPE} Update`;
    constructor(readonly updateModel: UpdateSeriesModel) {}
  }

  export class AddVolumeToSeries {
    static readonly type = `${ACTION_SCOPE} Add Volume to Series`;
    constructor(
      readonly series: SeriesModel,
      readonly createVolumeModel: CreateSeriesVolumeModel,
    ) {}
  }

  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete`;
    constructor(readonly id: string) {}
  }
}
