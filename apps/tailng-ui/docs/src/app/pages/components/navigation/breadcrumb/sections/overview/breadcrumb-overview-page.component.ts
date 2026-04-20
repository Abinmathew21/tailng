import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import {
  TngBreadcrumbComponent,
  TngBreadcrumbItemComponent,
  TngCodeBlockComponent,
} from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-breadcrumb-overview-page',
  imports: [
    TngBreadcrumbComponent,
    TngBreadcrumbItemComponent,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './breadcrumb-overview-page.component.html',
  styleUrls: ['./breadcrumb-overview-page.component.css'],
})
export class BreadcrumbOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly primitiveImportCode = [
    'import {',
    '  TngBreadcrumb,',
    '  TngBreadcrumbList,',
    '  TngBreadcrumbItem,',
    '  TngBreadcrumbLink,',
    '  TngBreadcrumbSeparator,',
    "} from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';",
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'breadcrumb-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-breadcrumb-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],',
        "  templateUrl: './breadcrumb-overview-plain-css.component.html',",
        "  styleUrl: './breadcrumb-overview-plain-css.component.css',",
        '})',
        'export class BreadcrumbOverviewPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'breadcrumb-overview-plain-css.component.html',
      code: [
        '<div class="demo-shell">',
        '  <tng-breadcrumb ariaLabel="Release path">',
        '    <tng-breadcrumb-item href="#">Home</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#">Releases</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item [current]="true">v2.6</tng-breadcrumb-item>',
        '  </tng-breadcrumb>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'breadcrumb-overview-plain-css.component.css',
      code: [
        '.demo-shell {',
        '  border: 1px solid var(--docs-border-subtle);',
        '  border-radius: 16px;',
        '  padding: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'breadcrumb-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-breadcrumb-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],',
        "  templateUrl: './breadcrumb-overview-tailwind.component.html',",
        "  styleUrl: './breadcrumb-overview-tailwind.component.css',",
        '})',
        'export class BreadcrumbOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'breadcrumb-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-breadcrumb ariaLabel="Tailwind breadcrumb" separator="›">',
        '    <tng-breadcrumb-item href="#">Docs</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#">Navigation</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item [current]="true">Breadcrumb</tng-breadcrumb-item>',
        '  </tng-breadcrumb>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'breadcrumb-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
