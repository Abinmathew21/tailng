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
    '[--tng-input-bg:var(--tng-semantic-background-surface)]',
    '[--tng-input-border:var(--tng-semantic-border-subtle)]',
    '[--tng-input-radius:0.85rem]',
    '[--tng-input-min-height:2.7rem]',
    '[--tng-input-px:0.9rem]',
    '[--tng-input-gap:0.65rem]',
    '[--tng-input-fg:var(--tng-semantic-foreground-primary)]',
    '[--tng-input-focus-ring:color-mix(in_srgb,var(--tng-semantic-focus-ring)_24%,transparent)]',
    '[--tng-input-placeholder:var(--tng-semantic-foreground-muted)]',
  ].join(' ');

  private readonly workspaceTailwindHostClassValue = [
    'block',
    'w-full',
    '[--tng-input-bg:var(--tng-semantic-background-surface)]',
    '[--tng-input-border:var(--tng-semantic-border-subtle)]',
    '[--tng-input-radius:0.85rem]',
    '[--tng-input-min-height:2.7rem]',
    '[--tng-input-px:0.9rem]',
    '[--tng-input-gap:0.55rem]',
    '[--tng-input-fg:var(--tng-semantic-foreground-primary)]',
    '[--tng-input-focus-ring:color-mix(in_srgb,var(--tng-semantic-focus-ring)_24%,transparent)]',
  ].join(' ');

  private readonly clearTailwindHostClassValue = [
    'block',
    'w-full',
    '[--tng-input-bg:var(--tng-semantic-background-surface)]',
    '[--tng-input-border:var(--tng-semantic-border-subtle)]',
    '[--tng-input-radius:0.85rem]',
    '[--tng-input-min-height:2.7rem]',
    '[--tng-input-px:0.9rem]',
    '[--tng-input-gap:0.55rem]',
    '[--tng-input-fg:var(--tng-semantic-foreground-primary)]',
    '[--tng-input-focus-ring:color-mix(in_srgb,var(--tng-semantic-focus-ring)_24%,transparent)]',
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
      '<div class="doc-cmp-form-field-ex-search-shell">',
      '  <tng-form-field>',
      '    <span tngPrefix aria-hidden="true" class="doc-cmp-form-field-ex-search-prefix">',
      '      <tng-icon icon="search" class="doc-cmp-form-field-ex-search-icon"></tng-icon>',
      '    </span>',
      '    <input tngInput type="search" placeholder="Search components..." />',
      '    <span tngSuffix class="doc-cmp-form-field-ex-search-meta">Ctrl+K</span>',
      '  </tng-form-field>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-form-field-ex-search-shell {',
      '  width: 100%;',
      '  --tng-input-bg: var(--tng-semantic-background-surface);',
      '  --tng-input-border: var(--tng-semantic-border-subtle);',
      '  --tng-input-radius: 0.85rem;',
      '  --tng-input-min-height: 2.7rem;',
      '  --tng-input-px: 0.9rem;',
      '  --tng-input-gap: 0.65rem;',
      '  --tng-input-fg: var(--tng-semantic-foreground-primary);',
      '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-focus-ring) 24%, transparent);',
      '  --tng-input-placeholder: var(--tng-semantic-foreground-muted);',
      '}',
      '',
      '.doc-cmp-form-field-ex-search-shell tng-form-field {',
      '  display: block;',
      '  width: 100%;',
      '}',
      '',
      '.doc-cmp-form-field-ex-search-prefix,',
      '.doc-cmp-form-field-ex-search-meta {',
      '  color: var(--tng-semantic-foreground-secondary);',
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
      '<div class="' + this.searchTailwindHostClassValue + '">',
      '  <tng-form-field>',
      '    <span tngPrefix aria-hidden="true" class="text-[var(--tng-semantic-foreground-secondary)]">',
      '      <tng-icon icon="search" class="h-4 w-4"></tng-icon>',
      '    </span>',
      '    <input tngInput type="search" placeholder="Search components..." />',
      '    <span tngSuffix class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">Ctrl+K</span>',
      '  </tng-form-field>',
      '</div>',
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
      '<div class="doc-cmp-form-field-ex-workspace-shell">',
      '  <tng-form-field>',
      '    <input tngInput type="text" value="core-platform" />',
      '    <span tngSuffix class="doc-cmp-form-field-ex-workspace-meta">.tailng.dev</span>',
      '  </tng-form-field>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-form-field-ex-workspace-shell {',
      '  width: 100%;',
      '  --tng-input-bg: var(--tng-semantic-background-surface);',
      '  --tng-input-border: var(--tng-semantic-border-subtle);',
      '  --tng-input-radius: 0.85rem;',
      '  --tng-input-min-height: 2.7rem;',
      '  --tng-input-px: 0.9rem;',
      '  --tng-input-gap: 0.55rem;',
      '  --tng-input-fg: var(--tng-semantic-foreground-primary);',
      '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-focus-ring) 24%, transparent);',
      '}',
      '',
      '.doc-cmp-form-field-ex-workspace-shell tng-form-field {',
      '  display: block;',
      '  width: 100%;',
      '}',
      '',
      '.doc-cmp-form-field-ex-workspace-meta {',
      '  color: var(--tng-semantic-foreground-secondary);',
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
      '<div class="' + this.workspaceTailwindHostClassValue + '">',
      '  <tng-form-field>',
      '    <input tngInput type="text" value="core-platform" />',
      '    <span tngSuffix class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">.tailng.dev</span>',
      '  </tng-form-field>',
      '</div>',
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
      '<div class="doc-cmp-form-field-ex-clear-shell">',
      '  <tng-form-field>',
      '    <input tngInput type="search" value="TailNG" />',
      '    <button tngSuffix type="button" class="doc-cmp-form-field-ex-clear-action" aria-label="Clear search">',
      '      Clear',
      '    </button>',
      '  </tng-form-field>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-form-field-ex-clear-shell {',
      '  width: 100%;',
      '  --tng-input-bg: var(--tng-semantic-background-surface);',
      '  --tng-input-border: var(--tng-semantic-border-subtle);',
      '  --tng-input-radius: 0.85rem;',
      '  --tng-input-min-height: 2.7rem;',
      '  --tng-input-px: 0.9rem;',
      '  --tng-input-gap: 0.55rem;',
      '  --tng-input-fg: var(--tng-semantic-foreground-primary);',
      '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-focus-ring) 24%, transparent);',
      '}',
      '',
      '.doc-cmp-form-field-ex-clear-shell tng-form-field {',
      '  display: block;',
      '  width: 100%;',
      '}',
      '',
      '.doc-cmp-form-field-ex-clear-action {',
      '  border: 0;',
      '  border-radius: 0.55rem;',
      '  background: transparent;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.78rem;',
      '  font-weight: 600;',
      '  padding: 0.35rem 0.6rem;',
      '}',
      '',
      '.doc-cmp-form-field-ex-clear-action:hover {',
      '  background: color-mix(in srgb, var(--tng-semantic-foreground-secondary) 14%, transparent);',
      '  color: var(--tng-semantic-foreground-primary);',
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
      '<div class="' + this.clearTailwindHostClassValue + '">',
      '  <tng-form-field>',
      '    <input tngInput type="search" value="TailNG" />',
      '    <button',
      '      tngSuffix',
      '      type="button"',
      '      aria-label="Clear search"',
      '      class="rounded-md bg-transparent px-2.5 py-1 text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-secondary)_14%,transparent)] hover:text-[var(--tng-semantic-foreground-primary)]"',
      '    >',
      '      Clear',
      '    </button>',
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
