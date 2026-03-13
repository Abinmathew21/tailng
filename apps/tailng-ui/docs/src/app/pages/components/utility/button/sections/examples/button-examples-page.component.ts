import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngPress } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-button-examples-page',
  imports: [
    TngButtonComponent,
    TngIcon,
    TngPress,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './button-examples-page.component.html',
  styleUrl: './button-examples-page.component.css',
})
export class ButtonExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly headlessActionCount = signal(0);
  protected readonly plainActionCount = signal(0);
  protected readonly tailwindActionCount = signal(0);

  protected readonly headlessMenuOpen = signal(false);
  protected readonly plainMenuOpen = signal(false);
  protected readonly tailwindMenuOpen = signal(false);

  protected readonly actionHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-actions-headless.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPress } from '@tailng-ui/primitives';",
        '',
        'export class ButtonActionsHeadlessComponent {',
        '  protected readonly count = signal(0);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-actions-headless.component.html',
      code: [
        '<div class="button-example-row">',
        '  <button tngPress type="button" class="button-headless" (click)="count.update(v => v + 1)">',
        '    Save draft',
        '  </button>',
        '  <button tngPress type="button" class="button-headless button-headless--ghost">Cancel</button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-actions-headless.component.css',
      code: [
        '.button-example-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly actionPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-actions-plain.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        '',
        'export class ButtonActionsPlainComponent {',
        '  protected readonly count = signal(0);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-actions-plain.component.html',
      code: [
        '<div class="button-example-row">',
        '  <tng-button tone="primary" appearance="solid" (click)="count.update(v => v + 1)">Save draft</tng-button>',
        '  <tng-button tone="neutral" appearance="outline">Cancel</tng-button>',
        '  <tng-button tone="danger" appearance="ghost" [disabled]="true">Delete</tng-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-actions-plain.component.css',
      code: [
        '.button-example-row {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly actionTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-actions-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        '',
        'export class ButtonActionsTailwindComponent {',
        '  protected readonly count = signal(0);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-actions-tailwind.component.html',
      code: [
        '<div class="flex flex-wrap gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-button tone="success" appearance="solid" (click)="count.update(v => v + 1)">',
        '    <tng-icon icon="check" class="h-4 w-4"></tng-icon>',
        '    Publish',
        '  </tng-button>',
        '  <tng-button tone="neutral" appearance="outline">Preview</tng-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-actions-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly menuHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-menu-headless.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPress } from '@tailng-ui/primitives';",
        '',
        'export class ButtonMenuHeadlessComponent {',
        '  protected readonly open = signal(false);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-menu-headless.component.html',
      code: [
        '<button',
        '  tngPress',
        '  type="button"',
        '  [ariaHasPopup]="\'menu\'"',
        '  [ariaExpanded]="open()"',
        '  [ariaControls]="\'headless-menu\'"',
        '  (click)="open.set(!open())"',
        '>',
        '  Open menu',
        '</button>',
        '<div id="headless-menu" [hidden]="!open()">Menu content</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-menu-headless.component.css',
      code: [
        '.button-menu-surface {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.75rem;',
        '  margin-top: 0.6rem;',
        '  padding: 0.6rem 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly menuPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-menu-plain.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        '',
        'export class ButtonMenuPlainComponent {',
        '  protected readonly open = signal(false);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-menu-plain.component.html',
      code: [
        '<tng-button',
        '  tone="neutral"',
        '  appearance="outline"',
        '  [ariaHasPopup]="\'menu\'"',
        '  [ariaExpanded]="open()"',
        '  [ariaControls]="\'plain-menu\'"',
        '  (click)="open.set(!open())"',
        '>',
        '  Actions',
        '</tng-button>',
        '<div id="plain-menu" [hidden]="!open()">Menu content</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-menu-plain.component.css',
      code: [
        '.button-menu-surface {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.75rem;',
        '  margin-top: 0.6rem;',
        '  padding: 0.6rem 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly menuTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-menu-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        '',
        'export class ButtonMenuTailwindComponent {',
        '  protected readonly open = signal(false);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-menu-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-button',
        '    tone="neutral"',
        '    appearance="ghost"',
        '    [ariaHasPopup]="\'menu\'"',
        '    [ariaExpanded]="open()"',
        '    [ariaControls]="\'tw-menu\'"',
        '    (click)="open.set(!open())"',
        '  >',
        '    Open menu',
        '  </tng-button>',
        '  <div id="tw-menu" [hidden]="!open()">Menu content</div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-menu-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected increment(scope: 'headless' | 'plain' | 'tailwind'): void {
    if (scope === 'headless') {
      this.headlessActionCount.update((value) => value + 1);
      return;
    }

    if (scope === 'plain') {
      this.plainActionCount.update((value) => value + 1);
      return;
    }

    this.tailwindActionCount.update((value) => value + 1);
  }

  protected toggleMenu(scope: 'headless' | 'plain' | 'tailwind'): void {
    if (scope === 'headless') {
      this.headlessMenuOpen.update((open) => !open);
      return;
    }

    if (scope === 'plain') {
      this.plainMenuOpen.update((open) => !open);
      return;
    }

    this.tailwindMenuOpen.update((open) => !open);
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
