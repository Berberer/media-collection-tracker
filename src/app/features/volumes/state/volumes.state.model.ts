import { VolumeModel } from '../model/volume.model';
import { SeriesModel } from '../../series/model/series.model';

export interface VolumesStateModel {
  missingVolumes: VolumeModel[];
  collectedVolumes: Map<SeriesModel, VolumeModel[]>;
  inDeliveryVolumes: VolumeModel[];
  releasedVolumes: VolumeModel[];
  upcomingVolumes: VolumeModel[];
}

export const defaultVolumesState: VolumesStateModel = {
  missingVolumes: [],
  collectedVolumes: new Map<SeriesModel, VolumeModel[]>(),
  inDeliveryVolumes: [],
  releasedVolumes: [],
  upcomingVolumes: [],
};
