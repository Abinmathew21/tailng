import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngBadge } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type BadgePreviewScope = 'plain' | 'tailwind';

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
  selector: 'app-headless-badge-overview-page',
  imports: [
    TngBadge,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './badge-overview-page.component.html',
  styleUrl: './badge-overview-page.component.css',
})
export class HeadlessBadgeOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly importCode = "import { TngBadge } from '@tailng-ui/primitives';";
  protected readonly basicUsageCode = [
    '<button',
    '  type="button"',
    '  [tngBadge]="notifications()"',
    '  [tngBadgeMax]="99"',
    '>',
    '  Inbox',
    '</button>',
    '',
  ].join('\n');

  protected readonly plainCount = signal(12);
  protected readonly tailwindCount = signal(4);
  protected readonly plainDot = signal(true);
  protected readonly tailwindDot = signal(false);

  protected readonly plainCssCodeTabs = createCodeTabs(
    'headless-badge-overview-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-badge-overview-plain-css',",
      '  standalone: true,',
      '  imports: [TngBadge],',
      "  templateUrl: './headless-badge-overview-plain-css.component.html',",
      "  styleUrl: './headless-badge-overview-plain-css.component.css',",
      '})',
      'export class HeadlessBadgeOverviewPlainCssComponent {',
      '  protected readonly count = signal(12);',
      '  protected readonly dot = signal(true);',
      '',
      '  protected increment(): void {',
      '    this.count.update((value) => value + 1);',
      '  }',
      '',
      '  protected reset(): void {',
      '    this.count.set(0);',
      '  }',
      '',
      '  protected toggleDot(): void {',
      '    this.dot.update((value) => !value);',
      '  }',
      '',
      '  protected status(): string {',
      "    return `count: ${this.count()} | dot: ${this.dot() ? 'on' : 'off'}`;",
      '  }',
      '}',
    ].join('\n'),
    [
      '<div class="badge-preview-shell badge-preview-shell--plain">',
      '  <div class="badge-preview-row">',
      '    <button type="button" class="badge-host" [tngBadge]="count()">Inbox</button>',
      '    <button type="button" class="badge-host" [tngBadge]="count() * 8" [tngBadgeMax]="99">Alerts</button>',
      '    <button type="button" class="badge-host" [tngBadge]="null" [tngBadgeDot]="dot()">Presence</button>',
      '  </div>',
      '  <div class="badge-preview-controls">',
      '    <button type="button" class="badge-control" (click)="increment()">+1 count</button>',
      '    <button type="button" class="badge-control" (click)="toggleDot()">Toggle dot</button>',
      '    <button type="button" class="badge-control" (click)="reset()">Reset</button>',
      '  </div>',
      '  <p class="badge-preview-status">{{ status() }}</p>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.badge-preview-shell--plain {',
      '  background: var(--tng-semantic-background-base);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.85rem;',
      '  padding: 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-badge-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-badge-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngBadge],',
      "  templateUrl: './headless-badge-overview-tailwind.component.html',",
      "  styleUrl: './headless-badge-overview-tailwind.component.css',",
      '})',
      'export class HeadlessBadgeOverviewTailwindComponent {',
      '  protected readonly count = signal(4);',
      '  protected readonly dot = signal(false);',
      '',
      '  protected increment(): void {',
      '    this.count.update((value) => value + 1);',
      '  }',
      '',
      '  protected reset(): void {',
      '    this.count.set(0);',
      '  }',
      '',
      '  protected toggleDot(): void {',
      '    this.dot.update((value) => !value);',
      '  }',
      '',
      '  protected status(): string {',
      "    return `count: ${this.count()} | dot: ${this.dot() ? 'on' : 'off'}`;",
      '  }',
      '}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <div class="flex flex-wrap gap-3">',
      '    <button type="button" [tngBadge]="count()" class="inline-flex min-h-10 min-w-28 items-center rounded-lg border border-tng-border-subtle bg-tng-bg-base px-4 py-2 text-sm font-semibold text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)] transition hover:bg-tng-bg-muted">Inbox</button>',
      '    <button type="button" [tngBadge]="count() * 11" [tngBadgeMax]="99" class="inline-flex min-h-10 min-w-28 items-center rounded-lg border border-tng-border-subtle bg-tng-bg-base px-4 py-2 text-sm font-semibold text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)] transition hover:bg-tng-bg-muted">Alerts</button>',
      '    <button type="button" [tngBadge]="null" [tngBadgeDot]="dot()" class="inline-flex min-h-10 min-w-28 items-center rounded-lg border border-tng-border-subtle bg-tng-bg-base px-4 py-2 text-sm font-semibold text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)] transition hover:bg-tng-bg-muted">Presence</button>',
      '  </div>',
      '  <div class="flex flex-wrap gap-2">',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="increment()">+1 count</button>',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="toggleDot()">Toggle dot</button>',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="reset()">Reset</button>',
      '  </div>',
      '  <p class="m-0 text-sm text-tng-fg-secondary">{{ status() }}</p>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected increment(scope: BadgePreviewScope): void {
    if (scope === 'plain') {
      this.plainCount.update((value) => value + 1);
      return;
    }

    this.tailwindCount.update((value) => value + 1);
  }

  protected reset(scope: BadgePreviewScope): void {
    if (scope === 'plain') {
      this.plainCount.set(0);
      return;
    }

    this.tailwindCount.set(0);
  }

  protected toggleDot(scope: BadgePreviewScope): void {
    if (scope === 'plain') {
      this.plainDot.update((value) => !value);
      return;
    }

    this.tailwindDot.update((value) => !value);
  }

  protected count(scope: BadgePreviewScope): number {
    return scope === 'plain' ? this.plainCount() : this.tailwindCount();
  }

  protected dot(scope: BadgePreviewScope): boolean {
    return scope === 'plain' ? this.plainDot() : this.tailwindDot();
  }

  protected status(scope: BadgePreviewScope): string {
    return `count: ${this.count(scope)} | dot: ${this.dot(scope) ? 'on' : 'off'}`;
  }
}
