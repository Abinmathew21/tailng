import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { TngSkeletonComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-skeleton-examples-page',
  imports: [TngSkeletonComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './skeleton-examples-page.component.html',
  styleUrl: './skeleton-examples-page.component.css',
})
export class SkeletonExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );
  protected readonly loadingMessages = [
    'Preparing your dashboard...',
    'Crunching the numbers...',
    'Almost ready...',
    'Loading your workspace...',
  ];

  protected readonly textPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-text-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeletonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-skeleton-examples-text-plain-css',",
        '  standalone: true,',
        '  imports: [TngSkeletonComponent],',
        "  templateUrl: './skeleton-examples-text-plain-css.component.html',",
        "  styleUrl: './skeleton-examples-text-plain-css.component.css',",
        '})',
        'export class SkeletonExamplesTextPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-text-plain-css.component.html',
      code: [
        '<section class="text-shell">',
        '  <tng-skeleton width="52%" height="0.85rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="1.1rem"></tng-skeleton>',
        '  <tng-skeleton width="88%" height="0.95rem"></tng-skeleton>',
        '  <tng-skeleton width="76%" height="0.95rem"></tng-skeleton>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-examples-text-plain-css.component.css',
      code: ['.text-shell {', '  display: grid;', '  gap: 0.65rem;', '}', ''].join('\n'),
    },
  ]);

  protected readonly textTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-text-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeletonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-skeleton-examples-text-tailwind',",
        '  standalone: true,',
        '  imports: [TngSkeletonComponent],',
        "  templateUrl: './skeleton-examples-text-tailwind.component.html',",
        "  styleUrl: './skeleton-examples-text-tailwind.component.css',",
        '})',
        'export class SkeletonExamplesTextTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-text-tailwind.component.html',
      code: [
        '<section class="grid gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-skeleton width="6rem" height="0.75rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="1.15rem"></tng-skeleton>',
        '  <tng-skeleton width="90%" height="0.95rem"></tng-skeleton>',
        '  <tng-skeleton width="72%" height="0.95rem"></tng-skeleton>',
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

  protected readonly cardPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-card-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeletonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-skeleton-examples-card-plain-css',",
        '  standalone: true,',
        '  imports: [TngSkeletonComponent],',
        "  templateUrl: './skeleton-examples-card-plain-css.component.html',",
        "  styleUrl: './skeleton-examples-card-plain-css.component.css',",
        '})',
        'export class SkeletonExamplesCardPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-card-plain-css.component.html',
      code: [
        '<section class="card-shell">',
        '  <tng-skeleton width="100%" height="8rem" [rounded]="false"></tng-skeleton>',
        '  <tng-skeleton width="42%" height="0.8rem"></tng-skeleton>',
        '  <tng-skeleton width="76%" height="1rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="0.9rem"></tng-skeleton>',
        '  <div class="card-actions">',
        '    <tng-skeleton width="5.5rem" height="2.25rem"></tng-skeleton>',
        '    <tng-skeleton width="4.5rem" height="2.25rem"></tng-skeleton>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-examples-card-plain-css.component.css',
      code: [
        '.card-shell {',
        '  display: grid;',
        '  gap: 0.75rem;',
        '}',
        '',
        '.card-actions {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly cardTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-card-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeletonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-skeleton-examples-card-tailwind',",
        '  standalone: true,',
        '  imports: [TngSkeletonComponent],',
        "  templateUrl: './skeleton-examples-card-tailwind.component.html',",
        "  styleUrl: './skeleton-examples-card-tailwind.component.css',",
        '})',
        'export class SkeletonExamplesCardTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-card-tailwind.component.html',
      code: [
        '<section class="grid gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-skeleton width="100%" height="8rem" [rounded]="false"></tng-skeleton>',
        '  <tng-skeleton width="7rem" height="0.8rem"></tng-skeleton>',
        '  <tng-skeleton width="82%" height="1rem"></tng-skeleton>',
        '  <tng-skeleton width="100%" height="0.9rem"></tng-skeleton>',
        '  <div class="flex flex-wrap gap-3">',
        '    <tng-skeleton width="6rem" height="2.25rem"></tng-skeleton>',
        '    <tng-skeleton width="4.75rem" height="2.25rem"></tng-skeleton>',
        '  </div>',
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

  protected readonly messagePlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'skeleton-examples-message.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSkeletonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-skeleton-examples-message',",
        '  standalone: true,',
        '  imports: [TngSkeletonComponent],',
        "  templateUrl: './skeleton-examples-message.component.html',",
        "  styleUrl: './skeleton-examples-message.component.css',",
        '})',
        'export class SkeletonExamplesMessageComponent {',
        '  protected readonly loadingMessages = [',
        "    'Preparing your dashboard...',",
        "    'Crunching the numbers...',",
        "    'Almost ready...',",
        "    'Loading your workspace...',",
        '  ];',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'skeleton-examples-message.component.html',
      code: [
        '<section class="message-shell">',
        '  <tng-skeleton',
        '    width="100%"',
        '    height="1.1rem"',
        '    message="Preparing your dashboard..."',
        '  ></tng-skeleton>',
        '',
        '  <tng-skeleton width="100%" height="1.1rem">',
        '    Preparing your dashboard...',
        '  </tng-skeleton>',
        '',
        '  <tng-skeleton',
        '    width="100%"',
        '    height="1.1rem"',
        '    [messages]="loadingMessages"',
        '  ></tng-skeleton>',
        '',
        '  <tng-skeleton',
        '    width="100%"',
        '    height="1.1rem"',
        '    messageMode="random"',
        '    messageStrategy="interval"',
        '    [messageInterval]="5000"',
        '    [messages]="loadingMessages"',
        '  ></tng-skeleton>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'skeleton-examples-message.component.css',
      code: ['.message-shell {', '  display: grid;', '  gap: 0.65rem;', '}', ''].join('\n'),
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
