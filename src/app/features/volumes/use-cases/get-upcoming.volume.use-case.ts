import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { VolumeModel } from '../model/volume.model';
import { VolumesRepository } from '../repository/volumes.repository';

@Injectable({
  providedIn: 'root',
})
export class GetUpcomingVolumeUseCase implements UseCase<void, VolumeModel[]> {
  private readonly repository = inject(VolumesRepository);

  /**
   * Get all series volumes that are upcoming.
   * @returns A list of {@link VolumeModel}.
   */
  async execute(): Promise<VolumeModel[]> {
    return this.repository.getUpcomingVolumes();
  }
}
