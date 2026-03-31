import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngCheckbox } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../checkbox.util';

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
  selector: 'app-headless-checkbox-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngCheckbox,
  ],
  templateUrl: './headless-checkbox-styling-page.component.html',
  styleUrl: './headless-checkbox-styling-page.component.css',
})
export class HeadlessCheckboxStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly stateSelectorSnippet = [
    'input[tngCheckbox][data-state="checked"] {',
    '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
    '}',
    '',
    'input[tngCheckbox][data-mixed] {',
    '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
    '}',
    '',
    'input[tngCheckbox][data-invalid] {',
    '  outline: 2px solid color-mix(in srgb, var(--tng-semantic-accent-danger, #dc2626) 55%, white);',
    '  outline-offset: 2px;',
    '}',
    '',
    'input[tngCheckbox][data-focus-visible] {',
    '  outline: 2px solid color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 70%, white);',
    '  outline-offset: 2px;',
    '}',
    '',
  ].join('\n');

  protected readonly shellSnippet = [
    '.checkbox-filter-card {',
    '  display: grid;',
    '  gap: 0.75rem;',
    '  inline-size: min(100%, 26rem);',
    '  margin-inline: auto;',
    '  padding: 1rem;',
    '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
    '  border-radius: 0.9rem;',
    '  background: var(--tng-semantic-background-base, #ffffff);',
    '}',
    '',
    '.checkbox-filter-card__row {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 0.65rem;',
    '  color: var(--tng-semantic-foreground-primary, #0f172a);',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'headless-checkbox-styles-plain',
    [
      "import { Component } from '@angular/core';",
      "import { TngCheckbox } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-checkbox-styles-plain',",
      '  imports: [TngCheckbox],',
      "  templateUrl: './headless-checkbox-styles-plain.component.html',",
      "  styleUrl: './headless-checkbox-styles-plain.component.css',",
      '})',
      'export class HeadlessCheckboxStylesPlainComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="checkbox-filter-card">',
      '  <label class="checkbox-filter-card__row">',
      '    <input type="checkbox" tngCheckbox [checked]="true" class="checkbox-filter-card__control" />',
      '    <span>Show release blockers</span>',
      '  </label>',
      '  <label class="checkbox-filter-card__row">',
      '    <input type="checkbox" tngCheckbox [indeterminate]="true" class="checkbox-filter-card__control" />',
      '    <span>Escalated work items</span>',
      '  </label>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.checkbox-filter-card {',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  inline-size: min(100%, 26rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.9rem;',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '}',
      '',
      '.checkbox-filter-card__row {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.65rem;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '}',
      '',
      '.checkbox-filter-card__control {',
      '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-checkbox-styles-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngCheckbox } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-checkbox-styles-tailwind',",
      '  imports: [TngCheckbox],',
      "  templateUrl: './headless-checkbox-styles-tailwind.component.html',",
      "  styleUrl: './headless-checkbox-styles-tailwind.component.css',",
      '})',
      'export class HeadlessCheckboxStylesTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[26rem] gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">',
      '    <input',
      '      type="checkbox"',
      '      tngCheckbox',
      '      [checked]="true"',
      '      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '    />',
      '    <span>Show release blockers</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">',
      '    <input',
      '      type="checkbox"',
      '      tngCheckbox',
      '      [indeterminate]="true"',
      '      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '    />',
      '    <span>Escalated work items</span>',
      '  </label>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
