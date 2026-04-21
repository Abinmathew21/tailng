import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngDialogComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

type DialogCloseReason = 'backdrop' | 'close-button' | 'escape' | 'programmatic';

@Component({
  selector: 'app-dialog-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngDialogComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './dialog-overview-page.component.html',
  styleUrl: './dialog-overview-page.component.css',
})
export class DialogOverviewPageComponent implements OnDestroy {
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

  protected readonly plainCloseReason = signal<DialogCloseReason | 'none'>('none');
  protected readonly tailwindCloseReason = signal<DialogCloseReason | 'none'>('none');

  protected readonly componentImportCode = [
    "import { TngDialogComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<button type="button" (click)="open.set(true)">Open review</button>',
    '',
    '<tng-dialog',
    '  title="Review changes"',
    '  description="Confirm before publishing the release."',
    '  [open]="open()"',
    '  (openChange)="open.set($event)"',
    '  (closed)="onClosed($event)"',
    '>',
    '  <p>Wrapper dialog body content.</p>',
    '</tng-dialog>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'dialog-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngDialogComponent } from '@tailng-ui/components';",
        '',
        "type DialogCloseReason = 'backdrop' | 'close-button' | 'escape' | 'programmatic';",
        '',
        '@Component({',
        "  selector: 'app-dialog-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngDialogComponent],',
        "  templateUrl: './dialog-overview-plain-css.component.html',",
        "  styleUrl: './dialog-overview-plain-css.component.css',",
        '})',
        'export class DialogOverviewPlainCssComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly lastReason = signal<DialogCloseReason | 'none'>('none');",
        '',
        '  protected onClosed(reason: DialogCloseReason): void {',
        '    this.lastReason.set(reason);',
        '  }',
        '',
        '  protected onOpenChange(next: boolean): void {',
        '    this.open.set(next);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-overview-plain-css.component.html',
      code: [
        '<button type="button" class="dialog-trigger" (click)="open.set(true)">Open review dialog</button>',
        '',
        '<tng-dialog',
        '  title="Review changes"',
        '  description="Wrapper provides panel, backdrop, and close affordance out of the box."',
        '  [open]="open()"',
        '  (openChange)="onOpenChange($event)"',
        '  (closed)="onClosed($event)"',
        '>',
        '  <p class="dialog-body-copy">Use the wrapper when your team wants quick defaults.</p>',
        '  <div class="dialog-preview-actions">',
        '    <button type="button" class="dialog-action-ghost" (click)="open.set(false)">Cancel</button>',
        '    <button type="button" class="dialog-action-primary" (click)="open.set(false)">Apply</button>',
        '  </div>',
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
        '  border-radius: 0.7rem;',
        '  min-height: 2.1rem;',
        '  padding: 0.45rem 0.9rem;',
        '}',
        '',
        '.dialog-preview-actions {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.6rem;',
        '  justify-content: flex-end;',
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
        "import { Component, signal } from '@angular/core';",
        "import { TngDialogComponent } from '@tailng-ui/components';",
        '',
        "type DialogCloseReason = 'backdrop' | 'close-button' | 'escape' | 'programmatic';",
        '',
        '@Component({',
        "  selector: 'app-dialog-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngDialogComponent],',
        "  templateUrl: './dialog-overview-tailwind.component.html',",
        "  styleUrl: './dialog-overview-tailwind.component.css',",
        '})',
        'export class DialogOverviewTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly lastReason = signal<DialogCloseReason | 'none'>('none');",
        '',
        '  protected onClosed(reason: DialogCloseReason): void {',
        '    this.lastReason.set(reason);',
        '  }',
        '',
        '  protected onOpenChange(next: boolean): void {',
        '    this.open.set(next);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <button',
        '    type="button"',
        '    class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"',
        '    (click)="open.set(true)"',
        '  >',
        '    Open review dialog',
        '  </button>',
        '',
        '  <tng-dialog',
        '    title="Tailwind review"',
        '    description="Combine wrapper behavior with utility classes for local theming."',
        '    [open]="open()"',
        '    (openChange)="onOpenChange($event)"',
        '    (closed)="onClosed($event)"',
        '  >',
        '    <p class="m-0 text-sm text-slate-700 dark:text-slate-300">Use utility classes directly in projected content.</p>',
        '    <div class="mt-3 flex flex-wrap justify-end gap-2">',
        '      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200" (click)="open.set(false)">Cancel</button>',
        '      <button type="button" class="rounded-lg border border-sky-600 bg-sky-600 px-3 py-2 text-sm font-semibold text-white" (click)="open.set(false)">Approve</button>',
        '    </div>',
        '  </tng-dialog>',
        '</div>',
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

  protected onPlainClose(reason: DialogCloseReason): void {
    this.plainCloseReason.set(reason);
  }

  protected onPlainOpenChange(isOpen: boolean): void {
    this.plainOpen.set(isOpen);
  }

  protected onTailwindClose(reason: DialogCloseReason): void {
    this.tailwindCloseReason.set(reason);
  }

  protected onTailwindOpenChange(isOpen: boolean): void {
    this.tailwindOpen.set(isOpen);
  }
}
