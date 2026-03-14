import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCollapsibleComponent } from '@tailng-ui/components';
import {
  TngCollapsible as TngCollapsiblePrimitive,
  TngCollapsibleContent as TngCollapsibleContentPrimitive,
  TngCollapsibleTrigger as TngCollapsibleTriggerPrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

const checkoutHeadlessContentId = 'docs-collapsible-examples-checkout-headless-content';
const releaseHeadlessContentId = 'docs-collapsible-examples-release-headless-content';
const errorHeadlessContentId = 'docs-collapsible-examples-error-headless-content';

@Component({
  selector: 'app-collapsible-examples-page',
  imports: [
    TngCollapsibleComponent,
    TngCollapsiblePrimitive,
    TngCollapsibleTriggerPrimitive,
    TngCollapsibleContentPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './collapsible-examples-page.component.html',
  styleUrl: './collapsible-examples-page.component.css',
})
export class CollapsibleExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  public readonly checkoutHeadlessContentId = checkoutHeadlessContentId;
  public readonly releaseHeadlessContentId = releaseHeadlessContentId;
  public readonly errorHeadlessContentId = errorHeadlessContentId;
  public readonly checkoutHeadlessOpen = signal(false);
  public readonly releaseHeadlessOpen = signal(false);
  public readonly errorHeadlessOpen = signal(false);
  public readonly checkoutPlainOpen = signal(false);
  public readonly checkoutTailwindOpen = signal(false);
  public readonly releasePlainOpen = signal(false);
  public readonly releaseTailwindOpen = signal(false);
  public readonly errorPlainOpen = signal(false);
  public readonly errorTailwindOpen = signal(false);

  protected readonly checkoutHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-checkout-headless.component.ts',
      code: [
        "readonly checkoutHeadlessContentId = 'docs-collapsible-examples-checkout-headless-content';",
        'readonly checkoutHeadlessOpen = signal(false);',
        '',
        'onCheckoutHeadlessOpenChange(nextOpen: boolean): void {',
        '  this.checkoutHeadlessOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-checkout-headless.component.html',
      code: [
        '<section tngCollapsible class="collapsible-example-headless" [open]="checkoutHeadlessOpen()">',
        '  <button',
        '    tngCollapsibleTrigger',
        '    class="collapsible-example-trigger"',
        '    [open]="checkoutHeadlessOpen()"',
        '    [contentId]="checkoutHeadlessContentId"',
        '    (click)="onCheckoutHeadlessOpenChange(!checkoutHeadlessOpen())"',
        '  >',
        '    Checkout progress',
        '  </button>',
        '',
        '  <ol',
        '    tngCollapsibleContent',
        '    class="collapsible-example-list"',
        '    [id]="checkoutHeadlessContentId"',
        '    [open]="checkoutHeadlessOpen()"',
        '    aria-label="Checkout progress"',
        '  >',
        '    <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Cart</li>',
        '    <li class="collapsible-example-item is-current"><span class="dot">2</span> Shipping</li>',
        '    <li class="collapsible-example-item"><span class="dot">3</span> Payment</li>',
        '  </ol>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-checkout-headless.component.css',
      code: [
        '.collapsible-example-trigger {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '}',
        '',
        '.collapsible-example-item.is-current {',
        '  border-color: var(--tng-semantic-accent-brand);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly checkoutPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-checkout-plain-css.component.ts',
      code: [
        'readonly checkoutPlainOpen = signal(false);',
        '',
        'onCheckoutPlainOpenChange(nextOpen: boolean): void {',
        '  this.checkoutPlainOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-checkout-plain-css.component.html',
      code: [
        '<div class="collapsible-example-shell collapsible-example-shell--plain">',
        '  <tng-collapsible',
        '    title="Checkout progress"',
        '    ariaLabel="Checkout progress"',
        '    [open]="checkoutPlainOpen()"',
        '    (openChange)="onCheckoutPlainOpenChange($event)"',
        '  >',
        '    <ol class="collapsible-example-list">',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Cart</li>',
        '      <li class="collapsible-example-item is-current"><span class="dot">2</span> Shipping</li>',
        '      <li class="collapsible-example-item"><span class="dot">3</span> Payment</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-checkout-plain-css.component.css',
      code: [
        '.collapsible-example-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly checkoutTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-checkout-tailwind.component.ts',
      code: [
        'readonly checkoutTailwindOpen = signal(false);',
        '',
        'onCheckoutTailwindOpenChange(nextOpen: boolean): void {',
        '  this.checkoutTailwindOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-checkout-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-collapsible',
        '    title="Checkout progress"',
        '    ariaLabel="Checkout progress"',
        '    [open]="checkoutTailwindOpen()"',
        '    (openChange)="onCheckoutTailwindOpenChange($event)"',
        '  >',
        '    <ol class="collapsible-example-list">',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Cart</li>',
        '      <li class="collapsible-example-item is-current"><span class="dot">2</span> Shipping</li>',
        '      <li class="collapsible-example-item"><span class="dot">3</span> Payment</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-checkout-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly releaseHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-release-headless.component.ts',
      code: [
        "readonly releaseHeadlessContentId = 'docs-collapsible-examples-release-headless-content';",
        'readonly releaseHeadlessOpen = signal(false);',
        '',
        'onReleaseHeadlessOpenChange(nextOpen: boolean): void {',
        '  this.releaseHeadlessOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-release-headless.component.html',
      code: [
        '<section tngCollapsible class="collapsible-example-headless" [open]="releaseHeadlessOpen()">',
        '  <button',
        '    tngCollapsibleTrigger',
        '    class="collapsible-example-trigger"',
        '    [open]="releaseHeadlessOpen()"',
        '    [contentId]="releaseHeadlessContentId"',
        '    (click)="onReleaseHeadlessOpenChange(!releaseHeadlessOpen())"',
        '  >',
        '    Release flow',
        '  </button>',
        '',
        '  <ol',
        '    tngCollapsibleContent',
        '    class="collapsible-example-list"',
        '    [id]="releaseHeadlessContentId"',
        '    [open]="releaseHeadlessOpen()"',
        '    aria-label="Release flow"',
        '  >',
        '    <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Draft</li>',
        '    <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Review</li>',
        '    <li class="collapsible-example-item is-current"><span class="dot">3</span> Publish</li>',
        '  </ol>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-release-headless.component.css',
      code: [
        '.collapsible-example-item.is-complete {',
        '  border-color: var(--tng-semantic-accent-success);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly releasePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-release-plain-css.component.ts',
      code: [
        'readonly releasePlainOpen = signal(false);',
        '',
        'onReleasePlainOpenChange(nextOpen: boolean): void {',
        '  this.releasePlainOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-release-plain-css.component.html',
      code: [
        '<div class="collapsible-example-shell collapsible-example-shell--plain">',
        '  <tng-collapsible',
        '    title="Release flow"',
        '    ariaLabel="Release flow"',
        '    [open]="releasePlainOpen()"',
        '    (openChange)="onReleasePlainOpenChange($event)"',
        '  >',
        '    <ol class="collapsible-example-list">',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Draft</li>',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Review</li>',
        '      <li class="collapsible-example-item is-current"><span class="dot">3</span> Publish</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-release-plain-css.component.css',
      code: [
        '.collapsible-example-item.is-complete {',
        '  background: color-mix(in srgb, var(--tng-semantic-accent-success) 12%, transparent);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly releaseTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-release-tailwind.component.ts',
      code: [
        'readonly releaseTailwindOpen = signal(false);',
        '',
        'onReleaseTailwindOpenChange(nextOpen: boolean): void {',
        '  this.releaseTailwindOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-release-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-collapsible',
        '    title="Release flow"',
        '    ariaLabel="Release flow"',
        '    [open]="releaseTailwindOpen()"',
        '    (openChange)="onReleaseTailwindOpenChange($event)"',
        '  >',
        '    <ol class="collapsible-example-list">',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Draft</li>',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Review</li>',
        '      <li class="collapsible-example-item is-current"><span class="dot">3</span> Publish</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-release-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly errorHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-error-headless.component.ts',
      code: [
        "readonly errorHeadlessContentId = 'docs-collapsible-examples-error-headless-content';",
        'readonly errorHeadlessOpen = signal(false);',
        '',
        'onErrorHeadlessOpenChange(nextOpen: boolean): void {',
        '  this.errorHeadlessOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-error-headless.component.html',
      code: [
        '<section tngCollapsible class="collapsible-example-headless" [open]="errorHeadlessOpen()">',
        '  <button',
        '    tngCollapsibleTrigger',
        '    class="collapsible-example-trigger"',
        '    [open]="errorHeadlessOpen()"',
        '    [contentId]="errorHeadlessContentId"',
        '    (click)="onErrorHeadlessOpenChange(!errorHeadlessOpen())"',
        '  >',
        '    Onboarding',
        '  </button>',
        '',
        '  <ol',
        '    tngCollapsibleContent',
        '    class="collapsible-example-list"',
        '    [id]="errorHeadlessContentId"',
        '    [open]="errorHeadlessOpen()"',
        '    aria-label="Onboarding"',
        '  >',
        '    <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Profile</li>',
        '    <li class="collapsible-example-item is-error"><span class="dot">2</span> Billing</li>',
        '    <li class="collapsible-example-item"><span class="dot">3</span> Team invite</li>',
        '  </ol>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-error-headless.component.css',
      code: [
        '.collapsible-example-item.is-error {',
        '  border-color: var(--tng-semantic-accent-danger);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly errorPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-error-plain-css.component.ts',
      code: [
        'readonly errorPlainOpen = signal(false);',
        '',
        'onErrorPlainOpenChange(nextOpen: boolean): void {',
        '  this.errorPlainOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-error-plain-css.component.html',
      code: [
        '<div class="collapsible-example-shell collapsible-example-shell--plain">',
        '  <tng-collapsible',
        '    title="Onboarding"',
        '    ariaLabel="Onboarding"',
        '    [open]="errorPlainOpen()"',
        '    (openChange)="onErrorPlainOpenChange($event)"',
        '  >',
        '    <ol class="collapsible-example-list">',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Profile</li>',
        '      <li class="collapsible-example-item is-error"><span class="dot">2</span> Billing</li>',
        '      <li class="collapsible-example-item"><span class="dot">3</span> Team invite</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-error-plain-css.component.css',
      code: [
        '.collapsible-example-item.is-error {',
        '  background: color-mix(in srgb, var(--tng-semantic-accent-danger) 10%, transparent);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly errorTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-error-tailwind.component.ts',
      code: [
        'readonly errorTailwindOpen = signal(false);',
        '',
        'onErrorTailwindOpenChange(nextOpen: boolean): void {',
        '  this.errorTailwindOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-error-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-collapsible',
        '    title="Onboarding"',
        '    ariaLabel="Onboarding"',
        '    [open]="errorTailwindOpen()"',
        '    (openChange)="onErrorTailwindOpenChange($event)"',
        '  >',
        '    <ol class="collapsible-example-list">',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Profile</li>',
        '      <li class="collapsible-example-item is-error"><span class="dot">2</span> Billing</li>',
        '      <li class="collapsible-example-item"><span class="dot">3</span> Team invite</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-error-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public onCheckoutHeadlessOpenChange(nextOpen: boolean): void {
    this.checkoutHeadlessOpen.set(nextOpen);
  }

  public onCheckoutPlainOpenChange(nextOpen: boolean): void {
    this.checkoutPlainOpen.set(nextOpen);
  }

  public onCheckoutTailwindOpenChange(nextOpen: boolean): void {
    this.checkoutTailwindOpen.set(nextOpen);
  }

  public onReleasePlainOpenChange(nextOpen: boolean): void {
    this.releasePlainOpen.set(nextOpen);
  }

  public onReleaseHeadlessOpenChange(nextOpen: boolean): void {
    this.releaseHeadlessOpen.set(nextOpen);
  }

  public onReleaseTailwindOpenChange(nextOpen: boolean): void {
    this.releaseTailwindOpen.set(nextOpen);
  }

  public onErrorPlainOpenChange(nextOpen: boolean): void {
    this.errorPlainOpen.set(nextOpen);
  }

  public onErrorHeadlessOpenChange(nextOpen: boolean): void {
    this.errorHeadlessOpen.set(nextOpen);
  }

  public onErrorTailwindOpenChange(nextOpen: boolean): void {
    this.errorTailwindOpen.set(nextOpen);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
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
