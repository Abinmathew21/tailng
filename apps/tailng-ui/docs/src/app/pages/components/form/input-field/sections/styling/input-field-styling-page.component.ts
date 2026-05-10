import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngInputFieldComponent } from '@tailng-ui/components';
import { TngInput, TngInputFieldSuffix } from '@tailng-ui/primitives';
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

function createWorkspaceFieldTsCode(selector: string, className: string): string {
  return [
    "import { Component } from '@angular/core';",
    "import { TngInputFieldComponent } from '@tailng-ui/components';",
    "import { TngInput, TngInputFieldSuffix } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: '" + selector + "',",
    '  standalone: true,',
    '  imports: [TngInputFieldComponent, TngInput, TngInputFieldSuffix],',
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
  selector: 'app-input-field-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInputFieldComponent,
    TngInput,
    TngInputFieldSuffix,
  ],
  templateUrl: './input-field-styling-page.component.html',
  styleUrls: [
    '../../../input/sections/styling/input-styling-page.component.css',
    './input-field-styling-page.component.css',
  ],
})
export class InputFieldStylingPageComponent implements OnDestroy {
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
    '.docs-input-field-shell {',
    '  --tng-input-bg: var(--tng-semantic-background-surface);',
    '  --tng-input-border: var(--tng-semantic-border-subtle);',
    '  --tng-input-fg: var(--tng-semantic-foreground-primary);',
    '  --tng-input-radius: 0.85rem;',
    '  --tng-input-min-height: 2.75rem;',
    '  --tng-input-px: 0.9rem;',
    '  --tng-input-gap: 0.65rem;',
    '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-focus-ring) 24%, transparent);',
    '  --tng-input-font-size: 0.96rem;',
    '  --tng-input-line-height: 1.45;',
    '  --tng-input-placeholder: var(--tng-semantic-foreground-muted);',
    '}',
    '',
  ].join('\n');

  protected readonly stateOwnershipCode = [
    '/* <tng-input-field> exposes host tokens. */',
    '/* Focus, invalid, disabled, and readonly attrs still live on the inner primitive group. */',
    '/* If you need custom shell selectors keyed off those attrs, move to headless input-group. */',
    '',
    '<tng-input-group class="docs-search-group">',
    '  <span tngInputFieldPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" />',
    '</tng-input-group>',
    '',
    '.docs-search-group[data-focused] {',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-focus-ring) 24%, transparent);',
    '}',
    '',
  ].join('\n');

  private readonly plainScenarioTsCode = createWorkspaceFieldTsCode(
    'app-doc-cmp-input-field-st-workspace-plain',
    'DocCmpInputFieldStWorkspacePlainComponent',
  );

  private readonly plainScenarioHtmlCode = [
    '<label class="doc-cmp-input-field-st-workspace-field">',
    '  <span class="doc-cmp-input-field-st-workspace-label">Workspace slug</span>',
    '  <div class="doc-cmp-input-field-st-workspace-shell">',
    '    <tng-input-field>',
    '      <input tngInput type="text" value="core-platform" />',
    '      <span tngInputFieldSuffix class="doc-cmp-input-field-st-workspace-meta">.tailng.dev</span>',
    '    </tng-input-field>',
    '  </div>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainScenarioCssCode = [
    '.doc-cmp-input-field-st-workspace-field {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '  width: min(100%, 31rem);',
    '}',
    '',
    '.doc-cmp-input-field-st-workspace-label {',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '  color: var(--tng-semantic-foreground-secondary);',
    '}',
    '',
    '.doc-cmp-input-field-st-workspace-shell {',
    '  width: 100%;',
    '  --tng-input-bg: var(--tng-semantic-background-surface);',
    '  --tng-input-border: var(--tng-semantic-border-subtle);',
    '  --tng-input-radius: 0.78rem;',
    '  --tng-input-min-height: 2.65rem;',
    '  --tng-input-px: 0.85rem;',
    '  --tng-input-gap: 0.55rem;',
    '  --tng-input-fg: var(--tng-semantic-foreground-primary);',
    '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-focus-ring) 24%, transparent);',
    '  --tng-input-placeholder: var(--tng-semantic-foreground-muted);',
    '}',
    '',
    '.doc-cmp-input-field-st-workspace-shell tng-input-field {',
    '  display: block;',
    '  width: 100%;',
    '}',
    '',
    '.doc-cmp-input-field-st-workspace-meta {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.8rem;',
    '  font-weight: 600;',
    '  white-space: nowrap;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindHostClassValue = [
    'block',
    'w-full',
    '[--tng-input-bg:var(--tng-semantic-background-surface)]',
    '[--tng-input-border:var(--tng-semantic-border-subtle)]',
    '[--tng-input-radius:0.78rem]',
    '[--tng-input-min-height:2.65rem]',
    '[--tng-input-px:0.85rem]',
    '[--tng-input-gap:0.55rem]',
    '[--tng-input-fg:var(--tng-semantic-foreground-primary)]',
    '[--tng-input-focus-ring:color-mix(in_srgb,var(--tng-semantic-focus-ring)_24%,transparent)]',
    '[--tng-input-placeholder:var(--tng-semantic-foreground-muted)]',
  ].join(' ');

  protected readonly tailwindHostClass = this.tailwindHostClassValue;

  private readonly tailwindScenarioTsCode = createWorkspaceFieldTsCode(
    'app-doc-cmp-input-field-st-workspace-tailwind',
    'DocCmpInputFieldStWorkspaceTailwindComponent',
  );

  private readonly tailwindScenarioHtmlCode = [
    '<label class="grid w-full max-w-[31rem] gap-2">',
    '  <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">Workspace slug</span>',
    '  <div class="' + this.tailwindHostClassValue + '">',
    '    <tng-input-field>',
    '      <input tngInput type="text" value="core-platform" />',
    '      <span tngInputFieldSuffix class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">.tailng.dev</span>',
    '    </tng-input-field>',
    '  </div>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindScenarioCssCode =
    '/* Tailwind utilities and host token overrides are applied directly in the template. */';

  protected readonly plainScenarioCodeTabs = createCodeTabs(
    'doc-cmp-input-field-styling-plain',
    this.plainScenarioTsCode,
    this.plainScenarioHtmlCode,
    this.plainScenarioCssCode,
  );

  protected readonly tailwindScenarioCodeTabs = createCodeTabs(
    'doc-cmp-input-field-styling-tailwind',
    this.tailwindScenarioTsCode,
    this.tailwindScenarioHtmlCode,
    this.tailwindScenarioCssCode,
  );

  protected readonly stylePatternExamples = [
    {
      title: 'Projected content classes',
      description:
        'Theme the wrapper at the host, then style projected prefix, suffix, and action elements with your own classes.',
      language: 'html',
      code: [
        '<div class="docs-search-shell">',
        '  <tng-input-field>',
        '    <span tngInputFieldPrefix class="docs-search-prefix" aria-hidden="true">',
        '      <tng-icon icon="search"></tng-icon>',
        '    </span>',
        '    <input tngInput type="search" placeholder="Search docs" />',
        '    <button tngInputFieldSuffix type="button" class="docs-search-action">Clear</button>',
        '  </tng-input-field>',
        '</div>',
        '',
        '.docs-search-shell {',
        '  --tng-input-border: var(--tng-semantic-border-subtle);',
        '  --tng-input-radius: 0.85rem;',
        '}',
        '',
        '.docs-search-prefix { color: var(--tng-semantic-foreground-secondary); }',
        '.docs-search-action { color: var(--tng-semantic-foreground-secondary); }',
        '',
      ].join('\n'),
    },
    {
      title: 'Headless escalation for shell state',
      description:
        'The component wrapper keeps state selectors inside the primitive. Drop to headless input-group when you need custom focus or invalid selectors on the shell itself.',
      language: 'html',
      code: this.stateOwnershipCode,
    },
  ] as const;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
