import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngSeparatorComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-separator-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSeparatorComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './separator-overview-page.component.html',
  styleUrl: './separator-overview-page.component.css',
})
export class SeparatorOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode =
    "import { TngSeparatorComponent } from '@tailng-ui/components';\n";

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'separator-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSeparatorComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-separator-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngSeparatorComponent],',
        "  templateUrl: './separator-overview-plain-css.component.html',",
        "  styleUrl: './separator-overview-plain-css.component.css',",
        '})',
        'export class SeparatorOverviewPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'separator-overview-plain-css.component.html',
      code: [
        '<div class="separator-preview-shell separator-preview-shell--plain">',
        '  <div class="separator-row">',
        '    <span>Overview</span>',
        '    <tng-separator orientation="vertical" class="separator-preview-vertical"></tng-separator>',
        '    <span>Incidents</span>',
        '    <tng-separator orientation="vertical" class="separator-preview-vertical"></tng-separator>',
        '    <span>Alerts</span>',
        '  </div>',
        '  <tng-separator class="separator-preview-horizontal"></tng-separator>',
        '  <p class="separator-preview-text">Apply wrapper-level spacing and let the component provide the line contract.</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'separator-overview-plain-css.component.css',
      code: [
        '.separator-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'separator-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSeparatorComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-separator-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngSeparatorComponent],',
        "  templateUrl: './separator-overview-tailwind.component.html',",
        "  styleUrl: './separator-overview-tailwind.component.css',",
        '})',
        'export class SeparatorOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'separator-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">',
        '    <span>Deployments</span>',
        '    <tng-separator orientation="vertical" class="self-stretch min-h-5"></tng-separator>',
        '    <span>Environments</span>',
        '    <tng-separator orientation="vertical" class="self-stretch min-h-5"></tng-separator>',
        '    <span>Audit trail</span>',
        '  </div>',
        '  <tng-separator class="my-3"></tng-separator>',
        '  <p class="m-0 text-sm text-slate-600 dark:text-slate-300">Tailwind utilities handle shell spacing while separator remains the same component.</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'separator-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
