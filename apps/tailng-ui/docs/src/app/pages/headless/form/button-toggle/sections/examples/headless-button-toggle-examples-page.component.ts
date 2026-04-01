import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
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

type DensityValue = 'compact' | 'comfortable' | 'spacious';
type FormatValue = 'bold' | 'italic' | 'underline';

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
  selector: 'app-headless-button-toggle-examples-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngButtonToggle, TngButtonToggleGroup],
  templateUrl: './headless-button-toggle-examples-page.component.html',
  styleUrl: './headless-button-toggle-examples-page.component.css',
})
export class HeadlessButtonToggleExamplesPageComponent implements OnDestroy {
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

  protected readonly plainDensity = signal<DensityValue>('comfortable');
  protected readonly tailwindDensity = signal<DensityValue>('comfortable');
  protected readonly plainFormats = signal<readonly FormatValue[]>(['bold']);
  protected readonly tailwindFormats = signal<readonly FormatValue[]>(['bold', 'underline']);

  protected readonly plainFormatsSummary = computed(() => this.renderSummary(this.plainFormats()));
  protected readonly tailwindFormatsSummary = computed(() => this.renderSummary(this.tailwindFormats()));

  protected readonly singleSelectPlainCodeTabs = createCodeTabs(
    'headless-button-toggle-density-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggle, TngButtonToggleGroup, type TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-button-toggle-density-plain',",
      '  standalone: true,',
      '  imports: [TngButtonToggle, TngButtonToggleGroup],',
      "  templateUrl: './headless-button-toggle-density-plain.component.html',",
      "  styleUrl: './headless-button-toggle-density-plain.component.css',",
      '})',
      'export class HeadlessButtonToggleDensityPlainComponent {',
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
      '<section class="headless-button-toggle-density-example">',
      '  <span class="headless-button-toggle-density-example__label">Editor density</span>',
      '  <div',
      '    tngButtonToggleGroup',
      '    class="headless-button-toggle-density-example__group"',
      '    type="single"',
      '    [tngButtonToggleValue]="density()"',
      '    (valueChange)="onDensityChange($event)"',
      '  >',
      '    <button tngButtonToggle tngButtonToggleValue="compact" class="headless-button-toggle-density-example__item">Compact</button>',
      '    <button tngButtonToggle tngButtonToggleValue="comfortable" class="headless-button-toggle-density-example__item">Comfortable</button>',
      '    <button tngButtonToggle tngButtonToggleValue="spacious" class="headless-button-toggle-density-example__item">Spacious</button>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.headless-button-toggle-density-example {',
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
      '.headless-button-toggle-density-example__label {',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.08em;',
      '  text-transform: uppercase;',
      '  color: #64748b;',
      '}',
      '',
      '.headless-button-toggle-density-example__group { display: inline-flex; flex-wrap: wrap; gap: 0.5rem; padding: 0.45rem; border: 1px solid #e2e8f0; border-radius: 1rem; background: #f8fafc; }',
      '.headless-button-toggle-density-example__item { appearance: none; border: 1px solid #cbd5e1; border-radius: 0.8rem; background: #ffffff; color: #334155; font: inherit; line-height: inherit; padding: 0.5rem 0.9rem; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05); }',
      '.headless-button-toggle-density-example__item:hover { background: #f1f5f9; border-color: #94a3b8; }',
      '.headless-button-toggle-density-example__item[data-selected="true"] { background: #2563eb; border-color: #2563eb; color: #ffffff; box-shadow: 0 12px 24px -18px rgba(37, 99, 235, 0.92); }',
      '',
    ].join('\n'),
  );

  protected readonly singleSelectTailwindCodeTabs = createCodeTabs(
    'headless-button-toggle-density-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggle, TngButtonToggleGroup, type TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-button-toggle-density-tailwind',",
      '  standalone: true,',
      '  imports: [TngButtonToggle, TngButtonToggleGroup],',
      "  templateUrl: './headless-button-toggle-density-tailwind.component.html',",
      '})',
      'export class HeadlessButtonToggleDensityTailwindComponent {',
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
      '  <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Editor density</span>',
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

  protected readonly multiSelectPlainCodeTabs = createCodeTabs(
    'headless-button-toggle-formatting-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggle, TngButtonToggleGroup } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-button-toggle-formatting-plain',",
      '  standalone: true,',
      '  imports: [TngButtonToggle, TngButtonToggleGroup],',
      "  templateUrl: './headless-button-toggle-formatting-plain.component.html',",
      "  styleUrl: './headless-button-toggle-formatting-plain.component.css',",
      '})',
      'export class HeadlessButtonToggleFormattingPlainComponent {',
      "  readonly formats = signal<readonly string[]>(['bold']);",
      '',
      '  onFormatsChange(values: readonly (string | number)[]): void {',
      "    this.formats.set(values.filter((value): value is string => typeof value === 'string'));",
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="headless-button-toggle-formatting-example">',
      '  <div',
      '    tngButtonToggleGroup',
      '    class="headless-button-toggle-formatting-example__group"',
      '    type="multiple"',
      '    [tngButtonToggleValues]="formats()"',
      '    (valuesChange)="onFormatsChange($event)"',
      '  >',
      '    <button tngButtonToggle tngButtonToggleValue="bold" class="headless-button-toggle-formatting-example__item">Bold</button>',
      '    <button tngButtonToggle tngButtonToggleValue="italic" class="headless-button-toggle-formatting-example__item">Italic</button>',
      '    <button tngButtonToggle tngButtonToggleValue="underline" class="headless-button-toggle-formatting-example__item">Underline</button>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.headless-button-toggle-formatting-example {',
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
      '.headless-button-toggle-formatting-example__group { display: inline-flex; flex-wrap: wrap; gap: 0.5rem; padding: 0.45rem; border: 1px solid #e2e8f0; border-radius: 1rem; background: #f8fafc; }',
      '.headless-button-toggle-formatting-example__item { appearance: none; border: 1px solid #cbd5e1; border-radius: 0.8rem; background: #ffffff; color: #334155; font: inherit; line-height: inherit; padding: 0.5rem 0.9rem; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05); }',
      '.headless-button-toggle-formatting-example__item:hover { background: #f1f5f9; border-color: #94a3b8; }',
      '.headless-button-toggle-formatting-example__item[data-selected="true"] { background: #2563eb; border-color: #2563eb; color: #ffffff; box-shadow: 0 12px 24px -18px rgba(37, 99, 235, 0.92); }',
      '',
    ].join('\n'),
  );

  protected readonly multiSelectTailwindCodeTabs = createCodeTabs(
    'headless-button-toggle-formatting-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggle, TngButtonToggleGroup } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-button-toggle-formatting-tailwind',",
      '  standalone: true,',
      '  imports: [TngButtonToggle, TngButtonToggleGroup],',
      "  templateUrl: './headless-button-toggle-formatting-tailwind.component.html',",
      '})',
      'export class HeadlessButtonToggleFormattingTailwindComponent {',
      "  readonly formats = signal<readonly string[]>(['bold', 'underline']);",
      '',
      '  onFormatsChange(values: readonly (string | number)[]): void {',
      "    this.formats.set(values.filter((value): value is string => typeof value === 'string'));",
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[34rem] gap-3 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <div',
      '    tngButtonToggleGroup',
      '    class="inline-flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2"',
      '    type="multiple"',
      '    [tngButtonToggleValues]="formats()"',
      '    (valuesChange)="onFormatsChange($event)"',
      '  >',
      '    <button tngButtonToggle tngButtonToggleValue="bold" class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 data-[selected=true]:border-blue-600 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_10px_24px_-16px_rgba(37,99,235,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">Bold</button>',
      '    <button tngButtonToggle tngButtonToggleValue="italic" class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 data-[selected=true]:border-blue-600 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_10px_24px_-16px_rgba(37,99,235,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">Italic</button>',
      '    <button tngButtonToggle tngButtonToggleValue="underline" class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 data-[selected=true]:border-blue-600 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_10px_24px_-16px_rgba(37,99,235,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">Underline</button>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly disabledPlainCodeTabs = createCodeTabs(
    'headless-button-toggle-disabled-plain',
    "import { Component } from '@angular/core';\nimport { TngButtonToggle, TngButtonToggleGroup } from '@tailng-ui/primitives';\n",
    [
      '<section class="headless-button-toggle-disabled-example">',
      '  <div tngButtonToggleGroup class="headless-button-toggle-disabled-example__group" type="single" disabled="">',
      '    <button tngButtonToggle tngButtonToggleValue="grid" class="headless-button-toggle-disabled-example__item">Grid</button>',
      '    <button tngButtonToggle tngButtonToggleValue="list" class="headless-button-toggle-disabled-example__item">List</button>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.headless-button-toggle-disabled-example {',
      '  display: grid;',
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
      '.headless-button-toggle-disabled-example__group { display: inline-flex; gap: 0.5rem; padding: 0.45rem; border: 1px solid #e2e8f0; border-radius: 0.9rem; background: #f8fafc; }',
      '.headless-button-toggle-disabled-example__item { appearance: none; border: 1px solid #e2e8f0; border-radius: 0.8rem; background: #f8fafc; color: #94a3b8; font: inherit; line-height: inherit; padding: 0.5rem 0.9rem; box-shadow: none; }',
      '.headless-button-toggle-disabled-example__item[data-disabled="true"] { opacity: 1; cursor: not-allowed; }',
      '',
    ].join('\n'),
  );

  protected readonly disabledTailwindCodeTabs = createCodeTabs(
    'headless-button-toggle-disabled-tailwind',
    "import { Component } from '@angular/core';\nimport { TngButtonToggle, TngButtonToggleGroup } from '@tailng-ui/primitives';\n",
    [
      '<section class="grid w-full max-w-[34rem] gap-3 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <div tngButtonToggleGroup class="inline-flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2" type="single" disabled="">',
      '    <button tngButtonToggle tngButtonToggleValue="grid" class="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400 shadow-none opacity-100">Grid</button>',
      '    <button tngButtonToggle tngButtonToggleValue="list" class="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400 shadow-none opacity-100">List</button>',
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

  public onPlainFormatsChange(values: readonly (string | number)[]): void {
    this.plainFormats.set(values.filter((value): value is FormatValue => value === 'bold' || value === 'italic' || value === 'underline'));
  }

  public onTailwindFormatsChange(values: readonly (string | number)[]): void {
    this.tailwindFormats.set(values.filter((value): value is FormatValue => value === 'bold' || value === 'italic' || value === 'underline'));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private renderSummary(values: readonly string[]): string {
    return values.length === 0 ? 'none' : values.join(', ');
  }
}
