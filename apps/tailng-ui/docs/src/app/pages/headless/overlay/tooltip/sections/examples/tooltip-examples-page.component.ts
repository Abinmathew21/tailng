import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTooltip, TngTooltipContent, TngTooltipTrigger } from '@tailng-ui/primitives';
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
  selector: 'app-headless-tooltip-examples-page',
  imports: [TngTooltip, TngTooltipContent, TngTooltipTrigger, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './tooltip-examples-page.component.html',
  styleUrl: './tooltip-examples-page.component.css',
})
export class HeadlessTooltipExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly iconPlainOpen = signal(false);
  protected readonly iconTailwindOpen = signal(false);
  protected readonly statusPlainOpen = signal(false);
  protected readonly statusTailwindOpen = signal(false);

  protected readonly iconPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-tooltip-icon-plain.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngTooltip, TngTooltipContent, TngTooltipTrigger } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-tooltip-icon-plain',",
        '  standalone: true,',
        '  imports: [TngTooltip, TngTooltipContent, TngTooltipTrigger],',
        "  templateUrl: './headless-tooltip-icon-plain.component.html',",
        "  styleUrl: './headless-tooltip-icon-plain.component.css',",
        '})',
        'export class HeadlessTooltipIconPlainComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-tooltip-icon-plain.component.html',
      code: [
        '<div class="headless-tooltip-example-shell">',
        '  <div tngTooltip side="right" [openDelay]="0" [closeDelay]="0" (openChange)="open.set($event)">',
        '    <button type="button" tngTooltipTrigger class="headless-tooltip-icon-trigger" aria-label="Sync release">',
        '      ⟳',
        '    </button>',
        '    <span tngTooltipContent id="sync-tooltip" class="headless-tooltip-example-note">',
        '      Syncs the release manifest before deploy.',
        '    </span>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-tooltip-icon-plain.component.css',
      code: [
        '.headless-tooltip-icon-trigger {',
        '  align-items: center;',
        '  aspect-ratio: 1;',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 999px;',
        '  display: inline-flex;',
        '  inline-size: 2.25rem;',
        '  justify-content: center;',
        '}',
        '',
        '.headless-tooltip-example-note[hidden] {',
        '  display: none !important;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly iconTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-tooltip-icon-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngTooltip, TngTooltipContent, TngTooltipTrigger } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-tooltip-icon-tailwind',",
        '  standalone: true,',
        '  imports: [TngTooltip, TngTooltipContent, TngTooltipTrigger],',
        "  templateUrl: './headless-tooltip-icon-tailwind.component.html',",
        "  styleUrl: './headless-tooltip-icon-tailwind.component.css',",
        '})',
        'export class HeadlessTooltipIconTailwindComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-tooltip-icon-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div tngTooltip side="right" [openDelay]="0" [closeDelay]="0" (openChange)="open.set($event)">',
        '    <button',
        '      type="button"',
        '      tngTooltipTrigger',
        '      aria-label="Sync release"',
        '      class="inline-flex size-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition focus-visible:border-sky-500 focus-visible:bg-sky-50 focus-visible:text-sky-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200/90 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:border-sky-400 dark:focus-visible:bg-sky-950 dark:focus-visible:text-sky-50 dark:focus-visible:ring-sky-500/45"',
        '    >',
        '      ⟳',
        '    </button>',
        '    <span',
        '      tngTooltipContent',
        '      id="sync-tooltip-tailwind"',
        '      class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-2xl [&[hidden]]:!hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"',
        '    >',
        '      Syncs the release manifest before deploy.',
        '    </span>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-tooltip-icon-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly statusPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-tooltip-status-plain.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngTooltip, TngTooltipContent, TngTooltipTrigger } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-tooltip-status-plain',",
        '  standalone: true,',
        '  imports: [TngTooltip, TngTooltipContent, TngTooltipTrigger],',
        "  templateUrl: './headless-tooltip-status-plain.component.html',",
        "  styleUrl: './headless-tooltip-status-plain.component.css',",
        '})',
        'export class HeadlessTooltipStatusPlainComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-tooltip-status-plain.component.html',
      code: [
        '<div tngTooltip side="top" [openDelay]="0" [closeDelay]="0" (openChange)="open.set($event)">',
        '  <button type="button" tngTooltipTrigger class="headless-tooltip-status-chip">Paused rollout</button>',
        '  <span tngTooltipContent id="paused-rollout-tooltip" class="headless-tooltip-example-note">',
        '    Deployment is paused until QA signs off on the release note.',
        '  </span>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-tooltip-status-plain.component.css',
      code: [
        '.headless-tooltip-status-chip {',
        '  border: 1px solid color-mix(in srgb, #f59e0b 52%, transparent);',
        '  border-radius: 999px;',
        '  padding: 0.45rem 0.8rem;',
        '}',
        '',
        '.headless-tooltip-example-note {',
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
        '  z-index: 70;',
        '}',
        '',
        '.headless-tooltip-example-note[hidden] {',
        '  display: none !important;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly statusTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-tooltip-status-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngTooltip, TngTooltipContent, TngTooltipTrigger } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-tooltip-status-tailwind',",
        '  standalone: true,',
        '  imports: [TngTooltip, TngTooltipContent, TngTooltipTrigger],',
        "  templateUrl: './headless-tooltip-status-tailwind.component.html',",
        "  styleUrl: './headless-tooltip-status-tailwind.component.css',",
        '})',
        'export class HeadlessTooltipStatusTailwindComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-tooltip-status-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div tngTooltip side="top" [openDelay]="0" [closeDelay]="0" (openChange)="open.set($event)">',
        '    <button',
        '      type="button"',
        '      tngTooltipTrigger',
        '      class="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900 transition focus-visible:border-amber-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200/90 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100 dark:focus-visible:border-amber-400 dark:focus-visible:ring-amber-500/40"',
        '    >',
        '      Paused rollout',
        '    </button>',
        '    <span',
        '      tngTooltipContent',
        '      id="paused-rollout-tooltip-tailwind"',
        '      class="max-w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-2xl [&[hidden]]:!hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"',
        '    >',
        '      Deployment is paused until QA signs off on the release note.',
        '    </span>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-tooltip-status-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
