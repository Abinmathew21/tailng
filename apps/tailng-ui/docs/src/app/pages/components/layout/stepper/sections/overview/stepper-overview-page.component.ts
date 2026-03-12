import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngStepperComponent } from '@tailng-ui/components';
import { TngStepper as TngStepperPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-stepper-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngStepperPrimitive,
    TngStepperComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './stepper-overview-page.component.html',
  styleUrl: './stepper-overview-page.component.css',
})
export class StepperOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly primitiveImportCode = "import { TngStepper } from '@tailng-ui/primitives';";

  protected readonly componentImportCode =
    "import { TngStepperComponent } from '@tailng-ui/components';";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'stepper-overview-headless.component.ts',
      code: [
        "readonly steps = ['Shipping details', 'Payment method', 'Confirmation'];",
        "readonly currentIndex = 0;",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-overview-headless.component.html',
      code: [
        '<ol tngStepper class="stepper-preview-list" aria-label="Checkout progress">',
        '  <li class="stepper-preview-item is-current">',
        '    <span class="stepper-preview-dot">1</span>',
        '    Shipping details',
        '  </li>',
        '  <li class="stepper-preview-item">',
        '    <span class="stepper-preview-dot">2</span>',
        '    Payment method',
        '  </li>',
        '  <li class="stepper-preview-item">',
        '    <span class="stepper-preview-dot">3</span>',
        '    Confirmation',
        '  </li>',
        '</ol>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-overview-headless.component.css',
      code: [
        '.stepper-preview-item.is-current {',
        '  border-color: var(--tng-semantic-accent-brand);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'stepper-overview-plain-css.component.ts',
      code: ["readonly currentStep = 'Review';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-overview-plain-css.component.html',
      code: [
        '<div class="stepper-preview-shell stepper-preview-shell--plain">',
        '  <tng-stepper ariaLabel="Release pipeline">',
        '    <ol class="stepper-preview-list">',
        '      <li class="stepper-preview-item is-complete"><span class="stepper-preview-dot">✓</span> Draft</li>',
        '      <li class="stepper-preview-item is-current"><span class="stepper-preview-dot">2</span> Review</li>',
        '      <li class="stepper-preview-item"><span class="stepper-preview-dot">3</span> Publish</li>',
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
      title: 'stepper-overview-plain-css.component.css',
      code: [
        '.stepper-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'stepper-overview-tailwind.component.ts',
      code: ["readonly stage = 'Review';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-stepper ariaLabel="Release pipeline">',
        '    <ol class="stepper-preview-list">',
        '      <li class="stepper-preview-item is-complete"><span class="stepper-preview-dot">✓</span> Draft</li>',
        '      <li class="stepper-preview-item is-current"><span class="stepper-preview-dot">2</span> Review</li>',
        '      <li class="stepper-preview-item"><span class="stepper-preview-dot">3</span> Publish</li>',
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
      title: 'stepper-overview-tailwind.component.css',
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
