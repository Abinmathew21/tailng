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
    '  display: block;',
    '  width: 100%;',
    '  --tng-input-bg: #ffffff;',
    '  --tng-input-border: #cbd5e1;',
    '  --tng-input-focus-ring: rgba(59, 130, 246, 0.22);',
    '  --tng-input-radius: 0.78rem;',
    '  --tng-input-min-height: 2.65rem;',
    '  --tng-input-px: 0.88rem;',
    '  --tng-input-fg: #0f172a;',
    '  --tng-input-font-size: 0.98rem;',
    '  --tng-input-font-weight: 500;',
    '  --tng-input-line-height: 1.35;',
    '  --tng-input-placeholder: #94a3b8;',
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
    '  color: #dc2626;',
    '  font-size: 0.82rem;',
    '}',
    '',
  ].join('\n');

  protected readonly tailwindInputHostClass = [
    'block',
    'w-full',
    '[--tng-input-bg:#ffffff]',
    '[--tng-input-border:#cbd5e1]',
    '[--tng-input-focus-ring:rgba(59,130,246,0.22)]',
    '[--tng-input-radius:0.78rem]',
    '[--tng-input-min-height:2.65rem]',
    '[--tng-input-px:0.88rem]',
    '[--tng-input-fg:#0f172a]',
    '[--tng-input-font-size:0.98rem]',
    '[--tng-input-font-weight:500]',
    '[--tng-input-line-height:1.35]',
    '[--tng-input-placeholder:#94a3b8]',
  ].join(' ');

  protected readonly tailwindDangerInputHostClass = [
    'block',
    'w-full',
    '[--tng-input-bg:rgba(254,242,242,0.7)]',
    '[--tng-input-border:#f87171]',
    '[--tng-input-focus-ring:rgba(248,113,113,0.22)]',
    '[--tng-input-radius:0.78rem]',
    '[--tng-input-min-height:2.65rem]',
    '[--tng-input-px:0.88rem]',
    '[--tng-input-fg:#0f172a]',
    '[--tng-input-font-size:0.98rem]',
    '[--tng-input-font-weight:500]',
    '[--tng-input-line-height:1.35]',
    '[--tng-input-placeholder:#94a3b8]',
  ].join(' ');

  protected readonly tailwindMutedInputHostClass = [
    'block',
    'w-full',
    '[--tng-input-bg:rgba(241,245,249,0.8)]',
    '[--tng-input-border:#cbd5e1]',
    '[--tng-input-focus-ring:rgba(148,163,184,0.18)]',
    '[--tng-input-radius:0.78rem]',
    '[--tng-input-min-height:2.65rem]',
    '[--tng-input-px:0.88rem]',
    '[--tng-input-fg:#334155]',
    '[--tng-input-font-size:0.98rem]',
    '[--tng-input-font-weight:500]',
    '[--tng-input-line-height:1.35]',
    '[--tng-input-placeholder:#94a3b8]',
  ].join(' ');

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
      '  class="block w-full [--tng-input-bg:#ffffff] [--tng-input-border:#cbd5e1] [--tng-input-focus-ring:rgba(59,130,246,0.22)] [--tng-input-radius:0.78rem] [--tng-input-min-height:2.65rem] [--tng-input-px:0.88rem] [--tng-input-fg:#0f172a] [--tng-input-font-size:0.98rem] [--tng-input-font-weight:500] [--tng-input-line-height:1.35] [--tng-input-placeholder:#94a3b8]"',
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
      "  <tng-input class=\"block w-full [--tng-input-bg:#ffffff] [--tng-input-border:#cbd5e1] [--tng-input-focus-ring:rgba(59,130,246,0.22)] [--tng-input-radius:0.78rem] [--tng-input-min-height:2.65rem] [--tng-input-px:0.88rem] [--tng-input-fg:#0f172a] [--tng-input-font-size:0.98rem] [--tng-input-font-weight:500] [--tng-input-line-height:1.35] [--tng-input-placeholder:#94a3b8]\" type=\"email\" placeholder=\"team@tailng.dev\" ariaLabel=\"Email\"></tng-input>",
      "  <tng-input class=\"block w-full [--tng-input-bg:#ffffff] [--tng-input-border:#cbd5e1] [--tng-input-focus-ring:rgba(59,130,246,0.22)] [--tng-input-radius:0.78rem] [--tng-input-min-height:2.65rem] [--tng-input-px:0.88rem] [--tng-input-fg:#0f172a] [--tng-input-font-size:0.98rem] [--tng-input-font-weight:500] [--tng-input-line-height:1.35] [--tng-input-placeholder:#94a3b8]\" type=\"search\" placeholder=\"Search docs\" ariaLabel=\"Search\"></tng-input>",
      "  <tng-input class=\"block w-full [--tng-input-bg:#ffffff] [--tng-input-border:#cbd5e1] [--tng-input-focus-ring:rgba(59,130,246,0.22)] [--tng-input-radius:0.78rem] [--tng-input-min-height:2.65rem] [--tng-input-px:0.88rem] [--tng-input-fg:#0f172a] [--tng-input-font-size:0.98rem] [--tng-input-font-weight:500] [--tng-input-line-height:1.35] [--tng-input-placeholder:#94a3b8]\" type=\"number\" placeholder=\"42\" ariaLabel=\"Number\"></tng-input>",
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
      "  <tng-input class=\"block w-full [--tng-input-bg:rgba(254,242,242,0.7)] [--tng-input-border:#f87171] [--tng-input-focus-ring:rgba(248,113,113,0.22)] [--tng-input-radius:0.78rem] [--tng-input-min-height:2.65rem] [--tng-input-px:0.88rem] [--tng-input-fg:#0f172a] [--tng-input-font-size:0.98rem] [--tng-input-font-weight:500] [--tng-input-line-height:1.35] [--tng-input-placeholder:#94a3b8]\" tone=\"danger\" type=\"email\" value=\"team@tailng\" [ariaInvalid]=\"true\"></tng-input>",
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
      "  <tng-input class=\"block w-full [--tng-input-bg:rgba(241,245,249,0.8)] [--tng-input-border:#cbd5e1] [--tng-input-focus-ring:rgba(148,163,184,0.18)] [--tng-input-radius:0.78rem] [--tng-input-min-height:2.65rem] [--tng-input-px:0.88rem] [--tng-input-fg:#334155] [--tng-input-font-size:0.98rem] [--tng-input-font-weight:500] [--tng-input-line-height:1.35] [--tng-input-placeholder:#94a3b8]\" type=\"text\" value=\"Readonly API key\" readonly></tng-input>",
      "  <tng-input class=\"block w-full opacity-60 [--tng-input-bg:rgba(241,245,249,0.8)] [--tng-input-border:#cbd5e1] [--tng-input-focus-ring:rgba(148,163,184,0.18)] [--tng-input-radius:0.78rem] [--tng-input-min-height:2.65rem] [--tng-input-px:0.88rem] [--tng-input-fg:#334155] [--tng-input-font-size:0.98rem] [--tng-input-font-weight:500] [--tng-input-line-height:1.35] [--tng-input-placeholder:#94a3b8]\" type=\"text\" value=\"Disabled while syncing\" disabled></tng-input>",
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
