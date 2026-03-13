import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngPress } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-button-overview-page',
  imports: [
    TngButtonComponent,
    TngCodeBlockComponent,
    TngIcon,
    TngPress,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './button-overview-page.component.html',
  styleUrl: './button-overview-page.component.css',
})
export class ButtonOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly headlessCount = signal(0);
  protected readonly plainCount = signal(0);
  protected readonly tailwindCount = signal(0);

  protected readonly primitiveImportCode = "import { TngPress } from '@tailng-ui/primitives';";
  protected readonly componentImportCode =
    "import { TngButtonComponent } from '@tailng-ui/components';";

  protected readonly primitiveUsageCode = [
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

  protected readonly componentUsageCode = [
    '<tng-button',
    '  appearance="solid"',
    '  tone="primary"',
    '  [disabled]="isPending()"',
    '  (click)="submit()"',
    '>',
    '  Save changes',
    '</tng-button>',
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-overview-headless.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPress } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        '  standalone: true,',
        '  imports: [TngPress],',
        '})',
        'export class ButtonOverviewHeadlessComponent {',
        '  protected readonly count = signal(0);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-overview-headless.component.html',
      code: [
        '<div class="button-overview-stack">',
        '  <button tngPress type="button" class="button-headless" (click)="count.update(v => v + 1)">',
        '    Headless action',
        '  </button>',
        '  <button tngPress type="button" class="button-headless button-headless--ghost" [disabled]="true">',
        '    Disabled',
        '  </button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-overview-headless.component.css',
      code: [
        '.button-headless {',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.6rem;',
        '  min-height: 2.4rem;',
        '  padding: 0 1rem;',
        '}',
        '.button-headless--ghost { background: transparent; }',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        '',
        'export class ButtonOverviewPlainComponent {',
        '  protected readonly count = signal(0);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-overview-plain-css.component.html',
      code: [
        '<div class="button-overview-stack">',
        '  <tng-button tone="primary" appearance="solid" (click)="count.update(v => v + 1)">',
        '    Save',
        '  </tng-button>',
        '  <tng-button tone="neutral" appearance="outline" [disabled]="true">',
        '    Disabled',
        '  </tng-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-overview-plain-css.component.css',
      code: [
        '.button-overview-stack {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.75rem;',
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
      title: 'button-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        '',
        'export class ButtonOverviewTailwindComponent {',
        '  protected readonly count = signal(0);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-overview-tailwind.component.html',
      code: [
        '<div class="flex flex-wrap gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-button tone="success" appearance="solid" class="text-slate-900 dark:text-slate-100">',
        '    <tng-icon icon="check" class="h-4 w-4"></tng-icon>',
        '    Publish',
        '  </tng-button>',
        '  <tng-button tone="neutral" appearance="ghost" class="text-slate-900 dark:text-slate-100">',
        '    Secondary',
        '  </tng-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected increment(scope: 'headless' | 'plain' | 'tailwind'): void {
    if (scope === 'headless') {
      this.headlessCount.update((count) => count + 1);
      return;
    }

    if (scope === 'plain') {
      this.plainCount.update((count) => count + 1);
      return;
    }

    this.tailwindCount.update((count) => count + 1);
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
