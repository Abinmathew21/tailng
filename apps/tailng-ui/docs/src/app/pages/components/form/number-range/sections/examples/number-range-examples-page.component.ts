import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngNumberRangeComponent } from '@tailng-ui/components';
import type { TngNumberRangeValue } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../number-range.util';

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
  selector: 'app-number-range-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    TngNumberRangeComponent,
  ],
  templateUrl: './number-range-examples-page.component.html',
  styleUrl: './number-range-examples-page.component.css',
})
export class NumberRangeExamplesPageComponent implements OnDestroy {
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

  protected readonly formDemoValue = signal<TngNumberRangeValue>({ min: 100, max: 500 });
  protected readonly constrainedRange = signal<TngNumberRangeValue>({ min: 20, max: 80 });

  private readonly tailwindCssCode =
    '/* tng-number-range needs no CSS in this file; optional utilities belong on wrapper elements only. */';

  // ── Basic range ───────────────────────────────────────────────────────────

  private readonly tsBasic = [
    "import { Component } from '@angular/core';",
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-nr-ex-basic',",
    '  standalone: true,',
    '  imports: [TngNumberRangeComponent],',
    "  templateUrl: './doc-cmp-nr-ex-basic.component.html',",
    "  styleUrl: './doc-cmp-nr-ex-basic.component.css',",
    '})',
    'export class DocCmpNrExBasicComponent {}',
    '',
  ].join('\n');

  private readonly plainCssBasic = [
    '.doc-cmp-nr-ex-basic-preview {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  width: min(100%, 28rem);',
    '}',
    '',
  ].join('\n');

  protected readonly basicPlainCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-nr-ex-basic-plain',
    tsCode: this.tsBasic,
    htmlCode: [
      '<div class="doc-cmp-nr-ex-basic-preview">',
      '  <tng-number-range',
      '    minPlaceholder="Min"',
      '    maxPlaceholder="Max"',
      '    ariaLabel="Numeric range"',
      '  ></tng-number-range>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.plainCssBasic,
  });

  protected readonly basicTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-nr-ex-basic-tailwind',
    tsCode: this.tsBasic,
    htmlCode: [
      '<div class="w-full max-w-[28rem]">',
      '  <tng-number-range',
      '    minPlaceholder="Min"',
      '    maxPlaceholder="Max"',
      '    ariaLabel="Numeric range"',
      '  ></tng-number-range>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.tailwindCssCode,
  });

  // ── With constraints ──────────────────────────────────────────────────────

  private readonly tsConstraints = [
    "import { Component, signal } from '@angular/core';",
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    "import type { TngNumberRangeValue } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-nr-ex-constraints',",
    '  standalone: true,',
    '  imports: [TngNumberRangeComponent],',
    "  templateUrl: './doc-cmp-nr-ex-constraints.component.html',",
    "  styleUrl: './doc-cmp-nr-ex-constraints.component.css',",
    '})',
    'export class DocCmpNrExConstraintsComponent {',
    '  protected readonly range = signal<TngNumberRangeValue>({ min: 20, max: 80 });',
    '}',
    '',
  ].join('\n');

  private readonly plainCssConstraints = [
    '.doc-cmp-nr-ex-constraints-preview {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  width: min(100%, 28rem);',
    '}',
    '',
    '.doc-cmp-nr-ex-constraints-hint {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.8rem;',
    '}',
    '',
  ].join('\n');

  protected readonly constraintsPlainCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-nr-ex-constraints-plain',
    tsCode: this.tsConstraints,
    htmlCode: [
      '<div class="doc-cmp-nr-ex-constraints-preview">',
      '  <tng-number-range',
      '    [min]="0"',
      '    [max]="100"',
      '    [step]="5"',
      '    [value]="range()"',
      '    (valueChange)="range.set($event ?? { min: null, max: null })"',
      '    minPlaceholder="0"',
      '    maxPlaceholder="100"',
      '    ariaLabel="Percentage range"',
      '    minAriaLabel="Minimum percentage"',
      '    maxAriaLabel="Maximum percentage"',
      '  ></tng-number-range>',
      '  <p class="doc-cmp-nr-ex-constraints-hint">Accepts 0–100 in steps of 5</p>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.plainCssConstraints,
  });

  protected readonly constraintsTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-nr-ex-constraints-tailwind',
    tsCode: this.tsConstraints,
    htmlCode: [
      '<div class="grid w-full max-w-[28rem] gap-2">',
      '  <tng-number-range',
      '    [min]="0"',
      '    [max]="100"',
      '    [step]="5"',
      '    [value]="range()"',
      '    (valueChange)="range.set($event ?? { min: null, max: null })"',
      '    minPlaceholder="0"',
      '    maxPlaceholder="100"',
      '    ariaLabel="Percentage range"',
      '    minAriaLabel="Minimum percentage"',
      '    maxAriaLabel="Maximum percentage"',
      '  ></tng-number-range>',
      '  <p class="text-xs text-[var(--tng-semantic-foreground-secondary)]">Accepts 0–100 in steps of 5</p>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.tailwindCssCode,
  });

  // ── Validation feedback ───────────────────────────────────────────────────

  private readonly tsValidation = [
    "import { Component } from '@angular/core';",
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-nr-ex-validation',",
    '  standalone: true,',
    '  imports: [TngNumberRangeComponent],',
    "  templateUrl: './doc-cmp-nr-ex-validation.component.html',",
    "  styleUrl: './doc-cmp-nr-ex-validation.component.css',",
    '})',
    'export class DocCmpNrExValidationComponent {}',
    '',
  ].join('\n');

  private readonly plainCssValidation = [
    '.doc-cmp-nr-ex-validation-preview {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '  width: min(100%, 28rem);',
    '}',
    '',
    '.doc-cmp-nr-ex-validation-helper--danger {',
    '  color: #dc2626;',
    '  font-size: 0.82rem;',
    '}',
    '',
  ].join('\n');

  protected readonly validationPlainCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-nr-ex-validation-plain',
    tsCode: this.tsValidation,
    htmlCode: [
      '<div class="doc-cmp-nr-ex-validation-preview">',
      '  <!-- Auto-computed invalid: min > max -->',
      '  <tng-number-range',
      '    [min]="0"',
      '    [max]="100"',
      '    [value]="{ min: 80, max: 20 }"',
      '    ariaLabel="Invalid range"',
      '  ></tng-number-range>',
      '  <p class="doc-cmp-nr-ex-validation-helper doc-cmp-nr-ex-validation-helper--danger">',
      '    Minimum must not exceed maximum.',
      '  </p>',
      '',
      '  <!-- Explicit invalid flag -->',
      '  <tng-number-range',
      '    [invalid]="true"',
      '    ariaLabel="Explicitly invalid range"',
      '    minPlaceholder="From"',
      '    maxPlaceholder="To"',
      '  ></tng-number-range>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.plainCssValidation,
  });

  protected readonly validationTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-nr-ex-validation-tailwind',
    tsCode: this.tsValidation,
    htmlCode: [
      '<div class="grid w-full max-w-[28rem] gap-3">',
      '  <div class="grid gap-1">',
      '    <tng-number-range',
      '      [min]="0"',
      '      [max]="100"',
      '      [value]="{ min: 80, max: 20 }"',
      '      ariaLabel="Invalid range"',
      '    ></tng-number-range>',
      '    <p class="text-xs font-medium text-red-600">Minimum must not exceed maximum.</p>',
      '  </div>',
      '  <tng-number-range',
      '    [invalid]="true"',
      '    ariaLabel="Explicitly invalid range"',
      '    minPlaceholder="From"',
      '    maxPlaceholder="To"',
      '  ></tng-number-range>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.tailwindCssCode,
  });

  // ── States ────────────────────────────────────────────────────────────────

  private readonly tsStates = [
    "import { Component } from '@angular/core';",
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-nr-ex-states',",
    '  standalone: true,',
    '  imports: [TngNumberRangeComponent],',
    "  templateUrl: './doc-cmp-nr-ex-states.component.html',",
    "  styleUrl: './doc-cmp-nr-ex-states.component.css',",
    '})',
    'export class DocCmpNrExStatesComponent {}',
    '',
  ].join('\n');

  private readonly plainCssStates = [
    '.doc-cmp-nr-ex-states-preview {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  width: min(100%, 28rem);',
    '}',
    '',
  ].join('\n');

  protected readonly statesPlainCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-nr-ex-states-plain',
    tsCode: this.tsStates,
    htmlCode: [
      '<div class="doc-cmp-nr-ex-states-preview">',
      '  <tng-number-range',
      '    [value]="{ min: 10, max: 90 }"',
      '    ariaLabel="Readonly range"',
      '    readonly',
      '  ></tng-number-range>',
      '  <tng-number-range',
      '    [value]="{ min: 0, max: 100 }"',
      '    ariaLabel="Disabled range"',
      '    disabled',
      '  ></tng-number-range>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.plainCssStates,
  });

  protected readonly statesTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-nr-ex-states-tailwind',
    tsCode: this.tsStates,
    htmlCode: [
      '<div class="grid w-full max-w-[28rem] gap-3">',
      '  <tng-number-range',
      '    [value]="{ min: 10, max: 90 }"',
      '    ariaLabel="Readonly range"',
      '    readonly',
      '  ></tng-number-range>',
      '  <tng-number-range',
      '    [value]="{ min: 0, max: 100 }"',
      '    ariaLabel="Disabled range"',
      '    disabled',
      '  ></tng-number-range>',
      '</div>',
      '',
    ].join('\n'),
    cssCode: this.tailwindCssCode,
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected formDemoDisplayValue(): string {
    const v = this.formDemoValue();
    const min = v.min !== null ? v.min : '—';
    const max = v.max !== null ? v.max : '—';
    return `Min: ${min}, Max: ${max}`;
  }
}
