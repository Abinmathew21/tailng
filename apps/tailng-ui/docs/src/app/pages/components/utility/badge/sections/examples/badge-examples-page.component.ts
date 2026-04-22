import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { type TngBadgePosition } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngBadge } from '@tailng-ui/components';

type ExampleVariant = 'plain' | 'tailwind';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: tsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

@Component({
  selector: 'app-badge-examples-page',
  imports: [TngBadge, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './badge-examples-page.component.html',
  styleUrl: './badge-examples-page.component.css',
})
export class BadgeExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainCount = signal(12);
  protected readonly tailwindCount = signal(21);
  protected readonly plainPosition = signal<TngBadgePosition>('top-end');
  protected readonly tailwindPosition = signal<TngBadgePosition>('top-end');
  protected readonly plainHidden = signal(false);
  protected readonly tailwindHidden = signal(false);
  protected readonly plainWidth = signal(176);
  protected readonly tailwindWidth = signal(176);
  protected readonly plainHeight = signal(56);
  protected readonly tailwindHeight = signal(56);

  protected readonly notificationsPlainCodeTabs = createCodeTabs(
    'badge-example-notifications-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-badge-notifications-plain',",
      '  standalone: true,',
      '  imports: [TngBadge],',
      "  templateUrl: './badge-notifications-plain.component.html',",
      "  styleUrl: './badge-notifications-plain.component.css',",
      '})',
      'export class BadgeNotificationsPlainComponent {',
      '  protected readonly count = signal(12);',
      '}',
    ].join('\n'),
    [
      '<button type="button" [tngBadge]="count()" tngBadgeTone="info" class="badge-example-host">Inbox</button>',
      '<button type="button" [tngBadge]="count() * 8" [tngBadgeMax]="99" tngBadgeTone="danger" class="badge-example-host">Alerts</button>',
      '<button type="button" [tngBadge]="null" [tngBadgeDot]="count() > 0" tngBadgeTone="success" class="badge-example-host">Presence</button>',
      '',
    ].join('\n'),
    [
      '.badge-example-host {',
      '  border: 1px solid var(--tng-semantic-border-strong);',
      '  border-radius: 0.6rem;',
      '  min-height: 2.4rem;',
      '  padding: 0 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly notificationsTailwindCodeTabs = createCodeTabs(
    'badge-example-notifications-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-badge-notifications-tailwind',",
      '  standalone: true,',
      '  imports: [TngBadge],',
      "  templateUrl: './badge-notifications-tailwind.component.html',",
      "  styleUrl: './badge-notifications-tailwind.component.css',",
      '})',
      'export class BadgeNotificationsTailwindComponent {',
      '  protected readonly count = signal(21);',
      '',
      '  protected adjustCount(delta: number): void {',
      '    this.count.update((value) => Math.max(0, value + delta));',
      '  }',
      '',
      '  protected clearCount(): void {',
      '    this.count.set(0);',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <div class="flex flex-wrap gap-3">',
      '    <button type="button" [tngBadge]="count()" class="inline-flex min-h-10 min-w-28 items-center rounded-lg border border-tng-border-subtle bg-tng-bg-base px-4 py-2 text-sm font-semibold text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)] transition hover:bg-tng-bg-muted">Inbox</button>',
      '    <button type="button" [tngBadge]="count() * 6" [tngBadgeMax]="99" tngBadgeTone="warning" class="inline-flex min-h-10 min-w-28 items-center rounded-lg border border-tng-border-subtle bg-tng-bg-base px-4 py-2 text-sm font-semibold text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)] transition hover:bg-tng-bg-muted">Alerts</button>',
      '    <button type="button" [tngBadge]="null" [tngBadgeDot]="count() > 0" tngBadgeTone="success" class="inline-flex min-h-10 min-w-28 items-center rounded-lg border border-tng-border-subtle bg-tng-bg-base px-4 py-2 text-sm font-semibold text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)] transition hover:bg-tng-bg-muted">Presence</button>',
      '  </div>',
      '  <div class="flex flex-wrap gap-2">',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="adjustCount(1)">+1</button>',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="adjustCount(-1)">-1</button>',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="clearCount()">Clear</button>',
      '  </div>',
      '  <p class="m-0 text-sm text-tng-fg-secondary">count: {{ count() }}</p>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly runtimePlainCodeTabs = createCodeTabs(
    'badge-example-runtime-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge, type TngBadgePosition } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-badge-runtime-plain',",
      '  standalone: true,',
      '  imports: [TngBadge],',
      "  templateUrl: './badge-runtime-plain.component.html',",
      "  styleUrl: './badge-runtime-plain.component.css',",
      '})',
      'export class BadgeRuntimePlainComponent {',
      "  protected readonly position = signal<TngBadgePosition>('top-end');",
      '  protected readonly hidden = signal(false);',
      '}',
    ].join('\n'),
    [
      '<button type="button" [tngBadge]="14" [tngBadgePosition]="position()" [tngBadgeHidden]="hidden()" class="badge-runtime-host">',
      '  Runtime host',
      '</button>',
      '',
    ].join('\n'),
    [
      '.badge-runtime-host {',
      '  min-width: 11rem;',
      '  min-height: 3.5rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly runtimeTailwindCodeTabs = createCodeTabs(
    'badge-example-runtime-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge, type TngBadgePosition } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-badge-runtime-tailwind',",
      '  standalone: true,',
      '  imports: [TngBadge],',
      "  templateUrl: './badge-runtime-tailwind.component.html',",
      "  styleUrl: './badge-runtime-tailwind.component.css',",
      '})',
      'export class BadgeRuntimeTailwindComponent {',
      "  protected readonly position = signal<TngBadgePosition>('top-end');",
      '  protected readonly hidden = signal(false);',
      '  protected readonly width = signal(176);',
      '  protected readonly height = signal(56);',
      '',
      '  protected setPosition(next: TngBadgePosition): void {',
      '    this.position.set(next);',
      '  }',
      '',
      '  protected toggleHidden(event: Event): void {',
      '    const input = event.target as HTMLInputElement;',
      '    this.hidden.set(input.checked);',
      '  }',
      '',
      '  protected updateWidth(event: Event): void {',
      '    const input = event.target as HTMLInputElement;',
      '    this.width.set(Number(input.value));',
      '  }',
      '',
      '  protected updateHeight(event: Event): void {',
      '    const input = event.target as HTMLInputElement;',
      '    this.height.set(Number(input.value));',
      '  }',
      '',
      '  protected runtimeSummary(): string {',
      "    return `position: ${this.position()} | hidden: ${this.hidden() ? 'yes' : 'no'}`;",
      '  }',
      '}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <button',
      '    type="button"',
      '    [tngBadge]="14"',
      '    [tngBadgePosition]="position()"',
      '    [tngBadgeHidden]="hidden()"',
      '    class="inline-flex items-center justify-center rounded-lg border border-tng-border-subtle bg-tng-bg-base px-4 py-2 text-sm font-semibold text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)] transition-[width,height] hover:bg-tng-bg-muted"',
      '    [style.width.px]="width()"',
      '    [style.height.px]="height()"',
      '  >',
      '    Runtime host',
      '  </button>',
      '  <div class="flex flex-wrap gap-2">',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="setPosition(\'top-start\')">top-start</button>',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="setPosition(\'top-end\')">top-end</button>',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="setPosition(\'bottom-start\')">bottom-start</button>',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="setPosition(\'bottom-end\')">bottom-end</button>',
      '  </div>',
      '  <div class="badge-tailwind-runtime-fields flex flex-wrap items-center gap-4 text-sm text-tng-fg-secondary">',
      '    <label class="inline-flex items-center gap-2">',
      '      Hidden',
      '      <input type="checkbox" [checked]="hidden()" (change)="toggleHidden($event)" />',
      '    </label>',
      '    <label class="inline-flex items-center gap-2">',
      '      Width',
      '      <input type="range" min="140" max="320" [value]="width()" (input)="updateWidth($event)" />',
      '    </label>',
      '    <label class="inline-flex items-center gap-2">',
      '      Height',
      '      <input type="range" min="48" max="140" [value]="height()" (input)="updateHeight($event)" />',
      '    </label>',
      '  </div>',
      '  <p class="m-0 text-sm text-tng-fg-secondary">{{ runtimeSummary() }}</p>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.badge-tailwind-runtime-fields input[type=\'checkbox\'],',
      '.badge-tailwind-runtime-fields input[type=\'range\'] {',
      '  accent-color: var(--tng-semantic-accent-brand);',
      '}',
      '',
    ].join('\n'),
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected adjustCount(scope: ExampleVariant, delta: number): void {
    if (scope === 'plain') {
      this.plainCount.update((value) => Math.max(0, value + delta));
      return;
    }

    this.tailwindCount.update((value) => Math.max(0, value + delta));
  }

  protected clearCount(scope: ExampleVariant): void {
    if (scope === 'plain') {
      this.plainCount.set(0);
      return;
    }

    this.tailwindCount.set(0);
  }

  protected setPosition(scope: ExampleVariant, position: TngBadgePosition): void {
    if (scope === 'plain') {
      this.plainPosition.set(position);
      return;
    }

    this.tailwindPosition.set(position);
  }

  protected toggleHidden(scope: ExampleVariant, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (scope === 'plain') {
      this.plainHidden.set(input.checked);
      return;
    }

    this.tailwindHidden.set(input.checked);
  }

  protected updateWidth(scope: ExampleVariant, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (scope === 'plain') {
      this.plainWidth.set(Number(input.value));
      return;
    }

    this.tailwindWidth.set(Number(input.value));
  }

  protected updateHeight(scope: ExampleVariant, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (scope === 'plain') {
      this.plainHeight.set(Number(input.value));
      return;
    }

    this.tailwindHeight.set(Number(input.value));
  }

  protected count(scope: ExampleVariant): number {
    return scope === 'plain' ? this.plainCount() : this.tailwindCount();
  }

  protected position(scope: ExampleVariant): TngBadgePosition {
    return scope === 'plain' ? this.plainPosition() : this.tailwindPosition();
  }

  protected hidden(scope: ExampleVariant): boolean {
    return scope === 'plain' ? this.plainHidden() : this.tailwindHidden();
  }

  protected width(scope: ExampleVariant): number {
    return scope === 'plain' ? this.plainWidth() : this.tailwindWidth();
  }

  protected height(scope: ExampleVariant): number {
    return scope === 'plain' ? this.plainHeight() : this.tailwindHeight();
  }

  protected runtimeSummary(scope: ExampleVariant): string {
    return `count: ${this.count(scope)} | position: ${this.position(scope)} | hidden: ${this.hidden(scope) ? 'yes' : 'no'}`;
  }
}
