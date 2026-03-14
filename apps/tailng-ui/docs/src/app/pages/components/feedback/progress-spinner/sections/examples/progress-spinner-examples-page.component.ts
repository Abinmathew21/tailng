import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngProgressSpinnerComponent } from '@tailng-ui/components';
import { TngProgressSpinner as TngProgressSpinnerPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-progress-spinner-examples-page',
  imports: [
    TngProgressSpinnerPrimitive,
    TngProgressSpinnerComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './progress-spinner-examples-page.component.html',
  styleUrl: './progress-spinner-examples-page.component.css',
})
export class ProgressSpinnerExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly uploadProgress = 68;
  protected readonly testCoverageProgress = 84;
  protected readonly releaseProgress = 42;
  protected readonly spinnerCircumference = 113.097;

  protected readonly uploadHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-examples-upload-headless.component.ts',
      code: "import { TngProgressSpinner } from '@tailng-ui/primitives';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-examples-upload-headless.component.html',
      code: [
        '<span tngProgressSpinner [value]="68" class="example-spinner" aria-label="Upload progress">',
        '  <svg class="example-spinner__svg" viewBox="0 0 40 40">',
        '    <circle class="example-spinner__track" cx="20" cy="20" r="18"></circle>',
        '    <circle',
        '      class="example-spinner__indicator"',
        '      cx="20"',
        '      cy="20"',
        '      r="18"',
        '      stroke-dasharray="113.097"',
        '      [attr.stroke-dashoffset]="113.097 - (113.097 * 68) / 100"',
        '    ></circle>',
        '  </svg>',
        '</span>',
        '<span tngProgressSpinner [value]="84" class="example-spinner" aria-label="Test coverage">...</span>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-examples-upload-headless.component.css',
      code: [
        '.example-spinner {',
        '  display: inline-flex;',
        '  height: 2.5rem;',
        '  width: 2.5rem;',
        '}',
        '',
        '.example-spinner__indicator {',
        '  stroke: var(--tng-semantic-accent-brand);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly uploadPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-examples-upload-plain-css.component.ts',
      code: "import { TngProgressSpinnerComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-examples-upload-plain-css.component.html',
      code: [
        '<tng-progress-spinner [value]="68" ariaLabel="Upload progress"></tng-progress-spinner>',
        '<tng-progress-spinner [value]="84" ariaLabel="Test coverage"></tng-progress-spinner>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-examples-upload-plain-css.component.css',
      code: [
        '.example-shell {',
        '  display: flex;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly uploadTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-examples-upload-tailwind.component.ts',
      code: "import { TngProgressSpinnerComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-examples-upload-tailwind.component.html',
      code: [
        '<div class="flex flex-wrap gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-progress-spinner [value]="68" ariaLabel="Upload progress"></tng-progress-spinner>',
        '  <tng-progress-spinner [value]="84" ariaLabel="Test coverage"></tng-progress-spinner>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-examples-upload-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly loadingHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-examples-loading-headless.component.ts',
      code: "import { TngProgressSpinner } from '@tailng-ui/primitives';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-examples-loading-headless.component.html',
      code: [
        '<span tngProgressSpinner [indeterminate]="true" class="example-spinner example-spinner--indeterminate" aria-label="Preparing release"></span>',
        '<span tngProgressSpinner [value]="42" class="example-spinner" aria-label="Release rollout">...</span>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-examples-loading-headless.component.css',
      code: [
        '.example-spinner--indeterminate {',
        '  animation: primitive-progress-spinner-spin 0.85s linear infinite;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly loadingPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-examples-loading-plain-css.component.ts',
      code: "import { TngProgressSpinnerComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-examples-loading-plain-css.component.html',
      code: [
        '<tng-progress-spinner [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-spinner>',
        '<tng-progress-spinner [value]="42" ariaLabel="Release rollout"></tng-progress-spinner>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-examples-loading-plain-css.component.css',
      code: [
        '.loading-shell {',
        '  display: flex;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly loadingTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-examples-loading-tailwind.component.ts',
      code: "import { TngProgressSpinnerComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-examples-loading-tailwind.component.html',
      code: [
        '<div class="flex flex-wrap gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-progress-spinner [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-spinner>',
        '  <tng-progress-spinner [value]="42" ariaLabel="Release rollout"></tng-progress-spinner>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-examples-loading-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
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
