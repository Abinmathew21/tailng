import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngNumberRangeComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../number-range.util';

@Component({
  selector: 'app-number-range-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngNumberRangeComponent,
  ],
  templateUrl: './number-range-styling-page.component.html',
  styleUrl: './number-range-styling-page.component.css',
})
export class NumberRangeStylingPageComponent implements OnDestroy {
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

  protected readonly slotSelectorsCode = [
    'tng-number-range',
    '.tng-number-range',
    '.tng-number-range__input',
    '.tng-number-range__input--min',
    '.tng-number-range__input--max',
    '.tng-number-range__separator',
    '',
  ].join('\n');

  protected readonly themeTokensCode = [
    '--tng-number-range-bg',
    '--tng-number-range-border',
    '--tng-number-range-fg',
    '--tng-number-range-placeholder',
    '--tng-number-range-radius',
    '--tng-number-range-min-height',
    '--tng-number-range-px',
    '--tng-number-range-gap',
    '--tng-number-range-focus-ring',
    '--tng-number-range-invalid-border',
    '--tng-number-range-separator-color',
    '',
  ].join('\n');

  protected readonly stateHooksCode = [
    '.my-range-host {',
    '  --tng-number-range-border: #cbd5e1;',
    '  --tng-number-range-focus-ring: rgba(59, 130, 246, 0.2);',
    '}',
    '',
    '.my-range-host .tng-number-range[data-invalid] {',
    '  border-color: #ef4444;',
    '}',
    '',
    '.my-range-host .tng-number-range[data-disabled] {',
    '  opacity: 0.58;',
    '  cursor: not-allowed;',
    '}',
    '',
  ].join('\n');

  private readonly plainCssScenarioHtmlCode = [
    '<label class="doc-cmp-nr-style-scenario-plain-field">',
    '  <span class="doc-cmp-nr-style-scenario-plain-caption">Price range</span>',
    '  <tng-number-range',
    '    [min]="0"',
    '    [max]="1000"',
    '    minPlaceholder="Min"',
    '    maxPlaceholder="Max"',
    '    ariaLabel="Price range"',
    '  ></tng-number-range>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainCssScenarioCssCode = [
    '.doc-cmp-nr-style-scenario-plain-field {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '  max-width: 28rem;',
    '}',
    '',
    '.doc-cmp-nr-style-scenario-plain-caption {',
    '  color: #64748b;',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '  line-height: 1.2;',
    '}',
    '',
  ].join('\n');

  private readonly plainCssScenarioTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-nr-style-scenario-plain',",
    '  standalone: true,',
    '  imports: [TngNumberRangeComponent],',
    "  templateUrl: './doc-cmp-nr-style-scenario-plain.component.html',",
    "  styleUrl: './doc-cmp-nr-style-scenario-plain.component.css',",
    '})',
    'export class DocCmpNrStyleScenarioPlainComponent {}',
    '',
  ].join('\n');

  private readonly tailwindScenarioHtmlCode = [
    '<label class="grid w-full max-w-[28rem] gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-3">',
    '  <span class="text-xs font-semibold uppercase tracking-[0.01em] text-[var(--tng-semantic-foreground-secondary)]">Price range</span>',
    '  <tng-number-range',
    '    [min]="0"',
    '    [max]="1000"',
    '    minPlaceholder="Min"',
    '    maxPlaceholder="Max"',
    '    ariaLabel="Price range"',
    '  ></tng-number-range>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindScenarioCssCode =
    '/* tng-number-range needs no CSS; optional utilities stay on the label wrapper only. */';

  private readonly tailwindScenarioTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-nr-style-scenario-tw',",
    '  standalone: true,',
    '  imports: [TngNumberRangeComponent],',
    "  templateUrl: './doc-cmp-nr-style-scenario-tw.component.html',",
    '})',
    'export class DocCmpNrStyleScenarioTwComponent {}',
    '',
  ].join('\n');

  protected readonly plainCssScenarioCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'doc-cmp-nr-style-scenario-plain.component.ts',
      code: this.plainCssScenarioTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'doc-cmp-nr-style-scenario-plain.component.html',
      code: this.plainCssScenarioHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'doc-cmp-nr-style-scenario-plain.component.css',
      code: this.plainCssScenarioCssCode,
    },
  ]);

  protected readonly tailwindScenarioCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'doc-cmp-nr-style-scenario-tw.component.ts',
      code: this.tailwindScenarioTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'doc-cmp-nr-style-scenario-tw.component.html',
      code: this.tailwindScenarioHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'doc-cmp-nr-style-scenario-tw.component.css',
      code: this.tailwindScenarioCssCode,
    },
  ]);

  protected readonly stylePatternExamples = [
    {
      title: 'Theme token override',
      description:
        'Override the public token surface on the host to change the visual character without touching internal DOM.',
      language: 'css',
      code: [
        '.my-price-range-host {',
        '  --tng-number-range-bg: #ffffff;',
        '  --tng-number-range-border: #cbd5e1;',
        '  --tng-number-range-radius: 0.75rem;',
        '  --tng-number-range-min-height: 2.5rem;',
        '  --tng-number-range-px: 0.8rem;',
        '  --tng-number-range-gap: 0.5rem;',
        '  --tng-number-range-focus-ring: rgba(59, 130, 246, 0.2);',
        '  --tng-number-range-separator-color: #94a3b8;',
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
        '.my-compact-range-host {',
        '  --tng-number-range-min-height: 2rem;',
        '  --tng-number-range-px: 0.6rem;',
        '  --tng-number-range-gap: 0.25rem;',
        '  --tng-number-range-radius: 0.5rem;',
        '}',
        '',
      ].join('\n'),
    },
    {
      title: 'State-aware container',
      description:
        'Use the emitted state attributes when the visual treatment must react to invalid or disabled state.',
      language: 'css',
      code: this.stateHooksCode,
    },
  ] as const;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
