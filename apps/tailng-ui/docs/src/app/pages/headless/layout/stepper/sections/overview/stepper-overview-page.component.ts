import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngStepper,
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
  selector: 'app-headless-stepper-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngStepper,
    TngStepperItem,
    TngStepperLabel,
    TngStepperTrigger,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './stepper-overview-page.component.html',
  styleUrls: ['./stepper-overview-page.component.css'],
})
export class HeadlessStepperOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly importCode = [
    "import {",
    "  TngStepper,",
    "  TngStepperConnector,",
    "  TngStepperDescription,",
    "  TngStepperItem,",
    "  TngStepperLabel,",
    "  TngStepperPanel,",
    "  TngStepperTrigger,",
    "} from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly usageCode = [
    '<section tngStepper ariaLabel="Release flow" defaultValue="review" linear>',
    '  <ol class="workflow-steps">',
    '    <li tngStepperItem value="draft" label="Draft" completed>',
    '      <button tngStepperTrigger>',
    '        <span tngStepperLabel>Draft</span>',
    '      </button>',
    '      <span tngStepperConnector></span>',
    '    </li>',
    '    <li tngStepperItem value="review" label="Review">',
    '      <button tngStepperTrigger>',
    '        <span tngStepperLabel>Review</span>',
    '        <span tngStepperDescription>Current step</span>',
    '      </button>',
    '      <span tngStepperConnector></span>',
    '      <section tngStepperPanel>Review content</section>',
    '    </li>',
    '    <li tngStepperItem value="publish" label="Publish">',
    '      <button tngStepperTrigger>',
    '        <span tngStepperLabel>Publish</span>',
    '      </button>',
    '    </li>',
    '  </ol>',
    '</section>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-stepper-overview-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngStepper, TngStepperItem, TngStepperLabel, TngStepperTrigger } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-stepper-overview-plain',",
        '  standalone: true,',
        '  imports: [TngStepper, TngStepperItem, TngStepperLabel, TngStepperTrigger],',
        "  templateUrl: './headless-stepper-overview-plain.component.html',",
        "  styleUrl: './headless-stepper-overview-plain.component.css',",
        '})',
        'export class HeadlessStepperOverviewPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-stepper-overview-plain.component.html',
      code: [
        '<section tngStepper defaultValue="review" ariaLabel="Release pipeline" class="stepper-preview">',
        '  <ol class="stepper-preview__list">',
        '    <li tngStepperItem value="draft" label="Draft" completed class="stepper-preview__item">',
        '      <button tngStepperTrigger class="stepper-preview__trigger">',
        '        <span class="stepper-preview__dot">1</span>',
        '        <span tngStepperLabel>Draft</span>',
        '      </button>',
        '    </li>',
        '    <li tngStepperItem value="review" label="Review" class="stepper-preview__item">',
        '      <button tngStepperTrigger class="stepper-preview__trigger">',
        '        <span class="stepper-preview__dot">2</span>',
        '        <span tngStepperLabel>Review</span>',
        '      </button>',
        '    </li>',
        '    <li tngStepperItem value="publish" label="Publish" class="stepper-preview__item">',
        '      <button tngStepperTrigger class="stepper-preview__trigger">',
        '        <span class="stepper-preview__dot">3</span>',
        '        <span tngStepperLabel>Publish</span>',
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
      title: 'headless-stepper-overview-plain.component.css',
      code: [
        '.stepper-preview__item[data-state="current"] {',
        '  border-color: var(--tng-semantic-accent-brand);',
        '}',
        '',
        '.stepper-preview__item[data-state="completed"] {',
        '  border-color: var(--tng-semantic-accent-success);',
        '}',
        '',
        '.stepper-preview__trigger[aria-current="step"] {',
        '  font-weight: 700;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-stepper-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngStepper, TngStepperItem, TngStepperLabel, TngStepperTrigger } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-stepper-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngStepper, TngStepperItem, TngStepperLabel, TngStepperTrigger],',
        "  templateUrl: './headless-stepper-overview-tailwind.component.html',",
        '})',
        'export class HeadlessStepperOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-stepper-overview-tailwind.component.html',
      code: [
        '<section tngStepper defaultValue="shipping" ariaLabel="Checkout progress" class="grid gap-3">',
        '  <ol class="grid gap-3">',
        '    <li tngStepperItem value="cart" label="Cart" completed class="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2">',
        '      <button tngStepperTrigger class="inline-flex items-center gap-3">',
        '        <span class="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-xs font-semibold text-white">1</span>',
        '        <span tngStepperLabel>Cart</span>',
        '      </button>',
        '    </li>',
        '    <li tngStepperItem value="shipping" label="Shipping" class="rounded-lg border border-sky-300 bg-sky-50 px-3 py-2">',
        '      <button tngStepperTrigger class="inline-flex items-center gap-3">',
        '        <span class="grid h-6 w-6 place-items-center rounded-full bg-sky-600 text-xs font-semibold text-white">2</span>',
        '        <span tngStepperLabel>Shipping</span>',
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
      title: 'headless-stepper-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
