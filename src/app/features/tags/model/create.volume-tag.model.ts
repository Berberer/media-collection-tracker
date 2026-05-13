import { RemoveMethods } from '../../../core/typing-utilities/remove-methods';

export class CreateVolumeTagModel {
  readonly label: string;

  constructor(model: RemoveMethods<CreateVolumeTagModel>) {
    this.label = model.label;
  }
}
