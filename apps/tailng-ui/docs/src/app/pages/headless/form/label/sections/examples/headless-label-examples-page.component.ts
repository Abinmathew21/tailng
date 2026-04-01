import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngLabel } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../label.util';

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

function createStaticTsCode(selector: string, className: string): string {
  return [
    "import { Component } from '@angular/core';",
    "import { TngLabel } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    `  selector: '${selector}',`,
    '  imports: [TngLabel],',
    `  templateUrl: './${selector}.component.html',`,
    `  styleUrl: './${selector}.component.css',`,
    '})',
    `export class ${className} {}`,
    '',
  ].join('\n');
}

@Component({
  selector: 'app-headless-label-examples-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngLabel],
  templateUrl: './headless-label-examples-page.component.html',
  styleUrl: './headless-label-examples-page.component.css',
})
export class HeadlessLabelExamplesPageComponent implements OnDestroy {
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

  protected readonly explicitPlainCodeTabs = createCodeTabs(
    'headless-label-explicit-plain',
    createStaticTsCode('app-headless-label-explicit-plain', 'HeadlessLabelExplicitPlainComponent'),
    [
      '<section class="headless-label-example-card">',
      '  <label tngLabel [required]="true" for="headless-label-explicit-email">',
      '    Work email',
      '  </label>',
      '  <input',
      '    id="headless-label-explicit-email"',
      '    class="headless-label-example-card__input"',
      '    type="email"',
      '    placeholder="ops@tailng.dev"',
      '    aria-required="true"',
      '  />',
      '</section>',
      '',
    ].join('\n'),
    [
      '.headless-label-example-card {',
      '  display: grid;',
      '  gap: 0.6rem;',
      '  inline-size: min(100%, 28rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '}',
      '',
      '.headless-label-example-card [data-slot="label"] {',
      '  display: inline-flex;',
      '  gap: 0.35rem;',
      '  color: #0f172a;',
      '  font-size: 0.9rem;',
      '  font-weight: 600;',
      '}',
      '',
      '.headless-label-example-card [data-slot="label"][data-required]::after {',
      '  content: "*";',
      '  color: #dc2626;',
      '}',
      '',
      '.headless-label-example-card__input {',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  min-block-size: 2.75rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.8rem;',
      '  padding: 0.65rem 0.8rem;',
      '  font: inherit;',
      '}',
      '',
      '.headless-label-example-card__input::placeholder {',
      '  color: #94a3b8;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly explicitTailwindCodeTabs = createCodeTabs(
    'headless-label-explicit-tailwind',
    createStaticTsCode('app-headless-label-explicit-tailwind', 'HeadlessLabelExplicitTailwindComponent'),
    [
      '<section class="grid w-full max-w-[28rem] gap-2 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <label',
      '    tngLabel',
      '    [required]="true"',
      '    for="headless-label-explicit-tailwind-email"',
      "    class=\"inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 [&[data-required]]:after:text-rose-600 [&[data-required]]:after:content-['*']\"",
      '  >',
      '    Work email',
      '  </label>',
      '  <input',
      '    id="headless-label-explicit-tailwind-email"',
      '    type="email"',
      '    placeholder="ops@tailng.dev"',
      '    aria-required="true"',
      '    class="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"',
      '  />',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly wrappedPlainCodeTabs = createCodeTabs(
    'headless-label-wrapped-plain',
    createStaticTsCode('app-headless-label-wrapped-plain', 'HeadlessLabelWrappedPlainComponent'),
    [
      '<label tngLabel class="headless-label-choice-row">',
      '  <input class="headless-label-choice-row__checkbox" type="checkbox" />',
      '  <span>Send the release announcement to Slack</span>',
      '</label>',
      '',
    ].join('\n'),
    [
      '.headless-label-choice-row {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.7rem;',
      '  inline-size: min(100%, 28rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  color-scheme: light;',
      '  color: #0f172a;',
      '  font-size: 0.95rem;',
      '  font-weight: 500;',
      '}',
      '',
      '.headless-label-choice-row__checkbox {',
      '  accent-color: #2563eb;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly wrappedTailwindCodeTabs = createCodeTabs(
    'headless-label-wrapped-tailwind',
    createStaticTsCode('app-headless-label-wrapped-tailwind', 'HeadlessLabelWrappedTailwindComponent'),
    [
      '<label tngLabel class="inline-flex w-full max-w-[28rem] items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm [color-scheme:light]">',
      '  <input type="checkbox" class="h-4 w-4 accent-blue-600" />',
      '  <span>Send the release announcement to Slack</span>',
      '</label>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly statePlainCodeTabs = createCodeTabs(
    'headless-label-state-plain',
    createStaticTsCode('app-headless-label-state-plain', 'HeadlessLabelStatePlainComponent'),
    [
      '<section class="headless-label-state-card">',
      '  <label tngLabel [required]="true" for="headless-label-state-owner">',
      '    Release owner',
      '  </label>',
      '  <input id="headless-label-state-owner" class="headless-label-state-card__input" type="text" aria-required="true" />',
      '  <label tngLabel [disabled]="true" for="headless-label-state-archive">',
      '    Archived environment',
      '  </label>',
      '  <input id="headless-label-state-archive" class="headless-label-state-card__input" type="text" disabled />',
      '</section>',
      '',
    ].join('\n'),
    [
      '.headless-label-state-card {',
      '  display: grid;',
      '  gap: 0.6rem;',
      '  inline-size: min(100%, 28rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '}',
      '',
      '.headless-label-state-card [data-slot="label"] {',
      '  display: inline-flex;',
      '  gap: 0.35rem;',
      '  color: #0f172a;',
      '  font-size: 0.9rem;',
      '  font-weight: 600;',
      '}',
      '',
      '.headless-label-state-card [data-slot="label"][data-required]::after {',
      '  content: "*";',
      '  color: #dc2626;',
      '}',
      '',
      '.headless-label-state-card [data-slot="label"][data-disabled] {',
      '  color: #64748b;',
      '}',
      '',
      '.headless-label-state-card__input {',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  min-block-size: 2.75rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.8rem;',
      '  padding: 0.65rem 0.8rem;',
      '  font: inherit;',
      '}',
      '',
      '.headless-label-state-card__input::placeholder {',
      '  color: #94a3b8;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly stateTailwindCodeTabs = createCodeTabs(
    'headless-label-state-tailwind',
    createStaticTsCode('app-headless-label-state-tailwind', 'HeadlessLabelStateTailwindComponent'),
    [
      '<section class="grid w-full max-w-[28rem] gap-2 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <label',
      '    tngLabel',
      '    [required]="true"',
      '    for="headless-label-state-tailwind-owner"',
      "    class=\"inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 [&[data-required]]:after:text-rose-600 [&[data-required]]:after:content-['*']\"",
      '  >',
      '    Release owner',
      '  </label>',
      '  <input',
      '    id="headless-label-state-tailwind-owner"',
      '    type="text"',
      '    aria-required="true"',
      '    class="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"',
      '  />',
      '  <label',
      '    tngLabel',
      '    [disabled]="true"',
      '    for="headless-label-state-tailwind-archive"',
      '    class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500"',
      '  >',
      '    Archived environment',
      '  </label>',
      '  <input',
      '    id="headless-label-state-tailwind-archive"',
      '    type="text"',
      '    disabled',
      '    class="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"',
      '  />',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
