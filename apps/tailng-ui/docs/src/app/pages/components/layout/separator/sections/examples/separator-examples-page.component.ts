import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngSeparatorComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-separator-examples-page',
  imports: [TngSeparatorComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './separator-examples-page.component.html',
  styleUrl: './separator-examples-page.component.css',
})
export class SeparatorExamplesPageComponent implements OnDestroy {
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
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'separator-examples-toolbar-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSeparatorComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-separator-examples-toolbar-plain-css',",
        '  standalone: true,',
        '  imports: [TngSeparatorComponent],',
        "  templateUrl: './separator-examples-toolbar-plain-css.component.html',",
        "  styleUrl: './separator-examples-toolbar-plain-css.component.css',",
        '})',
        'export class SeparatorExamplesToolbarPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'separator-examples-toolbar-plain-css.component.html',
      code: [
        '<div class="toolbar-shell toolbar-shell--plain">',
        '  <button type="button">All</button>',
        '  <tng-separator orientation="vertical" class="toolbar-separator"></tng-separator>',
        '  <button type="button">Running</button>',
        '  <tng-separator orientation="vertical" class="toolbar-separator"></tng-separator>',
        '  <button type="button">Archived</button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'separator-examples-toolbar-plain-css.component.css',
      code: [
        '.toolbar-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.55rem 0.8rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly toolbarTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'separator-examples-toolbar-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSeparatorComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-separator-examples-toolbar-tailwind',",
        '  standalone: true,',
        '  imports: [TngSeparatorComponent],',
        "  templateUrl: './separator-examples-toolbar-tailwind.component.html',",
        "  styleUrl: './separator-examples-toolbar-tailwind.component.css',",
        '})',
        'export class SeparatorExamplesToolbarTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'separator-examples-toolbar-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">',
        '    <button type="button">Pipelines</button>',
        '    <tng-separator orientation="vertical" class="self-stretch min-h-5"></tng-separator>',
        '    <button type="button">Jobs</button>',
        '    <tng-separator orientation="vertical" class="self-stretch min-h-5"></tng-separator>',
        '    <button type="button">Artifacts</button>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'separator-examples-toolbar-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly listPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'separator-examples-list-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSeparatorComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-separator-examples-list-plain-css',",
        '  standalone: true,',
        '  imports: [TngSeparatorComponent],',
        "  templateUrl: './separator-examples-list-plain-css.component.html',",
        "  styleUrl: './separator-examples-list-plain-css.component.css',",
        '})',
        'export class SeparatorExamplesListPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'separator-examples-list-plain-css.component.html',
      code: [
        '<section class="list-shell list-shell--plain">',
        '  <div class="list-row">Design review</div>',
        '  <tng-separator></tng-separator>',
        '  <div class="list-row">QA signoff</div>',
        '  <tng-separator></tng-separator>',
        '  <div class="list-row">Release freeze</div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'separator-examples-list-plain-css.component.css',
      code: [
        '.list-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.8rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly listTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'separator-examples-list-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSeparatorComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-separator-examples-list-tailwind',",
        '  standalone: true,',
        '  imports: [TngSeparatorComponent],',
        "  templateUrl: './separator-examples-list-tailwind.component.html',",
        "  styleUrl: './separator-examples-list-tailwind.component.css',",
        '})',
        'export class SeparatorExamplesListTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'separator-examples-list-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div class="py-2 text-sm text-slate-700 dark:text-slate-200">Canary rollout</div>',
        '  <tng-separator></tng-separator>',
        '  <div class="py-2 text-sm text-slate-700 dark:text-slate-200">Regional promotion</div>',
        '  <tng-separator></tng-separator>',
        '  <div class="py-2 text-sm text-slate-700 dark:text-slate-200">Post-release checks</div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'separator-examples-list-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
