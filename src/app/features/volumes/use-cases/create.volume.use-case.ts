import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { VolumeModel } from '../model/volume.model';
import { CreateVolumeModel } from '../model/create.volume.model';
import { VolumesRepository } from '../repository/volumes.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateVolumeUseCase implements UseCase<CreateVolumeModel, VolumeModel> {
  private readonly repository = inject(VolumesRepository);

  /**
   * Create a new series volume.
   * @param input The data to create the series volume with.
   * @returns The newly created {@link VolumeModel}.
   */
  execute(input: CreateVolumeModel): Promise<VolumeModel> {
    return this.repository.createVolume(input);
  }
}
