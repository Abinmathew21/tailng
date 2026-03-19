import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngBreadcrumbComponent,
  TngBreadcrumbItemComponent,
  TngCodeBlockComponent,
} from '@tailng-ui/components';
import {
  TngBreadcrumb,
  TngBreadcrumbItem,
  TngBreadcrumbLink,
  TngBreadcrumbList,
  TngBreadcrumbSeparator,
} from '@tailng-ui/primitives';
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
export class BreadcrumbOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

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

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'breadcrumb-overview-headless.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngBreadcrumb, TngBreadcrumbItem, TngBreadcrumbLink, TngBreadcrumbList, TngBreadcrumbSeparator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        '  imports: [TngBreadcrumb, TngBreadcrumbList, TngBreadcrumbItem, TngBreadcrumbLink, TngBreadcrumbSeparator],',
        "  templateUrl: './breadcrumb-overview-headless.component.html',",
        "  styleUrl: './breadcrumb-overview-headless.component.css',",
        '})',
        'export class BreadcrumbOverviewHeadlessComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'breadcrumb-overview-headless.component.html',
      code: [
        '<nav tngBreadcrumb aria-label="Headless breadcrumb path" class="demo-headless-nav">',
        '  <ol tngBreadcrumbList class="demo-headless-list">',
        '    <li tngBreadcrumbItem><a tngBreadcrumbLink href="/">Home</a></li>',
        '    <li tngBreadcrumbSeparator>/</li>',
        '    <li tngBreadcrumbItem><a tngBreadcrumbLink href="/docs">Docs</a></li>',
        '    <li tngBreadcrumbSeparator>/</li>',
        '    <li tngBreadcrumbItem><span aria-current="page">Breadcrumb</span></li>',
        '  </ol>',
        '</nav>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'breadcrumb-overview-headless.component.css',
      code: [
        '.demo-headless-nav {',
        '  width: fit-content;',
        '  max-width: 100%;',
        '}',
        '',
        '.demo-headless-list {',
        '  display: flex;',
        '  align-items: center;',
        '  gap: 0.5rem;',
        '  list-style: none;',
        '  margin: 0;',
        '  padding: 0;',
        '}',
        '',
        ".demo-headless-list [data-slot='breadcrumb-separator'] {",
        '  opacity: 0.72;',
        '}',
      ].join('\n'),
    },
  ]);

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

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
