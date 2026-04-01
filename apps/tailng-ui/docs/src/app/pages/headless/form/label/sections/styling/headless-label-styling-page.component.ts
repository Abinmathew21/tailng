import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngLabel } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../label.util';

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
  selector: 'app-headless-label-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngLabel,
  ],
  templateUrl: './headless-label-styling-page.component.html',
  styleUrl: './headless-label-styling-page.component.css',
})
export class HeadlessLabelStylingPageComponent implements OnDestroy {
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

  protected readonly stateSelectorSnippet = [
    'label[tngLabel][data-slot="label"] {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 0.35rem;',
    '}',
    '',
    'label[tngLabel][data-required]::after {',
    '  content: "*";',
    '  color: var(--tng-semantic-accent-danger, #dc2626);',
    '}',
    '',
    'label[tngLabel][data-disabled] {',
    '  color: var(--tng-semantic-foreground-secondary, #64748b);',
    '  opacity: 0.72;',
    '}',
    '',
  ].join('\n');

  protected readonly shellSnippet = [
    '.label-field-card {',
    '  display: grid;',
    '  gap: 1rem;',
    '  inline-size: min(100%, 34rem);',
    '  margin-inline: auto;',
    '  padding: 1rem;',
    '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
    '  border-radius: 1rem;',
    '  background: var(--tng-semantic-background-base, #ffffff);',
    '}',
    '',
    '.label-field-card__field {',
    '  display: grid;',
    '  gap: 0.55rem;',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'headless-label-styling-plain',
    [
      "import { Component } from '@angular/core';",
      "import { TngLabel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-label-styling-plain',",
      '  imports: [TngLabel],',
      "  templateUrl: './headless-label-styling-plain.component.html',",
      "  styleUrl: './headless-label-styling-plain.component.css',",
      '})',
      'export class HeadlessLabelStylingPlainComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="headless-label-style-card">',
      '  <div class="headless-label-style-card__field">',
      '    <label tngLabel [required]="true" for="headless-label-style-owner">',
      '      Release owner',
      '    </label>',
      '    <input id="headless-label-style-owner" class="headless-label-style-card__input" type="text" />',
      '  </div>',
      '  <div class="headless-label-style-card__field">',
      '    <label tngLabel [disabled]="true" for="headless-label-style-archive">',
      '      Archived environment',
      '    </label>',
      '    <input id="headless-label-style-archive" class="headless-label-style-card__input" type="text" disabled />',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.headless-label-style-card {',
      '  display: grid;',
      '  gap: 1rem;',
      '  inline-size: min(100%, 34rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '}',
      '',
      '.headless-label-style-card__field {',
      '  display: grid;',
      '  gap: 0.55rem;',
      '}',
      '',
      '.headless-label-style-card [data-slot="label"] {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.35rem;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-size: 0.9rem;',
      '  font-weight: 600;',
      '}',
      '',
      '.headless-label-style-card [data-slot="label"][data-required]::after {',
      '  content: "*";',
      '  color: var(--tng-semantic-accent-danger, #dc2626);',
      '}',
      '',
      '.headless-label-style-card [data-slot="label"][data-disabled] {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '}',
      '',
      '.headless-label-style-card__input {',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  min-block-size: 2.75rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.8rem;',
      '  padding: 0.65rem 0.8rem;',
      '  font: inherit;',
      '}',
      '',
      '.headless-label-style-card__input::placeholder {',
      '  color: #94a3b8;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-label-styling-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngLabel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-label-styling-tailwind',",
      '  imports: [TngLabel],',
      "  templateUrl: './headless-label-styling-tailwind.component.html',",
      '})',
      'export class HeadlessLabelStylingTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[34rem] gap-4 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <div class="grid gap-2">',
      '    <label',
      '      tngLabel',
      '      [required]="true"',
      '      for="headless-label-tailwind-owner"',
      "      class=\"inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 [&[data-required]]:after:text-rose-600 [&[data-required]]:after:content-['*']\"",
      '    >',
      '      Release owner',
      '    </label>',
      '    <input',
      '      id="headless-label-tailwind-owner"',
      '      type="text"',
      '      class="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"',
      '    />',
      '  </div>',
      '  <div class="grid gap-2">',
      '    <label',
      '      tngLabel',
      '      [disabled]="true"',
      '      for="headless-label-tailwind-archive"',
      '      class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500"',
      '    >',
      '      Archived environment',
      '    </label>',
      '    <input',
      '      id="headless-label-tailwind-archive"',
      '      type="text"',
      '      disabled',
      '      class="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"',
      '    />',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
