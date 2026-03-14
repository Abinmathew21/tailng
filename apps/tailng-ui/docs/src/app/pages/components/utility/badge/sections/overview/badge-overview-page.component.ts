import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngBadge, TngCodeBlockComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

type BadgePreviewVariant = 'headless' | 'plain' | 'tailwind';

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
  selector: 'app-badge-overview-page',
  imports: [
    TngBadge,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './badge-overview-page.component.html',
  styleUrl: './badge-overview-page.component.css',
})
export class BadgeOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly primitiveImportCode = "import { TngBadge } from '@tailng-ui/primitives';";
  protected readonly componentImportCode = "import { TngBadge } from '@tailng-ui/components';";

  protected readonly primitiveUsageCode = [
    '<button type="button" [tngBadge]="count()" [tngBadgeMax]="99">Inbox</button>',
    '<button type="button" [tngBadge]="null" [tngBadgeDot]="isOnline()">Presence</button>',
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<button',
    '  type="button"',
    '  [tngBadge]="notifications()"',
    '  tngBadgeTone="danger"',
    '  tngBadgePosition="top-end"',
    '>',
    '  Alerts',
    '</button>',
    '',
  ].join('\n');

  protected readonly headlessCount = signal(7);
  protected readonly plainCount = signal(12);
  protected readonly tailwindCount = signal(3);

  protected readonly headlessDot = signal(false);
  protected readonly plainDot = signal(true);
  protected readonly tailwindDot = signal(false);

  protected readonly headlessCodeTabs = createCodeTabs(
    'badge-overview-headless',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/primitives';",
      '',
      'export class BadgeOverviewHeadlessComponent {',
      '  protected readonly count = signal(7);',
      '  protected readonly dot = signal(false);',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="badge-preview-shell badge-preview-shell--headless">',
      '  <button type="button" class="badge-host" [tngBadge]="count()">Inbox</button>',
      '  <button type="button" class="badge-host" [tngBadge]="count() * 8" [tngBadgeMax]="99">Alerts</button>',
      '  <button type="button" class="badge-host" [tngBadge]="null" [tngBadgeDot]="dot()">Presence</button>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.badge-host {',
      '  border: 1px solid var(--tng-semantic-border-strong);',
      '  border-radius: 0.65rem;',
      '  min-height: 2.5rem;',
      '  padding: 0 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly plainCssCodeTabs = createCodeTabs(
    'badge-overview-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/components';",
      '',
      'export class BadgeOverviewPlainCssComponent {',
      '  protected readonly count = signal(12);',
      '  protected readonly dot = signal(true);',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="badge-preview-shell badge-preview-shell--plain">',
      '  <button type="button" class="badge-host" [tngBadge]="count()">Inbox</button>',
      '  <button type="button" class="badge-host" [tngBadge]="count() * 5" [tngBadgeMax]="99">Queue</button>',
      '  <button type="button" class="badge-host" [tngBadge]="null" [tngBadgeDot]="dot()">Presence</button>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.badge-preview-shell--plain {',
      '  background: var(--tng-semantic-background-surface);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.85rem;',
      '  padding: 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'badge-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/components';",
      '',
      'export class BadgeOverviewTailwindComponent {',
      '  protected readonly count = signal(3);',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="flex flex-wrap gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
      '  <button type="button" [tngBadge]="count()" class="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600">Inbox</button>',
      '  <button type="button" [tngBadge]="count() * 11" [tngBadgeMax]="99" class="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600">Alerts</button>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected increment(scope: BadgePreviewVariant): void {
    this.setCount(scope, this.readCount(scope) + 1);
  }

  protected reset(scope: BadgePreviewVariant): void {
    this.setCount(scope, 0);
  }

  protected toggleDot(scope: BadgePreviewVariant): void {
    this.setDot(scope, !this.readDot(scope));
  }

  protected status(scope: BadgePreviewVariant): string {
    return `count: ${this.readCount(scope)} | dot: ${this.readDot(scope) ? 'on' : 'off'}`;
  }

  private readCount(scope: BadgePreviewVariant): number {
    if (scope === 'headless') {
      return this.headlessCount();
    }

    if (scope === 'plain') {
      return this.plainCount();
    }

    return this.tailwindCount();
  }

  private setCount(scope: BadgePreviewVariant, value: number): void {
    const nextValue = Math.max(0, value);
    if (scope === 'headless') {
      this.headlessCount.set(nextValue);
      return;
    }

    if (scope === 'plain') {
      this.plainCount.set(nextValue);
      return;
    }

    this.tailwindCount.set(nextValue);
  }

  private readDot(scope: BadgePreviewVariant): boolean {
    if (scope === 'headless') {
      return this.headlessDot();
    }

    if (scope === 'plain') {
      return this.plainDot();
    }

    return this.tailwindDot();
  }

  private setDot(scope: BadgePreviewVariant, value: boolean): void {
    if (scope === 'headless') {
      this.headlessDot.set(value);
      return;
    }

    if (scope === 'plain') {
      this.plainDot.set(value);
      return;
    }

    this.tailwindDot.set(value);
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
