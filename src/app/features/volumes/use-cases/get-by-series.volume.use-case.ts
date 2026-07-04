import { inject, Injectable } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { VolumeModel } from '../model/volume.model';
import { VolumesRepository } from '../repository/volumes.repository';

@Injectable({
  providedIn: 'root',
})
export class GetBySeriesVolumeUseCase implements UseCase<string, VolumeModel[]> {
  private readonly repository = inject(VolumesRepository);

  /**
   * Get all series volumes for a specific series.
   * @param input The ID of the series.
   * @returns A list of {@link VolumeModel}.
   */
  execute(input: string): Promise<VolumeModel[]> {
    return this.repository.getVolumesBySeries(input);
  }
}
