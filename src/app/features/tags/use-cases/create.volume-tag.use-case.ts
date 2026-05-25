import { inject, Injectable } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { TagAlreadyExistsError } from '../errors/tags.errors';
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
   * @throws {TagAlreadyExistsError} If a tag with the same name already exists.
   */
  async execute(input: CreateVolumeTagModel): Promise<VolumeTagModel> {
    const existingTags = await this.repository.getAllVolumeTags();
    const tagExists = existingTags.some((tag) => tag.label === input.label);

    if (tagExists) {
      throw new TagAlreadyExistsError(input.label);
    }

    return this.repository.createVolumeTag(input);
  }
}
