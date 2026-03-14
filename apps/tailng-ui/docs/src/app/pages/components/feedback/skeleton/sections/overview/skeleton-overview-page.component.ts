import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngSkeletonComponent } from '@tailng-ui/components';
import { TngSkeleton as TngSkeletonPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-skeleton-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSkeletonPrimitive,
    TngSkeletonComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './skeleton-overview-page.component.html',
  styleUrl: './skeleton-overview-page.component.css',
})
export class SkeletonOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly primitiveImportCode = ["import { TngSkeleton } from '@tailng-ui/primitives';", ''].join('\n');
  protected readonly componentImportCode = ["import { TngSkeletonComponent } from '@tailng-ui/components';", ''].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-overview-headless.component.ts',
      code: this.primitiveImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-overview-headless.component.html',
      code: [
        '<section class="skeleton-stack">',
        '  <div tngSkeleton class="skeleton-line skeleton-line--title"></div>',
        '  <div tngSkeleton class="skeleton-line skeleton-line--body"></div>',
        '  <div tngSkeleton class="skeleton-line skeleton-line--body-short"></div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-overview-headless.component.css',
      code: [
        '.skeleton-line {',
        '  height: 0.9rem;',
        '  width: 100%;',
        '}',
        '',
        '.skeleton-line--title {',
        '  height: 1.1rem;',
        '  width: 58%;',
        '}',
        '',
        '.skeleton-line--body-short {',
        '  width: 72%;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-overview-plain-css.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-overview-plain-css.component.html',
      code: [
        '<section class="skeleton-stack">',
        '  <tng-skeleton width="58%" height="1.1rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="0.9rem"></tng-skeleton>',
        '  <tng-skeleton width="72%" height="0.9rem"></tng-skeleton>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-overview-plain-css.component.css',
      code: [
        '.skeleton-stack {',
        '  display: grid;',
        '  gap: 0.6rem;',
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
      title: 'skeleton-overview-tailwind.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-overview-tailwind.component.html',
      code: [
        '<section class="grid gap-2 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-skeleton width="58%" height="1.1rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="0.9rem"></tng-skeleton>',
        '  <tng-skeleton width="72%" height="0.9rem"></tng-skeleton>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-overview-tailwind.component.css',
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
