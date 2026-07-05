import { inject, Service } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { SecondVolumeInSingleVolumeSeriesError } from '../errors';
import { CreateVolumeModel } from '../model/create.volume.model';
import { VolumeModel } from '../model/volume.model';
import { VolumesRepository } from '../repository/volumes.repository';

@Service()
export class CreateVolumeUseCase implements UseCase<CreateVolumeModel, VolumeModel> {
  private readonly repository = inject(VolumesRepository);

  /**
   * Create a new series volume.
   * @param input The data to create the series volume with.
   * @returns The newly created {@link VolumeModel}.
   * @throws {@link SecondVolumeInSingleVolumeSeriesError} if the series is marked as single-volume and already has a volume.
   */
  async execute(input: CreateVolumeModel): Promise<VolumeModel> {
    if (input.series.singleVolume) {
      const seriesVolumes = await this.repository.getVolumesBySeries(input.series.id);
      if (seriesVolumes.length > 0) {
        throw new SecondVolumeInSingleVolumeSeriesError(input.series.id);
      }
    }

    return this.repository.createVolume(input);
  }
}
