import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngDialogComponent } from '@tailng-ui/components';
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
  selector: 'app-dialog-examples-page',
  imports: [
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
  templateUrl: './dialog-examples-page.component.html',
  styleUrl: './dialog-examples-page.component.css',
})
export class DialogExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly headlessOpen = signal(false);
  protected readonly plainOpen = signal(false);
  protected readonly tailwindOpen = signal(false);

  protected readonly headlessResult = signal('No decision yet');
  protected readonly plainResult = signal('No decision yet');
  protected readonly tailwindResult = signal('No decision yet');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'dialog-examples-headless.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly result = signal('No decision yet');",
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-examples-headless.component.html',
      code: [
        '<button type="button" [tngDialogTrigger]="dialog">Open confirmation</button>',
        '<section tngDialog #dialog="tngDialog">',
        '  <div tngDialogBackdrop>',
        '    <section tngDialogPanel>',
        '      <h2 tngDialogTitle>Delete release branch?</h2>',
        '      <div tngDialogActions>',
        '        <button type="button" tngDialogClose>Cancel</button>',
        '        <button type="button" tngDialogClose [tngDialogClose]="\'programmatic\'">Delete</button>',
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
      title: 'dialog-examples-headless.component.css',
      code: '.dialog-example-panel { max-width: 28rem; width: 100%; }',
    },
  ]);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'dialog-examples-plain-css.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly result = signal('No decision yet');",
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-examples-plain-css.component.html',
      code: [
        '<button type="button" (click)="open.set(true)">Open dialog</button>',
        '<tng-dialog title="Publish snapshot" [open]="open()" (openChange)="open.set($event)">',
        '  <p>Confirm publishing to staging.</p>',
        '</tng-dialog>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'dialog-examples-plain-css.component.css',
      code: '.dialog-action-row { justify-content: flex-end; }',
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'dialog-examples-tailwind.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly result = signal('No decision yet');",
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-examples-tailwind.component.html',
      code: [
        '<button class="rounded-lg border px-3 py-2" (click)="open.set(true)">Open</button>',
        '<tng-dialog title="Tailwind example" [open]="open()" (openChange)="open.set($event)">',
        '  <p class="text-sm text-slate-700 dark:text-slate-300">Review deployment notice.</p>',
        '</tng-dialog>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'dialog-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onHeadlessClosed(reason: TngDialogCloseReason): void {
    this.headlessResult.set(reason === 'programmatic' ? 'Deleted release branch' : `Closed (${reason})`);
  }

  protected onHeadlessOpenChange(isOpen: boolean): void {
    this.headlessOpen.set(isOpen);
  }

  protected onPlainApprove(): void {
    this.plainResult.set('Published to staging');
    this.plainOpen.set(false);
  }

  protected onPlainCancel(): void {
    this.plainResult.set('Canceled');
    this.plainOpen.set(false);
  }

  protected onTailwindApprove(): void {
    this.tailwindResult.set('Deployment approved');
    this.tailwindOpen.set(false);
  }

  protected onTailwindCancel(): void {
    this.tailwindResult.set('Canceled');
    this.tailwindOpen.set(false);
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
