import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngTooltipComponent } from '@tailng-ui/components';
import {
  TngTooltip as TngTooltipPrimitive,
  TngTooltipContent as TngTooltipContentPrimitive,
  type TngTooltipSide,
  TngTooltipTrigger as TngTooltipTriggerPrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-tooltip-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngTooltipComponent,
    TngTooltipPrimitive,
    TngTooltipTriggerPrimitive,
    TngTooltipContentPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tooltip-overview-page.component.html',
  styleUrl: './tooltip-overview-page.component.css',
})
export class TooltipOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessSide = signal<TngTooltipSide>('top');
  protected readonly headlessTooltipId = 'docs-tooltip-overview-headless';

  protected readonly plainOpen = signal(false);
  protected readonly tailwindOpen = signal(false);

  protected readonly primitiveImportCode = [
    "import { TngTooltip, TngTooltipTrigger, TngTooltipContent } from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngTooltipComponent } from '@tailng-ui/components';",
  ].join('\n');

  protected readonly primitiveUsageCode = [
    "readonly side = signal<'top' | 'right' | 'bottom' | 'left'>('top');",
    '',
    '<span tngTooltip [side]="side()" [openDelay]="0" [closeDelay]="0">',
    '  <button tngTooltipTrigger>Hover for hint</button>',
    '  <span tngTooltipContent [id]="\'country-tip\'">',
    '    Use this to filter countries quickly.',
    '  </span>',
    '</span>',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-tooltip',
    '  triggerLabel="Hover for hint"',
    '  text="Use this to filter countries quickly."',
    '  side="top"',
    '  [openDelay]="120"',
    '  [closeDelay]="80"',
    '></tng-tooltip>',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tooltip-overview-headless.component.ts',
      code: ["readonly side = signal<'top' | 'right' | 'bottom' | 'left'>('top');"].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tooltip-overview-headless.component.html',
      code: [
        '<span tngTooltip [side]="side()" [openDelay]="0" [closeDelay]="0">',
        '  <button tngTooltipTrigger>Hover or focus</button>',
        '  <span tngTooltipContent [id]="\'headless-tip\'">',
        '    Headless tooltip message.',
        '  </span>',
        '</span>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tooltip-overview-headless.component.css',
      code: [
        '[data-slot="tooltip-trigger"] {',
        '  border-radius: 0.68rem;',
        '  min-height: 2.1rem;',
        '}',
        '',
        '[data-slot="tooltip-content"] {',
        '  position: fixed;',
        '  z-index: 70;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tooltip-overview-plain-css.component.ts',
      code: ["readonly open = signal(false);", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tooltip-overview-plain-css.component.html',
      code: [
        '<tng-tooltip',
        '  triggerLabel="Plain CSS hint"',
        '  text="Wrapper tooltip with semantic token styling."',
        '  side="bottom"',
        '  [openDelay]="120"',
        '  [closeDelay]="80"',
        '  (openChange)="open.set($event)"',
        '></tng-tooltip>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tooltip-overview-plain-css.component.css',
      code: [
        '.tooltip-shell {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.95rem;',
        '  padding: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tooltip-overview-tailwind.component.ts',
      code: ["readonly open = signal(false);", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tooltip-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-tooltip',
        '    triggerLabel="Tailwind hint"',
        '    side="right"',
        '    [openDelay]="100"',
        '    [closeDelay]="80"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <span class="text-sm text-slate-700 dark:text-slate-300">',
        '      Tokenized wrapper with utility-first content.',
        '    </span>',
        '  </tng-tooltip>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tooltip-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
