import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngProgressBarComponent } from '@tailng-ui/components';
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
  selector: 'app-progress-bar-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngProgressBarPrimitive,
    TngProgressBarIndicatorPrimitive,
    TngProgressBarComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './progress-bar-overview-page.component.html',
  styleUrl: './progress-bar-overview-page.component.css',
})
export class ProgressBarOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly completion = 72;

  protected readonly primitiveImportCode = [
    "import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngProgressBarComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-bar-overview-headless.component.ts',
      code: this.primitiveImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-overview-headless.component.html',
      code: [
        '<div tngProgressBar [min]="0" [max]="100" [value]="72" class="track">',
        '  <span tngProgressBarIndicator class="indicator" [style.width.%]="72"></span>',
        '</div>',
        '',
        '<div tngProgressBar [indeterminate]="true" aria-label="Loading report" class="track">',
        '  <span tngProgressBarIndicator class="indicator indicator--indeterminate"></span>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-bar-overview-headless.component.css',
      code: [
        '.track {',
        '  background: var(--tng-semantic-background-surface);',
        '  border-radius: 9999px;',
        '  height: 0.625rem;',
        '  overflow: hidden;',
        '}',
        '',
        '.indicator--indeterminate {',
        '  animation: primitive-progress-bar-indeterminate 1.1s ease-in-out infinite;',
        '  width: 40%;',
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
      title: 'progress-bar-overview-plain-css.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-overview-plain-css.component.html',
      code: [
        '<section class="plain-shell">',
        '  <tng-progress-bar [value]="72" ariaLabel="Upload progress"></tng-progress-bar>',
        '  <tng-progress-bar [value]="34"></tng-progress-bar>',
        '  <tng-progress-bar [indeterminate]="true" ariaLabel="Loading data"></tng-progress-bar>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-bar-overview-plain-css.component.css',
      code: [
        '.plain-shell {',
        '  display: grid;',
        '  gap: 0.8rem;',
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
      title: 'progress-bar-overview-tailwind.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-overview-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div class="grid gap-3">',
        '    <tng-progress-bar [value]="72" ariaLabel="Deploy progress"></tng-progress-bar>',
        '    <tng-progress-bar [value]="48"></tng-progress-bar>',
        '    <tng-progress-bar [indeterminate]="true" ariaLabel="Syncing"></tng-progress-bar>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-bar-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
