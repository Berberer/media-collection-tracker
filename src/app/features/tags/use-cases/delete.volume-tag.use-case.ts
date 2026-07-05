import { inject, Service } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { TagsRepository } from '../repository/tags.repository';

@Service()
export class DeleteVolumeTagUseCase implements UseCase<string, boolean> {
  private readonly repository = inject(TagsRepository);

  /**
   * Delete an existing volume tag.
   * @param input The ID to identify the volume tag that is supposed to be deleted.
   * @return Boolean flag whether a volume tag was found and deleted for the ID.
   */
  execute(input: string): Promise<boolean> {
    return this.repository.deleteVolumeTag(input);
  }
}
