import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngFormFieldComponent } from '@tailng-ui/components';
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../form-field.util';

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

@Component({
  selector: 'app-form-field-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngFormFieldComponent,
    TngInput,
    TngPrefix,
    TngSuffix,
    TngIcon,
  ],
  templateUrl: './form-field-overview-page.component.html',
  styleUrls: [
    '../../../../../../shared/form/input/input-styles.css',
    './form-field-overview-page.component.css',
  ],
})
export class FormFieldOverviewPageComponent implements OnDestroy {
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

  protected readonly importsCode = [
    "import { TngFormFieldComponent } from '@tailng-ui/components';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly basicCompositionCode = [
    '<tng-form-field>',
    '  <input tngInput type="text" placeholder="Search" />',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly searchCompositionCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search components" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly relationshipCode = [
    '<tng-input type="search" placeholder="Search" ariaLabel="Search"></tng-input>',
    '',
    '<!-- Use tng-form-field when you need projected adornments -->',
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search components" />',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly accessibilityCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput aria-label="Search docs" />',
    '  <button tngSuffix type="button" aria-label="Clear search">Clear</button>',
    '</tng-form-field>',
    '',
  ].join('\n');

  private readonly plainCssExampleHtmlCode = [
    '<label class="doc-cmp-form-field-ov-plain-search-field">',
    '  <span class="doc-cmp-form-field-ov-plain-search-label">Search docs</span>',
    '  <tng-form-field class="doc-cmp-form-field-ov-plain-search-shell">',
    '    <span tngPrefix aria-hidden="true">',
    '      <tng-icon icon="search" class="doc-cmp-form-field-ov-plain-search-icon"></tng-icon>',
    '    </span>',
    '    <input tngInput type="search" placeholder="Search components..." />',
    '    <span tngSuffix class="doc-cmp-form-field-ov-plain-search-meta">Ctrl+K</span>',
    '  </tng-form-field>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainCssExampleTsCode = createFormFieldExampleTsCode(
    'app-doc-cmp-form-field-ov-plain-search',
    'DocCmpFormFieldOvPlainSearchComponent',
  );

  private readonly plainCssExampleCssCode = [
    '.doc-cmp-form-field-ov-plain-search-field {',
    '  display: grid;',
    '  gap: 0.45rem;',
    '  width: min(100%, 32rem);',
    '}',
    '.doc-cmp-form-field-ov-plain-search-label {',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '  color: var(--tng-semantic-foreground-secondary);',
    '}',
    '.doc-cmp-form-field-ov-plain-search-shell [data-slot="input-group"] {',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  background: var(--tng-semantic-background-base);',
    '  min-height: 2.65rem;',
    '  border-radius: 0.78rem;',
    '  padding-inline: 0.85rem;',
    '  box-shadow: none;',
    '}',
    '.doc-cmp-form-field-ov-plain-search-shell [data-slot="input-group"][data-focused] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
    '}',
    '.doc-cmp-form-field-ov-plain-search-shell [data-slot="input"] {',
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
    '.doc-cmp-form-field-ov-plain-search-icon { height: 1rem; width: 1rem; }',
    '.doc-cmp-form-field-ov-plain-search-meta {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.8rem;',
    '  font-weight: 600;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindExampleHtmlCode = [
    '<label class="grid w-full max-w-[32rem] gap-2">',
    '  <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">Search docs</span>',
    '  <tng-form-field',
    '    class="block',
    "           [&_[data-slot='input-group']]:min-h-11",
    "           [&_[data-slot='input-group']]:items-center",
    "           [&_[data-slot='input-group']]:rounded-xl",
    "           [&_[data-slot='input-group']]:border",
    "           [&_[data-slot='input-group']]:border-[var(--tng-semantic-border-strong)]",
    "           [&_[data-slot='input-group']]:bg-[var(--tng-semantic-background-base)]",
    "           [&_[data-slot='input-group']]:px-3",
    "           [&_[data-slot='input-group']]:shadow-none",
    "           [&_[data-slot='input-group'][data-focused]]:border-[var(--tng-semantic-accent-brand)]",
    "           [&_[data-slot='input-group'][data-focused]]:ring-2",
    "           [&_[data-slot='input-group'][data-focused]]:ring-blue-400/20",
    "           [&_[data-slot='input']]:w-full",
    "           [&_[data-slot='input']]:appearance-none",
    "           [&_[data-slot='input']]:border-0",
    "           [&_[data-slot='input']]:bg-transparent",
    "           [&_[data-slot='input']]:p-0",
    "           [&_[data-slot='input']]:outline-none",
    "           [&_[data-slot='input']]:shadow-none",
    "           [&_[data-slot='input']]:text-[var(--tng-semantic-foreground-primary)]",
    "           [&_[data-slot='input']]:placeholder:text-[var(--tng-semantic-foreground-muted)]",
    "           [&_[data-slot='input']]:focus:outline-none",
    "           [&_[data-slot='input']]:focus:ring-0",
    "           [&_[data-slot='input-group-leading']]:text-[var(--tng-semantic-foreground-secondary)]",
    "           [&_[data-slot='input-group-trailing']]:text-xs",
    "           [&_[data-slot='input-group-trailing']]:font-semibold",
    "           [&_[data-slot='input-group-trailing']]:text-[var(--tng-semantic-foreground-secondary)]\">",
    '    <span tngPrefix aria-hidden="true">',
    '      <tng-icon icon="search" class="h-4 w-4"></tng-icon>',
    '    </span>',
    '    <input tngInput type="search" placeholder="Search components..." />',
    '    <span tngSuffix>Ctrl+K</span>',
    '  </tng-form-field>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindExampleTsCode = createFormFieldExampleTsCode(
    'app-doc-cmp-form-field-ov-tailwind-search',
    'DocCmpFormFieldOvTailwindSearchComponent',
  );

  private readonly tailwindExampleCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly plainCssExampleCodeTabs = this.createCodeTabs(
    'form-field-plain-example',
    this.plainCssExampleTsCode,
    this.plainCssExampleHtmlCode,
    this.plainCssExampleCssCode,
  );

  protected readonly tailwindExampleCodeTabs = this.createCodeTabs(
    'form-field-tailwind-example',
    this.tailwindExampleTsCode,
    this.tailwindExampleHtmlCode,
    this.tailwindExampleCssCode,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected focusProjectedInput(event: MouseEvent): void {
    const currentTarget = event.currentTarget;
    if (!(currentTarget instanceof HTMLElement)) {
      return;
    }

    const control = currentTarget.querySelector('input, textarea');
    if (control instanceof HTMLElement) {
      control.focus();
    }
  }

  private createCodeTabs(
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
}
