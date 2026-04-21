import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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
  selector: 'app-headless-popover-examples-page',
  imports: [
    TngPopover,
    TngPopoverClose,
    TngPopoverPanel,
    TngPopoverTrigger,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './popover-examples-page.component.html',
  styleUrl: './popover-examples-page.component.css',
})
export class HeadlessPopoverExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly destructivePlainOpen = signal(false);
  protected readonly destructivePlainResult = signal('No decision yet');
  protected readonly destructiveTailwindOpen = signal(false);
  protected readonly destructiveTailwindResult = signal('No decision yet');
  protected readonly controlledPlainOpen = signal(false);
  protected readonly controlledPlainResult = signal('Checklist pending');
  protected readonly controlledTailwindOpen = signal(false);
  protected readonly controlledTailwindResult = signal('Checklist pending');

  protected readonly destructivePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-popover-destructive-plain.component.ts',
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
        "  selector: 'app-headless-popover-destructive-plain',",
        '  standalone: true,',
        '  imports: [TngPopover, TngPopoverClose, TngPopoverPanel, TngPopoverTrigger],',
        "  templateUrl: './headless-popover-destructive-plain.component.html',",
        "  styleUrl: './headless-popover-destructive-plain.component.css',",
        '})',
        'export class HeadlessPopoverDestructivePlainComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly result = signal('No decision yet');",
        '',
        '  protected onClosed(reason: TngPopoverCloseReason): void {',
        "    this.result.set(reason === 'outside-pointer' ? 'Closed by outside click' : `Closed (${reason})`);",
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-popover-destructive-plain.component.html',
      code: [
        '<section',
        '  tngPopover',
        '  #popover="tngPopover"',
        '  class="headless-popover-example-anchor"',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '  (closed)="onClosed($event)"',
        '>',
        '  <button type="button" class="headless-popover-example-trigger" [tngPopoverTrigger]="popover">',
        '    Delete release branch',
        '  </button>',
        '',
        '  <section tngPopoverPanel class="headless-popover-example-panel">',
        '    <h3 class="headless-popover-example-title">Delete release branch?</h3>',
        '    <p class="headless-popover-example-copy">This action removes branch automation and cannot be undone.</p>',
        '    <div class="headless-popover-action-row">',
        "      <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\" class=\"headless-popover-example-secondary\">Cancel</button>",
        "      <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\" class=\"headless-popover-example-danger\">Delete</button>",
        '    </div>',
        '  </section>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-popover-destructive-plain.component.css',
      code: [
        '.headless-popover-example-anchor {',
        '  display: inline-block;',
        '  position: relative;',
        '}',
        '',
        '.headless-popover-example-panel {',
        '  left: 0;',
        '  position: absolute;',
        '  top: calc(100% + 0.5rem);',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly destructiveTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-popover-destructive-tailwind.component.ts',
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
        "  selector: 'app-headless-popover-destructive-tailwind',",
        '  standalone: true,',
        '  imports: [TngPopover, TngPopoverClose, TngPopoverPanel, TngPopoverTrigger],',
        "  templateUrl: './headless-popover-destructive-tailwind.component.html',",
        "  styleUrl: './headless-popover-destructive-tailwind.component.css',",
        '})',
        'export class HeadlessPopoverDestructiveTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly result = signal('No decision yet');",
        '',
        '  protected onClosed(reason: TngPopoverCloseReason): void {',
        "    this.result.set(reason === 'outside-pointer' ? 'Closed by outside click' : `Closed (${reason})`);",
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-popover-destructive-tailwind.component.html',
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
        '    class="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-700 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-200"',
        '    [tngPopoverTrigger]="popover"',
        '  >',
        '    Delete release branch',
        '  </button>',
        '',
        '  <section',
        '    tngPopoverPanel',
        '    class="absolute left-0 top-[calc(100%+0.5rem)] grid min-w-80 gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950"',
        '  >',
        '    <h3 class="m-0 text-base font-semibold text-slate-950 dark:text-slate-50">Delete release branch?</h3>',
        '    <p class="m-0 text-sm text-slate-600 dark:text-slate-300">This action removes branch automation and cannot be undone.</p>',
        '    <div class="flex flex-wrap justify-end gap-2">',
        "      <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\" class=\"rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200\">Cancel</button>",
        "      <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\" class=\"rounded-lg border border-rose-600 bg-rose-600 px-3 py-2 text-sm font-semibold text-white\">Delete</button>",
        '    </div>',
        '  </section>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-popover-destructive-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly controlledPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-popover-controlled-review-plain.component.ts',
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
        "  selector: 'app-headless-popover-controlled-review-plain',",
        '  standalone: true,',
        '  imports: [TngPopover, TngPopoverClose, TngPopoverPanel, TngPopoverTrigger],',
        "  templateUrl: './headless-popover-controlled-review-plain.component.html',",
        "  styleUrl: './headless-popover-controlled-review-plain.component.css',",
        '})',
        'export class HeadlessPopoverControlledReviewPlainComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly result = signal('Checklist pending');",
        '',
        '  protected onClosed(reason: TngPopoverCloseReason): void {',
        "    if (reason !== 'programmatic') {",
        '      this.result.set(`Closed (${reason})`);',
        '    }',
        '  }',
        '',
        '  protected onDismiss(): void {',
        "    this.result.set('Review dismissed');",
        '    this.open.set(false);',
        '  }',
        '',
        '  protected onContinue(): void {',
        "    this.result.set('Checklist accepted');",
        '    this.open.set(false);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-popover-controlled-review-plain.component.html',
      code: [
        '<section',
        '  tngPopover',
        '  #popover="tngPopover"',
        '  class="headless-popover-review-shell"',
        '  [open]="open()"',
        '  [closeOnOutsidePointer]="false"',
        '  [closeOnEscape]="false"',
        '  [autoFocus]="\'panel\'"',
        '  [panelRole]="\'dialog\'"',
        '  (openChange)="open.set($event)"',
        '  (closed)="onClosed($event)"',
        '>',
        '  <button type="button" class="headless-popover-review-trigger" [tngPopoverTrigger]="popover">',
        '    Open security checklist',
        '  </button>',
        '',
        '  <section tngPopoverPanel class="headless-popover-review-panel">',
        '    <p class="headless-popover-review-eyebrow">Controlled review</p>',
        '    <h3 class="headless-popover-review-title">Security review required</h3>',
        '    <p class="headless-popover-review-copy">Finish the checklist before continuing.</p>',
        '    <ul class="headless-popover-review-list">',
        '      <li>Audit logs enabled</li>',
        '      <li>Rollback snapshot verified</li>',
        '      <li>On-call contact confirmed</li>',
        '    </ul>',
        '    <div class="headless-popover-action-row">',
        "      <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\" class=\"headless-popover-example-secondary\" (click)=\"onDismiss()\">Dismiss</button>",
        "      <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\" class=\"headless-popover-example-primary\" (click)=\"onContinue()\">Continue</button>",
        '    </div>',
        '  </section>',
        '</section>',
        '<p class="headless-popover-example-state">result: {{ result() }}</p>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-popover-controlled-review-plain.component.css',
      code: [
        '.headless-popover-review-shell {',
        '  display: inline-block;',
        '  position: relative;',
        '}',
        '',
        '.headless-popover-review-panel {',
        '  inline-size: min(100%, 24rem);',
        '  left: 0;',
        '  position: absolute;',
        '  top: calc(100% + 0.5rem);',
        '}',
        '',
        '.headless-popover-review-list {',
        '  margin: 0;',
        '  padding-inline-start: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly controlledTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-popover-controlled-review-tailwind.component.ts',
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
        "  selector: 'app-headless-popover-controlled-review-tailwind',",
        '  standalone: true,',
        '  imports: [TngPopover, TngPopoverClose, TngPopoverPanel, TngPopoverTrigger],',
        "  templateUrl: './headless-popover-controlled-review-tailwind.component.html',",
        "  styleUrl: './headless-popover-controlled-review-tailwind.component.css',",
        '})',
        'export class HeadlessPopoverControlledReviewTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly result = signal('Checklist pending');",
        '',
        '  protected onClosed(reason: TngPopoverCloseReason): void {',
        "    if (reason !== 'programmatic') {",
        '      this.result.set(`Closed (${reason})`);',
        '    }',
        '  }',
        '',
        '  protected onDismiss(): void {',
        "    this.result.set('Review dismissed');",
        '    this.open.set(false);',
        '  }',
        '',
        '  protected onContinue(): void {',
        "    this.result.set('Checklist accepted');",
        '    this.open.set(false);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-popover-controlled-review-tailwind.component.html',
      code: [
        '<section',
        '  tngPopover',
        '  #popover="tngPopover"',
        '  class="relative inline-block"',
        '  [open]="open()"',
        '  [closeOnOutsidePointer]="false"',
        '  [closeOnEscape]="false"',
        '  [autoFocus]="\'panel\'"',
        '  [panelRole]="\'dialog\'"',
        '  (openChange)="open.set($event)"',
        '  (closed)="onClosed($event)"',
        '>',
        '  <button',
        '    type="button"',
        '    class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"',
        '    [tngPopoverTrigger]="popover"',
        '  >',
        '    Open security checklist',
        '  </button>',
        '',
        '  <section',
        '    tngPopoverPanel',
        '    class="absolute left-0 top-[calc(100%+0.5rem)] grid min-w-80 gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950"',
        '  >',
        '    <p class="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Controlled review</p>',
        '    <h3 class="m-0 text-base font-semibold text-slate-950 dark:text-slate-50">Security review required</h3>',
        '    <p class="m-0 text-sm text-slate-600 dark:text-slate-300">Finish the checklist before continuing.</p>',
        '    <ul class="m-0 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">',
        '      <li>Audit logs enabled</li>',
        '      <li>Rollback snapshot verified</li>',
        '      <li>On-call contact confirmed</li>',
        '    </ul>',
        '    <div class="flex flex-wrap justify-end gap-2">',
        "      <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\" class=\"rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200\" (click)=\"onDismiss()\">Dismiss</button>",
        "      <button type=\"button\" tngPopoverClose [tngPopoverClose]=\"'programmatic'\" class=\"rounded-lg border border-sky-600 bg-sky-600 px-3 py-2 text-sm font-semibold text-white\" (click)=\"onContinue()\">Continue</button>",
        '    </div>',
        '  </section>',
        '</section>',
        '<p class="text-sm text-slate-600 dark:text-slate-300">result: {{ result() }}</p>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-popover-controlled-review-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onDestructivePlainClosed(reason: TngPopoverCloseReason): void {
    this.destructivePlainResult.set(
      reason === 'outside-pointer' ? 'Closed by outside click' : `Closed (${reason})`,
    );
  }

  protected onDestructiveTailwindClosed(reason: TngPopoverCloseReason): void {
    this.destructiveTailwindResult.set(
      reason === 'outside-pointer' ? 'Closed by outside click' : `Closed (${reason})`,
    );
  }

  protected onControlledPlainClosed(reason: TngPopoverCloseReason): void {
    if (reason !== 'programmatic') {
      this.controlledPlainResult.set(`Closed (${reason})`);
    }
  }

  protected onControlledPlainDismiss(): void {
    this.controlledPlainResult.set('Review dismissed');
    this.controlledPlainOpen.set(false);
  }

  protected onControlledPlainContinue(): void {
    this.controlledPlainResult.set('Checklist accepted');
    this.controlledPlainOpen.set(false);
  }

  protected onControlledTailwindClosed(reason: TngPopoverCloseReason): void {
    if (reason !== 'programmatic') {
      this.controlledTailwindResult.set(`Closed (${reason})`);
    }
  }

  protected onControlledTailwindDismiss(): void {
    this.controlledTailwindResult.set('Review dismissed');
    this.controlledTailwindOpen.set(false);
  }

  protected onControlledTailwindContinue(): void {
    this.controlledTailwindResult.set('Checklist accepted');
    this.controlledTailwindOpen.set(false);
  }
}
