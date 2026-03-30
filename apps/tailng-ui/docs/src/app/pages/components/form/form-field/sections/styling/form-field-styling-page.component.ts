import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngFormFieldComponent } from '@tailng-ui/components';
import { TngInput, TngSuffix } from '@tailng-ui/primitives';
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

function createFormFieldStylingExampleTsCode(selector: string, className: string): string {
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
  selector: 'app-form-field-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngFormFieldComponent,
    TngInput,
    TngSuffix,
  ],
  templateUrl: './form-field-styling-page.component.html',
  styleUrls: [
    '../../../input/sections/styling/input-styling-page.component.css',
    './form-field-styling-page.component.css',
  ],
})
export class FormFieldStylingPageComponent implements OnDestroy {
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

  protected readonly contractsCode = [
    '[data-slot="form-field-wrapper"]',
    '[data-appearance="outline" | "solid" | "ghost"]',
    '[data-size="sm" | "md" | "lg"]',
    '[data-tone="neutral" | "primary" | "success" | "danger"]',
    '[data-full-width]',
    '[data-slot="input-group"]',
    '[data-slot="input-group-leading"]',
    '[data-slot="input-group-control"]',
    '[data-slot="input-group-trailing"]',
    '[data-slot="input"]',
    '[data-focused]',
    '[data-disabled]',
    '[data-invalid]',
    '[data-readonly]',
    '',
  ].join('\n');

  protected readonly stateHooksCode = [
    '.doc-cmp-form-field-st-pattern-search-shell [data-slot="input-group"] {',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.75rem;',
    '  transition: border-color 0.15s ease, box-shadow 0.15s ease;',
    '}',
    '',
    '.doc-cmp-form-field-st-pattern-search-shell [data-slot="input-group"][data-focused] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 20%, transparent);',
    '}',
    '',
  ].join('\n');

  private readonly plainScenarioTsCode = createFormFieldStylingExampleTsCode(
    'app-doc-cmp-form-field-st-workspace-plain',
    'DocCmpFormFieldStWorkspacePlainComponent',
  );

  private readonly plainScenarioHtmlCode = [
    '<label class="doc-cmp-form-field-st-workspace-field">',
    '  <span class="doc-cmp-form-field-st-workspace-label">Workspace slug</span>',
    '  <tng-form-field class="doc-cmp-form-field-st-workspace-shell">',
    '    <input tngInput type="text" value="core-platform" />',
    '    <span tngSuffix class="doc-cmp-form-field-st-workspace-meta">.tailng.dev</span>',
    '  </tng-form-field>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainScenarioCssCode = [
    '.doc-cmp-form-field-st-workspace-field { display: grid; gap: 0.5rem; width: min(100%, 31rem); }',
    '.doc-cmp-form-field-st-workspace-label {',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '  color: var(--tng-semantic-foreground-secondary);',
    '}',
    '.doc-cmp-form-field-st-workspace-shell [data-slot="input-group"] {',
    '  min-height: 2.55rem;',
    '  border-radius: 0.75rem;',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  background: var(--tng-semantic-background-base);',
    '  padding-inline: 0.8rem;',
    '}',
    '.doc-cmp-form-field-st-workspace-shell [data-slot="input-group"][data-focused] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
    '}',
    '.doc-cmp-form-field-st-workspace-shell [data-slot="input"] {',
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
    '.doc-cmp-form-field-st-workspace-meta { font-size: 0.8rem; font-weight: 600; }',
    '',
  ].join('\n');

  private readonly tailwindScenarioTsCode = createFormFieldStylingExampleTsCode(
    'app-doc-cmp-form-field-st-workspace-tailwind',
    'DocCmpFormFieldStWorkspaceTailwindComponent',
  );

  private readonly tailwindScenarioHtmlCode = [
    '<label class="grid w-full max-w-[31rem] gap-2">',
    '  <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">',
    '    Workspace slug',
    '  </span>',
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
    "           [&_[data-slot='input-group-trailing']]:text-xs",
    "           [&_[data-slot='input-group-trailing']]:font-semibold",
    "           [&_[data-slot='input-group-trailing']]:text-[var(--tng-semantic-foreground-primary)]\">",
    '    <input tngInput type="text" value="core-platform" />',
    '    <span tngSuffix>.tailng.dev</span>',
    '  </tng-form-field>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindScenarioCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly plainScenarioCodeTabs = this.createCodeTabs(
    'form-field-style-example',
    this.plainScenarioTsCode,
    this.plainScenarioHtmlCode,
    this.plainScenarioCssCode,
  );

  protected readonly tailwindScenarioCodeTabs = this.createCodeTabs(
    'form-field-style-example-tailwind',
    this.tailwindScenarioTsCode,
    this.tailwindScenarioHtmlCode,
    this.tailwindScenarioCssCode,
  );

  protected readonly stylePatternExamples = [
    {
      title: 'Container-first focus styling',
      description:
        'Apply focus, invalid, and disabled treatment on the form-field shell instead of the projected input.',
      language: 'css',
      code: this.stateHooksCode,
    },
    {
      title: 'Projected slots',
      description:
        'Treat prefixes and suffixes as projected content that inherits the same shell chrome as the control.',
      language: 'html',
      code: [
        '<tng-form-field class="doc-cmp-form-field-st-pattern-search-shell">',
        '  <span tngPrefix aria-hidden="true">Search</span>',
        '  <input tngInput type="search" placeholder="Search docs" />',
        '  <button tngSuffix type="button" aria-label="Clear search">Clear</button>',
        '</tng-form-field>',
        '',
      ].join('\n'),
    },
    {
      title: 'State-driven styling',
      description:
        'Use the mirrored state attrs from the projected control instead of custom class toggles.',
      language: 'css',
      code: [
        '.doc-cmp-form-field-st-pattern-search-shell [data-slot="input-group"][data-invalid] {',
        '  border-color: var(--tng-semantic-accent-danger);',
        '}',
        '',
        '.doc-cmp-form-field-st-pattern-search-shell [data-slot="input-group"][data-disabled] {',
        '  opacity: 0.55;',
        '  cursor: not-allowed;',
        '}',
        '',
      ].join('\n'),
    },
  ] as const;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
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
