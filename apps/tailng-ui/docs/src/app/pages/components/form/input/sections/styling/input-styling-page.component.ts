import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../input.util';
import { TngCodeBlockComponent, TngInputComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-input-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInputComponent,
  ],
  templateUrl: './input-styling-page.component.html',
  styleUrl: './input-styling-page.component.css',
})
export class InputStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly slotSelectorsCode = [
    'tng-input',
    '[data-slot="input-component"]',
    'tng-form-field',
    '[data-slot="form-field-wrapper"]',
    '[data-appearance]',
    '[data-size]',
    '[data-tone]',
    '[data-full-width]',
    '',
  ].join('\n');

  protected readonly themeTokensCode = [
    '--tng-input-gap',
    '--tng-input-bg',
    '--tng-input-border',
    '--tng-input-radius',
    '--tng-input-fg',
    '--tng-input-min-height',
    '--tng-input-px',
    '--tng-input-py',
    '--tng-input-focus-ring',
    '--tng-input-font-size',
    '--tng-input-font-weight',
    '--tng-input-line-height',
    '--tng-input-placeholder',
    '',
  ].join('\n');

  protected readonly stateHooksCode = [
    '.doc-cmp-input-style-doc-statehooks-host {',
    '  --tng-input-border: #cbd5e1;',
    '  --tng-input-focus-ring: rgba(59, 130, 246, 0.2);',
    '}',
    '',
    '.doc-cmp-input-style-doc-statehooks-shell [data-slot="input-group"][data-invalid] {',
    '  border-color: #ef4444;',
    '}',
    '',
    '.doc-cmp-input-style-doc-statehooks-shell [data-slot="input-group"][data-disabled] {',
    '  opacity: 0.58;',
    '  cursor: not-allowed;',
    '}',
    '',
  ].join('\n');

  private readonly plainCssScenarioHtmlCode = [
    '<label class="doc-cmp-input-style-scenario-plain-field">',
    '  <span class="doc-cmp-input-style-scenario-plain-caption">Display name</span>',
    '  <tng-input',
    '    type="text"',
    '    value="Ada Lovelace"',
    '    ariaLabel="Display name"',
    '  ></tng-input>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainCssScenarioCssCode = [
    '.doc-cmp-input-style-scenario-plain-field {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '  max-width: 31rem;',
    '}',
    '',
    '.doc-cmp-input-style-scenario-plain-caption {',
    '  color: #64748b;',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '  line-height: 1.2;',
    '}',
    '',
  ].join('\n');

  private readonly plainCssScenarioTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-style-scenario-plain',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './doc-cmp-input-style-scenario-plain.component.html',",
    "  styleUrl: './doc-cmp-input-style-scenario-plain.component.css',",
    '})',
    'export class DocCmpInputStyleScenarioPlainComponent {}',
    '',
  ].join('\n');

  private readonly tailwindScenarioHtmlCode = [
    '<label class="doc-cmp-input-style-scenario-tw-field grid w-full max-w-[31rem] gap-2 rounded-xl border border-slate-300 bg-white/80 p-3">',
    '  <span class="doc-cmp-input-style-scenario-tw-caption text-xs font-semibold uppercase tracking-[0.01em] text-slate-500">Display name</span>',
    '  <tng-input',
    '    type="text"',
    '    value="Ada Lovelace"',
    '    ariaLabel="Display name"',
    '  ></tng-input>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindScenarioCssCode =
    '/* tng-input needs no CSS; optional utilities stay on the label wrapper only. */';

  private readonly tailwindScenarioTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-style-scenario-tw',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './doc-cmp-input-style-scenario-tw.component.html',",
    '})',
    'export class DocCmpInputStyleScenarioTwComponent {}',
    '',
  ].join('\n');

  protected readonly plainCssScenarioCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'doc-cmp-input-style-scenario-plain.component.ts',
      code: this.plainCssScenarioTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'doc-cmp-input-style-scenario-plain.component.html',
      code: this.plainCssScenarioHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'doc-cmp-input-style-scenario-plain.component.css',
      code: this.plainCssScenarioCssCode,
    },
  ]);

  protected readonly tailwindScenarioCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'doc-cmp-input-style-scenario-tw.component.ts',
      code: this.tailwindScenarioTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'doc-cmp-input-style-scenario-tw.component.html',
      code: this.tailwindScenarioHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'doc-cmp-input-style-scenario-tw.component.css',
      code: this.tailwindScenarioCssCode,
    },
  ]);

  protected readonly stylePatternExamples = [
    {
      title: 'Theme token override',
      description:
        'Prefer overriding the public input tokens on the host instead of reaching into internal DOM for routine visual changes.',
      language: 'css',
      code: [
        '.doc-cmp-input-style-pattern-theme-host {',
        '  --tng-input-bg: #ffffff;',
        '  --tng-input-border: #cbd5e1;',
        '  --tng-input-radius: 0.75rem;',
        '  --tng-input-min-height: 2.5rem;',
        '  --tng-input-px: 0.8rem;',
        '  --tng-input-focus-ring: rgba(59, 130, 246, 0.2);',
        '  --tng-input-font-size: 0.98rem;',
        '  --tng-input-font-weight: 500;',
        '  --tng-input-line-height: 1.35;',
        '  --tng-input-placeholder: #94a3b8;',
        '}',
        '',
      ].join('\n'),
    },
    {
      title: 'Density control',
      description:
        'Tune field density through the token surface instead of replacing the shell layout.',
      language: 'css',
      code: [
        '.doc-cmp-input-style-pattern-density-host {',
        '  --tng-input-min-height: 2.2rem;',
        '  --tng-input-px: 0.68rem;',
        '  --tng-input-gap: 0.45rem;',
        '  --tng-input-radius: 0.65rem;',
        '}',
        '',
      ].join('\n'),
    },
    {
      title: 'State-aware shell',
      description:
        'Use the emitted state attrs when the visual treatment must react to focus, invalid, or disabled state.',
      language: 'css',
      code: this.stateHooksCode,
    },
  ] as const;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

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

}
