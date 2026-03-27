import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngProgressBarComponent } from '@tailng-ui/components';
import {
  TngProgressBar as TngProgressBarPrimitive,
  TngProgressBarIndicator as TngProgressBarIndicatorPrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-progress-bar-examples-page',
  imports: [
    TngProgressBarPrimitive,
    TngProgressBarIndicatorPrimitive,
    TngProgressBarComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './progress-bar-examples-page.component.html',
  styleUrl: './progress-bar-examples-page.component.css',
})
export class ProgressBarExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly uploadProgress = 68;
  protected readonly testCoverageProgress = 84;
  protected readonly releaseProgress = 42;

  protected readonly uploadHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-bar-examples-upload-headless.component.ts',
      code: "import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-examples-upload-headless.component.html',
      code: [
        '<div class="example-track" tngProgressBar [value]="68">',
        '  <span class="example-indicator" tngProgressBarIndicator [style.width.%]="68"></span>',
        '</div>',
        '<div class="example-track" tngProgressBar [value]="84">',
        '  <span class="example-indicator" tngProgressBarIndicator [style.width.%]="84"></span>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-bar-examples-upload-headless.component.css',
      code: [
        '.example-track {',
        '  height: 0.625rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly uploadPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-bar-examples-upload-plain-css.component.ts',
      code: "import { TngProgressBarComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-examples-upload-plain-css.component.html',
      code: [
        '<tng-progress-bar [value]="68" ariaLabel="Upload progress"></tng-progress-bar>',
        '<tng-progress-bar [value]="84" ariaLabel="Test coverage"></tng-progress-bar>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-bar-examples-upload-plain-css.component.css',
      code: [
        '.example-shell {',
        '  display: grid;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly uploadTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-bar-examples-upload-tailwind.component.ts',
      code: "import { TngProgressBarComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-examples-upload-tailwind.component.html',
      code: [
        '<div class="grid gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-progress-bar [value]="68" ariaLabel="Upload progress"></tng-progress-bar>',
        '  <tng-progress-bar [value]="84" ariaLabel="Test coverage"></tng-progress-bar>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-bar-examples-upload-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly loadingHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-bar-examples-loading-headless.component.ts',
      code: "import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-examples-loading-headless.component.html',
      code: [
        '<div class="example-track" tngProgressBar [indeterminate]="true" aria-label="Preparing release">',
        '  <span class="example-indicator example-indicator--indeterminate" tngProgressBarIndicator></span>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-bar-examples-loading-headless.component.css',
      code: [
        '.example-indicator--indeterminate {',
        '  animation: primitive-progress-bar-indeterminate 1.1s ease-in-out infinite;',
        '  width: 40%;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly loadingPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-bar-examples-loading-plain-css.component.ts',
      code: "import { TngProgressBarComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-examples-loading-plain-css.component.html',
      code: [
        '<tng-progress-bar [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-bar>',
        '<tng-progress-bar [value]="42" ariaLabel="Release rollout"></tng-progress-bar>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-bar-examples-loading-plain-css.component.css',
      code: [
        '.loading-shell {',
        '  display: grid;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly loadingTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-bar-examples-loading-tailwind.component.ts',
      code: "import { TngProgressBarComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-examples-loading-tailwind.component.html',
      code: [
        '<div class="grid gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-progress-bar [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-bar>',
        '  <tng-progress-bar [value]="42" ariaLabel="Release rollout"></tng-progress-bar>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-bar-examples-loading-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
