import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngInputComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
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
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngInputComponent],
  templateUrl: './input-examples-page.component.html',
  styleUrl: './input-examples-page.component.css',
})
export class InputExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  private readonly baseTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-input-example',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './input-example.component.html',",
    "  styleUrl: './input-example.component.css',",
    '})',
    'export class InputExampleComponent {}',
    '',
  ].join('\n');

  private readonly plainCssCode = [
    '.input-example-control {',
    '  --tng-input-bg: var(--tng-semantic-background-base);',
    '  --tng-input-border: color-mix(in srgb, var(--tng-semantic-border-strong) 78%, transparent);',
    '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-accent-brand) 22%, transparent);',
    '  --tng-input-radius: 0.78rem;',
    '  --tng-input-min-height: 2.65rem;',
    '  --tng-input-px: 0.88rem;',
    '  --tng-input-fg: var(--tng-semantic-foreground-primary);',
    '}',
    '',
    '.input-example-variant-grid {',
    '  display: grid;',
    '  gap: 0.75rem;',
    '  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));',
    '}',
    '',
    '.input-example-stacked,',
    '.input-example-validation-stack {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '}',
    '',
    '.input-example-helper--danger {',
    '  color: var(--tng-semantic-accent-danger);',
    '  font-size: 0.82rem;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly basicPlainCodeTabs = createCodeTabs(
    'basic-text-field-plain',
    this.baseTsCode,
    [
      '<tng-input',
      '  class="input-example-control input-example-control--basic"',
      '  type="text"',
      '  placeholder="Project name"',
      '  ariaLabel="Project name"',
      '></tng-input>',
      '',
    ].join('\n'),
    this.plainCssCode,
  );

  protected readonly basicTailwindCodeTabs = createCodeTabs(
    'basic-text-field-tailwind',
    this.baseTsCode,
    [
      '<tng-input',
      '  class="block',
      "         [&_[data-slot='input-group']]:min-h-11",
      "         [&_[data-slot='input-group']]:rounded-xl",
      "         [&_[data-slot='input-group']]:border",
      "         [&_[data-slot='input-group']]:border-slate-300",
      "         [&_[data-slot='input-group']]:bg-white",
      "         [&_[data-slot='input-group']]:px-3",
      "         [&_[data-slot='input-group']]:shadow-sm",
      "         [&_[data-slot='input-group'][data-focused]]:border-blue-500",
      "         [&_[data-slot='input-group'][data-focused]]:ring-2",
      "         [&_[data-slot='input-group'][data-focused]]:ring-blue-200/70",
      "         [&_[data-slot='input']]:min-w-0",
      "         [&_[data-slot='input']]:w-full",
      "         [&_[data-slot='input']]:appearance-none",
      "         [&_[data-slot='input']]:border-0",
      "         [&_[data-slot='input']]:bg-transparent",
      "         [&_[data-slot='input']]:p-0",
      "         [&_[data-slot='input']]:text-[0.98rem]",
      "         [&_[data-slot='input']]:text-slate-900",
      "         [&_[data-slot='input']]:placeholder:text-slate-400",
      "         [&_[data-slot='input']]:outline-none\"",
      '  type="text"',
      '  placeholder="Project name"',
      '  ariaLabel="Project name"',
      '></tng-input>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  protected readonly typePlainCodeTabs = createCodeTabs(
    'type-variants-plain',
    this.baseTsCode,
    [
      '<div class="input-example-variant-grid">',
      '  <tng-input class="input-example-control" type="email" placeholder="team@tailng.dev" ariaLabel="Email"></tng-input>',
      '  <tng-input class="input-example-control" type="search" placeholder="Search docs" ariaLabel="Search"></tng-input>',
      '  <tng-input class="input-example-control" type="number" placeholder="42" ariaLabel="Number"></tng-input>',
      '</div>',
      '',
    ].join('\n'),
    this.plainCssCode,
  );

  protected readonly typeTailwindCodeTabs = createCodeTabs(
    'type-variants-tailwind',
    this.baseTsCode,
    [
      '<div class="grid gap-3">',
      "  <tng-input class=\"block [&_[data-slot='input-group']]:min-h-11 [&_[data-slot='input-group']]:rounded-xl [&_[data-slot='input-group']]:border [&_[data-slot='input-group']]:border-slate-300 [&_[data-slot='input-group']]:bg-white [&_[data-slot='input-group']]:px-3 [&_[data-slot='input-group']]:shadow-sm [&_[data-slot='input-group'][data-focused]]:border-blue-500 [&_[data-slot='input-group'][data-focused]]:ring-2 [&_[data-slot='input-group'][data-focused]]:ring-blue-200/70 [&_[data-slot='input']]:min-w-0 [&_[data-slot='input']]:w-full [&_[data-slot='input']]:appearance-none [&_[data-slot='input']]:border-0 [&_[data-slot='input']]:bg-transparent [&_[data-slot='input']]:p-0 [&_[data-slot='input']]:text-[0.98rem] [&_[data-slot='input']]:text-slate-900 [&_[data-slot='input']]:placeholder:text-slate-400 [&_[data-slot='input']]:outline-none\" type=\"email\" placeholder=\"team@tailng.dev\" ariaLabel=\"Email\"></tng-input>",
      "  <tng-input class=\"block [&_[data-slot='input-group']]:min-h-11 [&_[data-slot='input-group']]:rounded-xl [&_[data-slot='input-group']]:border [&_[data-slot='input-group']]:border-slate-300 [&_[data-slot='input-group']]:bg-white [&_[data-slot='input-group']]:px-3 [&_[data-slot='input-group']]:shadow-sm [&_[data-slot='input-group'][data-focused]]:border-blue-500 [&_[data-slot='input-group'][data-focused]]:ring-2 [&_[data-slot='input-group'][data-focused]]:ring-blue-200/70 [&_[data-slot='input']]:min-w-0 [&_[data-slot='input']]:w-full [&_[data-slot='input']]:appearance-none [&_[data-slot='input']]:border-0 [&_[data-slot='input']]:bg-transparent [&_[data-slot='input']]:p-0 [&_[data-slot='input']]:text-[0.98rem] [&_[data-slot='input']]:text-slate-900 [&_[data-slot='input']]:placeholder:text-slate-400 [&_[data-slot='input']]:outline-none\" type=\"search\" placeholder=\"Search docs\" ariaLabel=\"Search\"></tng-input>",
      "  <tng-input class=\"block [&_[data-slot='input-group']]:min-h-11 [&_[data-slot='input-group']]:rounded-xl [&_[data-slot='input-group']]:border [&_[data-slot='input-group']]:border-slate-300 [&_[data-slot='input-group']]:bg-white [&_[data-slot='input-group']]:px-3 [&_[data-slot='input-group']]:shadow-sm [&_[data-slot='input-group'][data-focused]]:border-blue-500 [&_[data-slot='input-group'][data-focused]]:ring-2 [&_[data-slot='input-group'][data-focused]]:ring-blue-200/70 [&_[data-slot='input']]:min-w-0 [&_[data-slot='input']]:w-full [&_[data-slot='input']]:appearance-none [&_[data-slot='input']]:border-0 [&_[data-slot='input']]:bg-transparent [&_[data-slot='input']]:p-0 [&_[data-slot='input']]:text-[0.98rem] [&_[data-slot='input']]:text-slate-900 [&_[data-slot='input']]:placeholder:text-slate-400 [&_[data-slot='input']]:outline-none\" type=\"number\" placeholder=\"42\" ariaLabel=\"Number\"></tng-input>",
      '</div>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  protected readonly validationPlainCodeTabs = createCodeTabs(
    'validation-feedback-plain',
    this.baseTsCode,
    [
      '<div class="input-example-validation-stack">',
      '  <tng-input class="input-example-control" tone="danger" type="email" value="team@tailng" [ariaInvalid]="true"></tng-input>',
      '  <p class="input-example-helper input-example-helper--danger">',
      '    Enter a valid email address in user@domain format.',
      '  </p>',
      '</div>',
      '',
    ].join('\n'),
    this.plainCssCode,
  );

  protected readonly validationTailwindCodeTabs = createCodeTabs(
    'validation-feedback-tailwind',
    this.baseTsCode,
    [
      '<div class="grid gap-2">',
      "  <tng-input class=\"block [&_[data-slot='input-group']]:min-h-11 [&_[data-slot='input-group']]:rounded-xl [&_[data-slot='input-group']]:border [&_[data-slot='input-group']]:border-red-400 [&_[data-slot='input-group']]:bg-red-50/70 [&_[data-slot='input-group']]:px-3 [&_[data-slot='input-group']]:shadow-sm [&_[data-slot='input-group'][data-focused]]:border-red-500 [&_[data-slot='input-group'][data-focused]]:ring-2 [&_[data-slot='input-group'][data-focused]]:ring-red-200 [&_[data-slot='input']]:min-w-0 [&_[data-slot='input']]:w-full [&_[data-slot='input']]:appearance-none [&_[data-slot='input']]:border-0 [&_[data-slot='input']]:bg-transparent [&_[data-slot='input']]:p-0 [&_[data-slot='input']]:text-[0.98rem] [&_[data-slot='input']]:text-slate-900 [&_[data-slot='input']]:placeholder:text-slate-400 [&_[data-slot='input']]:outline-none\" tone=\"danger\" type=\"email\" value=\"team@tailng\" [ariaInvalid]=\"true\"></tng-input>",
      '  <p class="text-xs font-medium text-red-600">Enter a valid email address in user@domain format.</p>',
      '</div>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  protected readonly statesPlainCodeTabs = createCodeTabs(
    'readonly-disabled-states-plain',
    this.baseTsCode,
    [
      '<div class="input-example-stacked">',
      '  <tng-input class="input-example-control" type="text" value="Readonly API key" readonly></tng-input>',
      '  <tng-input class="input-example-control" type="text" value="Disabled while syncing" disabled></tng-input>',
      '</div>',
      '',
    ].join('\n'),
    this.plainCssCode,
  );

  protected readonly statesTailwindCodeTabs = createCodeTabs(
    'readonly-disabled-states-tailwind',
    this.baseTsCode,
    [
      '<div class="grid gap-3">',
      "  <tng-input class=\"block [&_[data-slot='input-group']]:min-h-11 [&_[data-slot='input-group']]:rounded-xl [&_[data-slot='input-group']]:border [&_[data-slot='input-group']]:border-slate-300 [&_[data-slot='input-group']]:bg-slate-100/80 [&_[data-slot='input-group']]:px-3 [&_[data-slot='input-group']]:shadow-sm [&_[data-slot='input']]:min-w-0 [&_[data-slot='input']]:w-full [&_[data-slot='input']]:appearance-none [&_[data-slot='input']]:border-0 [&_[data-slot='input']]:bg-transparent [&_[data-slot='input']]:p-0 [&_[data-slot='input']]:text-[0.98rem] [&_[data-slot='input']]:text-slate-700 [&_[data-slot='input']]:outline-none\" type=\"text\" value=\"Readonly API key\" readonly></tng-input>",
      "  <tng-input class=\"block [&_[data-slot='input-group']]:min-h-11 [&_[data-slot='input-group']]:rounded-xl [&_[data-slot='input-group']]:border [&_[data-slot='input-group']]:border-slate-300 [&_[data-slot='input-group']]:bg-slate-100/80 [&_[data-slot='input-group']]:px-3 [&_[data-slot='input-group']]:opacity-60 [&_[data-slot='input']]:min-w-0 [&_[data-slot='input']]:w-full [&_[data-slot='input']]:appearance-none [&_[data-slot='input']]:border-0 [&_[data-slot='input']]:bg-transparent [&_[data-slot='input']]:p-0 [&_[data-slot='input']]:text-[0.98rem] [&_[data-slot='input']]:text-slate-700 [&_[data-slot='input']]:outline-none\" type=\"text\" value=\"Disabled while syncing\" disabled></tng-input>",
      '</div>',
      '',
    ].join('\n'),
    this.tailwindCssCode,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected focusProjectedInput(event: MouseEvent): void {
    const hostElement = event.currentTarget;
    if (!(hostElement instanceof HTMLElement)) {
      return;
    }

    const inputElement = hostElement.querySelector('[data-slot="input"]');
    if (!(inputElement instanceof HTMLInputElement) || inputElement.disabled) {
      return;
    }

    inputElement.focus({ preventScroll: true });
  }

}
