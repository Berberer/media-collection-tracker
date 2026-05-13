import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBars3Solid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, NgIcon, RouterLink],
  providers: [provideIcons({ heroBars3Solid })],
})
export class NavBarComponent {
  private readonly title = inject(Title);

  get currentTitle(): string {
    return this.title.getTitle();
  }

  readonly createSeries = output();
  readonly createVolume = output();
}
