import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngSkeleton } from '@tailng-ui/primitives';
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
  selector: 'app-headless-skeleton-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSkeleton,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './skeleton-overview-page.component.html',
  styleUrl: './skeleton-overview-page.component.css',
})
export class HeadlessSkeletonOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly importCode = ["import { TngSkeleton } from '@tailng-ui/primitives';", ''].join(
    '\n',
  );

  protected readonly compositionCode = [
    '<section class="skeleton-stack">',
    '  <div tngSkeleton class="skeleton-line skeleton-line--title"></div>',
    '  <div tngSkeleton class="skeleton-line"></div>',
    '  <div tngSkeleton class="skeleton-line skeleton-line--short"></div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-skeleton-overview-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeleton } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-skeleton-overview-plain',",
        '  standalone: true,',
        '  imports: [TngSkeleton],',
        "  templateUrl: './headless-skeleton-overview-plain.component.html',",
        "  styleUrl: './headless-skeleton-overview-plain.component.css',",
        '})',
        'export class HeadlessSkeletonOverviewPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-skeleton-overview-plain.component.html',
      code: [
        '<section class="skeleton-preview">',
        '  <div tngSkeleton class="skeleton-line skeleton-line--title"></div>',
        '  <div tngSkeleton class="skeleton-line"></div>',
        '  <div tngSkeleton class="skeleton-line skeleton-line--short"></div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-skeleton-overview-plain.component.css',
      code: [
        '.skeleton-preview {',
        '  display: grid;',
        '  gap: 0.7rem;',
        '}',
        '',
        '.skeleton-line {',
        '  background: linear-gradient(',
        '    90deg,',
        '    var(--tng-semantic-foreground-secondary) 0%,',
        '    var(--tng-semantic-border-subtle) 50%,',
        '    var(--tng-semantic-foreground-secondary) 100%',
        '  );',
        '  background-size: 220% 100%;',
        '  height: 0.9rem;',
        '}',
        '',
        '.skeleton-line[data-animated="true"] {',
        '  animation: tng-skeleton-shimmer 1.3s linear infinite;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-skeleton-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeleton } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-skeleton-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngSkeleton],',
        "  templateUrl: './headless-skeleton-overview-tailwind.component.html',",
        "  styleUrl: './headless-skeleton-overview-tailwind.component.css',",
        '})',
        'export class HeadlessSkeletonOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-skeleton-overview-tailwind.component.html',
      code: [
        '<section class="grid gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div tngSkeleton class="skeleton-tw-line h-[1.1rem] w-[58%] rounded-lg"></div>',
        '  <div tngSkeleton class="skeleton-tw-line h-[0.9rem] w-full rounded-lg"></div>',
        '  <div tngSkeleton class="skeleton-tw-line h-[0.9rem] w-[72%] rounded-lg"></div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-skeleton-overview-tailwind.component.css',
      code: [
        '/* Shimmer matches plain CSS: gradient + background-size + same keyframes as the wrapper demo. */',
        '.skeleton-tw-line {',
        '  background: linear-gradient(',
        '    90deg,',
        '    var(--tng-semantic-foreground-secondary) 0%,',
        '    var(--tng-semantic-border-subtle) 50%,',
        '    var(--tng-semantic-foreground-secondary) 100%',
        '  );',
        '  background-size: 220% 100%;',
        '}',
        '',
        '.skeleton-tw-line[data-animated="true"] {',
        '  animation: tng-skeleton-shimmer 1.3s linear infinite;',
        '}',
        '',
        '@keyframes tng-skeleton-shimmer {',
        '  0% {',
        '    background-position: 200% 0;',
        '  }',
        '',
        '  100% {',
        '    background-position: -20% 0;',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
