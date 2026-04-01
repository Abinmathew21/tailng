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
  selector: 'app-headless-button-toggle-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngButtonToggle,
    TngButtonToggleGroup,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './headless-button-toggle-styling-page.component.html',
  styleUrl: './headless-button-toggle-styling-page.component.css',
})
export class HeadlessButtonToggleStylingPageComponent implements OnDestroy {
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

  protected readonly plainSelection = signal<'all' | 'assigned' | 'drafts'>('assigned');
  protected readonly tailwindSelection = signal<'all' | 'assigned' | 'drafts'>('assigned');

  protected readonly selectorSnippet = [
    '[data-slot="button-toggle-group"] {',
    '  display: inline-flex;',
    '}',
    '',
    '[data-slot="button-toggle"][data-selected="true"] {',
    '  background: #2563eb;',
    '  color: #ffffff;',
    '}',
    '',
    '[data-slot="button-toggle"][data-focused="true"] {',
    '  outline: 2px solid rgba(37, 99, 235, 0.28);',
    '  outline-offset: 2px;',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'headless-button-toggle-styling-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggle, TngButtonToggleGroup, type TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-button-toggle-styling-plain',",
      '  standalone: true,',
      '  imports: [TngButtonToggle, TngButtonToggleGroup],',
      "  templateUrl: './headless-button-toggle-styling-plain.component.html',",
      "  styleUrl: './headless-button-toggle-styling-plain.component.css',",
      '})',
      'export class HeadlessButtonToggleStylingPlainComponent {',
      "  readonly activeTab = signal<'all' | 'assigned' | 'drafts'>('assigned');",
      '',
      '  onTabChange(value: TngButtonToggleValue | null): void {',
      "    if (value === 'all' || value === 'assigned' || value === 'drafts') {",
      '      this.activeTab.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="headless-button-toggle-filter-shell">',
      '  <span class="headless-button-toggle-filter-shell__label">Filter</span>',
      '  <div',
      '    tngButtonToggleGroup',
      '    class="headless-button-toggle-filter-shell__group"',
      '    type="single"',
      '    [tngButtonToggleValue]="activeTab()"',
      '    (valueChange)="onTabChange($event)"',
      '  >',
      '    <button tngButtonToggle tngButtonToggleValue="all" class="headless-button-toggle-filter-shell__item">All</button>',
      '    <button tngButtonToggle tngButtonToggleValue="assigned" class="headless-button-toggle-filter-shell__item">Assigned</button>',
      '    <button tngButtonToggle tngButtonToggleValue="drafts" class="headless-button-toggle-filter-shell__item">Drafts</button>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.headless-button-toggle-filter-shell {',
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
      '.headless-button-toggle-filter-shell__label {',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.08em;',
      '  text-transform: uppercase;',
      '  color: #64748b;',
      '}',
      '',
      '.headless-button-toggle-filter-shell__group {',
      '  display: inline-flex;',
      '  flex-wrap: wrap;',
      '  gap: 0.5rem;',
      '  padding: 0.45rem;',
      '  border: 1px solid #e2e8f0;',
      '  border-radius: 999px;',
      '  background: #f8fafc;',
      '}',
      '',
      '.headless-button-toggle-filter-shell__item {',
      '  appearance: none;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 999px;',
      '  background: #ffffff;',
      '  color: #334155;',
      '  font: inherit;',
      '  line-height: inherit;',
      '  padding: 0.5rem 0.9rem;',
      '  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);',
      '}',
      '',
      '.headless-button-toggle-filter-shell__item:hover {',
      '  background: #f1f5f9;',
      '  border-color: #94a3b8;',
      '}',
      '',
      '.headless-button-toggle-filter-shell__item[data-selected="true"] {',
      '  background: #2563eb;',
      '  border-color: #2563eb;',
      '  color: #ffffff;',
      '  box-shadow: 0 12px 24px -18px rgba(37, 99, 235, 0.92);',
      '}',
      '',
      '.headless-button-toggle-filter-shell__item[data-focused="true"] {',
      '  outline: 2px solid rgba(37, 99, 235, 0.28);',
      '  outline-offset: 2px;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-button-toggle-styling-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggle, TngButtonToggleGroup, type TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-button-toggle-styling-tailwind',",
      '  standalone: true,',
      '  imports: [TngButtonToggle, TngButtonToggleGroup],',
      "  templateUrl: './headless-button-toggle-styling-tailwind.component.html',",
      '})',
      'export class HeadlessButtonToggleStylingTailwindComponent {',
      "  readonly activeTab = signal<'all' | 'assigned' | 'drafts'>('assigned');",
      '',
      '  onTabChange(value: TngButtonToggleValue | null): void {',
      "    if (value === 'all' || value === 'assigned' || value === 'drafts') {",
      '      this.activeTab.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[34rem] gap-3 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Filter</span>',
      '  <div',
      '    tngButtonToggleGroup',
      '    class="inline-flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2"',
      '    type="single"',
      '    [tngButtonToggleValue]="activeTab()"',
      '    (valueChange)="onTabChange($event)"',
      '  >',
      '    <button tngButtonToggle tngButtonToggleValue="all" class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 data-[selected=true]:border-blue-600 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_10px_24px_-16px_rgba(37,99,235,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">All</button>',
      '    <button tngButtonToggle tngButtonToggleValue="assigned" class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 data-[selected=true]:border-blue-600 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_10px_24px_-16px_rgba(37,99,235,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">Assigned</button>',
      '    <button tngButtonToggle tngButtonToggleValue="drafts" class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 data-[selected=true]:border-blue-600 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_10px_24px_-16px_rgba(37,99,235,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">Drafts</button>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public onPlainSelectionChange(value: TngButtonToggleValue | null): void {
    if (value === 'all' || value === 'assigned' || value === 'drafts') {
      this.plainSelection.set(value);
    }
  }

  public onTailwindSelectionChange(value: TngButtonToggleValue | null): void {
    if (value === 'all' || value === 'assigned' || value === 'drafts') {
      this.tailwindSelection.set(value);
    }
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
