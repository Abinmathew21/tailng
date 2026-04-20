import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngInputComponent, TngLabelComponent } from '@tailng-ui/components';
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
    TngInputComponent,
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
    "import { TngInputComponent, TngLabelComponent } from '@tailng-ui/components';\n";

  protected readonly plainCssCodeTabs = createCodeTabs(
    'doc-cmp-label-overview-plain',
    [
      "import { Component } from '@angular/core';",
      "import { TngInputComponent, TngLabelComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-label-overview-plain',",
      '  standalone: true,',
      '  imports: [TngInputComponent, TngLabelComponent],',
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
      '    <tng-input [id]="\'doc-cmp-label-overview-workspace\'" type="text" placeholder="North Star" [ariaRequired]="true"></tng-input>',
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
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  color: var(--tng-semantic-foreground-primary);',
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
      '.doc-cmp-label-overview-card tng-input {',
      '  inline-size: 100%;',
      '}',
      '',
      '.doc-cmp-label-overview-card__checkbox {',
      '  accent-color: var(--tng-semantic-accent-brand);',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'doc-cmp-label-overview-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngInputComponent, TngLabelComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-label-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngInputComponent, TngLabelComponent],',
      "  templateUrl: './doc-cmp-label-overview-tailwind.component.html',",
      '})',
      'export class DocCmpLabelOverviewTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[34rem] gap-4 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
      '  <div class="grid gap-2">',
      '    <tng-label forId="doc-cmp-label-overview-tailwind-workspace" [required]="true">',
      '      Workspace name',
      '    </tng-label>',
      '    <tng-input [id]="\'doc-cmp-label-overview-tailwind-workspace\'" type="text" placeholder="North Star" [ariaRequired]="true"></tng-input>',
      '  </div>',
      '  <div class="inline-flex items-center gap-3">',
      '    <input id="doc-cmp-label-overview-tailwind-alerts" type="checkbox" class="h-4 w-4 accent-blue-600" />',
      '    <tng-label forId="doc-cmp-label-overview-tailwind-alerts">Send release alerts</tng-label>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    '/* tng-input and tng-label use default component styles; optional utilities stay on wrappers. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
