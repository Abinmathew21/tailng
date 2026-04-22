import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { type TngBadgePosition, TngBadge } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

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
  selector: 'app-headless-badge-examples-page',
  imports: [TngBadge, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './badge-examples-page.component.html',
  styleUrl: './badge-examples-page.component.css',
})
export class HeadlessBadgeExamplesPageComponent implements OnDestroy {
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
    'headless-badge-notifications-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-badge-notifications-plain-css',",
      '  standalone: true,',
      '  imports: [TngBadge],',
      "  templateUrl: './headless-badge-notifications-plain-css.component.html',",
      "  styleUrl: './headless-badge-notifications-plain-css.component.css',",
      '})',
      'export class HeadlessBadgeNotificationsPlainCssComponent {',
      '  protected readonly count = signal(12);',
      '}',
    ].join('\n'),
    [
      '<button type="button" [tngBadge]="count()" class="badge-example-host">Inbox</button>',
      '<button type="button" [tngBadge]="count() * 8" [tngBadgeMax]="99" class="badge-example-host">Alerts</button>',
      '<button type="button" [tngBadge]="null" [tngBadgeDot]="count() > 0" class="badge-example-host">Presence</button>',
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
    'headless-badge-notifications-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-badge-notifications-tailwind',",
      '  standalone: true,',
      '  imports: [TngBadge],',
      "  templateUrl: './headless-badge-notifications-tailwind.component.html',",
      "  styleUrl: './headless-badge-notifications-tailwind.component.css',",
      '})',
      'export class HeadlessBadgeNotificationsTailwindComponent {',
      '  protected readonly count = signal(21);',
      '}',
    ].join('\n'),
    [
      '<div class="grid gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
      '  <div class="flex flex-wrap gap-3">',
      '    <button type="button" [tngBadge]="count()" class="inline-flex min-h-10 min-w-28 items-center rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] px-4 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">Inbox</button>',
      '    <button type="button" [tngBadge]="count() * 6" [tngBadgeMax]="99" class="inline-flex min-h-10 min-w-28 items-center rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] px-4 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">Alerts</button>',
      '    <button type="button" [tngBadge]="null" [tngBadgeDot]="count() > 0" class="inline-flex min-h-10 min-w-28 items-center rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] px-4 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">Presence</button>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly runtimePlainCodeTabs = createCodeTabs(
    'headless-badge-runtime-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge, type TngBadgePosition } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-badge-runtime-plain-css',",
      '  standalone: true,',
      '  imports: [TngBadge],',
      "  templateUrl: './headless-badge-runtime-plain-css.component.html',",
      "  styleUrl: './headless-badge-runtime-plain-css.component.css',",
      '})',
      'export class HeadlessBadgeRuntimePlainCssComponent {',
      "  protected readonly position = signal<TngBadgePosition>('top-end');",
      '  protected readonly hidden = signal(false);',
      '}',
    ].join('\n'),
    [
      '<button',
      '  type="button"',
      '  [tngBadge]="14"',
      '  [tngBadgePosition]="position()"',
      '  [tngBadgeHidden]="hidden()"',
      '  class="badge-runtime-host"',
      '>',
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
    'headless-badge-runtime-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge, type TngBadgePosition } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-badge-runtime-tailwind',",
      '  standalone: true,',
      '  imports: [TngBadge],',
      "  templateUrl: './headless-badge-runtime-tailwind.component.html',",
      "  styleUrl: './headless-badge-runtime-tailwind.component.css',",
      '})',
      'export class HeadlessBadgeRuntimeTailwindComponent {',
      "  protected readonly position = signal<TngBadgePosition>('top-end');",
      '  protected readonly hidden = signal(false);',
      '}',
    ].join('\n'),
    [
      '<div class="grid gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
      '  <button',
      '    type="button"',
      '    [tngBadge]="14"',
      '    [tngBadgePosition]="position()"',
      '    [tngBadgeHidden]="hidden()"',
      '    class="inline-flex min-h-14 min-w-44 items-center justify-center rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] px-4 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]"',
      '  >',
      '    Runtime host',
      '  </button>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
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
