import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngProgressBarComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-progress-bar-examples-page',
  imports: [
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
      title: 'progress-bar-examples-upload-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBarComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-bar-examples-upload-plain-css',",
        '  standalone: true,',
        '  imports: [TngProgressBarComponent],',
        "  templateUrl: './progress-bar-examples-upload-plain-css.component.html',",
        "  styleUrl: './progress-bar-examples-upload-plain-css.component.css',",
        '})',
        'export class ProgressBarExamplesUploadPlainCssComponent {',
        '  protected readonly uploadProgress = 68;',
        '  protected readonly qualityProgress = 84;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-examples-upload-plain-css.component.html',
      code: [
        '<div class="example-shell">',
        '  <tng-progress-bar [value]="uploadProgress" ariaLabel="Upload progress"></tng-progress-bar>',
        '  <tng-progress-bar [value]="qualityProgress" ariaLabel="Quality checks"></tng-progress-bar>',
        '</div>',
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
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBarComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-bar-examples-upload-tailwind',",
        '  standalone: true,',
        '  imports: [TngProgressBarComponent],',
        "  templateUrl: './progress-bar-examples-upload-tailwind.component.html',",
        "  styleUrl: './progress-bar-examples-upload-tailwind.component.css',",
        '})',
        'export class ProgressBarExamplesUploadTailwindComponent {',
        '  protected readonly uploadProgress = 68;',
        '  protected readonly qualityProgress = 84;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-examples-upload-tailwind.component.html',
      code: [
        '<section class="grid gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="grid gap-1 text-sm">',
        '    <span class="text-[var(--tng-semantic-foreground-primary)]">Upload progress</span>',
        '    <tng-progress-bar [value]="uploadProgress" ariaLabel="Upload progress"></tng-progress-bar>',
        '  </div>',
        '  <div class="grid gap-1 text-sm">',
        '    <span class="text-[var(--tng-semantic-foreground-primary)]">Quality checks</span>',
        '    <tng-progress-bar [value]="qualityProgress" ariaLabel="Quality checks"></tng-progress-bar>',
        '  </div>',
        '</section>',
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

  protected readonly loadingPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'progress-bar-examples-loading-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBarComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-bar-examples-loading-plain-css',",
        '  standalone: true,',
        '  imports: [TngProgressBarComponent],',
        "  templateUrl: './progress-bar-examples-loading-plain-css.component.html',",
        "  styleUrl: './progress-bar-examples-loading-plain-css.component.css',",
        '})',
        'export class ProgressBarExamplesLoadingPlainCssComponent {',
        '  protected readonly releaseProgress = 42;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-examples-loading-plain-css.component.html',
      code: [
        '<div class="loading-shell">',
        '  <tng-progress-bar [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-bar>',
        '  <tng-progress-bar [value]="releaseProgress" ariaLabel="Release rollout"></tng-progress-bar>',
        '</div>',
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
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBarComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-progress-bar-examples-loading-tailwind',",
        '  standalone: true,',
        '  imports: [TngProgressBarComponent],',
        "  templateUrl: './progress-bar-examples-loading-tailwind.component.html',",
        "  styleUrl: './progress-bar-examples-loading-tailwind.component.css',",
        '})',
        'export class ProgressBarExamplesLoadingTailwindComponent {',
        '  protected readonly releaseProgress = 42;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'progress-bar-examples-loading-tailwind.component.html',
      code: [
        '<section class="grid gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="grid gap-1 text-sm">',
        '    <span class="text-[var(--tng-semantic-foreground-primary)]">Preparing release</span>',
        '    <tng-progress-bar [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-bar>',
        '  </div>',
        '  <div class="grid gap-1 text-sm">',
        '    <span class="text-[var(--tng-semantic-foreground-primary)]">Rollout</span>',
        '    <tng-progress-bar [value]="releaseProgress" ariaLabel="Release rollout"></tng-progress-bar>',
        '  </div>',
        '</section>',
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
