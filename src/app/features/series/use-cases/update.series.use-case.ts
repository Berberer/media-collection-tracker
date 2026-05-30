import { inject, Injectable } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { VolumeModel } from '../../volumes/model/volume.model';
import { VolumesRepository } from '../../volumes/repository/volumes.repository';
import {
  SeriesCompletedWithMissingVolumesError,
  SeriesSingleVolumeWithMultipleVolumesError,
} from '../errors';
import { SeriesModel } from '../model/series.model';
import { UpdateSeriesModel } from '../model/update.series.model';
import { SeriesRepository } from '../repository/series.repository';

@Injectable({
  providedIn: 'root',
})
export class UpdateSeriesUseCase implements UseCase<UpdateSeriesModel, SeriesModel> {
  private readonly seriesRepository = inject(SeriesRepository);
  private readonly volumeRepository = inject(VolumesRepository);

  /**
   * Update an existing series specified via ID.
   * @param input The data to update the series incl. the ID.
   * @returns The updated {@link SeriesModel}.
   * @throws {@link SeriesSingleVolumeWithMultipleVolumesError} If series is set to single volume but has multiple volumes attached.
   * @throws {@link SeriesCompletedWithMissingVolumesError} If series is marked as completed but still has missing volumes.
   */
  async execute(input: UpdateSeriesModel): Promise<SeriesModel> {
    const currentSeries = await this.seriesRepository.getSeriesById(input.id);
    const volumes: readonly VolumeModel[] = await this.volumeRepository.getVolumesBySeries(
      input.id,
    );

    if (input.singleVolume && volumes.length > 1) {
      throw new SeriesSingleVolumeWithMultipleVolumesError(input.id, volumes.length);
    }

    if (!currentSeries.completed && input.completed) {
      const missingVolumes = volumes.filter(
        (volume) => volume.inDelivery || volume.purchaseDate === null,
      );
      if (missingVolumes.length > 0) {
        throw new SeriesCompletedWithMissingVolumesError(input.id, missingVolumes.length);
      }
    }

    return this.seriesRepository.updateSeries(input);
  }
}
