import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngStepper,
  TngStepperConnector,
  TngStepperDescription,
  TngStepperItem,
  TngStepperLabel,
  TngStepperTrigger,
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
  selector: 'app-headless-stepper-examples-page',
  imports: [
    TngStepper,
    TngStepperConnector,
    TngStepperDescription,
    TngStepperItem,
    TngStepperLabel,
    TngStepperTrigger,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './stepper-examples-page.component.html',
  styleUrls: ['./stepper-examples-page.component.css'],
})
export class HeadlessStepperExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly checkoutPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-stepper-checkout.component.html',
      code: [
        '<section tngStepper defaultValue="shipping" ariaLabel="Checkout progress">',
        '  <ol class="headless-stepper-example-list">',
        '    <li tngStepperItem value="cart" label="Cart" completed class="headless-stepper-example-item">',
        '      <button tngStepperTrigger class="headless-stepper-example-trigger">',
        '        <span class="dot">1</span><span tngStepperLabel>Cart</span>',
        '      </button>',
        '    </li>',
        '    <li tngStepperItem value="shipping" label="Shipping" class="headless-stepper-example-item">',
        '      <button tngStepperTrigger class="headless-stepper-example-trigger">',
        '        <span class="dot">2</span><span tngStepperLabel>Shipping</span>',
        '      </button>',
        '    </li>',
        '  </ol>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-stepper-checkout.component.css',
      code: '[data-slot="stepper-item"][data-state="current"] { border-color: var(--tng-semantic-accent-brand); }',
    },
  ]);

  protected readonly checkoutTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-stepper-checkout-tailwind.component.html',
      code: [
        '<section tngStepper defaultValue="shipping" ariaLabel="Checkout progress">',
        '  <ol class="grid gap-3">',
        '    <li tngStepperItem value="cart" label="Cart" completed class="rounded-lg border border-emerald-300 p-3">',
        '      <button tngStepperTrigger class="inline-flex items-center gap-3"><span tngStepperLabel>Cart</span></button>',
        '    </li>',
        '    <li tngStepperItem value="shipping" label="Shipping" class="rounded-lg border border-sky-300 p-3">',
        '      <button tngStepperTrigger class="inline-flex items-center gap-3"><span tngStepperLabel>Shipping</span></button>',
        '    </li>',
        '  </ol>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-stepper-checkout-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly releasePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-stepper-release.component.html',
      code: [
        '<section tngStepper defaultValue="publish" linear ariaLabel="Release flow">',
        '  <ol class="headless-stepper-example-list">',
        '    <li tngStepperItem value="draft" label="Draft" completed class="headless-stepper-example-item">...</li>',
        '    <li tngStepperItem value="review" label="Review" completed class="headless-stepper-example-item">...</li>',
        '    <li tngStepperItem value="publish" label="Publish" class="headless-stepper-example-item">...</li>',
        '  </ol>',
        '</section>',
      ].join('\n'),
    },
  ]);

  protected readonly releaseTailwindCodeTabs: readonly DocsExampleCodeTab[] = this.releasePlainCodeTabs;

  protected readonly errorPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-stepper-error.component.html',
      code: [
        '<li tngStepperItem value="billing" label="Billing" error class="headless-stepper-example-item">',
        '  <button tngStepperTrigger class="headless-stepper-example-trigger">',
        '    <span class="dot">2</span>',
        '    <span tngStepperLabel>Billing</span>',
        '    <span tngStepperDescription>Payment method needs attention</span>',
        '  </button>',
        '</li>',
      ].join('\n'),
    },
  ]);

  protected readonly errorTailwindCodeTabs: readonly DocsExampleCodeTab[] = this.errorPlainCodeTabs;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
