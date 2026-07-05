import { Service } from '@angular/core';
import ColorHash from 'color-hash';
import { ContrastRatioChecker } from 'contrast-ratio-checker';

import { HashedTextColors } from '../hashed-text-colors';

const HEX_WHITE = '#FFFFFF';
const HEX_BLACK = '#000000';

@Service()
export class ColorService {
  private readonly colorHasher = new ColorHash();
  private readonly contrastRatioChecker = new ContrastRatioChecker();

  public stringToColorHex(s: string): string {
    return this.colorHasher.hex(s);
  }

  public getFontColorForBackgroundColor(backgroundColorHex: string): string {
    const scoreWhite = this.contrastRatioChecker.getContrastRatioByHex(
      backgroundColorHex,
      HEX_WHITE,
    );
    const scoreBlack = this.contrastRatioChecker.getContrastRatioByHex(
      backgroundColorHex,
      HEX_BLACK,
    );

    if (scoreWhite >= 7 && scoreWhite > scoreBlack) {
      return HEX_WHITE;
    } else {
      return HEX_BLACK;
    }
  }

  public applyTextColorHashing<T extends HashedTextColors<T>>(model: T): void {
    const backgroundColorHex = this.stringToColorHex(model.getColorHashingTextBasis());
    const textColorHex = this.getFontColorForBackgroundColor(backgroundColorHex);

    model.setColors({
      backgroundColorHex,
      textColorHex,
    });
  }
}
