import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngDialogComponent } from '@tailng-ui/components';
import {
  TngDialog,
  TngDialogActions,
  TngDialogBackdrop,
  TngDialogClose,
  TngDialogDescription,
  TngDialogPanel,
  TngDialogTitle,
  TngDialogTrigger,
  type TngDialogCloseReason,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-dialog-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngDialog,
    TngDialogActions,
    TngDialogBackdrop,
    TngDialogClose,
    TngDialogComponent,
    TngDialogDescription,
    TngDialogPanel,
    TngDialogTitle,
    TngDialogTrigger,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './dialog-overview-page.component.html',
  styleUrl: './dialog-overview-page.component.css',
})
export class DialogOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly headlessOpen = signal(false);
  protected readonly plainOpen = signal(false);
  protected readonly tailwindOpen = signal(false);

  protected readonly headlessCloseReason = signal<TngDialogCloseReason | 'none'>('none');
  protected readonly plainCloseReason = signal<'backdrop' | 'close-button' | 'escape' | 'programmatic' | 'none'>('none');
  protected readonly tailwindCloseReason = signal<'backdrop' | 'close-button' | 'escape' | 'programmatic' | 'none'>('none');

  protected readonly primitiveImportCode = [
    "import { TngDialog, TngDialogBackdrop, TngDialogPanel, TngDialogTrigger } from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngDialogComponent } from '@tailng-ui/components';",
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<button type="button" [tngDialogTrigger]="reviewDialog">Open review</button>',
    '<section tngDialog #reviewDialog="tngDialog">',
    '  <div tngDialogBackdrop>',
    '    <section tngDialogPanel>',
    '      <h2 tngDialogTitle>Review changes</h2>',
    '      <p tngDialogDescription>Confirm before publishing.</p>',
    '      <button type="button" tngDialogClose>Close</button>',
    '    </section>',
    '  </div>',
    '</section>',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-dialog title="Review changes" [open]="open" (openChange)="open = $event">',
    '  <p>Wrapper dialog body content.</p>',
    '</tng-dialog>',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'dialog-overview-headless.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly lastReason = signal<'none' | TngDialogCloseReason>('none');",
        '',
        'onOpenChange(next: boolean): void {',
        '  this.open.set(next);',
        '}',
        '',
        'onClosed(reason: TngDialogCloseReason): void {',
        '  this.lastReason.set(reason);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-overview-headless.component.html',
      code: [
        '<button type="button" [tngDialogTrigger]="dialog">Open dialog</button>',
        '<section tngDialog #dialog="tngDialog" [open]="open()">',
        '  <div tngDialogBackdrop>',
        '    <section tngDialogPanel>',
        '      <h2 tngDialogTitle>Review release</h2>',
        '      <p tngDialogDescription>Confirm before shipping.</p>',
        '      <div tngDialogActions>',
        '        <button type="button" tngDialogClose>Cancel</button>',
        '        <button type="button" tngDialogClose [tngDialogClose]="\'programmatic\'">Ship</button>',
        '      </div>',
        '    </section>',
        '  </div>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'dialog-overview-headless.component.css',
      code: [
        '.dialog-backdrop {',
        '  align-items: center;',
        '  background: rgb(2 6 23 / 56%);',
        '  display: grid;',
        '  inset: 0;',
        '  position: fixed;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'dialog-overview-plain-css.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly lastReason = signal('none');",
        '',
        'onOpenChange(next: boolean): void {',
        '  this.open.set(next);',
        '}',
        '',
        'onClosed(reason: string): void {',
        '  this.lastReason.set(reason);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-overview-plain-css.component.html',
      code: [
        '<button type="button" (click)="open.set(true)">Open wrapper dialog</button>',
        '<tng-dialog',
        '  title="Review release"',
        '  [open]="open()"',
        '  (openChange)="onOpenChange($event)"',
        '  (closed)="onClosed($event)"',
        '>',
        '  <p>Wrapper dialog body content.</p>',
        '</tng-dialog>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'dialog-overview-plain-css.component.css',
      code: [
        '.dialog-trigger {',
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
      title: 'dialog-overview-tailwind.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly lastReason = signal('none');",
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-overview-tailwind.component.html',
      code: [
        '<button class="rounded-lg border px-3 py-2" (click)="open.set(true)">Open dialog</button>',
        '<tng-dialog title="Tailwind dialog" [open]="open()" (openChange)="open.set($event)">',
        '  <p class="text-sm text-slate-600 dark:text-slate-300">Tailwind body content.</p>',
        '</tng-dialog>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'dialog-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onHeadlessClose(reason: TngDialogCloseReason): void {
    this.headlessCloseReason.set(reason);
  }

  protected onHeadlessOpenChange(isOpen: boolean): void {
    this.headlessOpen.set(isOpen);
  }

  protected onPlainClose(reason: 'backdrop' | 'close-button' | 'escape' | 'programmatic'): void {
    this.plainCloseReason.set(reason);
  }

  protected onPlainOpenChange(isOpen: boolean): void {
    this.plainOpen.set(isOpen);
  }

  protected onTailwindClose(reason: 'backdrop' | 'close-button' | 'escape' | 'programmatic'): void {
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
