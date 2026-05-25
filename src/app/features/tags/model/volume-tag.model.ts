import { HashedTextColors } from '../../../core/hashed-text-colors';
import { ExcludeSuperProperties } from '../../../core/typing-utilities/exclude-super-properties';
import { RemoveMethods } from '../../../core/typing-utilities/remove-methods';

export class VolumeTagModel extends HashedTextColors<VolumeTagModel> {
  readonly id: string;
  readonly label: string;

  constructor(
    model: RemoveMethods<ExcludeSuperProperties<HashedTextColors<VolumeTagModel>, VolumeTagModel>>,
  ) {
    super();
    this.id = model.id;
    this.label = model.label;
  }

  getColorHashingTextBasis(): string {
    return this.label;
  }

  clone(): VolumeTagModel {
    const clone = new VolumeTagModel({ ...this });
    clone.backgroundColorHex = this.backgroundColorHex;
    clone.textColorHex = this.textColorHex;
    return clone;
  }
}
