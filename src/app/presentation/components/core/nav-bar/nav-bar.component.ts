import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBars3Solid } from '@ng-icons/heroicons/solid';
import { TranslatePipe } from '@ngx-translate/core';

import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, NgIcon, RouterLink],
  providers: [provideIcons({ heroBars3Solid })],
})
export class NavBarComponent {
  readonly titleService = inject(TitleService);

  readonly createSeries = output();
  readonly createVolume = output();
}
