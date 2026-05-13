import { Selector } from '@ngxs/store';
import { VolumesState } from './volumes.state';
import { VolumesStateModel } from './volumes.state.model';
import { VolumeModel } from '../model/volume.model';
import { SeriesModel } from '../../series/model/series.model';

export abstract class VolumesStateSelectors {
  @Selector([VolumesState])
  static stateModel(stateModel: VolumesStateModel): VolumesStateModel {
    return stateModel;
  }

  @Selector([VolumesState])
  static missingVolumes({ missingVolumes }: VolumesStateModel): readonly VolumeModel[] {
    return missingVolumes;
  }

  @Selector([VolumesState])
  static collectedVolumes({
    collectedVolumes,
  }: VolumesStateModel): Map<SeriesModel, VolumeModel[]> {
    return collectedVolumes;
  }

  @Selector([VolumesState])
  static inDeliveryVolumes({ inDeliveryVolumes }: VolumesStateModel): readonly VolumeModel[] {
    return inDeliveryVolumes;
  }

  @Selector([VolumesState])
  static releasedVolumes({ releasedVolumes }: VolumesStateModel): readonly VolumeModel[] {
    return releasedVolumes;
  }

  @Selector([VolumesState])
  static upcomingVolumes({ upcomingVolumes }: VolumesStateModel): readonly VolumeModel[] {
    return upcomingVolumes;
  }
}
