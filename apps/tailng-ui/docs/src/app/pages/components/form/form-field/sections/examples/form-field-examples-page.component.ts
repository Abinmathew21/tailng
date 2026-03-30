import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngFormFieldComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

import {stackblitzTailwindUrl, stackblitzVanillaUrl} from '../../form-field.util';

function createFormFieldExampleTsCode(selector: string, className: string): string {
  return [
    "import { Component } from '@angular/core';",
    "import { TngFormFieldComponent } from '@tailng-ui/components';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    "import { TngIcon } from '@tailng-ui/icons';",
    '',
    '@Component({',
    `  selector: '${selector}',`,
    '  imports: [TngFormFieldComponent, TngInput, TngPrefix, TngSuffix, TngIcon],',
    `  templateUrl: './${selector}.component.html',`,
    `  styleUrl: './${selector}.component.css',`,
    '})',
    `export class ${className} {}`,
    '',
  ].join('\n');
}

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
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
  selector: 'app-form-field-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngFormFieldComponent,
    TngInput,
    TngPrefix,
    TngSuffix,
    TngIcon,
  ],
  templateUrl: './form-field-examples-page.component.html',
  styleUrls: [
    '../../../input/sections/examples/input-examples-page.component.css',
    './form-field-examples-page.component.css',
  ],
})
export class FormFieldExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  private readonly tailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly searchPlainCodeTabs = createCodeTabs(
    'form-field-search-plain',
    createFormFieldExampleTsCode(
      'app-doc-cmp-form-field-ex-search-plain',
      'DocCmpFormFieldExSearchPlainComponent',
    ),
    [
      '<tng-form-field class="doc-cmp-form-field-ex-search-shell">',
      '  <span tngPrefix aria-hidden="true">',
      '    <tng-icon icon="search" class="doc-cmp-form-field-ex-search-icon" />',
      '  </span>',
      '  <input tngInput type="search" placeholder="Search components..." />',
      '  <span tngSuffix class="doc-cmp-form-field-ex-search-meta">Ctrl+K</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-form-field-ex-search-shell [data-slot="input-group"] {',
      '  border: 1px solid var(--tng-semantic-border-strong);',
      '  background: var(--tng-semantic-background-base);',
      '  border-radius: 0.78rem;',
      '  min-height: 2.65rem;',
      '  padding-inline: 0.85rem;',
      '  box-shadow: none;',
      '}',
      '.doc-cmp-form-field-ex-search-shell [data-slot="input-group"][data-focused] {',
      '  border-color: var(--tng-semantic-accent-brand);',
      '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
      '}',
      '.doc-cmp-form-field-ex-search-shell [data-slot="input"] {',
      '  appearance: none;',
      '  background: transparent;',
      '  border: 0;',
      '  box-shadow: none;',
      '  color: inherit;',
      '  display: block;',
      '  font: inherit;',
      '  min-width: 0;',
      '  outline: none;',
      '  padding: 0;',
      '  width: 100%;',
      '}',
      '.doc-cmp-form-field-ex-search-icon { height: 1.1rem; width: 1.1rem; }',
      '.doc-cmp-form-field-ex-search-meta {',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.82rem;',
      '  font-weight: 600;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly searchTailwindCodeTabs = createCodeTabs(
    'form-field-search-tailwind',
    createFormFieldExampleTsCode(
      'app-doc-cmp-form-field-ex-search-tailwind',
      'DocCmpFormFieldExSearchTailwindComponent',
    ),
    [
      '<tng-form-field',
      '  class="block',
      "         [&_[data-slot='input-group']]:min-h-11",
      "         [&_[data-slot='input-group']]:items-center",
      "         [&_[data-slot='input-group']]:rounded-xl",
      "         [&_[data-slot='input-group']]:border",
      "         [&_[data-slot='input-group']]:border-[var(--tng-semantic-border-strong)]",
      "         [&_[data-slot='input-group']]:bg-[var(--tng-semantic-background-base)]",
      "         [&_[data-slot='input-group']]:px-3",
      "         [&_[data-slot='input-group']]:shadow-none",
      "         [&_[data-slot='input-group'][data-focused]]:border-[var(--tng-semantic-accent-brand)]",
      "         [&_[data-slot='input-group'][data-focused]]:ring-2",
      "         [&_[data-slot='input-group'][data-focused]]:ring-blue-400/20",
      "         [&_[data-slot='input']]:w-full",
      "         [&_[data-slot='input']]:appearance-none",
      "         [&_[data-slot='input']]:border-0",
      "         [&_[data-slot='input']]:bg-transparent",
      "         [&_[data-slot='input']]:p-0",
      "         [&_[data-slot='input']]:outline-none",
      "         [&_[data-slot='input']]:shadow-none",
      "         [&_[data-slot='input']]:text-[var(--tng-semantic-foreground-primary)]",
      "         [&_[data-slot='input']]:placeholder:text-[var(--tng-semantic-foreground-muted)]",
      "         [&_[data-slot='input']]:focus:outline-none",
      "         [&_[data-slot='input']]:focus:ring-0",
      "         [&_[data-slot='input-group-leading']]:text-[var(--tng-semantic-foreground-secondary)]",
      "         [&_[data-slot='input-group-trailing']]:text-xs",
      "         [&_[data-slot='input-group-trailing']]:font-semibold",
      "         [&_[data-slot='input-group-trailing']]:text-[var(--tng-semantic-foreground-secondary)]\">",
      '  <span tngPrefix aria-hidden="true">',
      '    <tng-icon icon="search" class="h-4 w-4" />',
      '  </span>',
      '  <input tngInput type="search" placeholder="Search components..." />',
      '  <span tngSuffix>Ctrl+K</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  protected readonly workspacePlainCodeTabs = createCodeTabs(
    'form-field-workspace-plain',
    createFormFieldExampleTsCode(
      'app-doc-cmp-form-field-ex-workspace-plain',
      'DocCmpFormFieldExWorkspacePlainComponent',
    ),
    [
      '<tng-form-field class="doc-cmp-form-field-ex-workspace-shell">',
      '  <input tngInput type="text" value="core-platform" />',
      '  <span tngSuffix class="doc-cmp-form-field-ex-workspace-meta">.tailng.dev</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-form-field-ex-workspace-shell [data-slot="input-group"] {',
      '  border: 1px solid var(--tng-semantic-border-strong);',
      '  background: var(--tng-semantic-background-base);',
      '  border-radius: 0.78rem;',
      '  min-height: 2.65rem;',
      '  padding-inline: 0.85rem;',
      '  box-shadow: none;',
      '}',
      '.doc-cmp-form-field-ex-workspace-shell [data-slot="input-group"][data-focused] {',
      '  border-color: var(--tng-semantic-accent-brand);',
      '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
      '}',
      '.doc-cmp-form-field-ex-workspace-shell [data-slot="input"] {',
      '  appearance: none;',
      '  background: transparent;',
      '  border: 0;',
      '  box-shadow: none;',
      '  color: inherit;',
      '  display: block;',
      '  font: inherit;',
      '  min-width: 0;',
      '  outline: none;',
      '  padding: 0;',
      '  width: 100%;',
      '}',
      '.doc-cmp-form-field-ex-workspace-meta {',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.82rem;',
      '  font-weight: 600;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly workspaceTailwindCodeTabs = createCodeTabs(
    'form-field-workspace-tailwind',
    createFormFieldExampleTsCode(
      'app-doc-cmp-form-field-ex-workspace-tailwind',
      'DocCmpFormFieldExWorkspaceTailwindComponent',
    ),
    [
      '<tng-form-field',
      '  class="block',
      "         [&_[data-slot='input-group']]:min-h-11",
      "         [&_[data-slot='input-group']]:items-center",
      "         [&_[data-slot='input-group']]:rounded-xl",
      "         [&_[data-slot='input-group']]:border",
      "         [&_[data-slot='input-group']]:border-[var(--tng-semantic-border-strong)]",
      "         [&_[data-slot='input-group']]:bg-[var(--tng-semantic-background-base)]",
      "         [&_[data-slot='input-group']]:px-3",
      "         [&_[data-slot='input-group']]:shadow-none",
      "         [&_[data-slot='input-group'][data-focused]]:border-[var(--tng-semantic-accent-brand)]",
      "         [&_[data-slot='input-group'][data-focused]]:ring-2",
      "         [&_[data-slot='input-group'][data-focused]]:ring-blue-400/20",
      "         [&_[data-slot='input']]:w-full",
      "         [&_[data-slot='input']]:appearance-none",
      "         [&_[data-slot='input']]:border-0",
      "         [&_[data-slot='input']]:bg-transparent",
      "         [&_[data-slot='input']]:p-0",
      "         [&_[data-slot='input']]:outline-none",
      "         [&_[data-slot='input']]:shadow-none",
      "         [&_[data-slot='input']]:text-[var(--tng-semantic-foreground-primary)]",
      "         [&_[data-slot='input']]:placeholder:text-[var(--tng-semantic-foreground-muted)]",
      "         [&_[data-slot='input']]:focus:outline-none",
      "         [&_[data-slot='input']]:focus:ring-0",
      "         [&_[data-slot='input-group-trailing']]:text-xs",
      "         [&_[data-slot='input-group-trailing']]:font-semibold",
      "         [&_[data-slot='input-group-trailing']]:text-[var(--tng-semantic-foreground-secondary)]\">",
      '  <input tngInput type="text" value="core-platform" />',
      '  <span tngSuffix>.tailng.dev</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  protected readonly clearPlainCodeTabs = createCodeTabs(
    'form-field-clear-plain',
    createFormFieldExampleTsCode(
      'app-doc-cmp-form-field-ex-clear-plain',
      'DocCmpFormFieldExClearPlainComponent',
    ),
    [
      '<tng-form-field class="doc-cmp-form-field-ex-clear-shell">',
      '  <input tngInput type="search" value="TailNG" />',
      '  <button',
      '    tngSuffix',
      '    type="button"',
      '    class="doc-cmp-form-field-ex-clear-action"',
      '    aria-label="Clear search"',
      '  >',
      '    Clear',
      '  </button>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-form-field-ex-clear-shell [data-slot="input-group"] {',
      '  border: 1px solid var(--tng-semantic-border-strong);',
      '  background: var(--tng-semantic-background-base);',
      '  border-radius: 0.78rem;',
      '  min-height: 2.65rem;',
      '  padding-inline: 0.85rem;',
      '  box-shadow: none;',
      '}',
      '.doc-cmp-form-field-ex-clear-shell [data-slot="input-group"][data-focused] {',
      '  border-color: var(--tng-semantic-accent-brand);',
      '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
      '}',
      '.doc-cmp-form-field-ex-clear-shell [data-slot="input"] {',
      '  appearance: none;',
      '  background: transparent;',
      '  border: 0;',
      '  box-shadow: none;',
      '  color: inherit;',
      '  display: block;',
      '  font: inherit;',
      '  min-width: 0;',
      '  outline: none;',
      '  padding: 0;',
      '  width: 100%;',
      '}',
      '.doc-cmp-form-field-ex-clear-action {',
      '  border: 0;',
      '  border-radius: 0.5rem;',
      '  background: transparent;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  padding: 0.3rem 0.55rem;',
      '  font-size: 0.78rem;',
      '  font-weight: 600;',
      '}',
      '.doc-cmp-form-field-ex-clear-action:hover {',
      '  background: color-mix(in srgb, var(--tng-semantic-background-muted) 62%, transparent);',
      '  color: var(--tng-semantic-foreground-primary);',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly clearTailwindCodeTabs = createCodeTabs(
    'form-field-clear-tailwind',
    createFormFieldExampleTsCode(
      'app-doc-cmp-form-field-ex-clear-tailwind',
      'DocCmpFormFieldExClearTailwindComponent',
    ),
    [
      '<tng-form-field',
      '  class="block',
      "         [&_[data-slot='input-group']]:min-h-11",
      "         [&_[data-slot='input-group']]:items-center",
      "         [&_[data-slot='input-group']]:rounded-xl",
      "         [&_[data-slot='input-group']]:border",
      "         [&_[data-slot='input-group']]:border-[var(--tng-semantic-border-strong)]",
      "         [&_[data-slot='input-group']]:bg-[var(--tng-semantic-background-base)]",
      "         [&_[data-slot='input-group']]:px-3",
      "         [&_[data-slot='input-group']]:shadow-none",
      "         [&_[data-slot='input-group'][data-focused]]:border-[var(--tng-semantic-accent-brand)]",
      "         [&_[data-slot='input-group'][data-focused]]:ring-2",
      "         [&_[data-slot='input-group'][data-focused]]:ring-blue-400/20",
      "         [&_[data-slot='input']]:w-full",
      "         [&_[data-slot='input']]:appearance-none",
      "         [&_[data-slot='input']]:border-0",
      "         [&_[data-slot='input']]:bg-transparent",
      "         [&_[data-slot='input']]:p-0",
      "         [&_[data-slot='input']]:outline-none",
      "         [&_[data-slot='input']]:shadow-none",
      "         [&_[data-slot='input']]:text-[var(--tng-semantic-foreground-primary)]",
      "         [&_[data-slot='input']]:placeholder:text-[var(--tng-semantic-foreground-muted)]",
      "         [&_[data-slot='input']]:focus:outline-none",
      "         [&_[data-slot='input']]:focus:ring-0",
      "         [&_[data-slot='input-group-trailing']_button]:rounded-md",
      "         [&_[data-slot='input-group-trailing']_button]:border-0",
      "         [&_[data-slot='input-group-trailing']_button]:bg-transparent",
      "         [&_[data-slot='input-group-trailing']_button]:px-2",
      "         [&_[data-slot='input-group-trailing']_button]:py-1",
      "         [&_[data-slot='input-group-trailing']_button]:text-xs",
      "         [&_[data-slot='input-group-trailing']_button]:font-semibold",
      "         [&_[data-slot='input-group-trailing']_button]:text-[var(--tng-semantic-foreground-secondary)]",
      "         hover:[&_[data-slot='input-group-trailing']_button]:bg-[color-mix(in_srgb,var(--tng-semantic-background-muted)_62%,transparent)]",
      "         hover:[&_[data-slot='input-group-trailing']_button]:text-[var(--tng-semantic-foreground-primary)]\">",
      '  <input tngInput type="search" value="TailNG" />',
      '  <button tngSuffix type="button" aria-label="Clear search">Clear</button>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
