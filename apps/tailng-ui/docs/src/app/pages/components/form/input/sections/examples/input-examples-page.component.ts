import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngInputComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngInputGroup, TngInputLeading, TngInputTrailing } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

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
  selector: 'app-input-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInputComponent,
    TngInputGroup,
    TngInput,
    TngInputLeading,
    TngInputTrailing,
    TngIcon,
  ],
  templateUrl: './input-examples-page.component.html',
  styleUrl: './input-examples-page.component.css',
})
export class InputExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly searchTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup, TngInputLeading, TngInputTrailing } from "@tailng-ui/primitives";',
    'import { TngInputComponent } from "@tailng-ui/components";',
    'import { TngIcon } from "@tailng-ui/icons";',
    '',
    '@Component({',
    '  standalone: true,',
    '  imports: [TngInputComponent, TngInputGroup, TngInput, TngInputLeading, TngInputTrailing, TngIcon],',
    "  templateUrl: './search-input.component.html',",
    "  styleUrl: './search-input.component.css',",
    '})',
    'export class SearchInputComponent {}',
    '',
  ].join('\n');

  protected readonly searchHeadlessHtmlCode = [
    '<div tngInputGroup class="input-example-headless-shell">',
    '  <span tngInputLeading aria-hidden="true">',
    '    <tng-icon icon="search" class="input-example-icon" />',
    '  </span>',
    '  <input tngInput type="search" placeholder="Search components..." />',
    '  <span tngInputTrailing class="input-example-meta">Ctrl+K</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly searchPlainHtmlCode = [
    '<tng-input class="input-example-control input-example-control--search">',
    '  <span tngInputLeading aria-hidden="true">',
    '    <tng-icon icon="search" class="input-example-icon" />',
    '  </span>',
    '  <input tngInput type="search" placeholder="Search components..." />',
    '  <span tngInputTrailing class="input-example-meta">Ctrl+K</span>',
    '</tng-input>',
    '',
  ].join('\n');

  protected readonly searchTailwindHtmlCode = [
    '<div',
    '  tngInputGroup',
    '  class="min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 shadow-sm transition',
    '         [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-200',
    '         dark:border-slate-600 dark:bg-slate-900/60 dark:[&[data-focused]]:border-blue-400 dark:[&[data-focused]]:ring-blue-400/30"',
    '>',
    '  <span tngInputLeading aria-hidden="true" class="text-slate-500 dark:text-slate-300">',
    '    <tng-icon icon="search" class="h-4 w-4" />',
    '  </span>',
    '  <input',
    '    tngInput',
    '    type="search"',
    '    placeholder="Search components..."',
    '    class="w-full border-0 bg-transparent p-0 text-[0.98rem] outline-none"',
    '  />',
    '  <span tngInputTrailing class="text-xs font-semibold text-slate-500 dark:text-slate-300">Ctrl+K</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly searchHeadlessCssCode = [
    '.input-example-headless-shell {',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.78rem;',
    '  min-height: 2.65rem;',
    '  padding-inline: 0.88rem;',
    '}',
    '',
    '.input-example-icon {',
    '  height: 1.1rem;',
    '  width: 1.1rem;',
    '}',
    '',
  ].join('\n');

  protected readonly searchPlainCssCode = [
    '.input-example-control--search [data-slot="input-group"] {',
    '  border-radius: 0.78rem;',
    '  min-height: 2.65rem;',
    '}',
    '',
    '.input-example-icon {',
    '  height: 1.1rem;',
    '  width: 1.1rem;',
    '}',
    '',
    '.input-example-meta {',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '}',
    '',
  ].join('\n');

  protected readonly searchTailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly workspaceTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup, TngInputTrailing } from "@tailng-ui/primitives";',
    'import { TngInputComponent } from "@tailng-ui/components";',
    '',
    '@Component({',
    '  standalone: true,',
    '  imports: [TngInputComponent, TngInputGroup, TngInput, TngInputTrailing],',
    "  templateUrl: './workspace-slug-input.component.html',",
    "  styleUrl: './workspace-slug-input.component.css',",
    '})',
    'export class WorkspaceSlugInputComponent {}',
    '',
  ].join('\n');

  protected readonly workspaceHeadlessHtmlCode = [
    '<div tngInputGroup class="input-example-headless-shell">',
    '  <input tngInput type="text" placeholder="Workspace slug" value="core-platform" />',
    '  <span tngInputTrailing class="input-example-meta">.tailng.dev</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly workspacePlainHtmlCode = [
    '<tng-input tone="primary" class="input-example-control input-example-control--workspace">',
    '  <input tngInput type="text" placeholder="Workspace slug" value="core-platform" />',
    '  <span tngInputTrailing class="input-example-meta">.tailng.dev</span>',
    '</tng-input>',
    '',
  ].join('\n');

  protected readonly workspaceTailwindHtmlCode = [
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
    '  <span tngInputTrailing class="text-xs font-semibold text-blue-700 dark:text-blue-300">.tailng.dev</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly workspaceHeadlessCssCode = [
    '.input-example-headless-shell {',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.78rem;',
    '  min-height: 2.65rem;',
    '  padding-inline: 0.88rem;',
    '}',
    '',
  ].join('\n');

  protected readonly workspacePlainCssCode = [
    '.input-example-control--workspace [data-slot="input-group"] {',
    '  border-radius: 0.78rem;',
    '  min-height: 2.65rem;',
    '}',
    '',
    '.input-example-meta {',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '}',
    '',
  ].join('\n');

  protected readonly workspaceTailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly validationTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup } from "@tailng-ui/primitives";',
    'import { TngInputComponent } from "@tailng-ui/components";',
    '',
    '@Component({',
    '  standalone: true,',
    '  imports: [TngInputComponent, TngInputGroup, TngInput],',
    "  templateUrl: './validation-input.component.html',",
    "  styleUrl: './validation-input.component.css',",
    '})',
    'export class ValidationInputComponent {}',
    '',
  ].join('\n');

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

  protected readonly validationPlainHtmlCode = [
    '<div class="input-example-validation-stack">',
    '  <tng-input tone="danger" class="input-example-control input-example-control--validation">',
    '    <input tngInput type="email" value="team@tailng" aria-invalid="true" />',
    '  </tng-input>',
    '  <p class="input-example-helper input-example-helper--danger">',
    '    Enter a valid email address in user@domain format.',
    '  </p>',
    '</div>',
    '',
  ].join('\n');

  protected readonly validationTailwindHtmlCode = [
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

  protected readonly validationHeadlessCssCode = [
    '.input-example-validation-stack {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '}',
    '',
    '.input-example-headless-shell {',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.78rem;',
    '  min-height: 2.65rem;',
    '  padding-inline: 0.88rem;',
    '}',
    '',
    '.input-example-helper--danger {',
    '  color: var(--tng-semantic-accent-danger);',
    '}',
    '',
  ].join('\n');

  protected readonly validationPlainCssCode = [
    '.input-example-control--validation [data-slot="input-group"] {',
    '  border-radius: 0.78rem;',
    '}',
    '',
    '.input-example-helper--danger {',
    '  color: var(--tng-semantic-accent-danger);',
    '  font-size: 0.82rem;',
    '}',
    '',
  ].join('\n');

  protected readonly validationTailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly statesTsCode = [
    'import { Component } from "@angular/core";',
    'import { TngInput, TngInputGroup } from "@tailng-ui/primitives";',
    'import { TngInputComponent } from "@tailng-ui/components";',
    '',
    '@Component({',
    '  standalone: true,',
    '  imports: [TngInputComponent, TngInputGroup, TngInput],',
    "  templateUrl: './stateful-inputs.component.html',",
    "  styleUrl: './stateful-inputs.component.css',",
    '})',
    'export class StatefulInputsComponent {}',
    '',
  ].join('\n');

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

  protected readonly statesPlainHtmlCode = [
    '<div class="input-example-stacked">',
    '  <tng-input class="input-example-control input-example-control--state">',
    '    <input tngInput type="text" value="Readonly API key" readonly />',
    '  </tng-input>',
    '  <tng-input class="input-example-control input-example-control--state">',
    '    <input tngInput type="text" value="Disabled while syncing" disabled />',
    '  </tng-input>',
    '</div>',
    '',
  ].join('\n');

  protected readonly statesTailwindHtmlCode = [
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

  protected readonly statesHeadlessCssCode = [
    '.input-example-stacked {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '}',
    '',
    '.input-example-headless-shell {',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.78rem;',
    '  min-height: 2.65rem;',
    '  padding-inline: 0.88rem;',
    '}',
    '',
  ].join('\n');

  protected readonly statesPlainCssCode = [
    '.input-example-stacked {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '}',
    '',
    '.input-example-control--state [data-slot="input-group"] {',
    '  border-radius: 0.78rem;',
    '  min-height: 2.65rem;',
    '}',
    '',
  ].join('\n');

  protected readonly statesTailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly searchHeadlessCodeTabs = createCodeTabs(
    'search-input-headless',
    this.searchTsCode,
    this.searchHeadlessHtmlCode,
    this.searchHeadlessCssCode,
  );
  protected readonly searchPlainCodeTabs = createCodeTabs(
    'search-input-plain-css',
    this.searchTsCode,
    this.searchPlainHtmlCode,
    this.searchPlainCssCode,
  );
  protected readonly searchTailwindCodeTabs = createCodeTabs(
    'search-input-tailwind',
    this.searchTsCode,
    this.searchTailwindHtmlCode,
    this.searchTailwindCssCode,
  );

  protected readonly workspaceHeadlessCodeTabs = createCodeTabs(
    'workspace-input-headless',
    this.workspaceTsCode,
    this.workspaceHeadlessHtmlCode,
    this.workspaceHeadlessCssCode,
  );
  protected readonly workspacePlainCodeTabs = createCodeTabs(
    'workspace-input-plain-css',
    this.workspaceTsCode,
    this.workspacePlainHtmlCode,
    this.workspacePlainCssCode,
  );
  protected readonly workspaceTailwindCodeTabs = createCodeTabs(
    'workspace-input-tailwind',
    this.workspaceTsCode,
    this.workspaceTailwindHtmlCode,
    this.workspaceTailwindCssCode,
  );

  protected readonly validationHeadlessCodeTabs = createCodeTabs(
    'validation-input-headless',
    this.validationTsCode,
    this.validationHeadlessHtmlCode,
    this.validationHeadlessCssCode,
  );
  protected readonly validationPlainCodeTabs = createCodeTabs(
    'validation-input-plain-css',
    this.validationTsCode,
    this.validationPlainHtmlCode,
    this.validationPlainCssCode,
  );
  protected readonly validationTailwindCodeTabs = createCodeTabs(
    'validation-input-tailwind',
    this.validationTsCode,
    this.validationTailwindHtmlCode,
    this.validationTailwindCssCode,
  );

  protected readonly statesHeadlessCodeTabs = createCodeTabs(
    'stateful-inputs-headless',
    this.statesTsCode,
    this.statesHeadlessHtmlCode,
    this.statesHeadlessCssCode,
  );
  protected readonly statesPlainCodeTabs = createCodeTabs(
    'stateful-inputs-plain-css',
    this.statesTsCode,
    this.statesPlainHtmlCode,
    this.statesPlainCssCode,
  );
  protected readonly statesTailwindCodeTabs = createCodeTabs(
    'stateful-inputs-tailwind',
    this.statesTsCode,
    this.statesTailwindHtmlCode,
    this.statesTailwindCssCode,
  );

  protected focusProjectedInput(event: MouseEvent): void {
    const hostElement = event.currentTarget;
    if (!(hostElement instanceof HTMLElement)) {
      return;
    }

    const inputElement = hostElement.querySelector('[data-slot="input"]');
    if (
      !(inputElement instanceof HTMLInputElement || inputElement instanceof HTMLTextAreaElement) ||
      inputElement.disabled
    ) {
      return;
    }

    inputElement.focus({ preventScroll: true });
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const view = this.documentRef.defaultView;
    const mutationObserverCtor = view?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
