import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngInput, TngInputGroup, TngInputFieldSuffix } from '@tailng-ui/primitives';
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
    "import { TngInput, TngInputGroup, TngInputFieldSuffix } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    `  selector: '${selector}',`,
    '  standalone: true,',
    '  imports: [TngInput, TngInputGroup, TngInputFieldSuffix],',
    `  templateUrl: './${selector}.component.html',`,
    `  styleUrl: './${selector}.component.css',`,
    '})',
    `export class ${className} {}`,
    '',
  ].join('\n');
}

@Component({
  selector: 'app-headless-input-group-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInput,
    TngInputGroup,
    TngInputFieldSuffix,
  ],
  templateUrl: './input-group-styling-page.component.html',
  styleUrls: [
    '../../../input/sections/styling/headless-input-styling-page.component.css',
    './input-group-styling-page.component.css',
  ],
})
export class HeadlessInputGroupStylingPageComponent implements OnDestroy {
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

  protected readonly stateSelectorsCode = [
    ".docs-workspace-shell[data-slot='input-group'] {",
    '  border: 1px solid #cbd5e1;',
    '  border-radius: 0.85rem;',
    '  padding-inline: 0.9rem;',
    '}',
    '',
    ".docs-workspace-shell[data-slot='input-group'][data-focused] {",
    '  border-color: #3b82f6;',
    '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
    '}',
    '',
    ".docs-workspace-shell[data-slot='input-group'][data-disabled] {",
    '  opacity: 0.64;',
    '}',
    '',
  ].join('\n');

  protected readonly plainScenarioCodeTabs = createCodeTabs(
    'headless-input-group-styling-plain',
    createStandaloneExampleTsCode(
      'app-headless-input-group-styling-plain',
      'HeadlessInputGroupStylingPlainComponent',
    ),
    [
      '<label class="docs-headless-input-group-styling-plain-field">',
      '  <span class="docs-headless-input-group-styling-plain-label">Workspace slug</span>',
      '  <tng-input-group class="docs-headless-input-group-styling-plain-shell">',
      '    <input',
      '      tngInput',
      '      type="text"',
      '      value="core-platform"',
      '      class="docs-headless-input-group-styling-plain-control"',
      '    />',
      '    <span tngInputFieldSuffix class="docs-headless-input-group-styling-plain-meta">.tailng.dev</span>',
      '  </tng-input-group>',
      '</label>',
      '',
    ].join('\n'),
    [
      '.docs-headless-input-group-styling-plain-field {',
      '  display: grid;',
      '  gap: 0.5rem;',
      '  width: min(100%, 31rem);',
      '}',
      '',
      '.docs-headless-input-group-styling-plain-label {',
      '  color: #64748b;',
      '  font-size: 0.82rem;',
      '  font-weight: 600;',
      '}',
      '',
      ".docs-headless-input-group-styling-plain-shell[data-slot='input-group'] {",
      '  align-items: center;',
      '  gap: 0.55rem;',
      '  width: 100%;',
      '  min-height: 2.65rem;',
      '  padding-inline: 0.85rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.78rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  transition: border-color 150ms ease, box-shadow 150ms ease;',
      '}',
      '',
      ".docs-headless-input-group-styling-plain-shell[data-slot='input-group'][data-focused] {",
      '  border-color: #3b82f6;',
      '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
      '}',
      '',
      ".docs-headless-input-group-styling-plain-control[data-slot='input'] {",
      '  min-width: 0;',
      '  width: 100%;',
      '  padding: 0;',
      '  border: 0;',
      '  background: transparent;',
      '  color: #0f172a;',
      '  font: inherit;',
      '  outline: none;',
      '  box-shadow: none;',
      '}',
      '',
      '.docs-headless-input-group-styling-plain-meta {',
      '  color: #64748b;',
      '  font-size: 0.8rem;',
      '  font-weight: 600;',
      '  white-space: nowrap;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindScenarioCodeTabs = createCodeTabs(
    'headless-input-group-styling-tailwind',
    createStandaloneExampleTsCode(
      'app-headless-input-group-styling-tailwind',
      'HeadlessInputGroupStylingTailwindComponent',
    ),
    [
      '<label class="grid w-full max-w-[31rem] gap-2">',
      '  <span class="text-xs font-semibold text-slate-500">Workspace slug</span>',
      '  <tng-input-group',
      '    class="min-h-[2.65rem] w-full items-center gap-[0.55rem] rounded-[0.78rem] border border-slate-300 bg-white px-3.5 text-slate-900 transition [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-4 [&[data-focused]]:ring-blue-100"',
      '  >',
      '    <input',
      '      tngInput',
      '      type="text"',
      '      value="core-platform"',
      '      class="min-w-0 flex-1 border-0 bg-transparent p-0 text-slate-900 outline-none"',
      '    />',
      '    <span tngInputFieldSuffix class="whitespace-nowrap text-xs font-semibold text-slate-500">.tailng.dev</span>',
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
