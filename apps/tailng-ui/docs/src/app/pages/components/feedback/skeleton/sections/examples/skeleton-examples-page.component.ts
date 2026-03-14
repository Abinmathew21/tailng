import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngSkeletonComponent } from '@tailng-ui/components';
import { TngSkeleton as TngSkeletonPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-skeleton-examples-page',
  imports: [
    TngSkeletonPrimitive,
    TngSkeletonComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './skeleton-examples-page.component.html',
  styleUrl: './skeleton-examples-page.component.css',
})
export class SkeletonExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly textHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-text-headless.component.ts',
      code: "import { TngSkeleton } from '@tailng-ui/primitives';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-text-headless.component.html',
      code: [
        '<section class="stack">',
        '  <div tngSkeleton class="line line--title"></div>',
        '  <div tngSkeleton class="line"></div>',
        '  <div tngSkeleton class="line line--short"></div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-examples-text-headless.component.css',
      code: [
        '.stack { display: grid; gap: 0.6rem; }',
        '.line { height: 0.9rem; }',
        '.line--title { height: 1.1rem; width: 56%; }',
        '.line--short { width: 68%; }',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly textPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-text-plain-css.component.ts',
      code: "import { TngSkeletonComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-text-plain-css.component.html',
      code: [
        '<section class="stack">',
        '  <tng-skeleton width="56%" height="1.1rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="0.9rem"></tng-skeleton>',
        '  <tng-skeleton width="68%" height="0.9rem"></tng-skeleton>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-examples-text-plain-css.component.css',
      code: '.stack { display: grid; gap: 0.6rem; }\n',
    },
  ]);

  protected readonly textTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-text-tailwind.component.ts',
      code: "import { TngSkeletonComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-text-tailwind.component.html',
      code: [
        '<section class="grid gap-2 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-skeleton width="56%" height="1.1rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="0.9rem"></tng-skeleton>',
        '  <tng-skeleton width="68%" height="0.9rem"></tng-skeleton>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-examples-text-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly cardHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-card-headless.component.ts',
      code: "import { TngSkeleton } from '@tailng-ui/primitives';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-card-headless.component.html',
      code: [
        '<section class="card-shell">',
        '  <div tngSkeleton class="avatar"></div>',
        '  <div tngSkeleton class="line line--title"></div>',
        '  <div tngSkeleton class="line"></div>',
        '  <div tngSkeleton [rounded]="false" class="media"></div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-examples-card-headless.component.css',
      code: [
        '.avatar { border-radius: 9999px; height: 2.75rem; width: 2.75rem; }',
        '.media { height: 6rem; width: 100%; }',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly cardPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-card-plain-css.component.ts',
      code: "import { TngSkeletonComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-card-plain-css.component.html',
      code: [
        '<section class="card-shell">',
        '  <tng-skeleton width="2.75rem" height="2.75rem"></tng-skeleton>',
        '  <tng-skeleton width="58%" height="1rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="0.9rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="6rem" [rounded]="false"></tng-skeleton>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-examples-card-plain-css.component.css',
      code: '.card-shell { display: grid; gap: 0.65rem; }\n',
    },
  ]);

  protected readonly cardTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-card-tailwind.component.ts',
      code: "import { TngSkeletonComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-card-tailwind.component.html',
      code: [
        '<section class="grid gap-2 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-skeleton width="2.75rem" height="2.75rem"></tng-skeleton>',
        '  <tng-skeleton width="58%" height="1rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="0.9rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="6rem" [rounded]="false"></tng-skeleton>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-examples-card-tailwind.component.css',
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
