import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngProgressBarComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-progress-bar-overview-page',
  imports: [
    TngCodeBlockComponent,
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
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly completion = 72;

  protected readonly componentImportCode = [
    "import { TngProgressBarComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-bar-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBarComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-bar-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngProgressBarComponent],',
        "  templateUrl: './progress-bar-overview-plain-css.component.html',",
        "  styleUrl: './progress-bar-overview-plain-css.component.css',",
        '})',
        'export class ProgressBarOverviewPlainCssComponent {',
        '  protected readonly completion = 72;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-overview-plain-css.component.html',
      code: [
        '<section class="plain-shell">',
        '  <tng-progress-bar [value]="completion" ariaLabel="Upload progress"></tng-progress-bar>',
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
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBarComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-bar-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngProgressBarComponent],',
        "  templateUrl: './progress-bar-overview-tailwind.component.html',",
        "  styleUrl: './progress-bar-overview-tailwind.component.css',",
        '})',
        'export class ProgressBarOverviewTailwindComponent {',
        '  protected readonly completion = 72;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-overview-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="grid gap-3">',
        '    <tng-progress-bar [value]="completion" ariaLabel="Deploy progress"></tng-progress-bar>',
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
