import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngFormFieldComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

function createCodeTabs(
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
  styleUrls: ['../../../input/sections/examples/input-examples-page.component.css'],
})
export class FormFieldExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  private readonly baseTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngFormFieldComponent } from '@tailng-ui/components';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    "import { TngIcon } from '@tailng-ui/icons';",
    '',
    '@Component({',
    "  selector: 'app-form-field-example',",
    '  imports: [TngFormFieldComponent, TngInput, TngPrefix, TngSuffix, TngIcon],',
    "  templateUrl: './form-field-example.component.html',",
    "  styleUrl: './form-field-example.component.css',",
    '})',
    'export class FormFieldExampleComponent {}',
    '',
  ].join('\n');

  private readonly plainCssCode = [
    '.input-example-control [data-slot="input-group"] {',
    '  border-radius: 0.78rem;',
    '  min-height: 2.65rem;',
    '}',
    '.input-example-icon { height: 1.1rem; width: 1.1rem; }',
    '.input-example-meta { font-size: 0.82rem; font-weight: 600; }',
    '',
  ].join('\n');

  private readonly tailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly searchPlainCodeTabs = createCodeTabs(
    'form-field-search-plain',
    this.baseTsCode,
    [
      '<tng-form-field class="input-example-control input-example-control--search">',
      '  <span tngPrefix aria-hidden="true">',
      '    <tng-icon icon="search" class="input-example-icon" />',
      '  </span>',
      '  <input tngInput type="search" placeholder="Search components..." />',
      '  <span tngSuffix class="input-example-meta">Ctrl+K</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    this.plainCssCode,
  );

  protected readonly searchTailwindCodeTabs = createCodeTabs(
    'form-field-search-tailwind',
    this.baseTsCode,
    [
      '<tng-form-field class="block ...">',
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
    this.baseTsCode,
    [
      '<tng-form-field class="input-example-control input-example-control--workspace">',
      '  <input tngInput type="text" value="core-platform" />',
      '  <span tngSuffix class="input-example-meta">.tailng.dev</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    this.plainCssCode,
  );

  protected readonly workspaceTailwindCodeTabs = createCodeTabs(
    'form-field-workspace-tailwind',
    this.baseTsCode,
    [
      '<tng-form-field class="block ...">',
      '  <input tngInput type="text" value="core-platform" />',
      '  <span tngSuffix>.tailng.dev</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  protected readonly clearPlainCodeTabs = createCodeTabs(
    'form-field-clear-plain',
    this.baseTsCode,
    [
      '<tng-form-field class="input-example-control input-example-control--search">',
      '  <input tngInput type="search" value="TailNG" />',
      '  <button tngSuffix type="button" aria-label="Clear search">Clear</button>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    this.plainCssCode,
  );

  protected readonly clearTailwindCodeTabs = createCodeTabs(
    'form-field-clear-tailwind',
    this.baseTsCode,
    [
      '<tng-form-field class="block ...">',
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
