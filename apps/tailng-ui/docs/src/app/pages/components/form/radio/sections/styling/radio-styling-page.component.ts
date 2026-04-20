import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngRadioComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../radio.util';

type CreateCodeTabsOptions = {
  readonly baseName: string;
  readonly cssCode: string;
  readonly htmlCode: string;
  readonly tsCode: string;
};

function createCodeTabs({
  baseName,
  cssCode,
  htmlCode,
  tsCode,
}: CreateCodeTabsOptions): readonly DocsExampleCodeTab[] {
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
  selector: 'app-radio-styling-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngRadioComponent],
  templateUrl: './radio-styling-page.component.html',
  styleUrl: './radio-styling-page.component.css',
})
export class RadioStylingPageComponent implements OnDestroy {
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

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-radio-styling-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-radio-styling-plain',",
      '  standalone: true,',
      '  imports: [TngRadioComponent],',
      "  templateUrl: './doc-cmp-radio-styling-plain.component.html',",
      "  styleUrl: './doc-cmp-radio-styling-plain.component.css',",
      '})',
      'export class DocCmpRadioStylingPlainComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-radio-styling-panel">',
      '  <h3 class="doc-cmp-radio-styling-panel__title">Release target</h3>',
      '  <tng-radio',
      '    name="release-target"',
      '    [checked]="true"',
      '  >',
      '    Production release',
      '  </tng-radio>',
      '  <div class="doc-cmp-radio-styling-item doc-cmp-radio-styling-item--danger">',
      '    <tng-radio',
      '      name="release-target"',
      '      [invalid]="true"',
      '    >',
      '      Needs compliance approval',
      '    </tng-radio>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-radio-styling-panel {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #d8e1ec;',
      '  border-radius: 1rem;',
      '  background: #fff;',
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.28);',
      '}',
      '',
      '.doc-cmp-radio-styling-panel__title {',
      '  margin: 0;',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '  color: var(--tng-semantic-foreground-primary);',
      '}',
      '',
      '.doc-cmp-radio-styling-panel > tng-radio,',
      '.doc-cmp-radio-styling-item {',
      '  display: block;',
      '  padding: 0.75rem 0.9rem;',
      '  border: 1px solid #d8e1ec;',
      '  border-radius: 0.9rem;',
      '  background: #fff;',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.22);',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);',
      '}',
      '',
      '.doc-cmp-radio-styling-item--danger,',
      '.doc-cmp-radio-styling-panel > .doc-cmp-radio-styling-item--danger {',
      '  border-color: #fda4af;',
      '  background: #fff1f2;',
      '  --tng-semantic-accent-danger: #dc2626;',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-accent-danger);',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-radio-styling-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-radio-styling-tailwind',",
      '  standalone: true,',
      '  imports: [TngRadioComponent],',
      "  templateUrl: './doc-cmp-radio-styling-tailwind.component.html',",
      '})',
      'export class DocCmpRadioStylingTailwindComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section',
      '  class="grid w-full max-w-[30rem] gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 shadow-sm"',
      '>',
      '  <h3 class="m-0 text-base font-semibold text-[var(--tng-semantic-foreground-primary)]">Release target</h3>',
      '  <div class="block rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] px-3 py-2 text-[var(--tng-semantic-foreground-primary)] shadow-sm [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)]">',
      '    <tng-radio',
      '    name="release-target"',
      '    [checked]="true"',
      '  >',
      '    Production release',
      '    </tng-radio>',
      '  </div>',
      '  <div class="block rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_35%,var(--tng-semantic-border-subtle)_65%)] bg-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_10%,var(--tng-semantic-background-surface)_90%)] px-3 py-2 text-[var(--tng-semantic-accent-danger)] shadow-sm [--tng-semantic-accent-danger:#dc2626] [--tng-semantic-focus-ring:rgba(220,38,38,0.18)]">',
      '    <tng-radio',
      '    name="release-target"',
      '    [invalid]="true"',
      '  >',
      '    Needs compliance approval',
      '    </tng-radio>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
