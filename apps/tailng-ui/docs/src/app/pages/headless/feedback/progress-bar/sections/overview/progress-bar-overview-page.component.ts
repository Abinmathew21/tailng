import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';
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
  selector: 'app-headless-progress-bar-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngProgressBar,
    TngProgressBarIndicator,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './progress-bar-overview-page.component.html',
  styleUrl: './progress-bar-overview-page.component.css',
})
export class HeadlessProgressBarOverviewPageComponent implements OnDestroy {
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

  protected readonly importCode = [
    "import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly compositionCode = [
    '<div tngProgressBar [min]="0" [max]="100" [value]="72" class="progress-track">',
    '  <span tngProgressBarIndicator class="progress-indicator" [style.width.%]="72"></span>',
    '</div>',
    '',
    '<div tngProgressBar [indeterminate]="true" aria-label="Loading report" class="progress-track">',
    '  <span tngProgressBarIndicator class="progress-indicator progress-indicator--indeterminate"></span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-progress-bar-overview-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-progress-bar-overview-plain',",
        '  standalone: true,',
        '  imports: [TngProgressBar, TngProgressBarIndicator],',
        "  templateUrl: './headless-progress-bar-overview-plain.component.html',",
        "  styleUrl: './headless-progress-bar-overview-plain.component.css',",
        '})',
        'export class HeadlessProgressBarOverviewPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-progress-bar-overview-plain.component.html',
      code: [
        '<section class="progress-preview progress-preview--plain">',
        '  <div tngProgressBar [value]="72" class="progress-preview-track">',
        '    <span tngProgressBarIndicator class="progress-preview-indicator" [style.width.%]="72"></span>',
        '  </div>',
        '  <div tngProgressBar [value]="48" class="progress-preview-track">',
        '    <span tngProgressBarIndicator class="progress-preview-indicator progress-preview-indicator--success" [style.width.%]="48"></span>',
        '  </div>',
        '  <div tngProgressBar [indeterminate]="true" aria-label="Preparing sync" class="progress-preview-track">',
        '    <span tngProgressBarIndicator class="progress-preview-indicator progress-preview-indicator--indeterminate"></span>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-progress-bar-overview-plain.component.css',
      code: [
        '.progress-preview--plain {',
        '  display: grid;',
        '  gap: 0.8rem;',
        '}',
        '',
        '.progress-preview-track {',
        '  background: var(--tng-semantic-background-surface);',
        '  border-radius: 9999px;',
        '  height: 0.625rem;',
        '  overflow: hidden;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-progress-bar-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-progress-bar-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngProgressBar, TngProgressBarIndicator],',
        "  templateUrl: './headless-progress-bar-overview-tailwind.component.html',",
        "  styleUrl: './headless-progress-bar-overview-tailwind.component.css',",
        '})',
        'export class HeadlessProgressBarOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-progress-bar-overview-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="grid gap-3">',
        '    <div tngProgressBar [value]="72" class="h-2 overflow-hidden rounded-full bg-[var(--tng-semantic-background-muted)]">',
        '      <span tngProgressBarIndicator class="block h-full rounded-full bg-[var(--tng-semantic-accent-brand)]" [style.width.%]="72"></span>',
        '    </div>',
        '    <div tngProgressBar [value]="48" class="h-2 overflow-hidden rounded-full bg-[var(--tng-semantic-background-muted)]">',
        '      <span tngProgressBarIndicator class="block h-full rounded-full bg-[var(--tng-semantic-accent-success)]" [style.width.%]="48"></span>',
        '    </div>',
        '    <div tngProgressBar [indeterminate]="true" aria-label="Preparing sync" class="h-2 overflow-hidden rounded-full bg-[var(--tng-semantic-background-muted)]">',
        '      <span tngProgressBarIndicator class="block h-full w-2/5 animate-[tng-progress-bar-indeterminate_1.1s_ease-in-out_infinite] rounded-full bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_42%,var(--tng-semantic-accent-success)_58%)]"></span>',
        '    </div>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-progress-bar-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
