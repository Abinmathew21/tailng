import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngInputGroup, TngPrefix, TngSuffix } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../input-group.util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
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

function createStandaloneExampleTsCode(selector: string, className: string): string {
  return [
    "import { Component } from '@angular/core';",
    "import { TngIcon } from '@tailng-ui/icons';",
    "import { TngInput, TngInputGroup, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    `  selector: '${selector}',`,
    '  standalone: true,',
    '  imports: [TngIcon, TngInput, TngInputGroup, TngPrefix, TngSuffix],',
    `  templateUrl: './${selector}.component.html',`,
    `  styleUrl: './${selector}.component.css',`,
    '})',
    `export class ${className} {}`,
    '',
  ].join('\n');
}

@Component({
  selector: 'app-headless-input-group-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngIcon,
    TngInput,
    TngInputGroup,
    TngPrefix,
    TngSuffix,
  ],
  templateUrl: './input-group-overview-page.component.html',
  styleUrls: [
    '../../../../../../shared/form/input/input-styles.css',
    './input-group-overview-page.component.css',
  ],
})
export class HeadlessInputGroupOverviewPageComponent implements OnDestroy {
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

  protected readonly importsCode = [
    "import { TngInput, TngInputGroup, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    "import { TngIcon } from '@tailng-ui/icons';",
    '',
  ].join('\n');

  protected readonly basicCompositionCode = [
    '<tng-input-group>',
    '  <input tngInput type="text" placeholder="Project name" />',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly groupedCompositionCode = [
    '<tng-input-group>',
    '  <span tngPrefix aria-hidden="true">',
    '    <tng-icon icon="search"></tng-icon>',
    '  </span>',
    '  <input tngInput type="search" placeholder="Search docs..." />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly mirroredStateCode = [
    '<tng-input-group class="docs-headless-search-shell">',
    '  <input tngInput type="email" aria-invalid="true" />',
    '</tng-input-group>',
    '',
    '.docs-headless-search-shell[data-focused] {',
    '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
    '}',
    '',
    '.docs-headless-search-shell[data-invalid] {',
    '  border-color: #dc2626;',
    '}',
    '',
  ].join('\n');

  protected readonly accessibilityCode = [
    '<label for="docs-search">Search docs</label>',
    '<tng-input-group>',
    '  <span tngPrefix aria-hidden="true">',
    '    <tng-icon icon="search"></tng-icon>',
    '  </span>',
    '  <input id="docs-search" tngInput type="search" />',
    '  <button tngSuffix type="button" aria-label="Clear search">Clear</button>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs = createCodeTabs(
    'headless-input-group-overview-plain',
    createStandaloneExampleTsCode(
      'app-headless-input-group-overview-plain',
      'HeadlessInputGroupOverviewPlainComponent',
    ),
    [
      '<label class="docs-headless-input-group-overview-plain-card">',
      '  <span class="docs-headless-input-group-overview-plain-label">Search docs</span>',
      '  <tng-input-group class="docs-headless-input-group-overview-plain-shell">',
      '    <span tngPrefix aria-hidden="true" class="docs-headless-input-group-overview-plain-prefix">',
      '      <tng-icon icon="search" class="docs-headless-input-group-overview-plain-icon"></tng-icon>',
      '    </span>',
      '    <input',
      '      tngInput',
      '      type="search"',
      '      placeholder="Search components..."',
      '      class="docs-headless-input-group-overview-plain-control"',
      '    />',
      '    <span tngSuffix class="docs-headless-input-group-overview-plain-meta">Ctrl+K</span>',
      '  </tng-input-group>',
      '</label>',
      '',
    ].join('\n'),
    [
      '.docs-headless-input-group-overview-plain-card {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '  width: min(100%, 34rem);',
      '  margin-inline: auto;',
      '  padding: 1.15rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1.25rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);',
      '}',
      '',
      '.docs-headless-input-group-overview-plain-label {',
      '  color: #64748b;',
      '  font-size: 0.8rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.02em;',
      '}',
      '',
      ".docs-headless-input-group-overview-plain-shell[data-slot='input-group'] {",
      '  align-items: center;',
      '  gap: 0.65rem;',
      '  width: 100%;',
      '  min-height: 2.85rem;',
      '  padding-inline: 0.95rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.9rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  transition: border-color 150ms ease, box-shadow 150ms ease;',
      '}',
      '',
      ".docs-headless-input-group-overview-plain-shell[data-slot='input-group'][data-focused] {",
      '  border-color: #3b82f6;',
      '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
      '}',
      '',
      '.docs-headless-input-group-overview-plain-prefix,',
      '.docs-headless-input-group-overview-plain-meta {',
      '  color: #64748b;',
      '}',
      '',
      '.docs-headless-input-group-overview-plain-icon {',
      '  width: 1rem;',
      '  height: 1rem;',
      '}',
      '',
      ".docs-headless-input-group-overview-plain-control[data-slot='input'] {",
      '  min-width: 0;',
      '  width: 100%;',
      '  padding: 0;',
      '  border: 0;',
      '  background: transparent;',
      '  color: #0f172a;',
      '  font: inherit;',
      '  line-height: 1.45;',
      '  outline: none;',
      '  box-shadow: none;',
      '}',
      '',
      '.docs-headless-input-group-overview-plain-control::placeholder {',
      '  color: #94a3b8;',
      '}',
      '',
      '.docs-headless-input-group-overview-plain-meta {',
      '  white-space: nowrap;',
      '  font-size: 0.8rem;',
      '  font-weight: 600;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-input-group-overview-tailwind',
    createStandaloneExampleTsCode(
      'app-headless-input-group-overview-tailwind',
      'HeadlessInputGroupOverviewTailwindComponent',
    ),
    [
      '<label class="mx-auto grid w-full max-w-[34rem] gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">',
      '  <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Search docs</span>',
      '  <tng-input-group',
      '    class="min-h-[2.85rem] w-full items-center gap-[0.65rem] rounded-[0.9rem] border border-slate-300 bg-white px-4 text-slate-900 transition [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-4 [&[data-focused]]:ring-blue-100"',
      '  >',
      '    <span tngPrefix aria-hidden="true" class="text-slate-500">',
      '      <tng-icon icon="search" class="h-4 w-4"></tng-icon>',
      '    </span>',
      '    <input',
      '      tngInput',
      '      type="search"',
      '      placeholder="Search components..."',
      '      class="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.96rem] leading-[1.45] text-slate-900 outline-none placeholder:text-slate-400"',
      '    />',
      '    <span tngSuffix class="whitespace-nowrap text-xs font-semibold text-slate-500">Ctrl+K</span>',
      '  </tng-input-group>',
      '</label>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
