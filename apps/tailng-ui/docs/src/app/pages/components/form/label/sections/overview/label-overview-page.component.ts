import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngLabelComponent } from '@tailng-ui/components';
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
  selector: 'app-label-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngLabelComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './label-overview-page.component.html',
  styleUrl: './label-overview-page.component.css',
})
export class LabelOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly componentImportCode =
    "import { TngLabelComponent } from '@tailng-ui/components';\n";

  protected readonly plainCssCodeTabs = createCodeTabs(
    'doc-cmp-label-overview-plain',
    [
      "import { Component } from '@angular/core';",
      "import { TngLabelComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-label-overview-plain',",
      '  standalone: true,',
      '  imports: [TngLabelComponent],',
      "  templateUrl: './doc-cmp-label-overview-plain.component.html',",
      "  styleUrl: './doc-cmp-label-overview-plain.component.css',",
      '})',
      'export class DocCmpLabelOverviewPlainComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="doc-cmp-label-overview-card">',
      '  <div class="doc-cmp-label-overview-card__field">',
      '    <tng-label forId="doc-cmp-label-overview-workspace" [required]="true">',
      '      Workspace name',
      '    </tng-label>',
      '    <input',
      '      id="doc-cmp-label-overview-workspace"',
      '      class="doc-cmp-label-overview-card__input"',
      '      type="text"',
      '      placeholder="North Star"',
      '      aria-required="true"',
      '    />',
      '  </div>',
      '  <div class="doc-cmp-label-overview-card__row">',
      '    <input id="doc-cmp-label-overview-alerts" type="checkbox" class="doc-cmp-label-overview-card__checkbox" />',
      '    <tng-label forId="doc-cmp-label-overview-alerts">Send release alerts</tng-label>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-label-overview-card {',
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
      '.doc-cmp-label-overview-card__field {',
      '  display: grid;',
      '  gap: 0.55rem;',
      '}',
      '',
      '.doc-cmp-label-overview-card__row {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.75rem;',
      '}',
      '',
      '.doc-cmp-label-overview-card__input {',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  min-block-size: 2.75rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.8rem;',
      '  padding: 0.65rem 0.8rem;',
      '  font: inherit;',
      '}',
      '',
      '.doc-cmp-label-overview-card__input::placeholder {',
      '  color: #94a3b8;',
      '}',
      '',
      '.doc-cmp-label-overview-card__checkbox {',
      '  accent-color: #2563eb;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'doc-cmp-label-overview-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngLabelComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-label-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngLabelComponent],',
      "  templateUrl: './doc-cmp-label-overview-tailwind.component.html',",
      '})',
      'export class DocCmpLabelOverviewTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[34rem] gap-4 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [--tng-semantic-accent-danger:#dc2626] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#64748b] [color-scheme:light]">',
      '  <div class="grid gap-2">',
      '    <tng-label forId="doc-cmp-label-overview-tailwind-workspace" [required]="true">',
      '      Workspace name',
      '    </tng-label>',
      '    <input',
      '      id="doc-cmp-label-overview-tailwind-workspace"',
      '      type="text"',
      '      placeholder="North Star"',
      '      aria-required="true"',
      '      class="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"',
      '    />',
      '  </div>',
      '  <div class="inline-flex items-center gap-3">',
      '    <input id="doc-cmp-label-overview-tailwind-alerts" type="checkbox" class="h-4 w-4 accent-blue-600" />',
      '    <tng-label forId="doc-cmp-label-overview-tailwind-alerts">Send release alerts</tng-label>',
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
