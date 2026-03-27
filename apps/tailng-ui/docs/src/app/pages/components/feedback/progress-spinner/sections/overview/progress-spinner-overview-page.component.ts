import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngProgressSpinnerComponent } from '@tailng-ui/components';
import { TngProgressSpinner as TngProgressSpinnerPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-progress-spinner-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngProgressSpinnerPrimitive,
    TngProgressSpinnerComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './progress-spinner-overview-page.component.html',
  styleUrl: './progress-spinner-overview-page.component.css',
})
export class ProgressSpinnerOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly completion = 72;
  protected readonly spinnerCircumference = 113.097;

  protected readonly primitiveImportCode = [
    "import { TngProgressSpinner } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngProgressSpinnerComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-overview-headless.component.ts',
      code: this.primitiveImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-overview-headless.component.html',
      code: [
        '<span tngProgressSpinner class="spinner" [value]="72" aria-label="Sync progress">',
        '  <svg class="spinner__svg" viewBox="0 0 40 40">',
        '    <circle class="spinner__track" cx="20" cy="20" r="18"></circle>',
        '    <circle',
        '      class="spinner__indicator"',
        '      cx="20"',
        '      cy="20"',
        '      r="18"',
        '      stroke-dasharray="113.097"',
        '      [attr.stroke-dashoffset]="113.097 - (113.097 * 72) / 100"',
        '    ></circle>',
        '  </svg>',
        '</span>',
        '',
        '<span tngProgressSpinner [indeterminate]="true" class="spinner spinner--indeterminate"></span>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-overview-headless.component.css',
      code: [
        '.spinner {',
        '  display: inline-flex;',
        '  height: 2.5rem;',
        '  width: 2.5rem;',
        '}',
        '',
        '.spinner__svg {',
        '  display: block;',
        '  height: 100%;',
        '  width: 100%;',
        '}',
        '',
        '.spinner__track,',
        '.spinner__indicator {',
        '  fill: none;',
        '  stroke-linecap: round;',
        '  stroke-width: 4;',
        '}',
        '',
        '.spinner__track {',
        '  stroke: var(--tng-semantic-border-subtle);',
        '}',
        '',
        '.spinner__indicator {',
        '  stroke: var(--tng-semantic-accent-brand);',
        '  transform: rotate(-90deg);',
        '  transform-origin: center;',
        '}',
        '',
        '.spinner--indeterminate {',
        '  animation: primitive-progress-spinner-spin 0.85s linear infinite;',
        '  border: 4px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 9999px;',
        '  border-top-color: var(--tng-semantic-accent-brand);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-overview-plain-css.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-overview-plain-css.component.html',
      code: [
        '<section class="plain-shell">',
        '  <tng-progress-spinner [value]="72" ariaLabel="Sync progress"></tng-progress-spinner>',
        '  <tng-progress-spinner [value]="34"></tng-progress-spinner>',
        '  <tng-progress-spinner [indeterminate]="true" ariaLabel="Loading"></tng-progress-spinner>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-overview-plain-css.component.css',
      code: [
        '.plain-shell {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.8rem;',
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
      title: 'progress-spinner-overview-tailwind.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-overview-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div class="flex flex-wrap gap-3">',
        '    <tng-progress-spinner [value]="72" ariaLabel="Deploy progress"></tng-progress-spinner>',
        '    <tng-progress-spinner [value]="48"></tng-progress-spinner>',
        '    <tng-progress-spinner [indeterminate]="true" ariaLabel="Syncing"></tng-progress-spinner>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
