import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngButtonToggle,
  TngButtonToggleGroup,
  type TngButtonToggleValue,
} from '@tailng-ui/primitives';
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

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
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
  selector: 'app-headless-button-toggle-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngButtonToggle,
    TngButtonToggleGroup,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './headless-button-toggle-overview-page.component.html',
  styleUrl: './headless-button-toggle-overview-page.component.css',
})
export class HeadlessButtonToggleOverviewPageComponent implements OnDestroy {
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

  protected readonly plainDensity = signal<'compact' | 'comfortable' | 'spacious'>('comfortable');
  protected readonly tailwindDensity = signal<'compact' | 'comfortable' | 'spacious'>('comfortable');

  protected readonly primitiveImportCode =
    "import { TngButtonToggle, TngButtonToggleGroup } from '@tailng-ui/primitives';\n";

  protected readonly singleSelectCode = [
    '<div',
    '  tngButtonToggleGroup',
    '  type="single"',
    '  [tngButtonToggleValue]="density()"',
    '  (valueChange)="onDensityChange($event)"',
    '>',
    '  <button tngButtonToggle tngButtonToggleValue="compact">Compact</button>',
    '  <button tngButtonToggle tngButtonToggleValue="comfortable">Comfortable</button>',
    '  <button tngButtonToggle tngButtonToggleValue="spacious">Spacious</button>',
    '</div>',
    '',
  ].join('\n');

  protected readonly multipleSelectCode = [
    '<div',
    '  tngButtonToggleGroup',
    '  type="multiple"',
    '  [tngButtonToggleValues]="filters()"',
    '  (valuesChange)="onFiltersChange($event)"',
    '>',
    '  <button tngButtonToggle tngButtonToggleValue="a11y">Accessibility</button>',
    '  <button tngButtonToggle tngButtonToggleValue="signals">Signals</button>',
    '  <button tngButtonToggle tngButtonToggleValue="dx">DX</button>',
    '</div>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'headless-button-toggle-overview-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggle, TngButtonToggleGroup, type TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-button-toggle-overview-plain',",
      '  standalone: true,',
      '  imports: [TngButtonToggle, TngButtonToggleGroup],',
      "  templateUrl: './headless-button-toggle-overview-plain.component.html',",
      "  styleUrl: './headless-button-toggle-overview-plain.component.css',",
      '})',
      'export class HeadlessButtonToggleOverviewPlainComponent {',
      "  readonly density = signal<'compact' | 'comfortable' | 'spacious'>('comfortable');",
      '',
      '  onDensityChange(value: TngButtonToggleValue | null): void {',
      "    if (value === 'compact' || value === 'comfortable' || value === 'spacious') {",
      '      this.density.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="headless-button-toggle-density-shell">',
      '  <span class="headless-button-toggle-density-shell__label">Density</span>',
      '  <div',
      '    tngButtonToggleGroup',
      '    class="headless-button-toggle-density-shell__group"',
      '    type="single"',
      '    [tngButtonToggleValue]="density()"',
      '    (valueChange)="onDensityChange($event)"',
      '  >',
      '    <button tngButtonToggle tngButtonToggleValue="compact" class="headless-button-toggle-density-shell__item">Compact</button>',
      '    <button tngButtonToggle tngButtonToggleValue="comfortable" class="headless-button-toggle-density-shell__item">Comfortable</button>',
      '    <button tngButtonToggle tngButtonToggleValue="spacious" class="headless-button-toggle-density-shell__item">Spacious</button>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.headless-button-toggle-density-shell {',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  inline-size: min(100%, 34rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '}',
      '',
      '.headless-button-toggle-density-shell__label {',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.08em;',
      '  text-transform: uppercase;',
      '  color: #64748b;',
      '}',
      '',
      '.headless-button-toggle-density-shell__group {',
      '  display: inline-flex;',
      '  flex-wrap: wrap;',
      '  gap: 0.55rem;',
      '  padding: 0.45rem;',
      '  border: 1px solid #e2e8f0;',
      '  border-radius: 1rem;',
      '  background: #f8fafc;',
      '}',
      '',
      '.headless-button-toggle-density-shell__item {',
      '  appearance: none;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.8rem;',
      '  background: #ffffff;',
      '  color: #334155;',
      '  font: inherit;',
      '  line-height: inherit;',
      '  padding: 0.55rem 0.9rem;',
      '  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);',
      '  transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease, box-shadow 140ms ease;',
      '}',
      '',
      '.headless-button-toggle-density-shell__item:hover {',
      '  background: #f1f5f9;',
      '  border-color: #94a3b8;',
      '}',
      '',
      '.headless-button-toggle-density-shell__item[data-selected="true"] {',
      '  background: #2563eb;',
      '  border-color: #2563eb;',
      '  color: #ffffff;',
      '  box-shadow: 0 12px 24px -18px rgba(37, 99, 235, 0.92);',
      '}',
      '',
      '.headless-button-toggle-density-shell__item[data-focused="true"] {',
      '  outline: 2px solid rgba(37, 99, 235, 0.28);',
      '  outline-offset: 2px;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-button-toggle-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggle, TngButtonToggleGroup, type TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-button-toggle-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngButtonToggle, TngButtonToggleGroup],',
      "  templateUrl: './headless-button-toggle-overview-tailwind.component.html',",
      '})',
      'export class HeadlessButtonToggleOverviewTailwindComponent {',
      "  readonly density = signal<'compact' | 'comfortable' | 'spacious'>('comfortable');",
      '',
      '  onDensityChange(value: TngButtonToggleValue | null): void {',
      "    if (value === 'compact' || value === 'comfortable' || value === 'spacious') {",
      '      this.density.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[34rem] gap-3 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Density</span>',
      '  <div',
      '    tngButtonToggleGroup',
      '    class="inline-flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2"',
      '    type="single"',
      '    [tngButtonToggleValue]="density()"',
      '    (valueChange)="onDensityChange($event)"',
      '  >',
      '    <button tngButtonToggle tngButtonToggleValue="compact" class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 data-[selected=true]:border-blue-600 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_10px_24px_-16px_rgba(37,99,235,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">Compact</button>',
      '    <button tngButtonToggle tngButtonToggleValue="comfortable" class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 data-[selected=true]:border-blue-600 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_10px_24px_-16px_rgba(37,99,235,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">Comfortable</button>',
      '    <button tngButtonToggle tngButtonToggleValue="spacious" class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 data-[selected=true]:border-blue-600 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_10px_24px_-16px_rgba(37,99,235,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">Spacious</button>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public onPlainDensityChange(value: TngButtonToggleValue | null): void {
    if (value === 'compact' || value === 'comfortable' || value === 'spacious') {
      this.plainDensity.set(value);
    }
  }

  public onTailwindDensityChange(value: TngButtonToggleValue | null): void {
    if (value === 'compact' || value === 'comfortable' || value === 'spacious') {
      this.tailwindDensity.set(value);
    }
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
