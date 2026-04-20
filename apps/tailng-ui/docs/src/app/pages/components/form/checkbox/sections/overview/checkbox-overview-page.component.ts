import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCheckboxComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../checkbox.util';

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
  selector: 'app-checkbox-overview-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngCheckboxComponent,
    TngCodeBlockComponent,
  ],
  templateUrl: './checkbox-overview-page.component.html',
  styleUrl: './checkbox-overview-page.component.css',
})
export class CheckboxOverviewPageComponent implements OnDestroy {
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

  protected readonly componentImportCode =
    "import { TngCheckboxComponent } from '@tailng-ui/components';\n";

  protected readonly componentUsageCode = [
    '<tng-checkbox [checked]="releaseReady" (checkedChange)="releaseReady = $event">',
    '  Release checklist complete',
    '</tng-checkbox>',
    '',
  ].join('\n');

  protected readonly triStateUsageCode = [
    '<tng-checkbox [indeterminate]="true">',
    '  Deployment approvals pending',
    '</tng-checkbox>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-checkbox-overview-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngCheckboxComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-checkbox-overview-plain',",
      '  standalone: true,',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './doc-cmp-checkbox-overview-plain.component.html',",
      "  styleUrl: './doc-cmp-checkbox-overview-plain.component.css',",
      '})',
      'export class DocCmpCheckboxOverviewPlainComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-checkbox-overview-card">',
      '  <tng-checkbox [checked]="true">',
      '    Email notifications',
      '  </tng-checkbox>',
      '  <tng-checkbox [indeterminate]="true">',
      '    Weekly digest (mixed)',
      '  </tng-checkbox>',
      '  <div class="doc-cmp-checkbox-overview-item--muted">',
      '    <tng-checkbox',
      '      [readonly]="true"',
      '      [checked]="true"',
      '    >',
      '      Readonly legal acknowledgement',
      '    </tng-checkbox>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-checkbox-overview-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: rgba(255, 255, 255, 0.92);',
      '}',
      '',
      '.doc-cmp-checkbox-overview-card > tng-checkbox {',
      '  display: block;',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.22);',
      '}',
      '',
      '.doc-cmp-checkbox-overview-item--muted tng-checkbox {',
      '  --tng-semantic-foreground-primary: #64748b;',
      '  --tng-semantic-foreground-secondary: #64748b;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-checkbox-overview-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngCheckboxComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-checkbox-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './doc-cmp-checkbox-overview-tailwind.component.html',",
      '})',
      'export class DocCmpCheckboxOverviewTailwindComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section',
      '  class="grid w-full max-w-[30rem] gap-3 rounded-2xl border border-slate-300 bg-white/90 p-4 text-slate-900 shadow-sm [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)] dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"',
      '>',
      '  <tng-checkbox [checked]="true">',
      '    Email notifications',
      '  </tng-checkbox>',
      '  <tng-checkbox [indeterminate]="true">',
      '    Weekly digest (mixed)',
      '  </tng-checkbox>',
      '  <div class="text-slate-500 dark:text-slate-400">',
      '    <tng-checkbox',
      '      [readonly]="true"',
      '      [checked]="true"',
      '    >',
      '      Readonly legal acknowledgement',
      '    </tng-checkbox>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
