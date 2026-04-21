import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngPopoverComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-popover-examples-page',
  imports: [TngPopoverComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './popover-examples-page.component.html',
  styleUrl: './popover-examples-page.component.css',
})
export class PopoverExamplesPageComponent implements OnDestroy {
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

  protected readonly plainResult = signal('No decision yet');
  protected readonly tailwindResult = signal('No decision yet');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'popover-examples-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPopoverComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-popover-examples-plain-css',",
        '  standalone: true,',
        '  imports: [TngPopoverComponent],',
        "  templateUrl: './popover-examples-plain-css.component.html',",
        "  styleUrl: './popover-examples-plain-css.component.css',",
        '})',
        'export class PopoverExamplesPlainCssComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly result = signal('No decision yet');",
        '',
        '  protected onCancel(): void {',
        "    this.result.set('Canceled');",
        '    this.open.set(false);',
        '  }',
        '',
        '  protected onApprove(): void {',
        "    this.result.set('Deleted release branch');",
        '    this.open.set(false);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-examples-plain-css.component.html',
      code: [
        '<tng-popover',
        '  triggerLabel="Delete release branch"',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '>',
        '  <p class="popover-example-copy">This action removes branch automation and cannot be undone.</p>',
        '  <div class="popover-action-row">',
        '    <button type="button" class="popover-example-secondary" (click)="onCancel()">Cancel</button>',
        '    <button type="button" class="popover-example-danger" (click)="onApprove()">Delete</button>',
        '  </div>',
        '</tng-popover>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'popover-examples-plain-css.component.css',
      code: [
        '.popover-action-row {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.55rem;',
        '  justify-content: flex-end;',
        '}',
        '',
        '.popover-example-danger {',
        '  background: #dc2626;',
        '  color: #fff;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'popover-examples-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPopoverComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-popover-examples-tailwind',",
        '  standalone: true,',
        '  imports: [TngPopoverComponent],',
        "  templateUrl: './popover-examples-tailwind.component.html',",
        "  styleUrl: './popover-examples-tailwind.component.css',",
        '})',
        'export class PopoverExamplesTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly result = signal('No decision yet');",
        '',
        '  protected onCancel(): void {',
        "    this.result.set('Deployment on hold');",
        '    this.open.set(false);',
        '  }',
        '',
        '  protected onApprove(): void {',
        "    this.result.set('Deployment approved');",
        '    this.open.set(false);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-popover',
        '    triggerLabel="Approve deployment"',
        '    [open]="open()"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <p class="m-0 text-sm text-slate-700 dark:text-slate-300">Rollout will start in us-east and eu-west.</p>',
        '    <div class="mt-3 flex flex-wrap justify-end gap-2">',
        '      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200" (click)="onCancel()">Hold</button>',
        '      <button type="button" class="rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white" (click)="onApprove()">Approve</button>',
        '    </div>',
        '  </tng-popover>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'popover-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainCancel(): void {
    this.plainResult.set('Canceled');
    this.plainOpen.set(false);
  }

  protected onPlainApprove(): void {
    this.plainResult.set('Deleted release branch');
    this.plainOpen.set(false);
  }

  protected onTailwindCancel(): void {
    this.tailwindResult.set('Deployment on hold');
    this.tailwindOpen.set(false);
  }

  protected onTailwindApprove(): void {
    this.tailwindResult.set('Deployment approved');
    this.tailwindOpen.set(false);
  }
}
