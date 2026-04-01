import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngToggle, TngToggleGroup } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../toggle.util';

type ToggleViewMode = 'grid' | 'list' | 'split';

type CreateCodeTabsOptions = {
  readonly baseName: string;
  readonly tsCode: string;
  readonly htmlCode: string;
  readonly cssCode: string;
};

function createCodeTabs({
  baseName,
  tsCode,
  htmlCode,
  cssCode,
}: CreateCodeTabsOptions): readonly DocsExampleCodeTab[] {
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
  selector: 'app-headless-toggle-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngToggle,
    TngToggleGroup,
  ],
  templateUrl: './headless-toggle-overview-page.component.html',
  styleUrl: './headless-toggle-overview-page.component.css',
})
export class HeadlessToggleOverviewPageComponent implements OnDestroy {
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

  protected readonly plainCssViewMode = signal<ToggleViewMode>('list');
  protected readonly tailwindViewMode = signal<ToggleViewMode>('grid');

  protected readonly primitiveImportCode =
    "import { TngToggle, TngToggleGroup } from '@tailng-ui/primitives';\n";

  protected readonly basicUsageCode = [
    '<button',
    '  tngToggle',
    '  [pressed]="showGrid()"',
    '  ariaLabel="Grid view"',
    '  (pressedChange)="showGrid.set($event)"',
    '>',
    '  Grid',
    '</button>',
    '',
  ].join('\n');

  protected readonly groupedUsageCode = [
    '<div',
    '  tngToggleGroup',
    '  selectionMode="single"',
    '  ariaLabel="View mode"',
    '  [value]="viewMode()"',
    '  (valueChange)="onViewModeChange($event)"',
    '>',
    '  <button tngToggle tngToggleValue="grid">Grid</button>',
    '  <button tngToggle tngToggleValue="list">List</button>',
    '  <button tngToggle tngToggleValue="split">Split</button>',
    '</div>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'headless-toggle-overview-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngToggle, TngToggleGroup } from '@tailng-ui/primitives';",
      '',
      "type PlainToggleViewMode = 'grid' | 'list' | 'split';",
      '',
      '@Component({',
      "  selector: 'app-headless-toggle-overview-plain',",
      '  standalone: true,',
      '  imports: [TngToggle, TngToggleGroup],',
      "  templateUrl: './headless-toggle-overview-plain.component.html',",
      "  styleUrl: './headless-toggle-overview-plain.component.css',",
      '})',
      'export class HeadlessToggleOverviewPlainComponent {',
      "  readonly viewMode = signal<PlainToggleViewMode>('list');",
      '',
      '  onViewModeChange(value: string | null): void {',
      "    if (value === 'grid' || value === 'list' || value === 'split') {",
      '      this.viewMode.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="headless-toggle-view-shell">',
      '  <div class="headless-toggle-view-shell__header">',
      '    <span class="headless-toggle-view-shell__eyebrow">View mode</span>',
      '    <p class="headless-toggle-view-shell__body">Pick one layout while keeping native button semantics.</p>',
      '  </div>',
      '  <div',
      '    tngToggleGroup',
      '    class="headless-toggle-view-shell__group"',
      '    selectionMode="single"',
      '    ariaLabel="View mode"',
      '    [value]="viewMode()"',
      '    (valueChange)="onViewModeChange($event)"',
      '  >',
      '    <button tngToggle tngToggleValue="grid" class="headless-toggle-view-shell__item">Grid</button>',
      '    <button tngToggle tngToggleValue="list" class="headless-toggle-view-shell__item">List</button>',
      '    <button tngToggle tngToggleValue="split" class="headless-toggle-view-shell__item">Split</button>',
      '  </div>',
      '  <p class="headless-toggle-view-shell__summary">Selected: {{ viewMode() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-toggle-view-shell {',
      '  display: grid;',
      '  gap: 0.85rem;',
      '  inline-size: min(100%, 32rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.28);',
      '}',
      '',
      '.headless-toggle-view-shell__header {',
      '  display: grid;',
      '  gap: 0.35rem;',
      '}',
      '',
      '.headless-toggle-view-shell__eyebrow {',
      '  color: #0f172a;',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.headless-toggle-view-shell__body {',
      '  margin: 0;',
      '  color: #475569;',
      '  font-size: 0.92rem;',
      '  line-height: 1.6;',
      '}',
      '',
      '.headless-toggle-view-shell__group {',
      '  display: inline-flex;',
      '  flex-wrap: wrap;',
      '  gap: 0.55rem;',
      '  padding: 0.55rem;',
      '  border: 1px solid #dbe4ee;',
      '  border-radius: 1rem;',
      '  background: #f8fafc;',
      '}',
      '',
      '.headless-toggle-view-shell__item {',
      '  align-items: center;',
      '  appearance: none;',
      '  background: #ffffff;',
      '  border: 1px solid #c6d4e1;',
      '  border-radius: 0.85rem;',
      '  color: #1e293b;',
      '  cursor: pointer;',
      '  display: inline-flex;',
      '  font: inherit;',
      '  font-size: 0.9rem;',
      '  font-weight: 600;',
      '  justify-content: center;',
      '  line-height: inherit;',
      '  min-height: 2.3rem;',
      '  min-width: 5.6rem;',
      '  padding: 0.45rem 0.95rem;',
      '  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease;',
      '}',
      '',
      '.headless-toggle-view-shell__item[data-state="on"] {',
      '  background: #2563eb;',
      '  border-color: #2563eb;',
      '  color: #ffffff;',
      '  box-shadow: 0 10px 20px -16px rgba(37, 99, 235, 0.7);',
      '}',
      '',
      '.headless-toggle-view-shell__item:focus-visible {',
      '  outline: 2px solid rgba(37, 99, 235, 0.32);',
      '  outline-offset: 2px;',
      '}',
      '',
      '.headless-toggle-view-shell__summary {',
      '  margin: 0;',
      '  color: #475569;',
      '  font-size: 0.82rem;',
      '  text-transform: capitalize;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'headless-toggle-overview-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngToggle, TngToggleGroup } from '@tailng-ui/primitives';",
      '',
      "type TailwindToggleViewMode = 'grid' | 'list' | 'split';",
      '',
      '@Component({',
      "  selector: 'app-headless-toggle-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngToggle, TngToggleGroup],',
      "  templateUrl: './headless-toggle-overview-tailwind.component.html',",
      '})',
      'export class HeadlessToggleOverviewTailwindComponent {',
      "  readonly viewMode = signal<TailwindToggleViewMode>('grid');",
      '',
      '  onViewModeChange(value: string | null): void {',
      "    if (value === 'grid' || value === 'list' || value === 'split') {",
      '      this.viewMode.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <div class="grid gap-1">',
      '    <span class="text-base font-semibold text-slate-900">View mode</span>',
      '    <p class="m-0 text-sm leading-6 text-slate-600">Keep the group semantics while styling the surface with utilities.</p>',
      '  </div>',
      '  <div',
      '    tngToggleGroup',
      '    class="inline-flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-2.5"',
      '    selectionMode="single"',
      '    ariaLabel="View mode"',
      '    [value]="viewMode()"',
      '    (valueChange)="onViewModeChange($event)"',
      '  >',
      '    <button tngToggle tngToggleValue="grid" class="inline-flex min-h-9 min-w-[5.4rem] items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition data-[state=on]:border-blue-600 data-[state=on]:bg-blue-600 data-[state=on]:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">Grid</button>',
      '    <button tngToggle tngToggleValue="list" class="inline-flex min-h-9 min-w-[5.4rem] items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition data-[state=on]:border-blue-600 data-[state=on]:bg-blue-600 data-[state=on]:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">List</button>',
      '    <button tngToggle tngToggleValue="split" class="inline-flex min-h-9 min-w-[5.4rem] items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition data-[state=on]:border-blue-600 data-[state=on]:bg-blue-600 data-[state=on]:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">Split</button>',
      '  </div>',
      '  <p class="m-0 text-xs text-slate-600">Selected: {{ viewMode() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected onPlainCssViewModeChange(value: string | null): void {
    if (value === 'grid' || value === 'list' || value === 'split') {
      this.plainCssViewMode.set(value);
    }
  }

  protected onTailwindViewModeChange(value: string | null): void {
    if (value === 'grid' || value === 'list' || value === 'split') {
      this.tailwindViewMode.set(value);
    }
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
