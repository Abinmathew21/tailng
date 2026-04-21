import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngProgressSpinner } from '@tailng-ui/primitives';
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
  selector: 'app-headless-progress-spinner-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngProgressSpinner,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './progress-spinner-overview-page.component.html',
  styleUrl: './progress-spinner-overview-page.component.css',
})
export class HeadlessProgressSpinnerOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly completion = 72;
  protected readonly reviewProgress = 48;
  protected readonly spinnerCircumference = 113.097;

  protected readonly importCode = [
    "import { TngProgressSpinner } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly compositionCode = [
    '<span tngProgressSpinner [value]="72" class="progress-spinner" aria-label="Sync progress">',
    '  <svg class="progress-spinner__svg" viewBox="0 0 40 40">',
    '    <circle class="progress-spinner__track" cx="20" cy="20" r="18"></circle>',
    '    <circle',
    '      class="progress-spinner__indicator"',
    '      cx="20"',
    '      cy="20"',
    '      r="18"',
    '      stroke-dasharray="113.097"',
    '      [attr.stroke-dashoffset]="113.097 - (113.097 * 72) / 100"',
    '    ></circle>',
    '  </svg>',
    '</span>',
    '',
    '<span tngProgressSpinner [indeterminate]="true" class="progress-spinner" aria-label="Loading report">',
    '  <svg class="progress-spinner__svg" viewBox="0 0 40 40">',
    '    <circle class="progress-spinner__track" cx="20" cy="20" r="18"></circle>',
    '    <circle',
    '      class="progress-spinner__indicator progress-spinner__indicator--indeterminate"',
    '      cx="20"',
    '      cy="20"',
    '      r="18"',
    '      stroke-dasharray="70"',
    '      stroke-dashoffset="20"',
    '    ></circle>',
    '  </svg>',
    '</span>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-progress-spinner-overview-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressSpinner } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-progress-spinner-overview-plain',",
        '  standalone: true,',
        '  imports: [TngProgressSpinner],',
        "  templateUrl: './headless-progress-spinner-overview-plain.component.html',",
        "  styleUrl: './headless-progress-spinner-overview-plain.component.css',",
        '})',
        'export class HeadlessProgressSpinnerOverviewPlainComponent {',
        '  protected readonly spinnerCircumference = 113.097;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-progress-spinner-overview-plain.component.html',
      code: [
        '<section class="spinner-preview spinner-preview--plain">',
        '  <span tngProgressSpinner [value]="72" class="spinner-preview__item" aria-label="Sync progress">',
        '    <svg class="spinner-preview__svg" viewBox="0 0 40 40">',
        '      <circle class="spinner-preview__track" cx="20" cy="20" r="18"></circle>',
        '      <circle',
        '        class="spinner-preview__indicator"',
        '        cx="20"',
        '        cy="20"',
        '        r="18"',
        '        stroke-dasharray="113.097"',
        '        [attr.stroke-dashoffset]="113.097 - (113.097 * 72) / 100"',
        '      ></circle>',
        '    </svg>',
        '  </span>',
        '  <span tngProgressSpinner [indeterminate]="true" class="spinner-preview__item" aria-label="Preparing sync">',
        '    <svg class="spinner-preview__svg" viewBox="0 0 40 40">',
        '      <circle class="spinner-preview__track" cx="20" cy="20" r="18"></circle>',
        '      <circle',
        '        class="spinner-preview__indicator spinner-preview__indicator--indeterminate"',
        '        cx="20"',
        '        cy="20"',
        '        r="18"',
        '        stroke-dasharray="70"',
        '        stroke-dashoffset="20"',
        '      ></circle>',
        '    </svg>',
        '  </span>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-progress-spinner-overview-plain.component.css',
      code: [
        '.spinner-preview--plain {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.8rem;',
        '}',
        '',
        '.spinner-preview__item {',
        '  display: inline-flex;',
        '  height: 2.5rem;',
        '  width: 2.5rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-progress-spinner-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressSpinner } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-progress-spinner-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngProgressSpinner],',
        "  templateUrl: './headless-progress-spinner-overview-tailwind.component.html',",
        "  styleUrl: './headless-progress-spinner-overview-tailwind.component.css',",
        '})',
        'export class HeadlessProgressSpinnerOverviewTailwindComponent {',
        '  protected readonly spinnerCircumference = 113.097;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-progress-spinner-overview-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="flex flex-wrap gap-3">',
        '    <span tngProgressSpinner [value]="72" class="inline-flex h-10 w-10" aria-label="Deploy progress">',
        '      <svg class="block h-full w-full" viewBox="0 0 40 40">',
        '        <circle class="fill-none stroke-[var(--tng-semantic-border-subtle)]" cx="20" cy="20" r="18" stroke-width="4"></circle>',
        '        <circle',
        '          class="fill-none stroke-[var(--tng-semantic-accent-brand)] [stroke-linecap:round]"',
        '          cx="20"',
        '          cy="20"',
        '          r="18"',
        '          stroke-width="4"',
        '          stroke-dasharray="113.097"',
        '          [attr.stroke-dashoffset]="113.097 - (113.097 * 72) / 100"',
        '          style="transform: rotate(-90deg); transform-origin: center;"',
        '        ></circle>',
        '      </svg>',
        '    </span>',
        '    <span tngProgressSpinner [indeterminate]="true" class="inline-flex h-10 w-10" aria-label="Preparing sync">',
        '      <svg class="block h-full w-full" viewBox="0 0 40 40">',
        '        <circle class="fill-none stroke-[var(--tng-semantic-border-subtle)]" cx="20" cy="20" r="18" stroke-width="4"></circle>',
        '        <circle',
        '          class="fill-none stroke-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_42%,var(--tng-semantic-accent-success)_58%)] [stroke-dasharray:70] [stroke-dashoffset:20] [stroke-linecap:round] animate-[tng-progress-spinner-indeterminate_1s_linear_infinite]"',
        '          cx="20"',
        '          cy="20"',
        '          r="18"',
        '          stroke-width="4"',
        '          style="transform-origin: center;"',
        '        ></circle>',
        '      </svg>',
        '    </span>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-progress-spinner-overview-tailwind.component.css',
      code: [
        '@keyframes tng-progress-spinner-indeterminate {',
        '  0% { transform: rotate(-90deg); }',
        '  100% { transform: rotate(270deg); }',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
