import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../input.util';
import { TngInputComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

function createCodeTabs(options: {
  baseName: string;
  tsCode: string;
  htmlCode: string;
  cssCode: string;
}): readonly DocsExampleCodeTab[] {
  const { baseName, tsCode, htmlCode, cssCode } = options;
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
  selector: 'app-input-examples-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngInputComponent],
  templateUrl: './input-examples-page.component.html',
  styleUrl: './input-examples-page.component.css',
})
export class InputExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  private readonly tsBasic = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-ex-basic',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './doc-cmp-input-ex-basic.component.html',",
    "  styleUrl: './doc-cmp-input-ex-basic.component.css',",
    '})',
    'export class DocCmpInputExBasicComponent {}',
    '',
  ].join('\n');

  private readonly tsTypes = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-ex-types',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './doc-cmp-input-ex-types.component.html',",
    "  styleUrl: './doc-cmp-input-ex-types.component.css',",
    '})',
    'export class DocCmpInputExTypesComponent {}',
    '',
  ].join('\n');

  private readonly tsValidation = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-ex-validation',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './doc-cmp-input-ex-validation.component.html',",
    "  styleUrl: './doc-cmp-input-ex-validation.component.css',",
    '})',
    'export class DocCmpInputExValidationComponent {}',
    '',
  ].join('\n');

  private readonly tsStates = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-ex-states',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './doc-cmp-input-ex-states.component.html',",
    "  styleUrl: './doc-cmp-input-ex-states.component.css',",
    '})',
    'export class DocCmpInputExStatesComponent {}',
    '',
  ].join('\n');

  private readonly plainCssBasic = [
    '/*',
    ' * tng-input uses default component styles; keep local CSS for layout only.',
    ' */',
    '',
    '.doc-cmp-input-ex-basic-preview {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  width: min(100%, 32rem);',
    '}',
    '',
  ].join('\n');

  private readonly plainCssTypes = [
    '/* Layout only; tng-input styling comes from the component. */',
    '',
    '.doc-cmp-input-ex-types-preview.doc-cmp-input-ex-types-grid {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));',
    '  width: min(100%, 100%);',
    '}',
    '',
  ].join('\n');

  private readonly plainCssValidation = [
    '/*',
    ' * tng-input uses default invalid styling from tone/ariaInvalid;',
    ' * optional helper text styling below.',
    ' */',
    '',
    '.doc-cmp-input-ex-validation-preview.doc-cmp-input-ex-validation-stack {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '  width: min(100%, 32rem);',
    '}',
    '',
    '.doc-cmp-input-ex-validation-helper--danger {',
    '  color: #dc2626;',
    '  font-size: 0.82rem;',
    '}',
    '',
  ].join('\n');

  private readonly plainCssStates = [
    '/* Layout only; readonly/disabled visuals come from the component. */',
    '',
    '.doc-cmp-input-ex-states-preview.doc-cmp-input-ex-states-stack {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  width: min(100%, 32rem);',
    '}',
    '',
  ].join('\n');

  private readonly tailwindCssCode =
    '/* tng-input needs no CSS in this file; optional utilities belong on non-input wrappers only. */';

  protected readonly basicPlainCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-input-ex-basic-plain',
    tsCode: this.tsBasic,
    htmlCode: [
      '<div class="doc-cmp-input-ex-basic-preview">',
      '  <tng-input',
      '    type="text"',
      '    placeholder="Project name"',
      '    ariaLabel="Project name"',
      '  ></tng-input>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.plainCssBasic,
  });

  protected readonly basicTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-input-ex-basic-tailwind',
    tsCode: this.tsBasic,
    htmlCode: [
      '<div class="doc-cmp-input-ex-basic-preview">',
      '  <tng-input',
      '    type="text"',
      '    placeholder="Project name"',
      '    ariaLabel="Project name"',
      '  ></tng-input>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.tailwindCssCode,
  });

  protected readonly typePlainCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-input-ex-types-plain',
    tsCode: this.tsTypes,
    htmlCode: [
      '<div class="doc-cmp-input-ex-types-preview doc-cmp-input-ex-types-grid">',
      '  <tng-input type="email" placeholder="team@tailng.dev" ariaLabel="Email"></tng-input>',
      '  <tng-input type="search" placeholder="Search docs" ariaLabel="Search"></tng-input>',
      '  <tng-input type="number" placeholder="42" ariaLabel="Number"></tng-input>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.plainCssTypes,
  });

  protected readonly typeTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-input-ex-types-tailwind',
    tsCode: this.tsTypes,
    htmlCode: [
      '<div class="doc-cmp-input-ex-types-preview doc-cmp-input-ex-types-grid">',
      '  <tng-input type="email" placeholder="team@tailng.dev" ariaLabel="Email"></tng-input>',
      '  <tng-input type="search" placeholder="Search docs" ariaLabel="Search"></tng-input>',
      '  <tng-input type="number" placeholder="42" ariaLabel="Number"></tng-input>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.tailwindCssCode,
  });

  protected readonly validationPlainCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-input-ex-validation-plain',
    tsCode: this.tsValidation,
    htmlCode: [
      '<div class="doc-cmp-input-ex-validation-preview doc-cmp-input-ex-validation-stack">',
      '  <tng-input tone="danger" type="email" value="team@tailng" [ariaInvalid]="true"></tng-input>',
      '  <p class="doc-cmp-input-ex-validation-helper doc-cmp-input-ex-validation-helper--danger">',
      '    Enter a valid email address in user@domain format.',
      '  </p>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.plainCssValidation,
  });

  protected readonly validationTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-input-ex-validation-tailwind',
    tsCode: this.tsValidation,
    htmlCode: [
      '<div class="doc-cmp-input-ex-validation-preview doc-cmp-input-ex-validation-stack">',
      '  <tng-input tone="danger" type="email" value="team@tailng" [ariaInvalid]="true"></tng-input>',
      '  <p class="doc-cmp-input-ex-validation-tw-helper text-xs font-medium text-red-600">Enter a valid email address in user@domain format.</p>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.tailwindCssCode,
  });

  protected readonly statesPlainCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-input-ex-states-plain',
    tsCode: this.tsStates,
    htmlCode: [
      '<div class="doc-cmp-input-ex-states-preview doc-cmp-input-ex-states-stack">',
      '  <tng-input type="text" value="Readonly API key" readonly></tng-input>',
      '  <tng-input type="text" value="Disabled while syncing" disabled></tng-input>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.plainCssStates,
  });

  protected readonly statesTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-input-ex-states-tailwind',
    tsCode: this.tsStates,
    htmlCode: [
      '<div class="doc-cmp-input-ex-states-preview doc-cmp-input-ex-states-stack">',
      '  <tng-input type="text" value="Readonly API key" readonly></tng-input>',
      '  <tng-input type="text" value="Disabled while syncing" disabled></tng-input>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.tailwindCssCode,
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected focusProjectedInput(event: MouseEvent): void {
    const hostElement = event.currentTarget;
    if (!(hostElement instanceof HTMLElement)) {
      return;
    }

    const inputElement = hostElement.querySelector('[data-slot="input"]');
    if (!(inputElement instanceof HTMLInputElement) || inputElement.disabled) {
      return;
    }

    inputElement.focus({ preventScroll: true });
  }

}
