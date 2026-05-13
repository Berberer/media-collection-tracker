import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { CreateVolumeTagModel } from '../model/create.volume-tag.model';
import { VolumeTagModel } from '../model/volume-tag.model';
import { TagsRepository } from '../repository/tags.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateVolumeTagUseCase implements UseCase<CreateVolumeTagModel, VolumeTagModel> {
  private readonly repository = inject(TagsRepository);

  /**
   * Create a new volume tag.
   * @param input The data to create the volume tag with.
   * @return The newly created {@link VolumeTagModel}.
   */
  execute(input: CreateVolumeTagModel): Promise<VolumeTagModel> {
    return this.repository.createVolumeTag(input);
  }
}
