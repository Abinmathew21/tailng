import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngPress } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-button-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngPress,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './button-overview-page.component.html',
  styleUrl: './button-overview-page.component.css',
})
export class HeadlessButtonOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainCount = signal(0);
  protected readonly tailwindCount = signal(0);

  protected readonly importCode = [
    "import { TngPress } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly basicUsageCode = [
    '<button',
    '  tngPress',
    '  type="button"',
    '  [ariaPressed]="isActive()"',
    '  (click)="isActive.set(!isActive())"',
    '>',
    '  Toggle state',
    '</button>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-button-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPress } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-button-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngPress],',
        "  templateUrl: './headless-button-overview-plain-css.component.html',",
        "  styleUrl: './headless-button-overview-plain-css.component.css',",
        '})',
        'export class HeadlessButtonOverviewPlainCssComponent {',
        '  protected readonly count = signal(0);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-button-overview-plain-css.component.html',
      code: [
        '<div class="headless-button-preview headless-button-preview--plain">',
        '  <button',
        '    tngPress',
        '    type="button"',
        '    class="headless-button-trigger"',
        '    (click)="count.update((value) => value + 1)"',
        '  >',
        '    Save draft',
        '  </button>',
        '  <button tngPress type="button" class="headless-button-trigger headless-button-trigger--ghost" [disabled]="true">',
        '    Disabled',
        '  </button>',
        '  <p class="headless-button-status">clicked: {{ count() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-button-overview-plain-css.component.css',
      code: [
        '.headless-button-trigger {',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.6rem;',
        '  min-height: 2.5rem;',
        '  padding: 0 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-button-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPress } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-button-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngPress],',
        "  templateUrl: './headless-button-overview-tailwind.component.html',",
        "  styleUrl: './headless-button-overview-tailwind.component.css',",
        '})',
        'export class HeadlessButtonOverviewTailwindComponent {',
        '  protected readonly count = signal(0);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-button-overview-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="flex flex-wrap gap-3">',
        '    <button',
        '      tngPress',
        '      type="button"',
        '      class="inline-flex min-h-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_58%,transparent)] bg-[var(--tng-semantic-accent-success)] px-4 text-sm font-semibold text-[var(--tng-semantic-foreground-inverse)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-success)_88%,var(--tng-semantic-foreground-primary)_12%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tng-semantic-background-base)]"',
        '      (click)="count.update((value) => value + 1)"',
        '    >',
        '      Publish',
        '    </button>',
        '    <button',
        '      tngPress',
        '      type="button"',
        '      class="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--tng-semantic-border-default)] px-4 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_6%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tng-semantic-background-base)]"',
        '    >',
        '      Secondary',
        '    </button>',
        '  </div>',
        '  <p class="mt-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">clicked: {{ count() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-button-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected increment(scope: 'plain' | 'tailwind'): void {
    if (scope === 'plain') {
      this.plainCount.update((value) => value + 1);
      return;
    }

    this.tailwindCount.update((value) => value + 1);
  }
}
