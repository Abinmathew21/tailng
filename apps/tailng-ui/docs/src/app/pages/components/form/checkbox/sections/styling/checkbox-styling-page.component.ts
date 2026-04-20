import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCheckboxComponent } from '@tailng-ui/components';
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
  selector: 'app-checkbox-styling-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngCheckboxComponent,
  ],
  templateUrl: './checkbox-styling-page.component.html',
  styleUrl: './checkbox-styling-page.component.css',
})
export class CheckboxStylingPageComponent implements OnDestroy {
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

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-checkbox-styling-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngCheckboxComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-checkbox-styling-plain',",
      '  standalone: true,',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './doc-cmp-checkbox-styling-plain.component.html',",
      "  styleUrl: './doc-cmp-checkbox-styling-plain.component.css',",
      '})',
      'export class DocCmpCheckboxStylingPlainComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-checkbox-styling-card">',
      '  <tng-checkbox [checked]="true">',
      '    Release checklist complete',
      '  </tng-checkbox>',
      '  <tng-checkbox [indeterminate]="true">',
      '    Deployment approvals pending',
      '  </tng-checkbox>',
      '  <div class="doc-cmp-checkbox-styling-item--danger">',
      '    <tng-checkbox',
      '      [invalid]="true"',
      '    >',
      '      Security review required',
      '    </tng-checkbox>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-checkbox-styling-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 32rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: rgba(255, 255, 255, 0.92);',
      '}',
      '',
      '.doc-cmp-checkbox-styling-card > tng-checkbox {',
      '  display: block;',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.22);',
      '  --tng-semantic-foreground-primary: #0f172a;',
      '}',
      '',
      '.doc-cmp-checkbox-styling-item--danger tng-checkbox {',
      '  --tng-semantic-accent-danger: #dc2626;',
      '  --tng-semantic-foreground-primary: #991b1b;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-checkbox-styling-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngCheckboxComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-checkbox-styling-tailwind',",
      '  standalone: true,',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './doc-cmp-checkbox-styling-tailwind.component.html',",
      '})',
      'export class DocCmpCheckboxStylingTailwindComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section',
      '  class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-slate-300 bg-white/90 p-4 text-slate-900 shadow-sm [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)] dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"',
      '>',
      '  <tng-checkbox [checked]="true">',
      '    Release checklist complete',
      '  </tng-checkbox>',
      '  <tng-checkbox [indeterminate]="true">',
      '    Deployment approvals pending',
      '  </tng-checkbox>',
      '  <div class="text-rose-800 [--tng-semantic-accent-danger:#dc2626] dark:text-rose-200">',
      '    <tng-checkbox',
      '      [invalid]="true"',
      '    >',
      '      Security review required',
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
