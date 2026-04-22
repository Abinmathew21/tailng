import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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
  selector: 'app-headless-skeleton-examples-page',
  imports: [TngSkeleton, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './skeleton-examples-page.component.html',
  styleUrl: './skeleton-examples-page.component.css',
})
export class HeadlessSkeletonExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly textPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-skeleton-text-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeleton } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-skeleton-text-plain',",
        '  standalone: true,',
        '  imports: [TngSkeleton],',
        "  templateUrl: './headless-skeleton-text-plain.component.html',",
        "  styleUrl: './headless-skeleton-text-plain.component.css',",
        '})',
        'export class HeadlessSkeletonTextPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-skeleton-text-plain.component.html',
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
      title: 'headless-skeleton-text-plain.component.css',
      code: [
        '.stack { display: grid; gap: 0.6rem; }',
        '.line { height: 0.9rem; width: 100%; }',
        '.line--title { height: 1.1rem; width: 56%; }',
        '.line--short { width: 68%; }',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly textTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-skeleton-text-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeleton } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-skeleton-text-tailwind',",
        '  standalone: true,',
        '  imports: [TngSkeleton],',
        "  templateUrl: './headless-skeleton-text-tailwind.component.html',",
        "  styleUrl: './headless-skeleton-text-tailwind.component.css',",
        '})',
        'export class HeadlessSkeletonTextTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-skeleton-text-tailwind.component.html',
      code: [
        '<section class="grid gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-canvas)] p-4">',
        '  <div tngSkeleton class="skeleton-tw-line h-[1.1rem] w-[56%] rounded-lg"></div>',
        '  <div tngSkeleton class="skeleton-tw-line h-[0.9rem] w-full rounded-lg"></div>',
        '  <div tngSkeleton class="skeleton-tw-line h-[0.9rem] w-[68%] rounded-lg"></div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-skeleton-text-tailwind.component.css',
      code: [
        '/* Shimmer matches plain CSS: gradient + background-size + keyframes (see overview for same pattern). */',
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

  protected readonly cardPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-skeleton-card-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeleton } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-skeleton-card-plain',",
        '  standalone: true,',
        '  imports: [TngSkeleton],',
        "  templateUrl: './headless-skeleton-card-plain.component.html',",
        "  styleUrl: './headless-skeleton-card-plain.component.css',",
        '})',
        'export class HeadlessSkeletonCardPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-skeleton-card-plain.component.html',
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
      title: 'headless-skeleton-card-plain.component.css',
      code: [
        '.card-shell { display: grid; gap: 0.65rem; }',
        '.avatar { border-radius: 9999px; height: 2.75rem; width: 2.75rem; }',
        '.media { height: 6rem; width: 100%; }',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly cardTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-skeleton-card-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeleton } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-skeleton-card-tailwind',",
        '  standalone: true,',
        '  imports: [TngSkeleton],',
        "  templateUrl: './headless-skeleton-card-tailwind.component.html',",
        "  styleUrl: './headless-skeleton-card-tailwind.component.css',",
        '})',
        'export class HeadlessSkeletonCardTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-skeleton-card-tailwind.component.html',
      code: [
        '<section class="grid gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-canvas)] p-4">',
        '  <div tngSkeleton class="skeleton-tw-line h-11 w-11 rounded-full"></div>',
        '  <div tngSkeleton class="skeleton-tw-line h-4 w-[58%] rounded-lg"></div>',
        '  <div tngSkeleton class="skeleton-tw-line h-[0.9rem] w-full rounded-lg"></div>',
        '  <div tngSkeleton [rounded]="false" class="skeleton-tw-line h-24 w-full"></div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-skeleton-card-tailwind.component.css',
      code: [
        '/* Shimmer matches plain CSS: gradient + background-size + keyframes. */',
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
