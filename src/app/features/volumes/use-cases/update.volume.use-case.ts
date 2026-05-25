import { inject, Injectable } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { UpdateVolumeModel } from '../model/update.volume.model';
import { VolumeModel } from '../model/volume.model';
import { VolumesRepository } from '../repository/volumes.repository';

@Injectable({
  providedIn: 'root',
})
export class UpdateVolumeUseCase implements UseCase<UpdateVolumeModel, VolumeModel> {
  private readonly repository = inject(VolumesRepository);

  /**
   * Update an existing series volume specified via ID.
   * @param input The data to update the series volume incl. the ID.
   * @returns The updated {@link VolumeModel}.
   */
  execute(input: UpdateVolumeModel): Promise<VolumeModel> {
    return this.repository.updateVolume(input);
  }
}
