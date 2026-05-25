import { HashedTextColors } from '../../../core/hashed-text-colors';
import { ExcludeSuperProperties } from '../../../core/typing-utilities/exclude-super-properties';
import { RemoveMethods } from '../../../core/typing-utilities/remove-methods';

export class SeriesTagModel extends HashedTextColors<SeriesTagModel> {
  readonly id: string;
  readonly label: string;

  constructor(
    model: RemoveMethods<ExcludeSuperProperties<HashedTextColors<SeriesTagModel>, SeriesTagModel>>,
  ) {
    super();
    this.id = model.id;
    this.label = model.label;
  }

  getColorHashingTextBasis(): string {
    return this.label;
  }

  clone(): SeriesTagModel {
    const clone = new SeriesTagModel({ ...this });
    clone.backgroundColorHex = this.backgroundColorHex;
    clone.textColorHex = this.textColorHex;
    return clone;
  }
}
