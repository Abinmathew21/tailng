import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngProgressSpinnerComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-progress-spinner-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngProgressSpinnerComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './progress-spinner-overview-page.component.html',
  styleUrl: './progress-spinner-overview-page.component.css',
})
export class ProgressSpinnerOverviewPageComponent implements OnDestroy {
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
    "import { TngProgressSpinnerComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressSpinnerComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-spinner-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngProgressSpinnerComponent],',
        "  templateUrl: './progress-spinner-overview-plain-css.component.html',",
        "  styleUrl: './progress-spinner-overview-plain-css.component.css',",
        '})',
        'export class ProgressSpinnerOverviewPlainCssComponent {',
        '  protected readonly completion = 72;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-overview-plain-css.component.html',
      code: [
        '<section class="plain-shell">',
        '  <tng-progress-spinner [value]="completion" ariaLabel="Sync progress"></tng-progress-spinner>',
        '  <tng-progress-spinner [value]="34"></tng-progress-spinner>',
        '  <tng-progress-spinner [indeterminate]="true" ariaLabel="Loading"></tng-progress-spinner>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-overview-plain-css.component.css',
      code: [
        '.plain-shell {',
        '  display: flex;',
        '  flex-wrap: wrap;',
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
      title: 'progress-spinner-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressSpinnerComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-spinner-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngProgressSpinnerComponent],',
        "  templateUrl: './progress-spinner-overview-tailwind.component.html',",
        "  styleUrl: './progress-spinner-overview-tailwind.component.css',",
        '})',
        'export class ProgressSpinnerOverviewTailwindComponent {',
        '  protected readonly completion = 72;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-overview-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="flex flex-wrap gap-3">',
        '    <tng-progress-spinner [value]="completion" ariaLabel="Deploy progress"></tng-progress-spinner>',
        '    <tng-progress-spinner [value]="48"></tng-progress-spinner>',
        '    <tng-progress-spinner [indeterminate]="true" ariaLabel="Syncing"></tng-progress-spinner>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
