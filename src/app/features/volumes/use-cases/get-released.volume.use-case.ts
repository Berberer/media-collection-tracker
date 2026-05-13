import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { VolumeModel } from '../model/volume.model';
import { VolumesRepository } from '../repository/volumes.repository';

@Injectable({
  providedIn: 'root',
})
export class GetReleasedVolumeUseCase implements UseCase<void, VolumeModel[]> {
  private readonly repository = inject(VolumesRepository);

  /**
   * Get all series volumes that are released.
   * @returns A list of {@link VolumeModel}.
   */
  execute(): Promise<VolumeModel[]> {
    return this.repository.getReleasedVolumes();
  }
}
