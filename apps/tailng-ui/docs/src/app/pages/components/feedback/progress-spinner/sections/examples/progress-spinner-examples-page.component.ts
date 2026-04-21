import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngProgressSpinnerComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-progress-spinner-examples-page',
  imports: [
    TngProgressSpinnerComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './progress-spinner-examples-page.component.html',
  styleUrl: './progress-spinner-examples-page.component.css',
})
export class ProgressSpinnerExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly uploadProgress = 68;
  protected readonly qualityProgress = 84;
  protected readonly releaseProgress = 42;

  protected readonly uploadPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-examples-upload-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressSpinnerComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-spinner-examples-upload-plain-css',",
        '  standalone: true,',
        '  imports: [TngProgressSpinnerComponent],',
        "  templateUrl: './progress-spinner-examples-upload-plain-css.component.html',",
        "  styleUrl: './progress-spinner-examples-upload-plain-css.component.css',",
        '})',
        'export class ProgressSpinnerExamplesUploadPlainCssComponent {',
        '  protected readonly uploadProgress = 68;',
        '  protected readonly qualityProgress = 84;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-examples-upload-plain-css.component.html',
      code: [
        '<div class="example-shell">',
        '  <tng-progress-spinner [value]="uploadProgress" ariaLabel="Upload progress"></tng-progress-spinner>',
        '  <tng-progress-spinner [value]="qualityProgress" ariaLabel="Quality checks"></tng-progress-spinner>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-examples-upload-plain-css.component.css',
      code: [
        '.example-shell {',
        '  display: flex;',
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
      title: 'progress-spinner-examples-upload-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressSpinnerComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-spinner-examples-upload-tailwind',",
        '  standalone: true,',
        '  imports: [TngProgressSpinnerComponent],',
        "  templateUrl: './progress-spinner-examples-upload-tailwind.component.html',",
        "  styleUrl: './progress-spinner-examples-upload-tailwind.component.css',",
        '})',
        'export class ProgressSpinnerExamplesUploadTailwindComponent {',
        '  protected readonly uploadProgress = 68;',
        '  protected readonly qualityProgress = 84;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-examples-upload-tailwind.component.html',
      code: [
        '<section class="flex flex-wrap gap-4 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-progress-spinner [value]="uploadProgress" ariaLabel="Upload progress"></tng-progress-spinner>',
        '  <tng-progress-spinner [value]="qualityProgress" ariaLabel="Quality checks"></tng-progress-spinner>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-examples-upload-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly loadingPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-spinner-examples-loading-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressSpinnerComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-spinner-examples-loading-plain-css',",
        '  standalone: true,',
        '  imports: [TngProgressSpinnerComponent],',
        "  templateUrl: './progress-spinner-examples-loading-plain-css.component.html',",
        "  styleUrl: './progress-spinner-examples-loading-plain-css.component.css',",
        '})',
        'export class ProgressSpinnerExamplesLoadingPlainCssComponent {',
        '  protected readonly releaseProgress = 42;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-examples-loading-plain-css.component.html',
      code: [
        '<div class="loading-shell">',
        '  <tng-progress-spinner [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-spinner>',
        '  <tng-progress-spinner [value]="releaseProgress" ariaLabel="Release rollout"></tng-progress-spinner>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-examples-loading-plain-css.component.css',
      code: [
        '.loading-shell {',
        '  display: flex;',
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
      title: 'progress-spinner-examples-loading-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressSpinnerComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-spinner-examples-loading-tailwind',",
        '  standalone: true,',
        '  imports: [TngProgressSpinnerComponent],',
        "  templateUrl: './progress-spinner-examples-loading-tailwind.component.html',",
        "  styleUrl: './progress-spinner-examples-loading-tailwind.component.css',",
        '})',
        'export class ProgressSpinnerExamplesLoadingTailwindComponent {',
        '  protected readonly releaseProgress = 42;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-spinner-examples-loading-tailwind.component.html',
      code: [
        '<section class="flex flex-wrap gap-4 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-progress-spinner [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-spinner>',
        '  <tng-progress-spinner [value]="releaseProgress" ariaLabel="Release rollout"></tng-progress-spinner>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'progress-spinner-examples-loading-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
