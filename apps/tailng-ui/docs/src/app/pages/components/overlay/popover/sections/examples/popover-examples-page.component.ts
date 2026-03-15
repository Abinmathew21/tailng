import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngPopoverComponent } from '@tailng-ui/components';
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
  selector: 'app-popover-examples-page',
  imports: [
    TngPopover,
    TngPopoverClose,
    TngPopoverComponent,
    TngPopoverPanel,
    TngPopoverTrigger,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './popover-examples-page.component.html',
  styleUrl: './popover-examples-page.component.css',
})
export class PopoverExamplesPageComponent implements OnDestroy {
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
      title: 'popover-examples-headless.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly result = signal('No decision yet');",
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-examples-headless.component.html',
      code: [
        '<section tngPopover #confirmPopover="tngPopover" [open]="open()" (openChange)="open.set($event)">',
        '  <div class="popover-anchor">',
        '    <button type="button" [tngPopoverTrigger]="confirmPopover">Delete release branch</button>',
        '    <section tngPopoverPanel>',
        '      <h3>Delete release branch?</h3>',
        '      <p>This action cannot be undone.</p>',
        '      <div>',
        '        <button type="button" tngPopoverClose (click)="result.set(\'Canceled\')">Cancel</button>',
        '        <button type="button" tngPopoverClose [tngPopoverClose]="\'programmatic\'" (click)="result.set(\'Deleted\')">',
        '          Delete',
        '        </button>',
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
      title: 'popover-examples-headless.component.css',
      code: [
        '.popover-anchor {',
        '  position: relative;',
        '}',
        '',
        '.popover-panel {',
        '  left: 0;',
        '  min-width: 20rem;',
        '  position: absolute;',
        '  top: calc(100% + 0.5rem);',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'popover-examples-plain-css.component.ts',
      code: [
        "readonly open = signal(false);",
        "readonly result = signal('No decision yet');",
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-examples-plain-css.component.html',
      code: [
        '<tng-popover',
        '  #popover',
        '  triggerLabel="Publish snapshot"',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '>',
        '  <p>Promote this build to staging and notify QA.</p>',
        '  <div class="action-row">',
        '    <button type="button" (click)="result.set(\'Canceled\'); popover.close()">Cancel</button>',
        '    <button type="button" (click)="result.set(\'Published\'); popover.close()">',
        '      Publish',
        '    </button>',
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
        '.action-row {',
        '  display: flex;',
        '  justify-content: flex-end;',
        '  gap: 0.5rem;',
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
        "readonly open = signal(false);",
        "readonly result = signal('No decision yet');",
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-examples-tailwind.component.html',
      code: [
        '<tng-popover #popover triggerLabel="Approve deployment" [open]="open()" (openChange)="open.set($event)">',
        '  <p class="m-0 text-sm text-slate-700 dark:text-slate-300">',
        '    Rollout starts in us-east then eu-west.',
        '  </p>',
        '  <div class="mt-3 flex flex-wrap justify-end gap-2">',
        '    <button type="button" (click)="result.set(\'Deployment on hold\'); popover.close()" class="rounded-lg border px-3 py-2 text-sm">',
        '      Hold',
        '    </button>',
        '    <button type="button" (click)="result.set(\'Deployment approved\'); popover.close()" class="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white">',
        '      Approve',
        '    </button>',
        '  </div>',
        '</tng-popover>',
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

  protected onHeadlessOpenChange(isOpen: boolean): void {
    this.headlessOpen.set(isOpen);
  }

  protected onPlainOpenChange(isOpen: boolean): void {
    this.plainOpen.set(isOpen);
  }

  protected onTailwindOpenChange(isOpen: boolean): void {
    this.tailwindOpen.set(isOpen);
  }

  protected onHeadlessClosed(reason: TngPopoverCloseReason): void {
    if (reason === 'escape') {
      this.headlessResult.set('Closed with Escape');
      return;
    }

    if (reason === 'outside-pointer') {
      this.headlessResult.set('Closed by outside click');
    }
  }

  protected onPlainClosed(reason: TngPopoverCloseReason): void {
    if (reason === 'escape') {
      this.plainResult.set('Closed with Escape');
      return;
    }

    if (reason === 'outside-pointer') {
      this.plainResult.set('Closed by outside click');
    }
  }

  protected onTailwindClosed(reason: TngPopoverCloseReason): void {
    if (reason === 'escape') {
      this.tailwindResult.set('Closed with Escape');
      return;
    }

    if (reason === 'outside-pointer') {
      this.tailwindResult.set('Closed by outside click');
    }
  }

  protected onHeadlessCancel(): void {
    this.headlessResult.set('Canceled');
  }

  protected onHeadlessDelete(): void {
    this.headlessResult.set('Deleted release branch');
  }

  protected onPlainCancel(): void {
    this.plainResult.set('Canceled');
  }

  protected onPlainApprove(): void {
    this.plainResult.set('Published to staging');
  }

  protected onTailwindCancel(): void {
    this.tailwindResult.set('Deployment on hold');
  }

  protected onTailwindApprove(): void {
    this.tailwindResult.set('Deployment approved');
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
