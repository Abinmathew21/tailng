import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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

type CreateCodeTabsArgs = {
  baseName: string;
  tsCode: string;
  htmlCode: string;
  cssCode: string;
};

type StandaloneExampleTsArgs = {
  selector: string;
  className: string;
  importsSource: readonly string[];
  importsArray: readonly string[];
  members?: readonly string[];
};

function createCodeTabs({
  baseName,
  tsCode,
  htmlCode,
  cssCode,
}: CreateCodeTabsArgs): readonly DocsExampleCodeTab[] {
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

function createStandaloneExampleTsCode({
  selector,
  className,
  importsSource,
  importsArray,
  members = [],
}: StandaloneExampleTsArgs): string {
  const classLines =
    members.length === 0
      ? [`export class ${className} {}`]
      : [
          `export class ${className} {`,
          ...members.map((line) => `  ${line}`),
          '}',
        ];

  return [
    ...importsSource,
    '',
    '@Component({',
    `  selector: '${selector}',`,
    '  standalone: true,',
    `  imports: [${importsArray.join(', ')}],`,
    `  templateUrl: './${selector}.component.html',`,
    `  styleUrl: './${selector}.component.css',`,
    '})',
    ...classLines,
    '',
  ].join('\n');
}

@Component({
  selector: 'app-headless-input-group-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngIcon,
    TngInput,
    TngInputGroup,
    TngPrefix,
    TngSuffix,
  ],
  templateUrl: './input-group-examples-page.component.html',
  styleUrls: [
    '../../../../../components/form/input/sections/examples/input-examples-page.component.css',
    './input-group-examples-page.component.css',
  ],
})
export class HeadlessInputGroupExamplesPageComponent implements OnDestroy {
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

  protected readonly clearActionQuery = signal('design tokens');

  protected readonly searchCommandPlainCodeTabs = createCodeTabs({
    baseName: 'headless-input-group-examples-plain-search-command',
    tsCode: createStandaloneExampleTsCode({
      selector: 'app-headless-input-group-examples-plain-search-command',
      className: 'HeadlessInputGroupExamplesPlainSearchCommandComponent',
      importsSource: [
        "import { Component } from '@angular/core';",
        "import { TngIcon } from '@tailng-ui/icons';",
        "import { TngInput, TngInputGroup, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
      ],
      importsArray: ['TngIcon', 'TngInput', 'TngInputGroup', 'TngPrefix', 'TngSuffix'],
    }),
    htmlCode: [
      '<label class="docs-headless-input-group-examples-plain-search-command-card">',
      '  <span class="docs-headless-input-group-examples-plain-search-command-label">Search docs</span>',
      '  <tng-input-group class="docs-headless-input-group-examples-plain-search-command-shell">',
      '    <span',
      '      tngPrefix',
      '      aria-hidden="true"',
      '      class="docs-headless-input-group-examples-plain-search-command-prefix"',
      '    >',
      '      <tng-icon',
      '        icon="search"',
      '        class="docs-headless-input-group-examples-plain-search-command-icon"',
      '      ></tng-icon>',
      '    </span>',
      '    <input',
      '      tngInput',
      '      type="search"',
      '      placeholder="Search components..."',
      '      class="docs-headless-input-group-examples-plain-search-command-control"',
      '    />',
      '    <span tngSuffix class="docs-headless-input-group-examples-plain-search-command-meta">Ctrl+K</span>',
      '  </tng-input-group>',
      '</label>',
      '',
    ].join('\n'),
    cssCode: [
      '.docs-headless-input-group-examples-plain-search-command-card {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '  width: min(100%, 34rem);',
      '}',
      '',
      '.docs-headless-input-group-examples-plain-search-command-label {',
      '  color: #64748b;',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '}',
      '',
      ".docs-headless-input-group-examples-plain-search-command-shell[data-slot='input-group'] {",
      '  align-items: center;',
      '  gap: 0.65rem;',
      '  width: 100%;',
      '  min-height: 2.85rem;',
      '  padding-inline: 0.95rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.92rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  transition: border-color 150ms ease, box-shadow 150ms ease;',
      '}',
      '',
      ".docs-headless-input-group-examples-plain-search-command-shell[data-slot='input-group'][data-focused] {",
      '  border-color: #3b82f6;',
      '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
      '}',
      '',
      '.docs-headless-input-group-examples-plain-search-command-prefix,',
      '.docs-headless-input-group-examples-plain-search-command-meta {',
      '  color: #64748b;',
      '}',
      '',
      '.docs-headless-input-group-examples-plain-search-command-icon {',
      '  width: 1rem;',
      '  height: 1rem;',
      '}',
      '',
      ".docs-headless-input-group-examples-plain-search-command-control[data-slot='input'] {",
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
      '.docs-headless-input-group-examples-plain-search-command-control::placeholder {',
      '  color: #94a3b8;',
      '}',
      '',
      '.docs-headless-input-group-examples-plain-search-command-meta {',
      '  white-space: nowrap;',
      '  font-size: 0.8rem;',
      '  font-weight: 600;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly searchCommandTailwindCodeTabs = createCodeTabs({
    baseName: 'headless-input-group-examples-tailwind-search-command',
    tsCode: createStandaloneExampleTsCode({
      selector: 'app-headless-input-group-examples-tailwind-search-command',
      className: 'HeadlessInputGroupExamplesTailwindSearchCommandComponent',
      importsSource: [
        "import { Component } from '@angular/core';",
        "import { TngIcon } from '@tailng-ui/icons';",
        "import { TngInput, TngInputGroup, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
      ],
      importsArray: ['TngIcon', 'TngInput', 'TngInputGroup', 'TngPrefix', 'TngSuffix'],
    }),
    htmlCode: [
      '<label class="grid w-full max-w-[34rem] gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">',
      '  <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Search docs</span>',
      '  <tng-input-group',
      '    class="min-h-[2.85rem] w-full items-center gap-[0.65rem] rounded-[0.92rem] border border-slate-300 bg-white px-4 text-slate-900 transition [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-4 [&[data-focused]]:ring-blue-100"',
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
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly workspaceSlugPlainCodeTabs = createCodeTabs({
    baseName: 'headless-input-group-examples-plain-workspace-slug',
    tsCode: createStandaloneExampleTsCode({
      selector: 'app-headless-input-group-examples-plain-workspace-slug',
      className: 'HeadlessInputGroupExamplesPlainWorkspaceSlugComponent',
      importsSource: [
        "import { Component } from '@angular/core';",
        "import { TngInput, TngInputGroup, TngSuffix } from '@tailng-ui/primitives';",
      ],
      importsArray: ['TngInput', 'TngInputGroup', 'TngSuffix'],
    }),
    htmlCode: [
      '<label class="docs-headless-input-group-examples-plain-workspace-slug-card">',
      '  <span class="docs-headless-input-group-examples-plain-workspace-slug-label">Workspace slug</span>',
      '  <tng-input-group class="docs-headless-input-group-examples-plain-workspace-slug-shell">',
      '    <input',
      '      tngInput',
      '      type="text"',
      '      value="core-platform"',
      '      class="docs-headless-input-group-examples-plain-workspace-slug-control"',
      '    />',
      '    <span tngSuffix class="docs-headless-input-group-examples-plain-workspace-slug-meta">.tailng.dev</span>',
      '  </tng-input-group>',
      '</label>',
      '',
    ].join('\n'),
    cssCode: [
      '.docs-headless-input-group-examples-plain-workspace-slug-card {',
      '  display: grid;',
      '  gap: 0.5rem;',
      '  width: min(100%, 31rem);',
      '}',
      '',
      '.docs-headless-input-group-examples-plain-workspace-slug-label {',
      '  color: #64748b;',
      '  font-size: 0.82rem;',
      '  font-weight: 600;',
      '}',
      '',
      ".docs-headless-input-group-examples-plain-workspace-slug-shell[data-slot='input-group'] {",
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
      ".docs-headless-input-group-examples-plain-workspace-slug-shell[data-slot='input-group'][data-focused] {",
      '  border-color: #3b82f6;',
      '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
      '}',
      '',
      ".docs-headless-input-group-examples-plain-workspace-slug-control[data-slot='input'] {",
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
      '.docs-headless-input-group-examples-plain-workspace-slug-meta {',
      '  color: #64748b;',
      '  font-size: 0.8rem;',
      '  font-weight: 600;',
      '  white-space: nowrap;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly workspaceSlugTailwindCodeTabs = createCodeTabs({
    baseName: 'headless-input-group-examples-tailwind-workspace-slug',
    tsCode: createStandaloneExampleTsCode({
      selector: 'app-headless-input-group-examples-tailwind-workspace-slug',
      className: 'HeadlessInputGroupExamplesTailwindWorkspaceSlugComponent',
      importsSource: [
        "import { Component } from '@angular/core';",
        "import { TngInput, TngInputGroup, TngSuffix } from '@tailng-ui/primitives';",
      ],
      importsArray: ['TngInput', 'TngInputGroup', 'TngSuffix'],
    }),
    htmlCode: [
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
      '    <span tngSuffix class="whitespace-nowrap text-xs font-semibold text-slate-500">.tailng.dev</span>',
      '  </tng-input-group>',
      '</label>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly clearActionPlainCodeTabs = createCodeTabs({
    baseName: 'headless-input-group-examples-plain-clear-action',
    tsCode: createStandaloneExampleTsCode({
      selector: 'app-headless-input-group-examples-plain-clear-action',
      className: 'HeadlessInputGroupExamplesPlainClearActionComponent',
      importsSource: [
        "import { Component, signal } from '@angular/core';",
        "import { TngInput, TngInputGroup, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
      ],
      importsArray: ['TngInput', 'TngInputGroup', 'TngPrefix', 'TngSuffix'],
      members: [
        "readonly headlessInputGroupExamplesPlainClearActionQuery = signal('design tokens');",
        '',
        'onHeadlessInputGroupExamplesPlainClearActionInput(event: Event): void {',
        '  this.headlessInputGroupExamplesPlainClearActionQuery.set(',
        '    (event.target as HTMLInputElement).value,',
        '  );',
        '}',
        '',
        'clearHeadlessInputGroupExamplesPlainClearActionQuery(): void {',
        "  this.headlessInputGroupExamplesPlainClearActionQuery.set('');",
        '}',
      ],
    }),
    htmlCode: [
      '<label class="docs-headless-input-group-examples-plain-clear-action-card">',
      '  <span class="docs-headless-input-group-examples-plain-clear-action-label">Command palette query</span>',
      '  <tng-input-group class="docs-headless-input-group-examples-plain-clear-action-shell">',
      '    <span tngPrefix class="docs-headless-input-group-examples-plain-clear-action-prefix">Query</span>',
      '    <input',
      '      tngInput',
      '      type="search"',
      '      placeholder="Search tokens..."',
      '      [value]="headlessInputGroupExamplesPlainClearActionQuery()"',
      '      (input)="onHeadlessInputGroupExamplesPlainClearActionInput($event)"',
      '      class="docs-headless-input-group-examples-plain-clear-action-control"',
      '    />',
      '    <button',
      '      tngSuffix',
      '      type="button"',
      '      class="docs-headless-input-group-examples-plain-clear-action-button"',
      '      [disabled]="headlessInputGroupExamplesPlainClearActionQuery().length === 0"',
      '      (click)="clearHeadlessInputGroupExamplesPlainClearActionQuery()"',
      '    >',
      '      Clear',
      '    </button>',
      '  </tng-input-group>',
      '</label>',
      '',
    ].join('\n'),
    cssCode: [
      '.docs-headless-input-group-examples-plain-clear-action-card {',
      '  display: grid;',
      '  gap: 0.6rem;',
      '  width: min(100%, 34rem);',
      '}',
      '',
      '.docs-headless-input-group-examples-plain-clear-action-label {',
      '  color: #64748b;',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '}',
      '',
      ".docs-headless-input-group-examples-plain-clear-action-shell[data-slot='input-group'] {",
      '  align-items: center;',
      '  gap: 0.7rem;',
      '  width: 100%;',
      '  min-height: 2.9rem;',
      '  padding-inline: 0.9rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.92rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  transition: border-color 150ms ease, box-shadow 150ms ease;',
      '}',
      '',
      ".docs-headless-input-group-examples-plain-clear-action-shell[data-slot='input-group'][data-focused] {",
      '  border-color: #3b82f6;',
      '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
      '}',
      '',
      '.docs-headless-input-group-examples-plain-clear-action-prefix {',
      '  color: #64748b;',
      '  font-size: 0.78rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.04em;',
      '  text-transform: uppercase;',
      '}',
      '',
      ".docs-headless-input-group-examples-plain-clear-action-control[data-slot='input'] {",
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
      '.docs-headless-input-group-examples-plain-clear-action-control::placeholder {',
      '  color: #94a3b8;',
      '}',
      '',
      '.docs-headless-input-group-examples-plain-clear-action-button {',
      '  appearance: none;',
      '  border: 0;',
      '  border-radius: 999px;',
      '  background: #dbeafe;',
      '  color: #1d4ed8;',
      '  cursor: pointer;',
      '  font: inherit;',
      '  font-size: 0.78rem;',
      '  font-weight: 700;',
      '  line-height: 1;',
      '  padding: 0.45rem 0.7rem;',
      '  transition: background-color 150ms ease, color 150ms ease, opacity 150ms ease;',
      '}',
      '',
      '.docs-headless-input-group-examples-plain-clear-action-button:hover {',
      '  background: #bfdbfe;',
      '}',
      '',
      '.docs-headless-input-group-examples-plain-clear-action-button:disabled {',
      '  cursor: default;',
      '  opacity: 0.5;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly clearActionTailwindCodeTabs = createCodeTabs({
    baseName: 'headless-input-group-examples-tailwind-clear-action',
    tsCode: createStandaloneExampleTsCode({
      selector: 'app-headless-input-group-examples-tailwind-clear-action',
      className: 'HeadlessInputGroupExamplesTailwindClearActionComponent',
      importsSource: [
        "import { Component, signal } from '@angular/core';",
        "import { TngInput, TngInputGroup, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
      ],
      importsArray: ['TngInput', 'TngInputGroup', 'TngPrefix', 'TngSuffix'],
      members: [
        "readonly headlessInputGroupExamplesTailwindClearActionQuery = signal('design tokens');",
        '',
        'onHeadlessInputGroupExamplesTailwindClearActionInput(event: Event): void {',
        '  this.headlessInputGroupExamplesTailwindClearActionQuery.set(',
        '    (event.target as HTMLInputElement).value,',
        '  );',
        '}',
        '',
        'clearHeadlessInputGroupExamplesTailwindClearActionQuery(): void {',
        "  this.headlessInputGroupExamplesTailwindClearActionQuery.set('');",
        '}',
      ],
    }),
    htmlCode: [
      '<label class="grid w-full max-w-[34rem] gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">',
      '  <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Command palette query</span>',
      '  <tng-input-group',
      '    class="min-h-[2.9rem] w-full items-center gap-[0.7rem] rounded-[0.92rem] border border-slate-300 bg-white px-4 text-slate-900 transition [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-4 [&[data-focused]]:ring-blue-100"',
      '  >',
      '    <span tngPrefix class="text-[0.78rem] font-bold uppercase tracking-[0.22em] text-slate-500">Query</span>',
      '    <input',
      '      tngInput',
      '      type="search"',
      '      placeholder="Search tokens..."',
      '      [value]="headlessInputGroupExamplesTailwindClearActionQuery()"',
      '      (input)="onHeadlessInputGroupExamplesTailwindClearActionInput($event)"',
      '      class="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.96rem] leading-[1.45] text-slate-900 outline-none placeholder:text-slate-400"',
      '    />',
      '    <button',
      '      tngSuffix',
      '      type="button"',
      '      class="rounded-full bg-blue-100 px-3 py-1.5 text-[0.78rem] font-bold leading-none text-blue-700 transition hover:bg-blue-200 disabled:cursor-default disabled:opacity-50"',
      '      [disabled]="headlessInputGroupExamplesTailwindClearActionQuery().length === 0"',
      '      (click)="clearHeadlessInputGroupExamplesTailwindClearActionQuery()"',
      '    >',
      '      Clear',
      '    </button>',
      '  </tng-input-group>',
      '</label>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected onClearActionInput(event: Event): void {
    this.clearActionQuery.set((event.target as HTMLInputElement).value);
  }

  protected clearClearActionQuery(): void {
    this.clearActionQuery.set('');
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
