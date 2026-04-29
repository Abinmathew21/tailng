import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
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

  protected readonly importCode = '';

  protected readonly usageCode = [
    '<ol aria-label="Release flow">',
    '  <li aria-current="step" class="workflow-step workflow-step--current">',
    '    <span class="workflow-step__dot">2</span>',
    '    Review',
    '  </li>',
    '  <li class="workflow-step">',
    '    <span class="workflow-step__dot">3</span>',
    '    Publish',
    '  </li>',
    '</ol>',
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
        '',
        '@Component({',
        "  selector: 'app-headless-stepper-overview-plain',",
        '  standalone: true,',
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
        '<ol class="headless-stepper-preview-list" aria-label="Release pipeline">',
        '  <li class="headless-stepper-preview-item is-complete">',
        '    <span class="headless-stepper-preview-dot">✓</span>',
        '    Draft',
        '  </li>',
        '  <li aria-current="step" class="headless-stepper-preview-item is-current">',
        '    <span class="headless-stepper-preview-dot">2</span>',
        '    Review',
        '  </li>',
        '  <li class="headless-stepper-preview-item">',
        '    <span class="headless-stepper-preview-dot">3</span>',
        '    Publish',
        '  </li>',
        '</ol>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-stepper-overview-plain.component.css',
      code: [
        '.headless-stepper-preview-item.is-current {',
        '  border-color: var(--tng-semantic-accent-brand);',
        '}',
        '',
        '.headless-stepper-preview-item.is-complete {',
        '  border-color: var(--tng-semantic-accent-success);',
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
        '',
        '@Component({',
        "  selector: 'app-headless-stepper-overview-tailwind',",
        '  standalone: true,',
        "  templateUrl: './headless-stepper-overview-tailwind.component.html',",
        "  styleUrl: './headless-stepper-overview-tailwind.component.css',",
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
        '<ol aria-label="Checkout progress" class="grid gap-3">',
        '  <li class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-slate-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-slate-100">',
        '    <span class="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-xs font-semibold text-white">✓</span>',
        '    Cart',
        '  </li>',
        '  <li aria-current="step" class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-sky-300 bg-sky-50 px-3 py-2 text-slate-900 dark:border-sky-800 dark:bg-sky-950/30 dark:text-slate-100">',
        '    <span class="grid h-6 w-6 place-items-center rounded-full bg-sky-600 text-xs font-semibold text-white">2</span>',
        '    Shipping',
        '  </li>',
        '  <li class="inline-flex min-h-10 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">',
        '    <span class="grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">3</span>',
        '    Payment',
        '  </li>',
        '</ol>',
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
