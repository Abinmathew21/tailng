import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngBreadcrumb,
  TngBreadcrumbItem,
  TngBreadcrumbLink,
  TngBreadcrumbList,
  TngBreadcrumbSeparator,
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

@Component({
  selector: 'app-headless-breadcrumb-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngBreadcrumb,
    TngBreadcrumbList,
    TngBreadcrumbItem,
    TngBreadcrumbLink,
    TngBreadcrumbSeparator,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './breadcrumb-overview-page.component.html',
  styleUrls: ['./breadcrumb-overview-page.component.css'],
})
export class HeadlessBreadcrumbOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly importCode = [
    'import {',
    '  TngBreadcrumb,',
    '  TngBreadcrumbList,',
    '  TngBreadcrumbItem,',
    '  TngBreadcrumbLink,',
    '  TngBreadcrumbSeparator,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly usageCode = [
    '<nav tngBreadcrumb aria-label="Docs path">',
    '  <ol tngBreadcrumbList>',
    '    <li tngBreadcrumbItem><a tngBreadcrumbLink href="/">Home</a></li>',
    '    <li tngBreadcrumbSeparator>/</li>',
    '    <li tngBreadcrumbItem><a tngBreadcrumbLink href="/docs">Docs</a></li>',
    '    <li tngBreadcrumbSeparator>/</li>',
    '    <li tngBreadcrumbItem><span aria-current="page">Breadcrumb</span></li>',
    '  </ol>',
    '</nav>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-breadcrumb-overview-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import {",
        "  TngBreadcrumb,",
        "  TngBreadcrumbItem,",
        "  TngBreadcrumbLink,",
        "  TngBreadcrumbList,",
        "  TngBreadcrumbSeparator,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-breadcrumb-overview-plain',",
        '  standalone: true,',
        '  imports: [',
        '    TngBreadcrumb,',
        '    TngBreadcrumbList,',
        '    TngBreadcrumbItem,',
        '    TngBreadcrumbLink,',
        '    TngBreadcrumbSeparator,',
        '  ],',
        "  templateUrl: './headless-breadcrumb-overview-plain.component.html',",
        "  styleUrl: './headless-breadcrumb-overview-plain.component.css',",
        '})',
        'export class HeadlessBreadcrumbOverviewPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-breadcrumb-overview-plain.component.html',
      code: [
        '<div class="headless-breadcrumb-shell">',
        '  <nav tngBreadcrumb aria-label="Release path">',
        '    <ol tngBreadcrumbList class="headless-breadcrumb-list">',
        '      <li tngBreadcrumbItem><a tngBreadcrumbLink href="#">Home</a></li>',
        '      <li tngBreadcrumbSeparator>/</li>',
        '      <li tngBreadcrumbItem><a tngBreadcrumbLink href="#">Releases</a></li>',
        '      <li tngBreadcrumbSeparator>/</li>',
        '      <li tngBreadcrumbItem><span aria-current="page">v2.6</span></li>',
        '    </ol>',
        '  </nav>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-breadcrumb-overview-plain.component.css',
      code: [
        '.headless-breadcrumb-shell {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
        '.headless-breadcrumb-list {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  align-items: center;',
        '  gap: 0.45rem;',
        '  margin: 0;',
        '  padding: 0;',
        '  list-style: none;',
        '}',
        '',
        ".headless-breadcrumb-list [data-slot='breadcrumb-link'] {",
        '  color: var(--tng-semantic-accent-brand);',
        '  text-decoration: none;',
        '}',
        '',
        ".headless-breadcrumb-list [aria-current='page'] {",
        '  color: var(--tng-semantic-foreground-primary);',
        '  font-weight: 600;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-breadcrumb-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import {",
        "  TngBreadcrumb,",
        "  TngBreadcrumbItem,",
        "  TngBreadcrumbLink,",
        "  TngBreadcrumbList,",
        "  TngBreadcrumbSeparator,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-breadcrumb-overview-tailwind',",
        '  standalone: true,',
        '  imports: [',
        '    TngBreadcrumb,',
        '    TngBreadcrumbList,',
        '    TngBreadcrumbItem,',
        '    TngBreadcrumbLink,',
        '    TngBreadcrumbSeparator,',
        '  ],',
        "  templateUrl: './headless-breadcrumb-overview-tailwind.component.html',",
        "  styleUrl: './headless-breadcrumb-overview-tailwind.component.css',",
        '})',
        'export class HeadlessBreadcrumbOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-breadcrumb-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <nav tngBreadcrumb aria-label="Tailwind docs path">',
        '    <ol tngBreadcrumbList class="flex flex-wrap items-center gap-[0.45rem] m-0 p-0 list-none">',
        '      <li tngBreadcrumbItem><a tngBreadcrumbLink class="text-sky-700 no-underline hover:underline dark:text-sky-300" href="#">Docs</a></li>',
        '      <li tngBreadcrumbSeparator class="text-slate-400">›</li>',
        '      <li tngBreadcrumbItem><a tngBreadcrumbLink class="text-sky-700 no-underline hover:underline dark:text-sky-300" href="#">Navigation</a></li>',
        '      <li tngBreadcrumbSeparator class="text-slate-400">›</li>',
        '      <li tngBreadcrumbItem><span class="font-semibold text-slate-900 dark:text-slate-100" aria-current="page">Breadcrumb</span></li>',
        '    </ol>',
        '  </nav>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-breadcrumb-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
