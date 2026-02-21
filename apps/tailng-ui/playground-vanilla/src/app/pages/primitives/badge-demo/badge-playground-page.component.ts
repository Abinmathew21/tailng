import { Component } from '@angular/core';
import { TngBadge } from '@tailng-ui/components';

type BadgeStyleMap = Readonly<Record<string, string>>;

@Component({
  selector: 'app-badge-playground-page',
  imports: [TngBadge],
  templateUrl: './badge-playground-page.component.html',
  styleUrl: './badge-playground-page.component.css',
})
export class BadgePlaygroundPageComponent {
  protected readonly customBadgeStyle: BadgeStyleMap = {
    '--tng-badge-bg': '#0891b2',
    '--tng-badge-fg': '#e0f2fe',
    '--tng-badge-size': '1.35rem',
    '--tng-badge-font-size': '0.75rem',
  };
}
