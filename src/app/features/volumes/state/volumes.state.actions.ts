import { CreateVolumeModel } from '../model/create.volume.model';
import { UpdateVolumeModel } from '../model/update.volume.model';

const ACTION_SCOPE = '[Volumes]';

export namespace Volumes {
  export class GetVolumesOfSeries {
    static readonly type = `${ACTION_SCOPE} Get Volumes Of Series`;
    constructor(readonly seriesId: string) {}
  }

  export class GetMissing {
    static readonly type = `${ACTION_SCOPE} Get Missing`;
  }

  export class GetCollected {
    static readonly type = `${ACTION_SCOPE} Get Collected`;
  }

  export class GetInDelivery {
    static readonly type = `${ACTION_SCOPE} Get In Delivery`;
  }

  export class GetReleased {
    static readonly type = `${ACTION_SCOPE} Get Released`;
  }

  export class GetUpcoming {
    static readonly type = `${ACTION_SCOPE} Get Upcoming`;
  }

  export class Create {
    static readonly type = `${ACTION_SCOPE} Create`;
    constructor(readonly createModel: CreateVolumeModel) {}
  }

  export class Update {
    static readonly type = `${ACTION_SCOPE} Update`;
    constructor(readonly updateModel: UpdateVolumeModel) {}
  }

  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete`;
    constructor(readonly id: string) {}
  }
}
