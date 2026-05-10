import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngInputGroup, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { stackblitzVanillaUrl, stackblitzTailwindUrl } from '../../input.util';

type CreateCodeTabsArgs = {
  baseName: string;
  tsCode: string;
  htmlCode: string;
  cssCode: string;
};

function createCodeTabs({ baseName, tsCode, htmlCode, cssCode }: CreateCodeTabsArgs): readonly DocsExampleCodeTab[] {
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
  selector: 'app-headless-input-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInputGroup,
    TngInput,
    TngInputFieldPrefix,
    TngInputFieldSuffix,
    TngIcon,
  ],
  templateUrl: './headless-input-examples-page.component.html',
  styleUrls: [
    '../../../../../components/form/input/sections/examples/input-examples-page.component.css',
    './headless-input-examples-page.component.css',
  ],
})
export class HeadlessInputExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly headlessSearchTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup, TngInputFieldPrefix, TngInputFieldSuffix } from "@tailng-ui/primitives";',
    'import { TngIcon } from "@tailng-ui/icons";',
    '',
    '@Component({',
    "  selector: 'app-search-input',",
    '  standalone: true,',
    '  imports: [TngInputGroup, TngInput, TngInputFieldPrefix, TngInputFieldSuffix, TngIcon],',
    "  templateUrl: './search-input.component.html',",
    "  styleUrl: './search-input.component.css',",
    '})',
    'export class SearchInputComponent {}',
    '',
  ].join('\n');

  protected readonly headlessWorkspaceTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup, TngInputFieldSuffix } from "@tailng-ui/primitives";',
    '',
    '@Component({',
    "  selector: 'app-workspace-slug-input',",
    '  standalone: true,',
    '  imports: [TngInputGroup, TngInput, TngInputFieldSuffix],',
    "  templateUrl: './workspace-slug-input.component.html',",
    "  styleUrl: './workspace-slug-input.component.css',",
    '})',
    'export class WorkspaceSlugInputComponent {}',
    '',
  ].join('\n');

  protected readonly workspaceHeadlessHtmlCode = [
    '<div tngInputGroup class="domain-shell">',
    '  <input tngInput type="text" value="core-platform" aria-label="Subdomain" />',
    '  <span tngInputFieldSuffix class="domain-suffix" aria-hidden="true">.tailng.dev</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly workspaceHeadlessCssCode = [
    ".domain-shell[data-slot='input-group'] {",
    '  width: 100%;',
    '  min-height: 3.25rem;',
    '  padding: 0 1.1rem;',
    '  border: 1px solid #94a3b8;',
    '  border-radius: 1.05rem;',
    '  background: #f8fafc;',
    '  color: #0f172a;',
    '  transition:',
    '    border-color 0.18s ease,',
    '    box-shadow 0.18s ease,',
    '    background-color 0.18s ease;',
    '  display: flex;',
    '  align-items: center;',
    '}',
    '',
    ".domain-shell[data-slot='input-group'][data-focused] {",
    '  border-color: #64748b;',
    '  box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.16);',
    '  background: #ffffff;',
    '}',
    '',
    ".domain-shell [data-slot='input-group-control'] {",
    '  flex: 1 1 auto;',
    '  width: 100%;',
    '  min-width: 0;',
    '}',
    '',
    ".domain-shell [data-slot='input'] {",
    '  background: transparent;',
    '  border: 0;',
    '  box-shadow: none;',
    '  color: #0f172a;',
    '  display: block;',
    '  font-size: 1.08rem;',
    '  font-weight: 500;',
    '  line-height: 1.2;',
    '  outline: none;',
    '  padding: 0;',
    '  width: 100%;',
    '  min-width: 0;',
    '}',
    '',
    ".domain-shell [data-slot='input-group-trailing'] {",
    '  margin-left: 0.8rem;',
    '}',
    '',
    ".domain-shell [data-slot='input-trailing'] {",
    '  display: inline-flex;',
    '  align-items: center;',
    '  flex: 0 0 auto;',
    '}',
    '',
    '.domain-suffix {',
    '  color: #475569;',
    '  font-size: 1.08rem;',
    '  font-weight: 600;',
    '  letter-spacing: 0.01em;',
    '  line-height: 1;',
    '  white-space: nowrap;',
    '}',
    '',
  ].join('\n');

  protected readonly headlessValidationTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup } from "@tailng-ui/primitives";',
    '',
    '@Component({',
    "  selector: 'app-validation-input',",
    '  standalone: true,',
    '  imports: [TngInputGroup, TngInput],',
    "  templateUrl: './validation-input.component.html',",
    "  styleUrl: './validation-input.component.css',",
    '})',
    'export class ValidationInputComponent {}',
    '',
  ].join('\n');

  protected readonly headlessStatesTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup } from "@tailng-ui/primitives";',
    '',
    '@Component({',
    "  selector: 'app-stateful-inputs',",
    '  standalone: true,',
    '  imports: [TngInputGroup, TngInput],',
    "  templateUrl: './stateful-inputs.component.html',",
    "  styleUrl: './stateful-inputs.component.css',",
    '})',
    'export class StatefulInputsComponent {}',
    '',
  ].join('\n');

  protected readonly searchHeadlessTailwindHtmlCode = [
    '<div',
    '  tngInputGroup',
    '  class="min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 shadow-sm transition',
    '         [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-200"',
    '>',
    '  <span tngInputFieldPrefix aria-hidden="true" class="text-slate-500">',
    '    <tng-icon icon="search" class="h-4 w-4" />',
    '  </span>',
    '  <input',
    '    tngInput',
    '    type="search"',
    '    placeholder="Search components..."',
    '    class="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-[0.98rem] text-slate-900 placeholder:text-slate-400 outline-none"',
    '  />',
    '  <span tngInputFieldSuffix class="text-xs font-semibold text-slate-500">Ctrl+K</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly workspaceHeadlessTailwindHtmlCode = [
    '<div',
    '  tngInputGroup',
    '  class="min-h-11 items-center gap-2 rounded-xl border border-blue-300 bg-blue-50/70 px-3 shadow-sm transition',
    '         [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-200"',
    '>',
    '  <input',
    '    tngInput',
    '    type="text"',
    '    placeholder="Workspace slug"',
    '    value="core-platform"',
    '    class="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-[0.98rem] text-slate-900 placeholder:text-slate-400 outline-none"',
    '  />',
    '  <span tngInputFieldSuffix class="text-xs font-semibold text-blue-700">.tailng.dev</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly validationHeadlessTailwindHtmlCode = [
    '<div class="grid gap-2">',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-11 items-center gap-2 rounded-xl border border-red-400 bg-red-50/70 px-3 shadow-sm transition',
    '           [&[data-focused]]:border-red-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-red-200"',
    '  >',
    '    <input',
    '      tngInput',
    '      type="email"',
    '      value="team@tailng"',
    '      aria-invalid="true"',
    '      class="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-[0.98rem] text-slate-900 outline-none"',
    '    />',
    '  </div>',
    '  <p class="text-xs font-medium text-red-600">',
    '    Enter a valid email address in user@domain format.',
    '  </p>',
    '</div>',
    '',
  ].join('\n');

  protected readonly statesHeadlessTailwindHtmlCode = [
    '<div class="grid gap-3">',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-11 items-center rounded-xl border border-slate-300 bg-slate-100/80 px-3 shadow-sm"',
    '  >',
    '    <input',
    '      tngInput',
    '      type="text"',
    '      value="Readonly API key"',
    '      readonly',
    '      class="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-[0.98rem] text-slate-900 outline-none"',
    '    />',
    '  </div>',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-11 items-center rounded-xl border border-slate-300 bg-slate-100/80 px-3 opacity-60"',
    '  >',
    '    <input',
    '      tngInput',
    '      type="text"',
    '      value="Disabled while syncing"',
    '      disabled',
    '      class="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-[0.98rem] text-slate-500 outline-none disabled:cursor-not-allowed"',
    '    />',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly searchHeadlessHtmlCode = [
    '<div tngInputGroup class="input-example-headless-shell">',
    '  <span tngInputFieldPrefix aria-hidden="true">',
    '    <tng-icon icon="search" class="input-example-icon" />',
    '  </span>',
    '  <input tngInput type="search" placeholder="Search components..." />',
    '  <span tngInputFieldSuffix class="input-example-meta">Ctrl+K</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly searchHeadlessCssCode = [
    ".input-example-headless-shell[data-slot='input-group'] {",
    '  background: #ffffff;',
    '  border: 1px solid #cbd5e1;',
    '  border-radius: 0.78rem;',
    '  color: #0f172a;',
    '  color-scheme: light;',
    '  cursor: text;',
    '  min-height: 2.65rem;',
    '  padding-inline: 0.88rem;',
    '  transition:',
    '    border-color 0.15s ease,',
    '    box-shadow 0.15s ease;',
    '}',
    '',
    ".input-example-headless-shell[data-slot='input-group'][data-focused] {",
    '  border-color: #3b82f6;',
    '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
    '}',
    '',
    ".input-example-headless-shell [data-slot='input-leading'],",
    ".input-example-headless-shell [data-slot='input-trailing'] {",
    '  align-items: center;',
    '  color: #64748b;',
    '  display: inline-flex;',
    '}',
    '',
    ".input-example-headless-shell [data-slot='input'] {",
    '  background: transparent;',
    '  border: 0 !important;',
    '  border-radius: 0;',
    '  box-shadow: none !important;',
    '  color: #0f172a;',
    '  display: block;',
    '  font-size: 0.98rem;',
    '  line-height: 1.35;',
    '  min-width: 0;',
    '  outline: none !important;',
    '  padding: 0;',
    '  width: 100%;',
    '}',
    '',
    ".input-example-headless-shell [data-slot='input']::placeholder {",
    '  color: #94a3b8;',
    '}',
    '',
    '.input-example-icon {',
    '  height: 1.1rem;',
    '  width: 1.1rem;',
    '}',
    '',
    '.input-example-meta {',
    '  color: #64748b;',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '  letter-spacing: 0.01em;',
    '}',
    '',
  ].join('\n');

  protected readonly searchTailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly workspaceTailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly validationHeadlessHtmlCode = [
    '<div class="input-example-validation-stack">',
    '  <div tngInputGroup class="input-example-headless-shell">',
    '    <input tngInput type="email" value="team@tailng" aria-invalid="true" />',
    '  </div>',
    '  <p class="input-example-helper input-example-helper--danger">',
    '    Enter a valid email address in user@domain format.',
    '  </p>',
    '</div>',
    '',
  ].join('\n');

  protected readonly validationHeadlessCssCode = [
    this.searchHeadlessCssCode,
    '.input-example-helper--danger {',
    '  color: #dc2626;',
    '  font-size: 0.82rem;',
    '}',
    '',
  ].join('\n');

  protected readonly validationTailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly statesHeadlessHtmlCode = [
    '<div class="input-example-stacked">',
    '  <div tngInputGroup class="input-example-headless-shell">',
    '    <input tngInput type="text" value="Readonly API key" readonly />',
    '  </div>',
    '  <div tngInputGroup class="input-example-headless-shell">',
    '    <input tngInput type="text" value="Disabled while syncing" disabled />',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly statesHeadlessCssCode = this.searchHeadlessCssCode;

  protected readonly statesTailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly searchPlainCodeTabs = createCodeTabs({
    baseName: 'search-input-plain-css',
    tsCode: this.headlessSearchTsCode,
    htmlCode: this.searchHeadlessHtmlCode,
    cssCode: this.searchHeadlessCssCode,
  });

  protected readonly searchTailwindCodeTabs = createCodeTabs({
    baseName: 'search-input-tailwind',
    tsCode: this.headlessSearchTsCode,
    htmlCode: this.searchHeadlessTailwindHtmlCode,
    cssCode: this.searchTailwindCssCode,
  });

  protected readonly workspacePlainCodeTabs = createCodeTabs({
    baseName: 'workspace-input-plain-css',
    tsCode: this.headlessWorkspaceTsCode,
    htmlCode: this.workspaceHeadlessHtmlCode,
    cssCode: this.workspaceHeadlessCssCode,
  });

  protected readonly workspaceTailwindCodeTabs = createCodeTabs({
    baseName: 'workspace-input-tailwind',
    tsCode: this.headlessWorkspaceTsCode,
    htmlCode: this.workspaceHeadlessTailwindHtmlCode,
    cssCode: this.workspaceTailwindCssCode,
  });

  protected readonly validationPlainCodeTabs = createCodeTabs({
    baseName: 'validation-input-plain-css',
    tsCode: this.headlessValidationTsCode,
    htmlCode: this.validationHeadlessHtmlCode,
    cssCode: this.validationHeadlessCssCode,
  });

  protected readonly validationTailwindCodeTabs = createCodeTabs({
    baseName: 'validation-input-tailwind',
    tsCode: this.headlessValidationTsCode,
    htmlCode: this.validationHeadlessTailwindHtmlCode,
    cssCode: this.validationTailwindCssCode,
  });

  protected readonly statesPlainCodeTabs = createCodeTabs({
    baseName: 'stateful-inputs-plain-css',
    tsCode: this.headlessStatesTsCode,
    htmlCode: this.statesHeadlessHtmlCode,
    cssCode: this.statesHeadlessCssCode,
  });

  protected readonly statesTailwindCodeTabs = createCodeTabs({
    baseName: 'stateful-inputs-tailwind',
    tsCode: this.headlessStatesTsCode,
    htmlCode: this.statesHeadlessTailwindHtmlCode,
    cssCode: this.statesTailwindCssCode,
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
