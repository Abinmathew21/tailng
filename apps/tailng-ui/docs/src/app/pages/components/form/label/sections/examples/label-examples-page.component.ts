import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngLabelComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
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
  selector: 'app-label-examples-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngLabelComponent],
  templateUrl: './label-examples-page.component.html',
  styleUrl: './label-examples-page.component.css',
})
export class LabelExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly plainCssCodeTabs = createCodeTabs(
    'doc-cmp-label-examples-plain',
    [
      "import { Component } from '@angular/core';",
      "import { TngLabelComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-label-examples-plain',",
      '  standalone: true,',
      '  imports: [TngLabelComponent],',
      "  templateUrl: './doc-cmp-label-examples-plain.component.html',",
      "  styleUrl: './doc-cmp-label-examples-plain.component.css',",
      '})',
      'export class DocCmpLabelExamplesPlainComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="doc-cmp-label-examples-card">',
      '  <div class="doc-cmp-label-examples-card__field">',
      '    <tng-label forId="doc-cmp-label-examples-project" [required]="true">Project name</tng-label>',
      '    <input id="doc-cmp-label-examples-project" class="doc-cmp-label-examples-card__input" type="text" aria-required="true" placeholder="Nova" />',
      '  </div>',
      '  <div class="doc-cmp-label-examples-card__row">',
      '    <input id="doc-cmp-label-examples-alerts" type="checkbox" class="doc-cmp-label-examples-card__checkbox" />',
      '    <tng-label forId="doc-cmp-label-examples-alerts">Send release alerts</tng-label>',
      '  </div>',
      '  <div class="doc-cmp-label-examples-card__field">',
      '    <tng-label class="doc-cmp-label-examples-card__meta-label" forId="doc-cmp-label-examples-archive" [disabled]="true">Archive note</tng-label>',
      '    <input id="doc-cmp-label-examples-archive" class="doc-cmp-label-examples-card__input" type="text" disabled placeholder="Readonly metadata" />',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-label-examples-card {',
      '  display: grid;',
      '  gap: 1rem;',
      '  inline-size: min(100%, 34rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '  --tng-semantic-accent-danger: #dc2626;',
      '  --tng-semantic-foreground-primary: #0f172a;',
      '  --tng-semantic-foreground-secondary: #64748b;',
      '}',
      '',
      '.doc-cmp-label-examples-card__field {',
      '  display: grid;',
      '  gap: 0.55rem;',
      '}',
      '',
      '.doc-cmp-label-examples-card__row {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.75rem;',
      '}',
      '',
      '.doc-cmp-label-examples-card__input {',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  min-block-size: 2.75rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.8rem;',
      '  padding: 0.65rem 0.8rem;',
      '  font: inherit;',
      '}',
      '',
      '.doc-cmp-label-examples-card__input::placeholder {',
      '  color: #94a3b8;',
      '}',
      '',
      '.doc-cmp-label-examples-card__checkbox {',
      '  accent-color: #2563eb;',
      '}',
      '',
      '.doc-cmp-label-examples-card__meta-label {',
      '  --tng-semantic-foreground-primary: #64748b;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'doc-cmp-label-examples-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngLabelComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-label-examples-tailwind',",
      '  standalone: true,',
      '  imports: [TngLabelComponent],',
      "  templateUrl: './doc-cmp-label-examples-tailwind.component.html',",
      '})',
      'export class DocCmpLabelExamplesTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[34rem] gap-4 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [--tng-semantic-accent-danger:#dc2626] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#64748b] [color-scheme:light]">',
      '  <div class="grid gap-2">',
      '    <tng-label forId="doc-cmp-label-examples-tailwind-project" [required]="true">Project name</tng-label>',
      '    <input',
      '      id="doc-cmp-label-examples-tailwind-project"',
      '      type="text"',
      '      aria-required="true"',
      '      placeholder="Nova"',
      '      class="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"',
      '    />',
      '  </div>',
      '  <div class="inline-flex items-center gap-3">',
      '    <input id="doc-cmp-label-examples-tailwind-alerts" type="checkbox" class="h-4 w-4 accent-blue-600" />',
      '    <tng-label forId="doc-cmp-label-examples-tailwind-alerts">Send release alerts</tng-label>',
      '  </div>',
      '  <div class="grid gap-2">',
      '    <tng-label class="block [--tng-semantic-foreground-primary:#64748b]" forId="doc-cmp-label-examples-tailwind-archive" [disabled]="true">Archive note</tng-label>',
      '    <input',
      '      id="doc-cmp-label-examples-tailwind-archive"',
      '      type="text"',
      '      disabled',
      '      placeholder="Readonly metadata"',
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
