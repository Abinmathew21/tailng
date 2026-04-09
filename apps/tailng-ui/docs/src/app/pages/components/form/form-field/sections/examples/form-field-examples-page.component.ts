import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngFormFieldComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../form-field.util';

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

  private readonly searchTailwindHostClassValue = [
    'block',
    'w-full',
    '[--tng-input-bg:#ffffff]',
    '[--tng-input-border:#cbd5e1]',
    '[--tng-input-radius:0.85rem]',
    '[--tng-input-min-height:2.7rem]',
    '[--tng-input-px:0.9rem]',
    '[--tng-input-gap:0.65rem]',
    '[--tng-input-fg:#0f172a]',
    '[--tng-input-focus-ring:rgba(59,130,246,0.18)]',
    '[--tng-input-placeholder:#94a3b8]',
  ].join(' ');

  private readonly workspaceTailwindHostClassValue = [
    'block',
    'w-full',
    '[--tng-input-bg:#ffffff]',
    '[--tng-input-border:#cbd5e1]',
    '[--tng-input-radius:0.85rem]',
    '[--tng-input-min-height:2.7rem]',
    '[--tng-input-px:0.9rem]',
    '[--tng-input-gap:0.55rem]',
    '[--tng-input-fg:#0f172a]',
    '[--tng-input-focus-ring:rgba(59,130,246,0.18)]',
  ].join(' ');

  private readonly clearTailwindHostClassValue = [
    'block',
    'w-full',
    '[--tng-input-bg:#ffffff]',
    '[--tng-input-border:#cbd5e1]',
    '[--tng-input-radius:0.85rem]',
    '[--tng-input-min-height:2.7rem]',
    '[--tng-input-px:0.9rem]',
    '[--tng-input-gap:0.55rem]',
    '[--tng-input-fg:#0f172a]',
    '[--tng-input-focus-ring:rgba(59,130,246,0.18)]',
  ].join(' ');

  protected readonly searchTailwindHostClass = this.searchTailwindHostClassValue;
  protected readonly workspaceTailwindHostClass = this.workspaceTailwindHostClassValue;
  protected readonly clearTailwindHostClass = this.clearTailwindHostClassValue;

  private readonly tailwindCssCode =
    '/* Tailwind utilities and host token overrides are applied directly in the template. */';

  protected readonly searchPlainCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-search-plain',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-search-plain',
      'DocCmpFormFieldExSearchPlainComponent',
      [
        "import { TngFormFieldComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
      ],
      ['TngFormFieldComponent', 'TngIcon', 'TngInput', 'TngPrefix', 'TngSuffix'],
    ),
    [
      '<tng-form-field class="doc-cmp-form-field-ex-search-shell">',
      '  <span tngPrefix aria-hidden="true" class="doc-cmp-form-field-ex-search-prefix">',
      '    <tng-icon icon="search" class="doc-cmp-form-field-ex-search-icon"></tng-icon>',
      '  </span>',
      '  <input tngInput type="search" placeholder="Search components..." />',
      '  <span tngSuffix class="doc-cmp-form-field-ex-search-meta">Ctrl+K</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-form-field-ex-search-shell {',
      '  display: block;',
      '  width: 100%;',
      '  --tng-input-bg: #ffffff;',
      '  --tng-input-border: #cbd5e1;',
      '  --tng-input-radius: 0.85rem;',
      '  --tng-input-min-height: 2.7rem;',
      '  --tng-input-px: 0.9rem;',
      '  --tng-input-gap: 0.65rem;',
      '  --tng-input-fg: #0f172a;',
      '  --tng-input-focus-ring: rgba(59, 130, 246, 0.18);',
      '  --tng-input-placeholder: #94a3b8;',
      '}',
      '',
      '.doc-cmp-form-field-ex-search-prefix,',
      '.doc-cmp-form-field-ex-search-meta {',
      '  color: #64748b;',
      '}',
      '',
      '.doc-cmp-form-field-ex-search-icon {',
      '  width: 1.05rem;',
      '  height: 1.05rem;',
      '}',
      '',
      '.doc-cmp-form-field-ex-search-meta {',
      '  font-size: 0.78rem;',
      '  font-weight: 600;',
      '  white-space: nowrap;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly searchTailwindCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-search-tailwind',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-search-tailwind',
      'DocCmpFormFieldExSearchTailwindComponent',
      [
        "import { TngFormFieldComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
      ],
      ['TngFormFieldComponent', 'TngIcon', 'TngInput', 'TngPrefix', 'TngSuffix'],
    ),
    [
      '<tng-form-field class="' + this.searchTailwindHostClassValue + '">',
      '  <span tngPrefix aria-hidden="true" class="text-slate-500">',
      '    <tng-icon icon="search" class="h-4 w-4"></tng-icon>',
      '  </span>',
      '  <input tngInput type="search" placeholder="Search components..." />',
      '  <span tngSuffix class="text-xs font-semibold text-slate-500">Ctrl+K</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  protected readonly workspacePlainCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-workspace-plain',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-workspace-plain',
      'DocCmpFormFieldExWorkspacePlainComponent',
      [
        "import { TngFormFieldComponent } from '@tailng-ui/components';",
        "import { TngInput, TngSuffix } from '@tailng-ui/primitives';",
      ],
      ['TngFormFieldComponent', 'TngInput', 'TngSuffix'],
    ),
    [
      '<tng-form-field class="doc-cmp-form-field-ex-workspace-shell">',
      '  <input tngInput type="text" value="core-platform" />',
      '  <span tngSuffix class="doc-cmp-form-field-ex-workspace-meta">.tailng.dev</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-form-field-ex-workspace-shell {',
      '  display: block;',
      '  width: 100%;',
      '  --tng-input-bg: #ffffff;',
      '  --tng-input-border: #cbd5e1;',
      '  --tng-input-radius: 0.85rem;',
      '  --tng-input-min-height: 2.7rem;',
      '  --tng-input-px: 0.9rem;',
      '  --tng-input-gap: 0.55rem;',
      '  --tng-input-fg: #0f172a;',
      '  --tng-input-focus-ring: rgba(59, 130, 246, 0.18);',
      '}',
      '',
      '.doc-cmp-form-field-ex-workspace-meta {',
      '  color: #64748b;',
      '  font-size: 0.8rem;',
      '  font-weight: 600;',
      '  white-space: nowrap;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly workspaceTailwindCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-workspace-tailwind',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-workspace-tailwind',
      'DocCmpFormFieldExWorkspaceTailwindComponent',
      [
        "import { TngFormFieldComponent } from '@tailng-ui/components';",
        "import { TngInput, TngSuffix } from '@tailng-ui/primitives';",
      ],
      ['TngFormFieldComponent', 'TngInput', 'TngSuffix'],
    ),
    [
      '<tng-form-field class="' + this.workspaceTailwindHostClassValue + '">',
      '  <input tngInput type="text" value="core-platform" />',
      '  <span tngSuffix class="text-xs font-semibold text-slate-500">.tailng.dev</span>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  protected readonly clearPlainCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-clear-plain',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-clear-plain',
      'DocCmpFormFieldExClearPlainComponent',
      [
        "import { TngFormFieldComponent } from '@tailng-ui/components';",
        "import { TngInput, TngSuffix } from '@tailng-ui/primitives';",
      ],
      ['TngFormFieldComponent', 'TngInput', 'TngSuffix'],
    ),
    [
      '<tng-form-field class="doc-cmp-form-field-ex-clear-shell">',
      '  <input tngInput type="search" value="TailNG" />',
      '  <button tngSuffix type="button" class="doc-cmp-form-field-ex-clear-action" aria-label="Clear search">',
      '    Clear',
      '  </button>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-form-field-ex-clear-shell {',
      '  display: block;',
      '  width: 100%;',
      '  --tng-input-bg: #ffffff;',
      '  --tng-input-border: #cbd5e1;',
      '  --tng-input-radius: 0.85rem;',
      '  --tng-input-min-height: 2.7rem;',
      '  --tng-input-px: 0.9rem;',
      '  --tng-input-gap: 0.55rem;',
      '  --tng-input-fg: #0f172a;',
      '  --tng-input-focus-ring: rgba(59, 130, 246, 0.18);',
      '}',
      '',
      '.doc-cmp-form-field-ex-clear-action {',
      '  border: 0;',
      '  border-radius: 0.55rem;',
      '  background: transparent;',
      '  color: #64748b;',
      '  font-size: 0.78rem;',
      '  font-weight: 600;',
      '  padding: 0.35rem 0.6rem;',
      '}',
      '',
      '.doc-cmp-form-field-ex-clear-action:hover {',
      '  background: rgba(148, 163, 184, 0.14);',
      '  color: #0f172a;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly clearTailwindCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-clear-tailwind',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-clear-tailwind',
      'DocCmpFormFieldExClearTailwindComponent',
      [
        "import { TngFormFieldComponent } from '@tailng-ui/components';",
        "import { TngInput, TngSuffix } from '@tailng-ui/primitives';",
      ],
      ['TngFormFieldComponent', 'TngInput', 'TngSuffix'],
    ),
    [
      '<tng-form-field class="' + this.clearTailwindHostClassValue + '">',
      '  <input tngInput type="search" value="TailNG" />',
      '  <button',
      '    tngSuffix',
      '    type="button"',
      '    aria-label="Clear search"',
      '    class="rounded-md bg-transparent px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-900"',
      '  >',
      '    Clear',
      '  </button>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
