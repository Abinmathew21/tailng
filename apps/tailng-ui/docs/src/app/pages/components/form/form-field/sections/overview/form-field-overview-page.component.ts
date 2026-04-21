import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngFormFieldComponent } from '@tailng-ui/components';
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

function createOverviewTsCode(selector: string, className: string): string {
  return [
    "import { Component } from '@angular/core';",
    "import { TngFormFieldComponent } from '@tailng-ui/components';",
    "import { TngIcon } from '@tailng-ui/icons';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: '" + selector + "',",
    '  standalone: true,',
    '  imports: [TngFormFieldComponent, TngIcon, TngInput, TngPrefix, TngSuffix],',
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

  readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
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
    "import { TngIcon } from '@tailng-ui/icons';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly basicCompositionCode = [
    '<tng-form-field>',
    '  <input tngInput type="text" placeholder="Search docs" />',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly searchCompositionCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">',
    '    <tng-icon icon="search"></tng-icon>',
    '  </span>',
    '  <input tngInput type="search" placeholder="Search components..." />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly relationshipCode = [
    '<tng-input type="text" placeholder="Display name" ariaLabel="Display name"></tng-input>',
    '',
    '<!-- Reach for tng-form-field when the shell needs projected content -->',
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">',
    '    <tng-icon icon="search"></tng-icon>',
    '  </span>',
    '  <input tngInput type="search" placeholder="Search components..." />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly accessibilityCode = [
    '<label for="docs-search">Search docs</label>',
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">',
    '    <tng-icon icon="search"></tng-icon>',
    '  </span>',
    '  <input id="docs-search" tngInput type="search" />',
    '  <button tngSuffix type="button" aria-label="Clear search">Clear</button>',
    '</tng-form-field>',
    '',
  ].join('\n');

  private readonly tailwindHostClassValue = [
    'block',
    'w-full',
    '[--tng-input-bg:var(--tng-semantic-background-surface)]',
    '[--tng-input-border:var(--tng-semantic-border-subtle)]',
    '[--tng-input-radius:0.9rem]',
    '[--tng-input-min-height:2.85rem]',
    '[--tng-input-px:0.95rem]',
    '[--tng-input-gap:0.65rem]',
    '[--tng-input-fg:var(--tng-semantic-foreground-primary)]',
    '[--tng-input-focus-ring:color-mix(in_srgb,var(--tng-semantic-focus-ring)_24%,transparent)]',
    '[--tng-input-font-size:0.96rem]',
    '[--tng-input-line-height:1.45]',
    '[--tng-input-placeholder:var(--tng-semantic-foreground-muted)]',
  ].join(' ');

  protected readonly tailwindHostClass = this.tailwindHostClassValue;

  private readonly plainExampleTsCode = createOverviewTsCode(
    'app-doc-cmp-form-field-ov-plain-search',
    'DocCmpFormFieldOvPlainSearchComponent',
  );

  private readonly plainExampleHtmlCode = [
    '<label class="doc-cmp-form-field-ov-plain-card">',
    '  <span class="doc-cmp-form-field-ov-plain-label">Search docs</span>',
    '  <div class="doc-cmp-form-field-ov-plain-shell">',
    '    <tng-form-field>',
    '      <span tngPrefix aria-hidden="true" class="doc-cmp-form-field-ov-plain-prefix">',
    '        <tng-icon icon="search" class="doc-cmp-form-field-ov-plain-icon"></tng-icon>',
    '      </span>',
    '      <input tngInput type="search" placeholder="Search components..." />',
    '      <span tngSuffix class="doc-cmp-form-field-ov-plain-meta">Ctrl+K</span>',
    '    </tng-form-field>',
    '  </div>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainExampleCssCode = [
    '.doc-cmp-form-field-ov-plain-card {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  width: min(100%, 34rem);',
    '  margin-inline: auto;',
    '  padding: 1.15rem;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 1.25rem;',
    '  background: var(--tng-semantic-background-surface);',
    '  color: var(--tng-semantic-foreground-primary);',
    '  box-shadow: 0 12px 32px color-mix(in srgb, var(--tng-semantic-foreground-primary) 8%, transparent);',
    '}',
    '',
    '.doc-cmp-form-field-ov-plain-label {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.8rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.02em;',
    '}',
    '',
    '.doc-cmp-form-field-ov-plain-shell {',
    '  width: 100%;',
    '  --tng-input-bg: var(--tng-semantic-background-surface);',
    '  --tng-input-border: var(--tng-semantic-border-subtle);',
    '  --tng-input-radius: 0.9rem;',
    '  --tng-input-min-height: 2.85rem;',
    '  --tng-input-px: 0.95rem;',
    '  --tng-input-gap: 0.65rem;',
    '  --tng-input-fg: var(--tng-semantic-foreground-primary);',
    '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-focus-ring) 24%, transparent);',
    '  --tng-input-font-size: 0.96rem;',
    '  --tng-input-line-height: 1.45;',
    '  --tng-input-placeholder: var(--tng-semantic-foreground-muted);',
    '}',
    '',
    '.doc-cmp-form-field-ov-plain-shell tng-form-field {',
    '  display: block;',
    '  width: 100%;',
    '}',
    '',
    '.doc-cmp-form-field-ov-plain-prefix,',
    '.doc-cmp-form-field-ov-plain-meta {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '}',
    '',
    '.doc-cmp-form-field-ov-plain-icon {',
    '  width: 1rem;',
    '  height: 1rem;',
    '}',
    '',
    '.doc-cmp-form-field-ov-plain-meta {',
    '  font-size: 0.8rem;',
    '  font-weight: 600;',
    '  white-space: nowrap;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindExampleTsCode = createOverviewTsCode(
    'app-doc-cmp-form-field-ov-tailwind-search',
    'DocCmpFormFieldOvTailwindSearchComponent',
  );

  private readonly tailwindExampleHtmlCode = [
    '<label class="mx-auto grid w-full max-w-[34rem] gap-2 rounded-[1.5rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-[0_12px_32px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)]">',
    '  <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-secondary)]">Search docs</span>',
    '  <div class="' + this.tailwindHostClassValue + '">',
    '    <tng-form-field>',
    '      <span tngPrefix aria-hidden="true" class="text-[var(--tng-semantic-foreground-secondary)]">',
    '        <tng-icon icon="search" class="h-4 w-4"></tng-icon>',
    '      </span>',
    '      <input tngInput type="search" placeholder="Search components..." />',
    '      <span tngSuffix class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">Ctrl+K</span>',
    '    </tng-form-field>',
    '  </div>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindExampleCssCode =
    '/* Tailwind utilities and host token overrides are applied directly in the template. */';

  protected readonly plainCssExampleCodeTabs = createCodeTabs(
    'doc-cmp-form-field-overview-plain',
    this.plainExampleTsCode,
    this.plainExampleHtmlCode,
    this.plainExampleCssCode,
  );

  protected readonly tailwindExampleCodeTabs = createCodeTabs(
    'doc-cmp-form-field-overview-tailwind',
    this.tailwindExampleTsCode,
    this.tailwindExampleHtmlCode,
    this.tailwindExampleCssCode,
  );

  ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
