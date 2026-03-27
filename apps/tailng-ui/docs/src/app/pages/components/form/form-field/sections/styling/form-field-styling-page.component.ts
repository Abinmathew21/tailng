import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngFormFieldComponent } from '@tailng-ui/components';
import { TngInput, TngSuffix } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

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
  styleUrls: ['../../../input/sections/styling/input-styling-page.component.css'],
})
export class FormFieldStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly contractsCode = [
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
    '.search-shell [data-slot="input-group"] {',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.75rem;',
    '  transition: border-color 0.15s ease, box-shadow 0.15s ease;',
    '}',
    '',
    '.search-shell [data-slot="input-group"][data-focused] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 20%, transparent);',
    '}',
    '',
  ].join('\n');

  private readonly plainScenarioTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngFormFieldComponent } from '@tailng-ui/components';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    "import { TngIcon } from '@tailng-ui/icons';",
    '',
    '@Component({',
    "  selector: 'app-form-field-style-example',",
    '  imports: [TngFormFieldComponent, TngInput, TngPrefix, TngSuffix, TngIcon],',
    "  templateUrl: './form-field-style-example.component.html',",
    "  styleUrl: './form-field-style-example.component.css',",
    '})',
    'export class FormFieldStyleExampleComponent {}',
    '',
  ].join('\n');

  private readonly plainScenarioHtmlCode = [
    '<label class="account-field">',
    '  <span class="account-label">Workspace slug</span>',
    '  <tng-form-field class="account-shell">',
    '    <input tngInput type="text" value="core-platform" />',
    '    <span tngSuffix class="account-meta">.tailng.dev</span>',
    '  </tng-form-field>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainScenarioCssCode = [
    '.account-field { display: grid; gap: 0.5rem; width: min(100%, 31rem); }',
    '.account-label { font-size: 0.82rem; font-weight: 600; color: var(--tng-semantic-foreground-secondary); }',
    '.account-shell [data-slot="input-group"] {',
    '  min-height: 2.55rem;',
    '  border-radius: 0.75rem;',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  background: var(--tng-semantic-background-base);',
    '  padding-inline: 0.8rem;',
    '}',
    '.account-shell [data-slot="input-group"][data-focused] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
    '}',
    '.account-meta { font-size: 0.8rem; font-weight: 600; }',
    '',
  ].join('\n');

  private readonly tailwindScenarioTsCode = this.plainScenarioTsCode;

  private readonly tailwindScenarioHtmlCode = [
    '<label class="grid w-full max-w-[31rem] gap-2">',
    '  <span class="text-xs font-semibold text-slate-500">Workspace slug</span>',
    '  <tng-form-field',
    '    class="block',
    "           [&_[data-slot='input-group']]:min-h-11",
    "           [&_[data-slot='input-group']]:items-center",
    "           [&_[data-slot='input-group']]:rounded-xl",
    "           [&_[data-slot='input-group']]:border",
    "           [&_[data-slot='input-group']]:border-blue-300",
    "           [&_[data-slot='input-group']]:bg-blue-50/70",
    "           [&_[data-slot='input-group']]:px-3",
    "           [&_[data-slot='input-group']]:shadow-sm",
    "           [&_[data-slot='input-group'][data-focused]]:border-blue-500",
    "           [&_[data-slot='input-group'][data-focused]]:ring-2",
    "           [&_[data-slot='input-group'][data-focused]]:ring-blue-200",
    "           [&_[data-slot='input']]:w-full",
    "           [&_[data-slot='input']]:border-0",
    "           [&_[data-slot='input']]:bg-transparent",
    "           [&_[data-slot='input']]:p-0",
    "           [&_[data-slot='input']]:outline-none",
    "           [&_[data-slot='input-group-trailing']]:text-xs",
    '           [&_[data-slot=\'input-group-trailing\']]:font-semibold">',
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
      description: 'Apply focus, invalid, and disabled treatment on the form-field shell instead of the projected input.',
      language: 'css',
      code: this.stateHooksCode,
    },
    {
      title: 'Projected slots',
      description: 'Treat prefixes and suffixes as projected content that inherits the same shell chrome as the control.',
      language: 'html',
      code: [
        '<tng-form-field class="search-shell">',
        '  <span tngPrefix aria-hidden="true">Search</span>',
        '  <input tngInput type="search" placeholder="Search docs" />',
        '  <button tngSuffix type="button" aria-label="Clear search">Clear</button>',
        '</tng-form-field>',
        '',
      ].join('\n'),
    },
    {
      title: 'State-driven styling',
      description: 'Use the mirrored state attrs from the projected control instead of custom class toggles.',
      language: 'css',
      code: [
        '.search-shell [data-slot="input-group"][data-invalid] {',
        '  border-color: var(--tng-semantic-accent-danger);',
        '}',
        '',
        '.search-shell [data-slot="input-group"][data-disabled] {',
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
      { value: 'html', label: 'HTML', language: 'html', title: `${baseName}.component.html`, code: htmlCode },
      { value: 'css', label: 'CSS', language: 'css', title: `${baseName}.component.css`, code: cssCode },
    ]);
  }

}
