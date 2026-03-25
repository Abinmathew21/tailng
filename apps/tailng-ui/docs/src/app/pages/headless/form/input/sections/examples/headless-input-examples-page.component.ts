import { Component } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngInputGroup, TngPrefix, TngSuffix } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { InputExamplesPageComponent } from '../../../../../components/form/input/sections/examples/input-examples-page.component';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
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
    TngPrefix,
    TngSuffix,
    TngIcon,
  ],
  templateUrl: './headless-input-examples-page.component.html',
  styleUrls: [
    '../../../../../components/form/input/sections/examples/input-examples-page.component.css',
  ],
})
export class HeadlessInputExamplesPageComponent extends InputExamplesPageComponent {
  protected readonly headlessSearchTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup, TngPrefix, TngSuffix } from "@tailng-ui/primitives";',
    'import { TngIcon } from "@tailng-ui/icons";',
    '',
    '@Component({',
    '  imports: [TngInputGroup, TngInput, TngPrefix, TngSuffix, TngIcon],',
    "  templateUrl: './search-input.component.html',",
    "  styleUrl: './search-input.component.css',",
    '})',
    'export class SearchInputComponent {}',
    '',
  ].join('\n');

  protected readonly headlessWorkspaceTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup, TngSuffix } from "@tailng-ui/primitives";',
    '',
    '@Component({',
    '  imports: [TngInputGroup, TngInput, TngSuffix],',
    "  templateUrl: './workspace-slug-input.component.html',",
    "  styleUrl: './workspace-slug-input.component.css',",
    '})',
    'export class WorkspaceSlugInputComponent {}',
    '',
  ].join('\n');

  protected readonly headlessValidationTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup } from "@tailng-ui/primitives";',
    '',
    '@Component({',
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
    '         [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-200',
    '         dark:border-slate-600 dark:bg-slate-900/60 dark:[&[data-focused]]:border-blue-400 dark:[&[data-focused]]:ring-blue-400/30"',
    '>',
    '  <span tngPrefix aria-hidden="true" class="text-slate-500 dark:text-slate-300">',
    '    <tng-icon icon="search" class="h-4 w-4" />',
    '  </span>',
    '  <input',
    '    tngInput',
    '    type="search"',
    '    placeholder="Search components..."',
    '    class="w-full border-0 bg-transparent p-0 text-[0.98rem] outline-none"',
    '  />',
    '  <span tngSuffix class="text-xs font-semibold text-slate-500 dark:text-slate-300">Ctrl+K</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly workspaceHeadlessTailwindHtmlCode = [
    '<div',
    '  tngInputGroup',
    '  class="min-h-11 items-center gap-2 rounded-xl border border-blue-300 bg-blue-50/70 px-3 shadow-sm transition',
    '         [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-200',
    '         dark:border-blue-500/60 dark:bg-blue-950/30 dark:[&[data-focused]]:border-blue-300 dark:[&[data-focused]]:ring-blue-400/30"',
    '>',
    '  <input',
    '    tngInput',
    '    type="text"',
    '    placeholder="Workspace slug"',
    '    value="core-platform"',
    '    class="w-full border-0 bg-transparent p-0 text-[0.98rem] outline-none"',
    '  />',
    '  <span tngSuffix class="text-xs font-semibold text-blue-700 dark:text-blue-300">.tailng.dev</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly validationHeadlessTailwindHtmlCode = [
    '<div class="grid gap-2">',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-11 items-center gap-2 rounded-xl border border-red-400 bg-red-50/70 px-3 shadow-sm transition',
    '           [&[data-focused]]:border-red-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-red-200',
    '           dark:border-red-500/70 dark:bg-red-950/25 dark:[&[data-focused]]:border-red-300 dark:[&[data-focused]]:ring-red-400/30"',
    '  >',
    '    <input',
    '      tngInput',
    '      type="email"',
    '      value="team@tailng"',
    '      aria-invalid="true"',
    '      class="w-full border-0 bg-transparent p-0 text-[0.98rem] outline-none"',
    '    />',
    '  </div>',
    '  <p class="text-xs font-medium text-red-600 dark:text-red-300">',
    '    Enter a valid email address in user@domain format.',
    '  </p>',
    '</div>',
    '',
  ].join('\n');

  protected readonly statesHeadlessTailwindHtmlCode = [
    '<div class="grid gap-3">',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-11 items-center rounded-xl border border-slate-300 bg-slate-100/80 px-3 shadow-sm dark:border-slate-600 dark:bg-slate-800/70"',
    '  >',
    '    <input',
    '      tngInput',
    '      type="text"',
    '      value="Readonly API key"',
    '      readonly',
    '      class="w-full border-0 bg-transparent p-0 text-[0.98rem] outline-none"',
    '    />',
    '  </div>',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-11 items-center rounded-xl border border-slate-300 bg-slate-100/80 px-3 opacity-60 dark:border-slate-600 dark:bg-slate-800/70"',
    '  >',
    '    <input',
    '      tngInput',
    '      type="text"',
    '      value="Disabled while syncing"',
    '      disabled',
    '      class="w-full border-0 bg-transparent p-0 text-[0.98rem] outline-none"',
    '    />',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected override readonly searchPlainCodeTabs = createCodeTabs(
    'search-input-plain-css',
    this.headlessSearchTsCode,
    this.searchHeadlessHtmlCode,
    this.searchHeadlessCssCode,
  );

  protected override readonly searchTailwindCodeTabs = createCodeTabs(
    'search-input-tailwind',
    this.headlessSearchTsCode,
    this.searchHeadlessTailwindHtmlCode,
    this.searchTailwindCssCode,
  );

  protected override readonly workspacePlainCodeTabs = createCodeTabs(
    'workspace-input-plain-css',
    this.headlessWorkspaceTsCode,
    this.workspaceHeadlessHtmlCode,
    this.workspaceHeadlessCssCode,
  );

  protected override readonly workspaceTailwindCodeTabs = createCodeTabs(
    'workspace-input-tailwind',
    this.headlessWorkspaceTsCode,
    this.workspaceHeadlessTailwindHtmlCode,
    this.workspaceTailwindCssCode,
  );

  protected override readonly validationPlainCodeTabs = createCodeTabs(
    'validation-input-plain-css',
    this.headlessValidationTsCode,
    this.validationHeadlessHtmlCode,
    this.validationHeadlessCssCode,
  );

  protected override readonly validationTailwindCodeTabs = createCodeTabs(
    'validation-input-tailwind',
    this.headlessValidationTsCode,
    this.validationHeadlessTailwindHtmlCode,
    this.validationTailwindCssCode,
  );

  protected override readonly statesPlainCodeTabs = createCodeTabs(
    'stateful-inputs-plain-css',
    this.headlessStatesTsCode,
    this.statesHeadlessHtmlCode,
    this.statesHeadlessCssCode,
  );

  protected override readonly statesTailwindCodeTabs = createCodeTabs(
    'stateful-inputs-tailwind',
    this.headlessStatesTsCode,
    this.statesHeadlessTailwindHtmlCode,
    this.statesTailwindCssCode,
  );
}
