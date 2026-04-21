import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngPopover,
  TngPopoverClose,
  TngPopoverPanel,
  TngPopoverTrigger,
  type TngPopoverCloseReason,
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
  selector: 'app-headless-popover-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngPopover,
    TngPopoverClose,
    TngPopoverPanel,
    TngPopoverTrigger,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './popover-overview-page.component.html',
  styleUrl: './popover-overview-page.component.css',
})
export class HeadlessPopoverOverviewPageComponent implements OnDestroy {
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

  protected readonly plainReason = signal<TngPopoverCloseReason | 'none'>('none');
  protected readonly tailwindReason = signal<TngPopoverCloseReason | 'none'>('none');

  protected readonly importCode = [
    'import {',
    '  TngPopover,',
    '  TngPopoverClose,',
    '  TngPopoverPanel,',
    '  TngPopoverTrigger,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly compositionCode = [
    '<section tngPopover #reviewPopover="tngPopover" class="review-anchor">',
    '  <button type="button" [tngPopoverTrigger]="reviewPopover">Project actions</button>',
    '',
    '  <section tngPopoverPanel>',
    '    <p>Popover body content.</p>',
    "    <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\">Close</button>",
    '  </section>',
    '</section>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-popover-overview-plain.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        'import {',
        '  TngPopover,',
        '  TngPopoverClose,',
        '  TngPopoverPanel,',
        '  TngPopoverTrigger,',
        "  type TngPopoverCloseReason,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-popover-overview-plain',",
        '  standalone: true,',
        '  imports: [TngPopover, TngPopoverClose, TngPopoverPanel, TngPopoverTrigger],',
        "  templateUrl: './headless-popover-overview-plain.component.html',",
        "  styleUrl: './headless-popover-overview-plain.component.css',",
        '})',
        'export class HeadlessPopoverOverviewPlainComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly lastReason = signal<TngPopoverCloseReason | 'none'>('none');",
        '',
        '  protected onClosed(reason: TngPopoverCloseReason): void {',
        '    this.lastReason.set(reason);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-popover-overview-plain.component.html',
      code: [
        '<section',
        '  tngPopover',
        '  #popover="tngPopover"',
        '  class="headless-popover-anchor"',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '  (closed)="onClosed($event)"',
        '>',
        '  <button type="button" class="headless-popover-trigger" [tngPopoverTrigger]="popover">',
        '    Open headless popover',
        '  </button>',
        '',
        '  <section tngPopoverPanel class="headless-popover-panel">',
        '    <p class="headless-popover-title">Release checklist</p>',
        '    <p class="headless-popover-description">Review readiness items before shipping.</p>',
        '    <div class="headless-popover-actions">',
        '      <button type="button" tngPopoverClose class="headless-popover-secondary">Dismiss</button>',
        "      <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\" class=\"headless-popover-primary\">Ship</button>",
        '    </div>',
        '  </section>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-popover-overview-plain.component.css',
      code: [
        '.headless-popover-anchor {',
        '  display: inline-block;',
        '  position: relative;',
        '}',
        '',
        '.headless-popover-panel {',
        '  left: 0;',
        '  position: absolute;',
        '  top: calc(100% + 0.5rem);',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-popover-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        'import {',
        '  TngPopover,',
        '  TngPopoverClose,',
        '  TngPopoverPanel,',
        '  TngPopoverTrigger,',
        "  type TngPopoverCloseReason,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-popover-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngPopover, TngPopoverClose, TngPopoverPanel, TngPopoverTrigger],',
        "  templateUrl: './headless-popover-overview-tailwind.component.html',",
        "  styleUrl: './headless-popover-overview-tailwind.component.css',",
        '})',
        'export class HeadlessPopoverOverviewTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly lastReason = signal<TngPopoverCloseReason | 'none'>('none');",
        '',
        '  protected onClosed(reason: TngPopoverCloseReason): void {',
        '    this.lastReason.set(reason);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-popover-overview-tailwind.component.html',
      code: [
        '<section',
        '  tngPopover',
        '  #popover="tngPopover"',
        '  class="relative inline-block"',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '  (closed)="onClosed($event)"',
        '>',
        '  <button',
        '    type="button"',
        '    class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"',
        '    [tngPopoverTrigger]="popover"',
        '  >',
        '    Tailwind actions',
        '  </button>',
        '',
        '  <section',
        '    tngPopoverPanel',
        '    class="absolute left-0 top-[calc(100%+0.5rem)] grid min-w-72 gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950"',
        '  >',
        '    <p class="m-0 text-sm font-semibold text-slate-950 dark:text-slate-50">Release checklist</p>',
        '    <p class="m-0 text-sm text-slate-600 dark:text-slate-300">Pair the primitive with your own anchored layout utilities.</p>',
        '    <div class="flex flex-wrap justify-end gap-2">',
        '      <button type="button" tngPopoverClose class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Dismiss</button>',
        "      <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\" class=\"rounded-lg border border-sky-600 bg-sky-600 px-3 py-2 text-sm font-semibold text-white\">Ship</button>",
        '    </div>',
        '  </section>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-popover-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
