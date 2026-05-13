import { Clonable } from './clonable';

export abstract class HashedTextColors<T> extends Clonable<T> {
  backgroundColorHex = '#FFFFFF';
  textColorHex = '#000000';

  abstract getColorHashingTextBasis(): string;

  setColors(model: Partial<HashedTextColors<T>>): void {
    if (model.backgroundColorHex) {
      this.backgroundColorHex = model.backgroundColorHex;
    }
    if (model.textColorHex) {
      this.textColorHex = model.textColorHex;
    }
  }
}
