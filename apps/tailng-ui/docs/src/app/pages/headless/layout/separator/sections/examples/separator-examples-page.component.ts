import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngSeparator } from '@tailng-ui/primitives';
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
  selector: 'app-headless-separator-examples-page',
  imports: [TngSeparator, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './separator-examples-page.component.html',
  styleUrl: './separator-examples-page.component.css',
})
export class HeadlessSeparatorExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly toolbarPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-separator-toolbar-plain.component.html',
      code: [
        '<div class="headless-separator-toolbar">',
        '  <button type="button">Grid</button>',
        '  <div tngSeparator orientation="vertical" class="headless-separator-toolbar-line"></div>',
        '  <button type="button">List</button>',
        '  <div tngSeparator orientation="vertical" class="headless-separator-toolbar-line"></div>',
        '  <button type="button">Calendar</button>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-separator-toolbar-plain.component.css',
      code: '/* Uses the owner-authored classes shown in the live example. */',
    },
  ]);

  protected readonly toolbarTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-separator-toolbar-tailwind.component.html',
      code: [
        '<div class="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/60">',
        '  <button type="button">Pipelines</button>',
        '  <div tngSeparator orientation="vertical" class="self-stretch min-h-5"></div>',
        '  <button type="button">Jobs</button>',
        '  <div tngSeparator orientation="vertical" class="self-stretch min-h-5"></div>',
        '  <button type="button">Artifacts</button>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-separator-toolbar-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly contentPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-separator-content-plain.component.html',
      code: [
        '<section class="headless-separator-list">',
        '  <div class="headless-separator-list-row">Design review</div>',
        '  <div tngSeparator class="headless-separator-list-line"></div>',
        '  <div class="headless-separator-list-row">QA signoff</div>',
        '  <div tngSeparator class="headless-separator-list-line"></div>',
        '  <div class="headless-separator-list-row">Release freeze</div>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-separator-content-plain.component.css',
      code: '/* Uses the owner-authored classes shown in the live example. */',
    },
  ]);

  protected readonly contentTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-separator-content-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div class="py-2 text-sm text-slate-700 dark:text-slate-200">Canary rollout</div>',
        '  <div tngSeparator></div>',
        '  <div class="py-2 text-sm text-slate-700 dark:text-slate-200">Regional promotion</div>',
        '  <div tngSeparator></div>',
        '  <div class="py-2 text-sm text-slate-700 dark:text-slate-200">Post-release checks</div>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-separator-content-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly semanticPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-separator-semantic-plain.component.html',
      code: [
        '<section class="headless-separator-semantic">',
        '  <div>',
        '    <h3>Current alerts</h3>',
        '    <p>2 production issues need review.</p>',
        '  </div>',
        '  <div tngSeparator [decorative]="false" class="headless-separator-semantic-line"></div>',
        '  <div>',
        '    <h3>Resolved alerts</h3>',
        '    <p>5 issues were closed today.</p>',
        '  </div>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-separator-semantic-plain.component.css',
      code: '/* Uses the owner-authored classes shown in the live example. */',
    },
  ]);

  protected readonly semanticTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-separator-semantic-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/70">',
        '  <div>',
        '    <h3 class="m-0 text-base font-semibold text-slate-950 dark:text-slate-50">Current alerts</h3>',
        '    <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">2 production issues need review.</p>',
        '  </div>',
        '  <div tngSeparator [decorative]="false" class="my-3"></div>',
        '  <div>',
        '    <h3 class="m-0 text-base font-semibold text-slate-950 dark:text-slate-50">Resolved alerts</h3>',
        '    <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">5 issues were closed today.</p>',
        '  </div>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-separator-semantic-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
