import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngInputGroup, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../input.util';

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
  selector: 'app-headless-input-api-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngCodeBlockComponent,
    TngInputGroup,
    TngInput,
    TngInputFieldPrefix,
    TngInputFieldSuffix,
    TngIcon,
  ],
  templateUrl: './headless-input-api-page.component.html',
  styleUrls: [
    './headless-input-api-page.component.css',
    '../../../../../../shared/form/input/input-styles.css',
  ],
})
export class HeadlessInputApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly directiveAttachCode = [
    '<input tngInput type="text" />',
    '',
  ].join('\n');

  protected readonly groupTemplateCode = [
    '<div tngInputGroup class="input-example-headless-shell">',
    '  <span tngInputFieldPrefix aria-hidden="true" class="input-api-prefix">',
    '    <tng-icon icon="search" class="input-example-icon" />',
    '  </span>',
    '  <input',
    '    tngInput',
    '    type="search"',
    '    placeholder="Search docs..."',
    '    aria-label="Search docs"',
    '    class="input-api-control"',
    '  />',
    '  <button tngInputFieldSuffix type="button" class="input-api-icon-button" aria-label="Clear search">',
    '    <tng-icon icon="x" class="input-example-icon" />',
    '  </button>',
    '</div>',
    '',
  ].join('\n');

  protected readonly groupDemoTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup, TngInputFieldPrefix, TngInputFieldSuffix } from "@tailng-ui/primitives";',
    'import { TngIcon } from "@tailng-ui/icons";',
    '',
    '@Component({',
    '  imports: [TngInputGroup, TngInput, TngInputFieldPrefix, TngInputFieldSuffix, TngIcon],',
    "  templateUrl: './grouped-search-input.component.html',",
    "  styleUrl: './grouped-search-input.component.css',",
    '})',
    'export class GroupedSearchInputComponent {}',
    '',
  ].join('\n');

  protected readonly groupDemoPlainCssCode = [
    '.input-example-headless-shell {',
    '  background: #ffffff;',
    '  border: 1px solid #cbd5e1;',
    '  border-radius: 0.78rem;',
    '  color: #0f172a;',
    '  cursor: text;',
    '  min-height: 2.65rem;',
    '  padding-inline: 0.88rem;',
    '  width: min(100%, 32rem);',
    '  transition:',
    '    border-color 0.15s ease,',
    '    box-shadow 0.15s ease;',
    '}',
    '',
    '.input-example-headless-shell[data-focused] {',
    '  border-color: #3b82f6;',
    '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
    '}',
    '',
    '.input-api-prefix {',
    '  align-items: center;',
    '  color: #64748b;',
    '  display: inline-flex;',
    '}',
    '',
    '.input-api-icon-button {',
    '  align-items: center;',
    '  background: transparent;',
    '  border: 0;',
    '  border-radius: 999px;',
    '  color: #64748b;',
    '  cursor: pointer;',
    '  display: inline-flex;',
    '  padding: 0;',
    '}',
    '',
    '.input-api-icon-button:focus-visible {',
    '  outline: 2px solid rgba(59, 130, 246, 0.55);',
    '  outline-offset: 2px;',
    '}',
    '',
    '.input-api-control {',
    '  background: transparent;',
    '  border: 0 !important;',
    '  border-radius: 0;',
    '  box-shadow: none !important;',
    '  color: #0f172a;',
    '  display: block;',
    '  font-size: 0.98rem;',
    '  line-height: 1.35;',
    '  min-width: 0;',
    '  outline: none !important;',
    '  padding: 0;',
    '  width: 100%;',
    '}',
    '',
    '.input-api-control::placeholder {',
    '  color: #94a3b8;',
    '}',
    '',
    '.input-example-icon {',
    '  height: 1.1rem;',
    '  width: 1.1rem;',
    '}',
    '',
  ].join('\n');

  protected readonly groupDemoTailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly groupDemoPlainCodeTabs = createCodeTabs(
    'grouped-search-input-plain',
    this.groupDemoTsCode,
    this.groupTemplateCode,
    this.groupDemoPlainCssCode,
  );

  protected readonly groupDemoTailwindCodeTabs = createCodeTabs(
    'grouped-search-input-tailwind',
    this.groupDemoTsCode,
    [
      '<div',
      '  tngInputGroup',
      '  class="min-h-11 w-full max-w-[32rem] items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 shadow-sm transition',
      '         [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-200"',
      '>',
      '  <span tngInputFieldPrefix aria-hidden="true" class="text-slate-500">',
      '    <tng-icon icon="search" class="h-4 w-4" />',
      '  </span>',
      '  <input',
      '    tngInput',
      '    type="search"',
      '    placeholder="Search docs..."',
      '    aria-label="Search docs"',
      '    class="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.98rem] outline-none"',
      '  />',
      '  <button',
      '    tngInputFieldSuffix',
      '    type="button"',
      '    aria-label="Clear search"',
      '    class="inline-flex items-center rounded-full border-0 bg-transparent p-0 text-slate-500 transition hover:text-slate-700"',
      '  >',
      '    <tng-icon icon="x" class="h-4 w-4" />',
      '  </button>',
      '</div>',
      '',
    ].join('\n'),
    this.groupDemoTailwindCssCode,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
