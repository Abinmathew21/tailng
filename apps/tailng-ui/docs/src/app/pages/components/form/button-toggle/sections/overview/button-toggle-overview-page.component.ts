import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngButtonToggleComponent,
  TngButtonToggleGroupComponent,
  TngCodeBlockComponent,
} from '@tailng-ui/components';
import type { TngButtonToggleValue } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../button-toggle.util';

type DensityOption = 'compact' | 'comfortable' | 'spacious';
type FeatureFlag = 'a11y' | 'analytics' | 'signals';

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
  selector: 'app-button-toggle-overview-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngButtonToggleComponent,
    TngButtonToggleGroupComponent,
    TngCodeBlockComponent,
  ],
  templateUrl: './button-toggle-overview-page.component.html',
  styleUrl: './button-toggle-overview-page.component.css',
})
export class ButtonToggleOverviewPageComponent implements OnDestroy {
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

  protected readonly plainCssDensity = signal<DensityOption>('comfortable');
  protected readonly tailwindFeatures = signal<readonly FeatureFlag[]>(['a11y', 'signals']);

  protected readonly componentImportCode =
    "import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';\n";

  protected readonly componentUsageCode = [
    '<tng-button-toggle-group',
    '  ariaLabel="Density selection"',
    '  [value]="density()"',
    '  (valueChange)="onDensityChange($event)"',
    '>',
    `  <tng-button-toggle [tngButtonToggleValue]="'compact'">Compact</tng-button-toggle>`,
    `  <tng-button-toggle [tngButtonToggleValue]="'comfortable'">Comfortable</tng-button-toggle>`,
    `  <tng-button-toggle [tngButtonToggleValue]="'spacious'">Spacious</tng-button-toggle>`,
    '</tng-button-toggle-group>',
    '',
  ].join('\n');

  protected readonly multiSelectUsageCode = [
    '<tng-button-toggle-group',
    '  ariaLabel="Feature filters"',
    '  type="multiple"',
    '  [values]="filters()"',
    '  (valuesChange)="onFiltersChange($event)"',
    '>',
    `  <tng-button-toggle [tngButtonToggleValue]="'a11y'">Accessibility</tng-button-toggle>`,
    `  <tng-button-toggle [tngButtonToggleValue]="'signals'">Signals</tng-button-toggle>`,
    `  <tng-button-toggle [tngButtonToggleValue]="'analytics'">Analytics</tng-button-toggle>`,
    '</tng-button-toggle-group>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-button-toggle-overview-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';",
      "import type { TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      "type PlainDensityOption = 'compact' | 'comfortable' | 'spacious';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-button-toggle-overview-plain',",
      '  standalone: true,',
      '  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],',
      "  templateUrl: './doc-cmp-button-toggle-overview-plain.component.html',",
      "  styleUrl: './doc-cmp-button-toggle-overview-plain.component.css',",
      '})',
      'export class DocCmpButtonToggleOverviewPlainComponent {',
      "  readonly selectedPlainDensity = signal<PlainDensityOption>('comfortable');",
      '',
      '  onPlainDensityChange(value: TngButtonToggleValue | null): void {',
      "    if (value === 'compact' || value === 'comfortable' || value === 'spacious') {",
      '      this.selectedPlainDensity.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-button-toggle-density-card">',
      '  <div class="doc-cmp-button-toggle-density-card__header">',
      '    <span class="doc-cmp-button-toggle-density-card__eyebrow">Editor density</span>',
      '    <p class="doc-cmp-button-toggle-density-card__body">Choose how compact the writing workspace should feel.</p>',
      '  </div>',
      '  <tng-button-toggle-group',
      '    class="doc-cmp-button-toggle-density-group"',
      '    ariaLabel="Editor density"',
      '    [value]="selectedPlainDensity()"',
      '    (valueChange)="onPlainDensityChange($event)"',
      '  >',
      `    <tng-button-toggle class="doc-cmp-button-toggle-density-item" [tngButtonToggleValue]="'compact'">Compact</tng-button-toggle>`,
      `    <tng-button-toggle class="doc-cmp-button-toggle-density-item" [tngButtonToggleValue]="'comfortable'">Comfortable</tng-button-toggle>`,
      `    <tng-button-toggle class="doc-cmp-button-toggle-density-item" [tngButtonToggleValue]="'spacious'">Spacious</tng-button-toggle>`,
      '  </tng-button-toggle-group>',
      '  <p class="doc-cmp-button-toggle-density-card__summary">Selected: {{ selectedPlainDensity() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-button-toggle-density-card {',
      '  display: grid;',
      '  gap: 0.85rem;',
      '  inline-size: min(100%, 32rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #dbe4ee;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.28);',
      '  color-scheme: light;',
      '}',
      '',
      '.doc-cmp-button-toggle-density-card__header {',
      '  display: grid;',
      '  gap: 0.35rem;',
      '}',
      '',
      '.doc-cmp-button-toggle-density-card__eyebrow {',
      '  color: #0f172a;',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.doc-cmp-button-toggle-density-card__body {',
      '  margin: 0;',
      '  color: #475569;',
      '  font-size: 0.92rem;',
      '  line-height: 1.6;',
      '}',
      '',
      '.doc-cmp-button-toggle-density-group {',
      '  --tng-semantic-border-subtle: #dbe4ee;',
      '  background: #f8fafc;',
      '  border-radius: 1rem;',
      '}',
      '',
      '.doc-cmp-button-toggle-density-item {',
      '  --tng-semantic-background-surface: #ffffff;',
      '  --tng-semantic-background-muted: #edf4ff;',
      '  --tng-semantic-border-subtle: #c6d4e1;',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-foreground-primary: #1e293b;',
      '  --tng-color-white: #ffffff;',
      '}',
      '',
      '.doc-cmp-button-toggle-density-card__summary {',
      '  margin: 0;',
      '  color: #475569;',
      '  font-size: 0.82rem;',
      '  text-transform: capitalize;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-button-toggle-overview-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';",
      '',
      "type TailwindFeatureFlag = 'a11y' | 'analytics' | 'signals';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-button-toggle-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],',
      "  templateUrl: './doc-cmp-button-toggle-overview-tailwind.component.html',",
      '})',
      'export class DocCmpButtonToggleOverviewTailwindComponent {',
      "  readonly selectedTailwindFeatures = signal<readonly TailwindFeatureFlag[]>(['a11y', 'signals']);",
      '',
      '  onTailwindFeaturesChange(values: readonly (string | number)[]): void {',
      '    this.selectedTailwindFeatures.set(',
      "      values.filter((value): value is TailwindFeatureFlag => value === 'a11y' || value === 'analytics' || value === 'signals'),",
      '    );',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <div class="grid gap-1">',
      '    <span class="text-base font-semibold text-slate-900">Feature flags</span>',
      '    <p class="m-0 text-sm leading-6 text-slate-600">Keep the same component API while switching to a utility-driven shell.</p>',
      '  </div>',
      '  <tng-button-toggle-group',
      '    class="inline-flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-2.5 [--tng-semantic-border-subtle:#dbe4ee]"',
      '    ariaLabel="Feature filters"',
      '    type="multiple"',
      '    [values]="selectedTailwindFeatures()"',
      '    (valuesChange)="onTailwindFeaturesChange($event)"',
      '  >',
      `    <tng-button-toggle class="[--tng-semantic-background-surface:#ffffff] [--tng-semantic-background-muted:#edf4ff] [--tng-semantic-border-subtle:#c6d4e1] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-foreground-primary:#1e293b] [--tng-color-white:#ffffff]" [tngButtonToggleValue]="'a11y'">Accessibility</tng-button-toggle>`,
      `    <tng-button-toggle class="[--tng-semantic-background-surface:#ffffff] [--tng-semantic-background-muted:#edf4ff] [--tng-semantic-border-subtle:#c6d4e1] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-foreground-primary:#1e293b] [--tng-color-white:#ffffff]" [tngButtonToggleValue]="'signals'">Signals</tng-button-toggle>`,
      `    <tng-button-toggle class="[--tng-semantic-background-surface:#ffffff] [--tng-semantic-background-muted:#edf4ff] [--tng-semantic-border-subtle:#c6d4e1] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-foreground-primary:#1e293b] [--tng-color-white:#ffffff]" [tngButtonToggleValue]="'analytics'">Analytics</tng-button-toggle>`,
      '  </tng-button-toggle-group>',
      '  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedTailwindFeatures().join(", ") }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected onPlainCssDensityChange(value: TngButtonToggleValue | null): void {
    if (value === 'compact' || value === 'comfortable' || value === 'spacious') {
      this.plainCssDensity.set(value);
    }
  }

  protected onTailwindFeaturesChange(values: readonly TngButtonToggleValue[]): void {
    this.tailwindFeatures.set(
      values.filter(
        (value): value is FeatureFlag =>
          value === 'a11y' || value === 'analytics' || value === 'signals',
      ),
    );
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
