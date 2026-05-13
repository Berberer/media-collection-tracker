import { RemoveMethods } from '../../../core/typing-utilities/remove-methods';

export class CreateSeriesTagModel {
  readonly label: string;

  constructor(model: RemoveMethods<CreateSeriesTagModel>) {
    this.label = model.label;
  }
}
