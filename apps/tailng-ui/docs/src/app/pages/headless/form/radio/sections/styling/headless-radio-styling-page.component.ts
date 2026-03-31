import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngRadio } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../radio.util';

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
  selector: 'app-headless-radio-styling-page',
  imports: [TngCodeBlockComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngRadio],
  templateUrl: './headless-radio-styling-page.component.html',
  styleUrl: './headless-radio-styling-page.component.css',
})
export class HeadlessRadioStylingPageComponent implements OnDestroy {
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
    'input[tngRadio][data-state="checked"] {',
    '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
    '}',
    '',
    'input[tngRadio][data-invalid] {',
    '  outline: 2px solid color-mix(in srgb, var(--tng-semantic-accent-danger, #dc2626) 55%, white);',
    '  outline-offset: 2px;',
    '}',
    '',
    'input[tngRadio][data-focus-visible] {',
    '  outline: 2px solid color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 70%, white);',
    '  outline-offset: 2px;',
    '}',
    '',
  ].join('\n');

  protected readonly shellSnippet = [
    '.radio-filter-card {',
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
    '.radio-filter-card__row {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 0.65rem;',
    '  color: var(--tng-semantic-foreground-primary, #0f172a);',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'headless-radio-filter-shell-plain',
    [
      "import { Component } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-radio-filter-shell-plain',",
      '  imports: [TngRadio],',
      "  templateUrl: './headless-radio-filter-shell-plain.component.html',",
      "  styleUrl: './headless-radio-filter-shell-plain.component.css',",
      '})',
      'export class HeadlessRadioFilterShellPlainComponent {}',
      '',
    ].join('\n'),
    [
      '<fieldset class="headless-radio-filter-card">',
      '  <legend class="headless-radio-filter-card__legend">Release target</legend>',
      '  <label class="headless-radio-filter-card__row">',
      '    <input type="radio" tngRadio name="release-target" [checked]="true" class="headless-radio-filter-card__control" />',
      '    <span>Production release</span>',
      '  </label>',
      '  <label class="headless-radio-filter-card__row headless-radio-filter-card__row--invalid">',
      '    <input type="radio" tngRadio name="release-target" [invalid]="true" class="headless-radio-filter-card__control" />',
      '    <span>Needs compliance approval</span>',
      '  </label>',
      '</fieldset>',
      '',
    ].join('\n'),
    [
      '.headless-radio-filter-card {',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.95rem;',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 26rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '}',
      '',
      '.headless-radio-filter-card__legend {',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-weight: 700;',
      '  margin: 0 0 0.15rem;',
      '  padding: 0;',
      '}',
      '',
      '.headless-radio-filter-card__row {',
      '  align-items: center;',
      '  border: 1px solid transparent;',
      '  border-radius: 0.75rem;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  display: inline-flex;',
      '  gap: 0.65rem;',
      '  padding: 0.5rem 0.7rem;',
      '}',
      '',
      '.headless-radio-filter-card__control {',
      '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
      '}',
      '',
      '.headless-radio-filter-card__row--invalid {',
      '  background: color-mix(',
      '    in srgb,',
      '    var(--tng-semantic-accent-danger, #dc2626) 10%,',
      '    var(--tng-semantic-background-base, #ffffff)',
      '  );',
      '  border-color: color-mix(',
      '    in srgb,',
      '    var(--tng-semantic-accent-danger, #dc2626) 45%,',
      '    var(--tng-semantic-border-subtle, #cbd5e1)',
      '  );',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-radio-filter-shell-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-radio-filter-shell-tailwind',",
      '  imports: [TngRadio],',
      "  templateUrl: './headless-radio-filter-shell-tailwind.component.html',",
      '})',
      'export class HeadlessRadioFilterShellTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<fieldset class="grid w-full max-w-[26rem] gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">',
      '  <legend class="text-sm font-semibold text-slate-900">Release target</legend>',
      '  <label class="inline-flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-900">',
      '    <input',
      '      type="radio"',
      '      tngRadio',
      '      name="release-target"',
      '      [checked]="true"',
      '      class="h-4 w-4 border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"',
      '    />',
      '    <span>Production release</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 rounded-lg border border-rose-300/80 bg-rose-50 px-3 py-2 text-sm font-medium text-slate-900">',
      '    <input',
      '      type="radio"',
      '      tngRadio',
      '      name="release-target"',
      '      [invalid]="true"',
      '      class="h-4 w-4 border-rose-400 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"',
      '    />',
      '    <span>Needs compliance approval</span>',
      '  </label>',
      '</fieldset>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
