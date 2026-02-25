import { Component } from '@angular/core';
import { TngBadgeComponent } from '@tailng-ui/components';

type BadgeStyleMap = Readonly<Record<string, string>>;

@Component({
  selector: 'app-badge-playground-page',
  imports: [TngBadgeComponent],
  templateUrl: './badge-playground-page.component.html',
  styleUrl: './badge-playground-page.component.css',
})
export class BadgePlaygroundPageComponent {
  protected readonly customBadgeStyle: BadgeStyleMap = {
    '--tng-badge-bg': '#0ea5e9',
    '--tng-badge-fg': '#082f49',
    '--tng-badge-size': '1.35rem',
    '--tng-badge-font-size': '0.75rem',
  };
}
