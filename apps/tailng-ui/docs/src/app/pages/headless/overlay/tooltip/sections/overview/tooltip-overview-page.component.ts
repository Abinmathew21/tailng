import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngTooltip,
  TngTooltipContent,
  TngTooltipTrigger,
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
  selector: 'app-headless-tooltip-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngTooltip,
    TngTooltipContent,
    TngTooltipTrigger,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tooltip-overview-page.component.html',
  styleUrl: './tooltip-overview-page.component.css',
})
export class HeadlessTooltipOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainOpen = signal(false);
  protected readonly tailwindOpen = signal(false);

  protected readonly importCode = [
    'import {',
    '  TngTooltip,',
    '  TngTooltipContent,',
    '  TngTooltipTrigger,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly compositionCode = [
    '<span tngTooltip side="top" [openDelay]="120" [closeDelay]="60">',
    '  <button type="button" tngTooltipTrigger>Hover for hint</button>',
    '  <span tngTooltipContent id="country-filter-tip">',
    '    Use this to filter countries quickly.',
    '  </span>',
    '</span>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-tooltip-overview-plain.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        'import {',
        '  TngTooltip,',
        '  TngTooltipContent,',
        '  TngTooltipTrigger,',
        "  type TngTooltipSide,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-tooltip-overview-plain',",
        '  standalone: true,',
        '  imports: [TngTooltip, TngTooltipContent, TngTooltipTrigger],',
        "  templateUrl: './headless-tooltip-overview-plain.component.html',",
        "  styleUrl: './headless-tooltip-overview-plain.component.css',",
        '})',
        'export class HeadlessTooltipOverviewPlainComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly side = signal<TngTooltipSide>('top');",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-tooltip-overview-plain.component.html',
      code: [
        '<div class="headless-tooltip-preview-shell">',
        '  <div',
        '    class="headless-tooltip-anchor"',
        '    tngTooltip',
        '    [side]="side()"',
        '    [openDelay]="0"',
        '    [closeDelay]="0"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <button type="button" tngTooltipTrigger class="headless-tooltip-trigger">',
        '      Hover or focus for storage hint',
        '    </button>',
        '    <span tngTooltipContent class="headless-tooltip-note" id="storage-tooltip">',
        '      Headless tooltip stays non-interactive and repositions with collision handling.',
        '    </span>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-tooltip-overview-plain.component.css',
      code: [
        '.headless-tooltip-anchor {',
        '  display: inline-flex;',
        '}',
        '',
        '.headless-tooltip-trigger {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.7rem;',
        '  min-height: 2.15rem;',
        '  padding: 0.45rem 0.9rem;',
        '}',
        '',
        '.headless-tooltip-note {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.7rem;',
        '  box-shadow: 0 20px 36px color-mix(in srgb, var(--tng-semantic-foreground-primary) 22%, transparent);',
        '  box-sizing: border-box;',
        '  color: var(--tng-semantic-foreground-primary);',
        '  display: block;',
        '  font-size: 0.82rem;',
        '  line-height: 1.45;',
        '  max-width: min(22rem, calc(100vw - 3rem));',
        '  overflow-wrap: break-word;',
        '  padding: 0.55rem 0.75rem;',
        '  pointer-events: none;',
        '  white-space: normal;',
        '}',
        '',
        '.headless-tooltip-note[hidden] {',
        '  display: none !important;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-tooltip-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        'import {',
        '  TngTooltip,',
        '  TngTooltipContent,',
        '  TngTooltipTrigger,',
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-tooltip-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngTooltip, TngTooltipContent, TngTooltipTrigger],',
        "  templateUrl: './headless-tooltip-overview-tailwind.component.html',",
        "  styleUrl: './headless-tooltip-overview-tailwind.component.css',",
        '})',
        'export class HeadlessTooltipOverviewTailwindComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-tooltip-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div',
        '    tngTooltip',
        '    side="right"',
        '    [openDelay]="0"',
        '    [closeDelay]="0"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <button',
        '      type="button"',
        '      tngTooltipTrigger',
        '      class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition focus-visible:border-sky-500 focus-visible:bg-sky-50 focus-visible:text-sky-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200/90 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:border-sky-400 dark:focus-visible:bg-sky-950 dark:focus-visible:text-sky-50 dark:focus-visible:ring-sky-500/45"',
        '    >',
        '      Hover for rollout hint',
        '    </button>',
        '    <span',
        '      tngTooltipContent',
        '      id="rollout-tooltip"',
        '      class="max-w-64 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-2xl [&[hidden]]:!hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"',
        '    >',
        '      Tailwind utilities can reskin the surface while the primitive owns placement and ARIA.',
        '    </span>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-tooltip-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
