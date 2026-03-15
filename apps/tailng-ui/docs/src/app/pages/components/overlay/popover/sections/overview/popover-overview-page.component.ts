import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngPopoverComponent } from '@tailng-ui/components';
import {
  TngPopover,
  TngPopoverClose,
  TngPopoverPanel,
  TngPopoverTrigger,
  type TngPopoverCloseReason,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-popover-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngPopover,
    TngPopoverClose,
    TngPopoverComponent,
    TngPopoverPanel,
    TngPopoverTrigger,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './popover-overview-page.component.html',
  styleUrl: './popover-overview-page.component.css',
})
export class PopoverOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly headlessOpen = signal(false);
  protected readonly plainOpen = signal(false);
  protected readonly tailwindOpen = signal(false);

  protected readonly headlessCloseReason = signal<TngPopoverCloseReason | 'none'>('none');
  protected readonly plainCloseReason = signal<TngPopoverCloseReason | 'none'>('none');
  protected readonly tailwindCloseReason = signal<TngPopoverCloseReason | 'none'>('none');

  protected readonly primitiveImportCode = [
    "import { TngPopover, TngPopoverPanel, TngPopoverTrigger, TngPopoverClose } from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngPopoverComponent } from '@tailng-ui/components';",
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<section tngPopover #reviewPopover="tngPopover">',
    '  <button type="button" [tngPopoverTrigger]="reviewPopover">Project actions</button>',
    '  <section tngPopoverPanel>',
    '    <p>Popover body content.</p>',
    '    <button type="button" tngPopoverClose [tngPopoverClose]="\'programmatic\'">Close</button>',
    '  </section>',
    '</section>',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-popover triggerLabel="Project actions">',
    '  <p>Wrapper popover body content.</p>',
    '</tng-popover>',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'popover-overview-headless.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly lastReason = signal<'none' | TngPopoverCloseReason>('none');",
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-overview-headless.component.html',
      code: [
        '<section tngPopover #popover="tngPopover" [open]="open()" (openChange)="open.set($event)">',
        '  <button type="button" [tngPopoverTrigger]="popover">Open headless popover</button>',
        '  <section tngPopoverPanel>',
        '    <p>Review checklist before shipping.</p>',
        '    <button type="button" tngPopoverClose [tngPopoverClose]="\'programmatic\'">Ship</button>',
        '  </section>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'popover-overview-headless.component.css',
      code: [
        '[data-slot="popover-panel"] {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.75rem;',
        '  box-shadow: 0 18px 32px rgb(2 6 23 / 22%);',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'popover-overview-plain-css.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly lastReason = signal<'none' | TngPopoverCloseReason>('none');",
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-overview-plain-css.component.html',
      code: [
        '<tng-popover',
        '  #popover',
        '  triggerLabel="Project actions"',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '  (closed)="lastReason.set($event)"',
        '>',
        '  <p>Use wrapper defaults and style projected content.</p>',
        '  <button type="button" (click)="popover.close()">Apply</button>',
        '</tng-popover>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'popover-overview-plain-css.component.css',
      code: [
        '.popover-trigger {',
        '  border-radius: 0.65rem;',
        '  padding: 0.45rem 0.85rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'popover-overview-tailwind.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly lastReason = signal<'none' | TngPopoverCloseReason>('none');",
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-overview-tailwind.component.html',
      code: [
        '<tng-popover #popover triggerLabel="Tailwind actions" [open]="open()" (openChange)="open.set($event)">',
        '  <p class="text-sm text-slate-700 dark:text-slate-300">Projected content styled with utilities.</p>',
        '  <button (click)="popover.close()" class="rounded-lg bg-sky-600 px-3 py-2 text-sm text-white">',
        '    Apply',
        '  </button>',
        '</tng-popover>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'popover-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onHeadlessClose(reason: TngPopoverCloseReason): void {
    this.headlessCloseReason.set(reason);
  }

  protected onHeadlessOpenChange(isOpen: boolean): void {
    this.headlessOpen.set(isOpen);
  }

  protected onPlainClose(reason: TngPopoverCloseReason): void {
    this.plainCloseReason.set(reason);
  }

  protected onPlainOpenChange(isOpen: boolean): void {
    this.plainOpen.set(isOpen);
  }

  protected onTailwindClose(reason: TngPopoverCloseReason): void {
    this.tailwindCloseReason.set(reason);
  }

  protected onTailwindOpenChange(isOpen: boolean): void {
    this.tailwindOpen.set(isOpen);
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
