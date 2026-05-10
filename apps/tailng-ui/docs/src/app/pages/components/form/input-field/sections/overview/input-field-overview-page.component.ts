import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngInputFieldComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../input-field.util';

function createOverviewTsCode(selector: string, className: string): string {
  return [
    "import { Component } from '@angular/core';",
    "import { TngInputFieldComponent } from '@tailng-ui/components';",
    "import { TngIcon } from '@tailng-ui/icons';",
    "import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: '" + selector + "',",
    '  standalone: true,',
    '  imports: [TngInputFieldComponent, TngIcon, TngInput, TngInputFieldPrefix, TngInputFieldSuffix],',
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
  selector: 'app-input-field-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInputFieldComponent,
    TngInput,
    TngInputFieldPrefix,
    TngInputFieldSuffix,
    TngIcon,
  ],
  templateUrl: './input-field-overview-page.component.html',
  styleUrls: [
    '../../../../../../shared/form/input/input-styles.css',
    './input-field-overview-page.component.css',
  ],
})
export class InputFieldOverviewPageComponent implements OnDestroy {
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
    "import { TngInputFieldComponent } from '@tailng-ui/components';",
    "import { TngIcon } from '@tailng-ui/icons';",
    "import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly basicCompositionCode = [
    '<tng-input-field>',
    '  <input tngInput type="text" placeholder="Search docs" />',
    '</tng-input-field>',
    '',
  ].join('\n');

  protected readonly searchCompositionCode = [
    '<tng-input-field>',
    '  <span tngInputFieldPrefix aria-hidden="true">',
    '    <tng-icon icon="search"></tng-icon>',
    '  </span>',
    '  <input tngInput type="search" placeholder="Search components..." />',
    '  <span tngInputFieldSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-input-field>',
    '',
  ].join('\n');

  protected readonly relationshipCode = [
    '<tng-input type="text" placeholder="Display name" ariaLabel="Display name"></tng-input>',
    '',
    '<!-- Reach for tng-input-field when the shell needs projected content -->',
    '<tng-input-field>',
    '  <span tngInputFieldPrefix aria-hidden="true">',
    '    <tng-icon icon="search"></tng-icon>',
    '  </span>',
    '  <input tngInput type="search" placeholder="Search components..." />',
    '  <span tngInputFieldSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-input-field>',
    '',
  ].join('\n');

  protected readonly accessibilityCode = [
    '<label for="docs-search">Search docs</label>',
    '<tng-input-field>',
    '  <span tngInputFieldPrefix aria-hidden="true">',
    '    <tng-icon icon="search"></tng-icon>',
    '  </span>',
    '  <input id="docs-search" tngInput type="search" />',
    '  <button tngInputFieldSuffix type="button" aria-label="Clear search">Clear</button>',
    '</tng-input-field>',
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
    'app-doc-cmp-input-field-ov-plain-search',
    'DocCmpInputFieldOvPlainSearchComponent',
  );

  private readonly plainExampleHtmlCode = [
    '<label class="doc-cmp-input-field-ov-plain-card">',
    '  <span class="doc-cmp-input-field-ov-plain-label">Search docs</span>',
    '  <div class="doc-cmp-input-field-ov-plain-shell">',
    '    <tng-input-field>',
    '      <span tngInputFieldPrefix aria-hidden="true" class="doc-cmp-input-field-ov-plain-prefix">',
    '        <tng-icon icon="search" class="doc-cmp-input-field-ov-plain-icon"></tng-icon>',
    '      </span>',
    '      <input tngInput type="search" placeholder="Search components..." />',
    '      <span tngInputFieldSuffix class="doc-cmp-input-field-ov-plain-meta">Ctrl+K</span>',
    '    </tng-input-field>',
    '  </div>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainExampleCssCode = [
    '.doc-cmp-input-field-ov-plain-card {',
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
    '.doc-cmp-input-field-ov-plain-label {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.8rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.02em;',
    '}',
    '',
    '.doc-cmp-input-field-ov-plain-shell {',
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
    '.doc-cmp-input-field-ov-plain-shell tng-input-field {',
    '  display: block;',
    '  width: 100%;',
    '}',
    '',
    '.doc-cmp-input-field-ov-plain-prefix,',
    '.doc-cmp-input-field-ov-plain-meta {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '}',
    '',
    '.doc-cmp-input-field-ov-plain-icon {',
    '  width: 1rem;',
    '  height: 1rem;',
    '}',
    '',
    '.doc-cmp-input-field-ov-plain-meta {',
    '  font-size: 0.8rem;',
    '  font-weight: 600;',
    '  white-space: nowrap;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindExampleTsCode = createOverviewTsCode(
    'app-doc-cmp-input-field-ov-tailwind-search',
    'DocCmpInputFieldOvTailwindSearchComponent',
  );

  private readonly tailwindExampleHtmlCode = [
    '<label class="mx-auto grid w-full max-w-[34rem] gap-2 rounded-[1.5rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-[0_12px_32px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)]">',
    '  <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-secondary)]">Search docs</span>',
    '  <div class="' + this.tailwindHostClassValue + '">',
    '    <tng-input-field>',
    '      <span tngInputFieldPrefix aria-hidden="true" class="text-[var(--tng-semantic-foreground-secondary)]">',
    '        <tng-icon icon="search" class="h-4 w-4"></tng-icon>',
    '      </span>',
    '      <input tngInput type="search" placeholder="Search components..." />',
    '      <span tngInputFieldSuffix class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">Ctrl+K</span>',
    '    </tng-input-field>',
    '  </div>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindExampleCssCode =
    '/* Tailwind utilities and host token overrides are applied directly in the template. */';

  protected readonly plainCssExampleCodeTabs = createCodeTabs(
    'doc-cmp-input-field-overview-plain',
    this.plainExampleTsCode,
    this.plainExampleHtmlCode,
    this.plainExampleCssCode,
  );

  protected readonly tailwindExampleCodeTabs = createCodeTabs(
    'doc-cmp-input-field-overview-tailwind',
    this.tailwindExampleTsCode,
    this.tailwindExampleHtmlCode,
    this.tailwindExampleCssCode,
  );

  ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
