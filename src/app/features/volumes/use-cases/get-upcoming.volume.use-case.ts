import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { VolumeModel } from '../model/volume.model';
import { VolumesRepository } from '../repository/volumes.repository';

@Injectable({
  providedIn: 'root',
})
export class GetUpcomingVolumeUseCase implements UseCase<Date | undefined, VolumeModel[]> {
  private readonly repository = inject(VolumesRepository);

  /**
   * Get all series volumes that are upcoming.
   * If a max release date is provided, only volumes with a release date before or on that date are returned.
   * @param maxReleaseDate Optional maximum release date for filtering.
   * @returns A list of {@link VolumeModel}.
   */
  async execute(maxReleaseDate?: Date): Promise<VolumeModel[]> {
    const volumes = await this.repository.getUpcomingVolumes();

    if (!maxReleaseDate) {
      return volumes;
    }

    return volumes.filter(
      (volume) => volume.releaseDate !== null && volume.releaseDate <= maxReleaseDate,
    );
  }
}
