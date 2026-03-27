import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngTooltipComponent } from '@tailng-ui/components';
import {
  TngTooltip as TngTooltipPrimitive,
  TngTooltipContent as TngTooltipContentPrimitive,
  TngTooltipTrigger as TngTooltipTriggerPrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-tooltip-examples-page',
  imports: [
    TngTooltipComponent,
    TngTooltipPrimitive,
    TngTooltipTriggerPrimitive,
    TngTooltipContentPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tooltip-examples-page.component.html',
  styleUrl: './tooltip-examples-page.component.css',
})
export class TooltipExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessTooltipId = 'docs-tooltip-examples-headless';
  protected readonly plainOpen = signal(false);
  protected readonly tailwindOpen = signal(false);

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tooltip-examples-headless.component.ts',
      code: ['// Root directive manages tooltip open/close runtime.'].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tooltip-examples-headless.component.html',
      code: [
        '<span tngTooltip side="right" [openDelay]="0" [closeDelay]="0">',
        '  <button tngTooltipTrigger>Delete release branch</button>',
        '  <span tngTooltipContent [id]="\'delete-tip\'">',
        '    Permanently removes branch automation.',
        '  </span>',
        '</span>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tooltip-examples-headless.component.css',
      code: [
        '.tooltip-note {',
        '  position: fixed;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tooltip-examples-plain-css.component.ts',
      code: ["readonly open = signal(false);"].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tooltip-examples-plain-css.component.html',
      code: [
        '<tng-tooltip',
        '  triggerLabel="Archive release notes"',
        '  text="Moves notes to readonly archive."',
        '  side="bottom"',
        '  [openDelay]="100"',
        '  [closeDelay]="80"',
        '  (openChange)="open.set($event)"',
        '></tng-tooltip>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tooltip-examples-plain-css.component.css',
      code: [
        '.tooltip-example-shell {',
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
      title: 'tooltip-examples-tailwind.component.ts',
      code: ["readonly open = signal(false);"].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tooltip-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-tooltip',
        '    triggerLabel="Approve deployment"',
        '    side="top"',
        '    [openDelay]="150"',
        '    [closeDelay]="100"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <span class="text-sm text-slate-700 dark:text-slate-300">',
        '      Rollout starts in us-east, then eu-west.',
        '    </span>',
        '  </tng-tooltip>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tooltip-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
