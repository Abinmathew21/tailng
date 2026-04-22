import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngSkeletonComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-skeleton-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSkeletonComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './skeleton-overview-page.component.html',
  styleUrl: './skeleton-overview-page.component.css',
})
export class SkeletonOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = [
    "import { TngSkeletonComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeletonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-skeleton-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngSkeletonComponent],',
        "  templateUrl: './skeleton-overview-plain-css.component.html',",
        "  styleUrl: './skeleton-overview-plain-css.component.css',",
        '})',
        'export class SkeletonOverviewPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-overview-plain-css.component.html',
      code: [
        '<section class="plain-shell">',
        '  <tng-skeleton width="64%" height="1.15rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="0.95rem"></tng-skeleton>',
        '  <tng-skeleton width="78%" height="0.95rem"></tng-skeleton>',
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
        '.plain-shell {',
        '  display: grid;',
        '  gap: 0.7rem;',
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
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeletonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-skeleton-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngSkeletonComponent],',
        "  templateUrl: './skeleton-overview-tailwind.component.html',",
        "  styleUrl: './skeleton-overview-tailwind.component.css',",
        '})',
        'export class SkeletonOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-overview-tailwind.component.html',
      code: [
        '<section class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="grid gap-3">',
        '    <tng-skeleton width="9rem" height="0.85rem"></tng-skeleton>',
        '    <tng-skeleton width="100%" height="1rem"></tng-skeleton>',
        '    <tng-skeleton width="83%" height="1rem"></tng-skeleton>',
        '    <tng-skeleton width="61%" height="1rem"></tng-skeleton>',
        '  </div>',
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
}
