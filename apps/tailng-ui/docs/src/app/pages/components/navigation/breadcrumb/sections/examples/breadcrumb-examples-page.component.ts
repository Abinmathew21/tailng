import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';
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
  selector: 'app-breadcrumb-examples-page',
  imports: [
    TngBreadcrumbComponent,
    TngBreadcrumbItemComponent,
    TngBreadcrumb,
    TngBreadcrumbList,
    TngBreadcrumbItem,
    TngBreadcrumbLink,
    TngBreadcrumbSeparator,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './breadcrumb-examples-page.component.html',
  styleUrls: ['./breadcrumb-examples-page.component.css'],
})
export class BreadcrumbExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly collapseHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'breadcrumb-example-collapse-headless.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngBreadcrumb, TngBreadcrumbItem, TngBreadcrumbLink, TngBreadcrumbList, TngBreadcrumbSeparator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        '  imports: [TngBreadcrumb, TngBreadcrumbList, TngBreadcrumbItem, TngBreadcrumbLink, TngBreadcrumbSeparator],',
        "  templateUrl: './breadcrumb-example-collapse-headless.component.html',",
        "  styleUrl: './breadcrumb-example-collapse-headless.component.css',",
        '})',
        'export class BreadcrumbExampleCollapseHeadlessComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'breadcrumb-example-collapse-headless.component.html',
      code: [
        '<nav tngBreadcrumb aria-label="Catalog path" class="example-headless-nav">',
        '  <ol tngBreadcrumbList class="example-headless-list">',
        '    <li tngBreadcrumbItem><a tngBreadcrumbLink href="#">Home</a></li>',
        '    <li tngBreadcrumbSeparator>/</li>',
        '    <li tngBreadcrumbItem><span aria-hidden="true">…</span></li>',
        '    <li tngBreadcrumbSeparator>/</li>',
        '    <li tngBreadcrumbItem><a tngBreadcrumbLink href="#">Shoes</a></li>',
        '    <li tngBreadcrumbSeparator>/</li>',
        '    <li tngBreadcrumbItem><span aria-current="page">Running</span></li>',
        '  </ol>',
        '</nav>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'breadcrumb-example-collapse-headless.component.css',
      code: [
        '.example-headless-nav {',
        '  width: fit-content;',
        '  max-width: 100%;',
        '}',
        '',
        '.example-headless-list {',
        '  display: flex;',
        '  align-items: center;',
        '  gap: 0.5rem;',
        '  list-style: none;',
        '  margin: 0;',
        '  padding: 0;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly collapsePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'breadcrumb-example-collapse-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        '  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],',
        "  templateUrl: './breadcrumb-example-collapse-plain.component.html',",
        "  styleUrl: './breadcrumb-example-collapse-plain.component.css',",
        '})',
        'export class BreadcrumbExampleCollapsePlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'breadcrumb-example-collapse-plain.component.html',
      code: [
        '<div class="example-shell">',
        '  <tng-breadcrumb [maxItems]="4" [itemsBeforeCollapse]="1" [itemsAfterCollapse]="2">',
        '    <tng-breadcrumb-item href="#">Home</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#">Catalog</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#">Products</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#">Shoes</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item [current]="true">Running</tng-breadcrumb-item>',
        '  </tng-breadcrumb>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'breadcrumb-example-collapse-plain.component.css',
      code: [
        '.example-shell {',
        '  border: 1px solid var(--docs-border-subtle);',
        '  border-radius: 16px;',
        '  padding: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly collapseTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'breadcrumb-example-collapse-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        '  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],',
        "  templateUrl: './breadcrumb-example-collapse-tailwind.component.html',",
        "  styleUrl: './breadcrumb-example-collapse-tailwind.component.css',",
        '})',
        'export class BreadcrumbExampleCollapseTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'breadcrumb-example-collapse-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-breadcrumb [maxItems]="4" separator="›">',
        '    <tng-breadcrumb-item href="#">Home</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#">Catalog</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#">Products</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#">Shoes</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item [current]="true">Running</tng-breadcrumb-item>',
        '  </tng-breadcrumb>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'breadcrumb-example-collapse-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly currentHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'breadcrumb-example-current-headless.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngBreadcrumb, TngBreadcrumbItem, TngBreadcrumbLink, TngBreadcrumbList, TngBreadcrumbSeparator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        '  imports: [TngBreadcrumb, TngBreadcrumbList, TngBreadcrumbItem, TngBreadcrumbLink, TngBreadcrumbSeparator],',
        "  templateUrl: './breadcrumb-example-current-headless.component.html',",
        "  styleUrl: './breadcrumb-example-current-headless.component.css',",
        '})',
        'export class BreadcrumbExampleCurrentHeadlessComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'breadcrumb-example-current-headless.component.html',
      code: [
        '<nav tngBreadcrumb aria-label="Headless current link path">',
        '  <ol tngBreadcrumbList>',
        '    <li tngBreadcrumbItem><a tngBreadcrumbLink href="#">Home</a></li>',
        '    <li tngBreadcrumbSeparator>/</li>',
        '    <li tngBreadcrumbItem><a tngBreadcrumbLink aria-current="page" href="#">Docs</a></li>',
        '  </ol>',
        '</nav>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'breadcrumb-example-current-headless.component.css',
      code: [
        '.example-headless-nav {',
        '  width: fit-content;',
        '  max-width: 100%;',
        '}',
        '',
        '.example-headless-list {',
        '  display: flex;',
        '  align-items: center;',
        '  gap: 0.5rem;',
        '  list-style: none;',
        '  margin: 0;',
        '  padding: 0;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly currentPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'breadcrumb-example-current-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        '  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],',
        "  templateUrl: './breadcrumb-example-current-plain.component.html',",
        "  styleUrl: './breadcrumb-example-current-plain.component.css',",
        '})',
        'export class BreadcrumbExampleCurrentPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'breadcrumb-example-current-plain.component.html',
      code: [
        '<div class="example-shell">',
        '  <tng-breadcrumb>',
        '    <tng-breadcrumb-item href="#">Home</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#" [disabled]="true">Restricted</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#" [current]="true" [currentAsLink]="true">Docs</tng-breadcrumb-item>',
        '  </tng-breadcrumb>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'breadcrumb-example-current-plain.component.css',
      code: [
        '.example-shell {',
        '  border: 1px solid var(--docs-border-subtle);',
        '  border-radius: 16px;',
        '  padding: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly currentTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'breadcrumb-example-current-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        '  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],',
        "  templateUrl: './breadcrumb-example-current-tailwind.component.html',",
        "  styleUrl: './breadcrumb-example-current-tailwind.component.css',",
        '})',
        'export class BreadcrumbExampleCurrentTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'breadcrumb-example-current-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-breadcrumb>',
        '    <tng-breadcrumb-item href="#">Workspace</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item href="#" [disabled]="true">Restricted</tng-breadcrumb-item>',
        '    <tng-breadcrumb-item [current]="true">Billing</tng-breadcrumb-item>',
        '  </tng-breadcrumb>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'breadcrumb-example-current-tailwind.component.css',
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
