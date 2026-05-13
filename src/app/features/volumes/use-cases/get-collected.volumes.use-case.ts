import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { VolumeModel } from '../model/volume.model';
import { VolumesRepository } from '../repository/volumes.repository';
import { SeriesModel } from '../../series/model/series.model';

@Injectable({
  providedIn: 'root',
})
export class GetCollectedVolumesUseCase implements UseCase<void, Map<SeriesModel, VolumeModel[]>> {
  private readonly repository = inject(VolumesRepository);

  /**
   * Get all series volumes that are already collected, grouped by series.
   * @returns A Map where keys are {@link SeriesModel} and values are arrays of {@link VolumeModel}.
   */
  async execute(): Promise<Map<SeriesModel, VolumeModel[]>> {
    const volumes = await this.repository.getCollectedVolumes();
    const groupedVolumes = new Map<SeriesModel, VolumeModel[]>();

    volumes.forEach((volume) => {
      const series = volume.series;

      // Find existing series in map to avoid duplicate series objects as keys if they have same ID
      let seriesKey = Array.from(groupedVolumes.keys()).find((s) => s.id === series.id);

      if (!seriesKey) {
        seriesKey = series;
        groupedVolumes.set(seriesKey, []);
      }

      groupedVolumes.get(seriesKey)!.push(volume);
    });

    // Sort volumes by sequence number for each series
    for (const volumes of groupedVolumes.values()) {
      volumes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    }

    return groupedVolumes;
  }
}
