import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
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
      title: 'headless-stepper-checkout-plain.component.html',
      code: [
        '<ol tngStepper class="headless-stepper-example-list" aria-label="Checkout progress">',
        '  <li data-state="completed" class="headless-stepper-example-item is-complete"><span class="dot">✓</span> Cart</li>',
        '  <li aria-current="step" data-state="current" class="headless-stepper-example-item is-current"><span class="dot">2</span> Shipping</li>',
        '  <li data-state="upcoming" class="headless-stepper-example-item"><span class="dot">3</span> Payment</li>',
        '</ol>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-stepper-checkout-plain.component.css',
      code: '/* Uses owner-authored classes and data-state attrs from the page stylesheet. */',
    },
  ]);

  protected readonly checkoutTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-stepper-checkout-tailwind.component.html',
      code: [
        '<ol tngStepper aria-label="Checkout progress" class="grid gap-3">',
        '  <li class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-slate-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-slate-100"><span class="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-xs font-semibold text-white">✓</span> Cart</li>',
        '  <li aria-current="step" class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-sky-300 bg-sky-50 px-3 py-2 text-slate-900 dark:border-sky-800 dark:bg-sky-950/30 dark:text-slate-100"><span class="grid h-6 w-6 place-items-center rounded-full bg-sky-600 text-xs font-semibold text-white">2</span> Shipping</li>',
        '  <li class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><span class="grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">3</span> Payment</li>',
        '</ol>',
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
      title: 'headless-stepper-release-plain.component.html',
      code: [
        '<ol tngStepper class="headless-stepper-example-list" aria-label="Release flow">',
        '  <li data-state="completed" class="headless-stepper-example-item is-complete"><span class="dot">✓</span> Draft</li>',
        '  <li data-state="completed" class="headless-stepper-example-item is-complete"><span class="dot">✓</span> Review</li>',
        '  <li aria-current="step" data-state="current" class="headless-stepper-example-item is-current"><span class="dot">3</span> Publish</li>',
        '</ol>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-stepper-release-plain.component.css',
      code: '/* Uses owner-authored classes and data-state attrs from the page stylesheet. */',
    },
  ]);

  protected readonly releaseTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-stepper-release-tailwind.component.html',
      code: [
        '<ol tngStepper aria-label="Release flow" class="grid gap-3">',
        '  <li class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-slate-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-slate-100"><span class="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-xs font-semibold text-white">✓</span> Draft</li>',
        '  <li class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-slate-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-slate-100"><span class="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-xs font-semibold text-white">✓</span> Review</li>',
        '  <li aria-current="step" class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-sky-300 bg-sky-50 px-3 py-2 text-slate-900 dark:border-sky-800 dark:bg-sky-950/30 dark:text-slate-100"><span class="grid h-6 w-6 place-items-center rounded-full bg-sky-600 text-xs font-semibold text-white">3</span> Publish</li>',
        '</ol>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-stepper-release-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly errorPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-stepper-error-plain.component.html',
      code: [
        '<ol tngStepper class="headless-stepper-example-list" aria-label="Onboarding">',
        '  <li data-state="completed" class="headless-stepper-example-item is-complete"><span class="dot">✓</span> Profile</li>',
        '  <li aria-current="step" data-state="error" class="headless-stepper-example-item is-error"><span class="dot">2</span> Billing</li>',
        '  <li data-state="upcoming" class="headless-stepper-example-item"><span class="dot">3</span> Team invite</li>',
        '</ol>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-stepper-error-plain.component.css',
      code: '/* Uses owner-authored classes and data-state attrs from the page stylesheet. */',
    },
  ]);

  protected readonly errorTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-stepper-error-tailwind.component.html',
      code: [
        '<ol tngStepper aria-label="Onboarding" class="grid gap-3">',
        '  <li class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-slate-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-slate-100"><span class="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-xs font-semibold text-white">✓</span> Profile</li>',
        '  <li aria-current="step" class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-slate-900 dark:border-rose-800 dark:bg-rose-950/30 dark:text-slate-100"><span class="grid h-6 w-6 place-items-center rounded-full bg-rose-600 text-xs font-semibold text-white">2</span> Billing</li>',
        '  <li class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><span class="grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">3</span> Team invite</li>',
        '</ol>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-stepper-error-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
