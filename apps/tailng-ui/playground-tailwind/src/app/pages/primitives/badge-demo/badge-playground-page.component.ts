import { Component } from '@angular/core';
import { TngBadgeComponent } from '@tailng-ui/components';

type BadgeStyleMap = Readonly<Record<string, string>>;

@Component({
  selector: 'app-badge-playground-page',
  imports: [TngBadgeComponent],
  templateUrl: './badge-playground-page.component.html',
})
export class BadgePlaygroundPageComponent {
  protected readonly customBadgeStyle: BadgeStyleMap = {
    '--tng-badge-bg': 'var(--tng-semantic-accent-brand)',
    '--tng-badge-fg': 'var(--tng-color-white)',
    '--tng-badge-size': '1.35rem',
    '--tng-badge-font-size': '0.75rem',
  };

  protected readonly solidVariantStyle: BadgeStyleMap = {
    '--tng-badge-bg': 'var(--tng-semantic-accent-brand)',
    '--tng-badge-fg': 'var(--tng-color-white)',
  };

  protected readonly softVariantStyle: BadgeStyleMap = {
    '--tng-badge-bg': 'color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, white)',
    '--tng-badge-fg': 'var(--tng-semantic-accent-brand)',
  };

  protected readonly outlineVariantStyle: BadgeStyleMap = {
    '--tng-badge-bg': 'var(--tng-semantic-background-surface)',
    '--tng-badge-fg': 'var(--tng-semantic-foreground-primary)',
  };
}
