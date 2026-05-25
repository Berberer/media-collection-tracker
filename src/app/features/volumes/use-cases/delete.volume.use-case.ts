import { inject, Injectable } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { VolumesRepository } from '../repository/volumes.repository';

@Injectable({
  providedIn: 'root',
})
export class DeleteVolumeUseCase implements UseCase<string, boolean> {
  private readonly repository = inject(VolumesRepository);

  /**
   * Delete an existing volume.
   * @param input The ID to identify the volume that is supposed to be deleted.
   * @return Boolean flag whether a volume was found and deleted for the ID.
   */
  execute(input: string): Promise<boolean> {
    return this.repository.deleteVolume(input);
  }
}
