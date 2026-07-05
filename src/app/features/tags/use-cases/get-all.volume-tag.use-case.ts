import { inject, Service } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { VolumeTagModel } from '../model/volume-tag.model';
import { TagsRepository } from '../repository/tags.repository';

@Service()
export class GetAllVolumeTagUseCase implements UseCase<void, readonly VolumeTagModel[]> {
  private readonly repository = inject(TagsRepository);

  /**
   * Get all available volume tags.
   * @return A list of {@link VolumeTagModel}.
   */
  execute(): Promise<readonly VolumeTagModel[]> {
    return this.repository.getAllVolumeTags();
  }
}
