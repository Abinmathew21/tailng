import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngStepperComponent } from '@tailng-ui/components';
import { TngStepper as TngStepperPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-stepper-examples-page',
  imports: [
    TngStepperComponent,
    TngStepperPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './stepper-examples-page.component.html',
  styleUrl: './stepper-examples-page.component.css',
})
export class StepperExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly checkoutHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'stepper-examples-checkout-headless.component.ts',
      code: ["readonly flow = ['Cart', 'Shipping', 'Payment'];", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-examples-checkout-headless.component.html',
      code: [
        '<ol tngStepper class="stepper-example-list" aria-label="Checkout progress">',
        '  <li class="stepper-example-item is-complete"><span class="dot">✓</span> Cart</li>',
        '  <li class="stepper-example-item is-current"><span class="dot">2</span> Shipping</li>',
        '  <li class="stepper-example-item"><span class="dot">3</span> Payment</li>',
        '</ol>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-examples-checkout-headless.component.css',
      code: [
        '.stepper-example-item.is-current {',
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
      title: 'stepper-examples-checkout-plain-css.component.ts',
      code: ["readonly current = 'Shipping';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-examples-checkout-plain-css.component.html',
      code: [
        '<div class="stepper-example-shell stepper-example-shell--plain">',
        '  <tng-stepper ariaLabel="Checkout progress">',
        '    <ol class="stepper-example-list">',
        '      <li class="stepper-example-item is-complete"><span class="dot">✓</span> Cart</li>',
        '      <li class="stepper-example-item is-current"><span class="dot">2</span> Shipping</li>',
        '      <li class="stepper-example-item"><span class="dot">3</span> Payment</li>',
        '    </ol>',
        '  </tng-stepper>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-examples-checkout-plain-css.component.css',
      code: [
        '.stepper-example-shell--plain {',
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
      title: 'stepper-examples-checkout-tailwind.component.ts',
      code: ["readonly current = 'Shipping';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-examples-checkout-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-stepper ariaLabel="Checkout progress">',
        '    <ol class="stepper-example-list">',
        '      <li class="stepper-example-item is-complete"><span class="dot">✓</span> Cart</li>',
        '      <li class="stepper-example-item is-current"><span class="dot">2</span> Shipping</li>',
        '      <li class="stepper-example-item"><span class="dot">3</span> Payment</li>',
        '    </ol>',
        '  </tng-stepper>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-examples-checkout-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly releaseHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'stepper-examples-release-headless.component.ts',
      code: ["readonly stage = 'Publish';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-examples-release-headless.component.html',
      code: [
        '<ol tngStepper class="stepper-example-list" aria-label="Release flow">',
        '  <li class="stepper-example-item is-complete"><span class="dot">✓</span> Draft</li>',
        '  <li class="stepper-example-item is-complete"><span class="dot">✓</span> Review</li>',
        '  <li class="stepper-example-item is-current"><span class="dot">3</span> Publish</li>',
        '</ol>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-examples-release-headless.component.css',
      code: [
        '.stepper-example-item.is-complete {',
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
      title: 'stepper-examples-release-plain-css.component.ts',
      code: ["readonly stage = 'Publish';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-examples-release-plain-css.component.html',
      code: [
        '<div class="stepper-example-shell stepper-example-shell--plain">',
        '  <tng-stepper ariaLabel="Release flow">',
        '    <ol class="stepper-example-list">',
        '      <li class="stepper-example-item is-complete"><span class="dot">✓</span> Draft</li>',
        '      <li class="stepper-example-item is-complete"><span class="dot">✓</span> Review</li>',
        '      <li class="stepper-example-item is-current"><span class="dot">3</span> Publish</li>',
        '    </ol>',
        '  </tng-stepper>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-examples-release-plain-css.component.css',
      code: [
        '.stepper-example-item.is-complete {',
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
      title: 'stepper-examples-release-tailwind.component.ts',
      code: ["readonly stage = 'Publish';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-examples-release-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-stepper ariaLabel="Release flow">',
        '    <ol class="stepper-example-list">',
        '      <li class="stepper-example-item is-complete"><span class="dot">✓</span> Draft</li>',
        '      <li class="stepper-example-item is-complete"><span class="dot">✓</span> Review</li>',
        '      <li class="stepper-example-item is-current"><span class="dot">3</span> Publish</li>',
        '    </ol>',
        '  </tng-stepper>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-examples-release-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly errorHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'stepper-examples-error-headless.component.ts',
      code: ["readonly failingStep = 'Billing';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-examples-error-headless.component.html',
      code: [
        '<ol tngStepper class="stepper-example-list" aria-label="Onboarding">',
        '  <li class="stepper-example-item is-complete"><span class="dot">✓</span> Profile</li>',
        '  <li class="stepper-example-item is-error"><span class="dot">2</span> Billing</li>',
        '  <li class="stepper-example-item"><span class="dot">3</span> Team invite</li>',
        '</ol>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-examples-error-headless.component.css',
      code: [
        '.stepper-example-item.is-error {',
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
      title: 'stepper-examples-error-plain-css.component.ts',
      code: ["readonly failingStep = 'Billing';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-examples-error-plain-css.component.html',
      code: [
        '<div class="stepper-example-shell stepper-example-shell--plain">',
        '  <tng-stepper ariaLabel="Onboarding">',
        '    <ol class="stepper-example-list">',
        '      <li class="stepper-example-item is-complete"><span class="dot">✓</span> Profile</li>',
        '      <li class="stepper-example-item is-error"><span class="dot">2</span> Billing</li>',
        '      <li class="stepper-example-item"><span class="dot">3</span> Team invite</li>',
        '    </ol>',
        '  </tng-stepper>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-examples-error-plain-css.component.css',
      code: [
        '.stepper-example-item.is-error {',
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
      title: 'stepper-examples-error-tailwind.component.ts',
      code: ["readonly failingStep = 'Billing';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-examples-error-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-stepper ariaLabel="Onboarding">',
        '    <ol class="stepper-example-list">',
        '      <li class="stepper-example-item is-complete"><span class="dot">✓</span> Profile</li>',
        '      <li class="stepper-example-item is-error"><span class="dot">2</span> Billing</li>',
        '      <li class="stepper-example-item"><span class="dot">3</span> Team invite</li>',
        '    </ol>',
        '  </tng-stepper>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-examples-error-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

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
