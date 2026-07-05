import { inject, Service } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { VolumeModel } from '../model/volume.model';
import { VolumesRepository } from '../repository/volumes.repository';

@Service()
export class GetInDeliveryVolumeUseCase implements UseCase<void, VolumeModel[]> {
  private readonly repository = inject(VolumesRepository);

  /**
   * Get all series volumes that are currently in delivery.
   * @returns A list of {@link VolumeModel}.
   */
  execute(): Promise<VolumeModel[]> {
    return this.repository.getInDeliveryVolumes();
  }
}
