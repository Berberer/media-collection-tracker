import { CreateVolumeTagModel } from '../model/create.volume-tag.model';

const SERIES_ACTION_SCOPE = '[Series Tags]';
const VOLUME_ACTION_SCOPE = '[Volume Tags]';

export namespace SeriesTags {
  export class GetAll {
    static readonly type = `${SERIES_ACTION_SCOPE} Get All`;
    constructor(readonly globalEvent = false) {}
  }

  export class Create {
    static readonly type = `${SERIES_ACTION_SCOPE} Create`;
    constructor(readonly createModel: CreateVolumeTagModel) {}
  }

  export class Delete {
    static readonly type = `${SERIES_ACTION_SCOPE} Delete`;
    constructor(readonly id: string) {}
  }
}

export namespace VolumeTags {
  export class GetAll {
    static readonly type = `${VOLUME_ACTION_SCOPE} Get All`;
    constructor(readonly globalEvent = false) {}
  }

  export class Create {
    static readonly type = `${VOLUME_ACTION_SCOPE} Create`;
    constructor(readonly createModel: CreateVolumeTagModel) {}
  }

  export class Delete {
    static readonly type = `${VOLUME_ACTION_SCOPE} Delete`;
    constructor(readonly id: string) {}
  }
}
