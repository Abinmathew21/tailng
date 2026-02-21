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
    '--tng-badge-bg': 'var(--tng-semantic-accent-brand)',
    '--tng-badge-fg': 'var(--tng-color-white)',
    '--tng-badge-size': '1.35rem',
    '--tng-badge-font-size': '0.75rem',
  };
}
