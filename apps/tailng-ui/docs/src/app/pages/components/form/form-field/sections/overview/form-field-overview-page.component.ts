import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngCodeBlockComponent,
  TngError,
  TngFormFieldComponent,
  TngHint,
  TngInputComponent,
  TngInputFieldComponent,
  TngLabelComponent,
} from '@tailng-ui/components';
import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

function createStandaloneExampleTsCode(
  selector: string,
  className: string,
  importLines: readonly string[],
  imports: readonly string[],
): string {
  return [
    "import { Component } from '@angular/core';",
    ...importLines,
    '',
    '@Component({',
    "  selector: '" + selector + "',",
    '  standalone: true,',
    '  imports: [' + imports.join(', ') + '],',
    "  templateUrl: './" + selector + ".component.html',",
    "  styleUrl: './" + selector + ".component.css',",
    '})',
    'export class ' + className + ' {}',
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
    { value: 'ts', label: 'TS', language: 'ts', title: baseName + '.component.ts', code: tsCode },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: baseName + '.component.html',
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: baseName + '.component.css',
      code: cssCode,
    },
  ]);
}

const inputGroupImportLines = [
  "import { TngFormFieldComponent, TngHint, TngInputFieldComponent, TngLabelComponent } from '@tailng-ui/components';",
  "import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';",
] as const;

@Component({
  selector: 'app-form-field-overview-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngCodeBlockComponent,
    TngFormFieldComponent,
    TngHint,
    TngError,
    TngInputComponent,
    TngInputFieldComponent,
    TngLabelComponent,
    TngInput,
    TngInputFieldPrefix,
    TngInputFieldSuffix,
  ],
  templateUrl: './form-field-overview-page.component.html',
  styleUrl: './form-field-overview-page.component.css',
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

  protected readonly basicCode = [
    '<tng-form-field>',
    '  <tng-label forId="email">Email</tng-label>',
    '  <tng-input id="email" type="email" placeholder="team@tailng.dev" required />',
    '  <p tngHint>Use your work email.</p>',
    '  <p tngError>Email is required.</p>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly inputGroupTailwindFieldClass = [
    'grid',
    'w-full',
    'gap-2',
    '[--tng-form-field-label-fg:var(--tng-semantic-foreground-primary)]',
    '[--tng-form-field-message-fg:var(--tng-semantic-foreground-secondary)]',
  ].join(' ');

  private readonly tailwindCssCode =
    '/* Tailwind utilities and host token overrides are applied directly in the template. */';

  protected readonly inputGroupPlainCodeTabs = createCodeTabs(
    'doc-cmp-form-field-overview-input-group-plain',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ov-input-group-plain',
      'DocCmpFormFieldOvInputGroupPlainComponent',
      inputGroupImportLines,
      [
        'TngFormFieldComponent',
        'TngHint',
        'TngInputFieldComponent',
        'TngLabelComponent',
        'TngInput',
        'TngInputFieldPrefix',
        'TngInputFieldSuffix',
      ],
    ),
    [
      '<div class="doc-cmp-form-field-ov-input-group-shell">',
      '  <tng-form-field>',
      '    <tng-label forId="amount">Amount</tng-label>',
      '    <tng-input-field>',
      '      <span tngInputFieldPrefix>$</span>',
      '      <input tngInput id="amount" type="number" />',
      '      <span tngInputFieldSuffix>USD</span>',
      '    </tng-input-field>',
      '    <p tngHint>Enter amount before tax.</p>',
      '  </tng-form-field>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-form-field-ov-input-group-shell {',
      '  width: min(100%, 30rem);',
      '}',
      '',
      '.doc-cmp-form-field-ov-input-group-shell [tngInputFieldPrefix],',
      '.doc-cmp-form-field-ov-input-group-shell [tngInputFieldSuffix] {',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.875rem;',
      '  font-weight: 600;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly inputGroupTailwindCodeTabs = createCodeTabs(
    'doc-cmp-form-field-overview-input-group-tailwind',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ov-input-group-tailwind',
      'DocCmpFormFieldOvInputGroupTailwindComponent',
      inputGroupImportLines,
      [
        'TngFormFieldComponent',
        'TngHint',
        'TngInputFieldComponent',
        'TngLabelComponent',
        'TngInput',
        'TngInputFieldPrefix',
        'TngInputFieldSuffix',
      ],
    ),
    [
      '<div class="w-full max-w-[30rem]">',
      '  <tng-form-field class="' + this.inputGroupTailwindFieldClass + '">',
      '    <tng-label forId="amount">Amount</tng-label>',
      '    <tng-input-field>',
      '      <span tngInputFieldPrefix class="text-sm font-semibold text-[var(--tng-semantic-foreground-secondary)]">$</span>',
      '      <input tngInput id="amount" type="number" />',
      '      <span tngInputFieldSuffix class="text-sm font-semibold text-[var(--tng-semantic-foreground-secondary)]">USD</span>',
      '    </tng-input-field>',
      '    <p tngHint>Enter amount before tax.</p>',
      '  </tng-form-field>',
      '</div>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
