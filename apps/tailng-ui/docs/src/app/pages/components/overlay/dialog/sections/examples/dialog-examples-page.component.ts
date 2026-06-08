import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngDialogComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-dialog-examples-page',
  imports: [TngDialogComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './dialog-examples-page.component.html',
  styleUrl: './dialog-examples-page.component.css',
})
export class DialogExamplesPageComponent implements OnDestroy {
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
  protected readonly contentSlotOpen = signal(false);
  protected readonly contentSlotTailwindOpen = signal(false);

  protected readonly plainResult = signal('No decision yet');
  protected readonly tailwindResult = signal('No decision yet');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'dialog-examples-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngDialogComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-dialog-examples-plain-css',",
        '  standalone: true,',
        '  imports: [TngDialogComponent],',
        "  templateUrl: './dialog-examples-plain-css.component.html',",
        "  styleUrl: './dialog-examples-plain-css.component.css',",
        '})',
        'export class DialogExamplesPlainCssComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly result = signal('No decision yet');",
        '',
        '  protected onApprove(): void {',
        "    this.result.set('Deleted release branch');",
        '    this.open.set(false);',
        '  }',
        '',
        '  protected onCancel(): void {',
        "    this.result.set('Canceled');",
        '    this.open.set(false);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-examples-plain-css.component.html',
      code: [
        '<button type="button" class="dialog-example-trigger" (click)="open.set(true)">',
        '  Delete release branch',
        '</button>',
        '',
        '<tng-dialog',
        '  title="Delete release branch?"',
        '  description="This action removes branch automation and cannot be undone."',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '>',
        '  <div class="dialog-action-row">',
        '    <button type="button" class="dialog-example-secondary" (click)="onCancel()">Cancel</button>',
        '    <button type="button" class="dialog-example-danger" (click)="onApprove()">Delete</button>',
        '  </div>',
        '</tng-dialog>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'dialog-examples-plain-css.component.css',
      code: [
        '.dialog-action-row {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.55rem;',
        '  justify-content: flex-end;',
        '}',
        '',
        '.dialog-example-danger {',
        '  background: #dc2626;',
        '  color: #fff;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly contentSlotPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'dialog-content-slot-plain.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngDialogComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-dialog-content-slot-plain',",
        '  standalone: true,',
        '  imports: [TngDialogComponent],',
        "  templateUrl: './dialog-content-slot-plain.component.html',",
        "  styleUrl: './dialog-content-slot-plain.component.css',",
        '})',
        'export class DialogContentSlotPlainComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-content-slot-plain.component.html',
      code: [
        '<button type="button" class="dialog-example-trigger" (click)="open.set(true)">',
        '  Open rollout notes',
        '</button>',
        '',
        '<tng-dialog',
        '  title="Rollout notes"',
        '  description="Review the deployment summary before approving."',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '>',
        '  <p>Traffic shifts in us-east first, then eu-west after health checks pass.</p>',
        '  <ul>',
        '    <li>Canary window: 15 minutes</li>',
        '    <li>Rollback owner: platform-oncall</li>',
        '    <li>Feature flags: checkout-v2, billing-sync</li>',
        '  </ul>',
        '</tng-dialog>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'dialog-content-slot-plain.component.css',
      code: [
        'tng-dialog [data-slot="dialog-content"] {',
        '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 8%, var(--tng-semantic-background-surface));',
        '  border: 1px dashed var(--tng-semantic-border-subtle);',
        '  border-radius: 0.75rem;',
        '  display: grid;',
        '  gap: 0.65rem;',
        '  padding: 0.85rem 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly contentSlotTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'dialog-content-slot-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngDialogComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-dialog-content-slot-tailwind',",
        '  standalone: true,',
        '  imports: [TngDialogComponent],',
        "  templateUrl: './dialog-content-slot-tailwind.component.html',",
        "  styleUrl: './dialog-content-slot-tailwind.component.css',",
        '})',
        'export class DialogContentSlotTailwindComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-content-slot-tailwind.component.html',
      code: [
        '<tng-dialog',
        '  title="Rollout notes"',
        '  description="Review the deployment summary before approving."',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '>',
        '  <p class="m-0 text-sm text-slate-700 dark:text-slate-300">Traffic shifts in us-east first.</p>',
        '  <ul class="m-0 grid list-disc gap-1 pl-5 text-sm text-slate-700 dark:text-slate-300">',
        '    <li>Canary window: 15 minutes</li>',
        '    <li>Rollback owner: platform-oncall</li>',
        '  </ul>',
        '</tng-dialog>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'dialog-content-slot-tailwind.component.css',
      code: [
        'tng-dialog [data-slot="dialog-content"] {',
        '  background: rgb(248 250 252);',
        '  border: 1px solid rgb(226 232 240);',
        '  border-radius: 1rem;',
        '  display: grid;',
        '  gap: 0.75rem;',
        '  padding: 1rem;',
        '}',
        '',
        ':host-context(.dark) tng-dialog [data-slot="dialog-content"] {',
        '  background: rgb(15 23 42);',
        '  border-color: rgb(51 65 85);',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'dialog-examples-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngDialogComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-dialog-examples-tailwind',",
        '  standalone: true,',
        '  imports: [TngDialogComponent],',
        "  templateUrl: './dialog-examples-tailwind.component.html',",
        "  styleUrl: './dialog-examples-tailwind.component.css',",
        '})',
        'export class DialogExamplesTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly result = signal('No decision yet');",
        '',
        '  protected onApprove(): void {',
        "    this.result.set('Deployment approved');",
        '    this.open.set(false);',
        '  }',
        '',
        '  protected onCancel(): void {',
        "    this.result.set('Canceled');",
        '    this.open.set(false);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'dialog-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <button',
        '    type="button"',
        '    class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"',
        '    (click)="open.set(true)"',
        '  >',
        '    Approve deployment',
        '  </button>',
        '',
        '  <tng-dialog',
        '    title="Approve deployment"',
        '    description="Proceed with production rollout for version 2.7.0?"',
        '    [open]="open()"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <p class="m-0 text-sm text-slate-700 dark:text-slate-300">Rollout will start in us-east and eu-west.</p>',
        '    <div class="mt-3 flex flex-wrap justify-end gap-2">',
        '      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200" (click)="onCancel()">Hold</button>',
        '      <button type="button" class="rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white" (click)="onApprove()">Approve</button>',
        '    </div>',
        '  </tng-dialog>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'dialog-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainApprove(): void {
    this.plainResult.set('Deleted release branch');
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
}
