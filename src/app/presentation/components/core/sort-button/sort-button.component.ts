import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowsUpDownSolid,
  heroChevronDownSolid,
  heroChevronUpSolid,
} from '@ng-icons/heroicons/solid';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
  NONE = 'NONE',
}

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrl: './sort-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgIcon],
  providers: [
    provideIcons({
      heroArrowsUpDownSolid,
      heroChevronUpSolid,
      heroChevronDownSolid,
    }),
  ],
})
export class SortButtonComponent {
  readonly SortDirection = SortDirection;
  readonly direction = input<SortDirection>(SortDirection.NONE);
  readonly sortToggled = output<SortDirection>();

  toggle(): void {
    const current = this.direction();
    let next: SortDirection;

    if (current === SortDirection.NONE) {
      next = SortDirection.ASC;
    } else if (current === SortDirection.ASC) {
      next = SortDirection.DESC;
    } else {
      next = SortDirection.NONE;
    }

    this.sortToggled.emit(next);
  }
}
