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

type FormattingOption = 'bold' | 'code' | 'mentions';

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

function isFormattingOption(value: string): value is FormattingOption {
  return value === 'bold' || value === 'code' || value === 'mentions';
}

@Component({
  selector: 'app-headless-toggle-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngToggle,
    TngToggleGroup,
  ],
  templateUrl: './headless-toggle-styling-page.component.html',
  styleUrl: './headless-toggle-styling-page.component.css',
})
export class HeadlessToggleStylingPageComponent implements OnDestroy {
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

  protected readonly plainCssFormatting = signal<readonly FormattingOption[]>(['bold', 'code']);
  protected readonly tailwindFormatting = signal<readonly FormattingOption[]>(['mentions']);

  protected readonly stateSelectorSnippet = [
    'button[tngToggle][data-slot="toggle"] {',
    '  background: #ffffff;',
    '  border: 1px solid #c6d4e1;',
    '  color: #1e293b;',
    '}',
    '',
    'button[tngToggle][data-state="on"] {',
    '  background: #2563eb;',
    '  border-color: #2563eb;',
    '  color: #ffffff;',
    '}',
    '',
    'button[tngToggle][data-disabled] {',
    '  cursor: not-allowed;',
    '  opacity: 0.55;',
    '}',
    '',
    'button[tngToggle]:focus-visible {',
    '  outline: 2px solid rgba(37, 99, 235, 0.28);',
    '  outline-offset: 2px;',
    '}',
    '',
  ].join('\n');

  protected readonly groupShellSnippet = [
    '[tngToggleGroup][data-slot="toggle-group"] {',
    '  display: inline-flex;',
    '  flex-wrap: wrap;',
    '  gap: 0.55rem;',
    '  padding: 0.55rem;',
    '  border: 1px solid #dbe4ee;',
    '  border-radius: 1rem;',
    '  background: #f8fafc;',
    '}',
    '',
    '[tngToggleGroup][data-disabled] {',
    '  opacity: 0.6;',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'headless-toggle-styling-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngToggle, TngToggleGroup } from '@tailng-ui/primitives';",
      '',
      "type PlainFormattingOption = 'bold' | 'code' | 'mentions';",
      '',
      '@Component({',
      "  selector: 'app-headless-toggle-styling-plain',",
      '  standalone: true,',
      '  imports: [TngToggle, TngToggleGroup],',
      "  templateUrl: './headless-toggle-styling-plain.component.html',",
      "  styleUrl: './headless-toggle-styling-plain.component.css',",
      '})',
      'export class HeadlessToggleStylingPlainComponent {',
      "  readonly formatting = signal<readonly PlainFormattingOption[]>(['bold', 'code']);",
      '',
      '  onFormattingChange(values: readonly string[]): void {',
      '    this.formatting.set(',
      "      values.filter((value): value is PlainFormattingOption => value === 'bold' || value === 'code' || value === 'mentions'),",
      '    );',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="headless-toggle-format-shell">',
      '  <div class="headless-toggle-format-shell__header">',
      '    <span class="headless-toggle-format-shell__eyebrow">Formatting tools</span>',
      '    <p class="headless-toggle-format-shell__body">Make active states obvious without losing native button semantics.</p>',
      '  </div>',
      '  <div',
      '    tngToggleGroup',
      '    class="headless-toggle-format-shell__group"',
      '    ariaLabel="Formatting tools"',
      '    [values]="formatting()"',
      '    (valuesChange)="onFormattingChange($event)"',
      '  >',
      '    <button tngToggle tngToggleValue="bold" class="headless-toggle-format-shell__item">Bold</button>',
      '    <button tngToggle tngToggleValue="code" class="headless-toggle-format-shell__item">Code</button>',
      '    <button tngToggle tngToggleValue="mentions" class="headless-toggle-format-shell__item">Mentions</button>',
      '  </div>',
      '  <p class="headless-toggle-format-shell__summary">Active: {{ formatting().join(", ") }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-toggle-format-shell {',
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
      '.headless-toggle-format-shell__header {',
      '  display: grid;',
      '  gap: 0.35rem;',
      '}',
      '',
      '.headless-toggle-format-shell__eyebrow {',
      '  color: #0f172a;',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.headless-toggle-format-shell__body {',
      '  margin: 0;',
      '  color: #475569;',
      '  font-size: 0.92rem;',
      '  line-height: 1.6;',
      '}',
      '',
      '.headless-toggle-format-shell__group {',
      '  display: inline-flex;',
      '  flex-wrap: wrap;',
      '  gap: 0.55rem;',
      '  padding: 0.55rem;',
      '  border: 1px solid #dbe4ee;',
      '  border-radius: 1rem;',
      '  background: #f8fafc;',
      '}',
      '',
      '.headless-toggle-format-shell__item {',
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
      '.headless-toggle-format-shell__item[data-state="on"] {',
      '  background: #2563eb;',
      '  border-color: #2563eb;',
      '  color: #ffffff;',
      '  box-shadow: 0 10px 20px -16px rgba(37, 99, 235, 0.7);',
      '}',
      '',
      '.headless-toggle-format-shell__item:focus-visible {',
      '  outline: 2px solid rgba(37, 99, 235, 0.32);',
      '  outline-offset: 2px;',
      '}',
      '',
      '.headless-toggle-format-shell__summary {',
      '  margin: 0;',
      '  color: #475569;',
      '  font-size: 0.82rem;',
      '  text-transform: capitalize;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'headless-toggle-styling-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngToggle, TngToggleGroup } from '@tailng-ui/primitives';",
      '',
      "type TailwindFormattingOption = 'bold' | 'code' | 'mentions';",
      '',
      '@Component({',
      "  selector: 'app-headless-toggle-styling-tailwind',",
      '  standalone: true,',
      '  imports: [TngToggle, TngToggleGroup],',
      "  templateUrl: './headless-toggle-styling-tailwind.component.html',",
      '})',
      'export class HeadlessToggleStylingTailwindComponent {',
      "  readonly formatting = signal<readonly TailwindFormattingOption[]>(['mentions']);",
      '',
      '  onFormattingChange(values: readonly string[]): void {',
      '    this.formatting.set(',
      "      values.filter((value): value is TailwindFormattingOption => value === 'bold' || value === 'code' || value === 'mentions'),",
      '    );',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <div class="grid gap-1">',
      '    <span class="text-base font-semibold text-slate-900">Formatting tools</span>',
      '    <p class="m-0 text-sm leading-6 text-slate-600">Use state attributes directly while the shell is expressed with utilities.</p>',
      '  </div>',
      '  <div',
      '    tngToggleGroup',
      '    class="inline-flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-2.5"',
      '    ariaLabel="Formatting tools"',
      '    [values]="formatting()"',
      '    (valuesChange)="onFormattingChange($event)"',
      '  >',
      '    <button tngToggle tngToggleValue="bold" class="inline-flex min-h-9 min-w-[5.4rem] items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition data-[state=on]:border-blue-600 data-[state=on]:bg-blue-600 data-[state=on]:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">Bold</button>',
      '    <button tngToggle tngToggleValue="code" class="inline-flex min-h-9 min-w-[5.4rem] items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition data-[state=on]:border-blue-600 data-[state=on]:bg-blue-600 data-[state=on]:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">Code</button>',
      '    <button tngToggle tngToggleValue="mentions" class="inline-flex min-h-9 min-w-[5.4rem] items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition data-[state=on]:border-blue-600 data-[state=on]:bg-blue-600 data-[state=on]:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">Mentions</button>',
      '  </div>',
      '  <p class="m-0 text-xs text-slate-600">Active: {{ formatting().join(", ") }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected onPlainCssFormattingChange(values: readonly string[]): void {
    this.plainCssFormatting.set(values.filter(isFormattingOption));
  }

  protected onTailwindFormattingChange(values: readonly string[]): void {
    this.tailwindFormatting.set(values.filter(isFormattingOption));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
