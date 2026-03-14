import { Component, signal } from '@angular/core';
import { TngBadgeComponent } from '@tailng-ui/components';
import type { TngBadgePosition } from '@tailng-ui/primitives';

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

  protected readonly runtimeBadgeCount = signal(12);
  protected readonly runtimeBadgeDot = signal(false);
  protected readonly runtimeBadgeHidden = signal(false);
  protected readonly runtimeBadgePosition = signal<TngBadgePosition>('top-end');
  protected readonly runtimeHostWidth = signal(176);
  protected readonly runtimeHostHeight = signal(56);

  protected setRuntimeBadgePosition(position: TngBadgePosition): void {
    this.runtimeBadgePosition.set(position);
  }

  protected updateRuntimeBadgeCount(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.runtimeBadgeCount.set(Number(input.value));
  }

  protected updateRuntimeHostWidth(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.runtimeHostWidth.set(Number(input.value));
  }

  protected updateRuntimeHostHeight(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.runtimeHostHeight.set(Number(input.value));
  }

  protected toggleRuntimeDot(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.runtimeBadgeDot.set(input.checked);
  }

  protected toggleRuntimeHidden(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.runtimeBadgeHidden.set(input.checked);
  }
}
