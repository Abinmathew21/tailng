import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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
  selector: 'app-headless-progress-bar-examples-page',
  imports: [
    TngProgressBar,
    TngProgressBarIndicator,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './progress-bar-examples-page.component.html',
  styleUrl: './progress-bar-examples-page.component.css',
})
export class HeadlessProgressBarExamplesPageComponent implements OnDestroy {
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
  protected readonly rolloutProgress = 42;

  protected readonly determinatePlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-progress-bar-determinate-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-progress-bar-determinate-plain',",
        '  standalone: true,',
        '  imports: [TngProgressBar, TngProgressBarIndicator],',
        "  templateUrl: './headless-progress-bar-determinate-plain.component.html',",
        "  styleUrl: './headless-progress-bar-determinate-plain.component.css',",
        '})',
        'export class HeadlessProgressBarDeterminatePlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-progress-bar-determinate-plain.component.html',
      code: [
        '<section class="progress-example progress-example--plain">',
        '  <div class="progress-example-row">',
        '    <span>Upload progress</span>',
        '    <div tngProgressBar [value]="68" class="progress-example-track">',
        '      <span tngProgressBarIndicator class="progress-example-indicator" [style.width.%]="68"></span>',
        '    </div>',
        '  </div>',
        '  <div class="progress-example-row">',
        '    <span>Quality checks</span>',
        '    <div tngProgressBar [value]="84" class="progress-example-track">',
        '      <span tngProgressBarIndicator class="progress-example-indicator progress-example-indicator--success" [style.width.%]="84"></span>',
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
      title: 'headless-progress-bar-determinate-plain.component.css',
      code: [
        '.progress-example {',
        '  display: grid;',
        '  gap: 0.85rem;',
        '}',
        '',
        '.progress-example-track {',
        '  background: var(--tng-semantic-background-surface);',
        '  border-radius: 9999px;',
        '  height: 0.625rem;',
        '  overflow: hidden;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly determinateTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-progress-bar-determinate-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-progress-bar-determinate-tailwind',",
        '  standalone: true,',
        '  imports: [TngProgressBar, TngProgressBarIndicator],',
        "  templateUrl: './headless-progress-bar-determinate-tailwind.component.html',",
        "  styleUrl: './headless-progress-bar-determinate-tailwind.component.css',",
        '})',
        'export class HeadlessProgressBarDeterminateTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-progress-bar-determinate-tailwind.component.html',
      code: [
        '<section class="grid gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="grid gap-1 text-sm">',
        '    <span class="text-[var(--tng-semantic-foreground-primary)]">Upload progress</span>',
        '    <div tngProgressBar [value]="68" class="h-2 overflow-hidden rounded-full bg-[var(--tng-semantic-background-muted)]">',
        '      <span tngProgressBarIndicator class="block h-full rounded-full bg-[var(--tng-semantic-accent-brand)]" [style.width.%]="68"></span>',
        '    </div>',
        '  </div>',
        '  <div class="grid gap-1 text-sm">',
        '    <span class="text-[var(--tng-semantic-foreground-primary)]">Quality checks</span>',
        '    <div tngProgressBar [value]="84" class="h-2 overflow-hidden rounded-full bg-[var(--tng-semantic-background-muted)]">',
        '      <span tngProgressBarIndicator class="block h-full rounded-full bg-[var(--tng-semantic-accent-success)]" [style.width.%]="84"></span>',
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
      title: 'headless-progress-bar-determinate-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly handoffPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-progress-bar-handoff-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-progress-bar-handoff-plain',",
        '  standalone: true,',
        '  imports: [TngProgressBar, TngProgressBarIndicator],',
        "  templateUrl: './headless-progress-bar-handoff-plain.component.html',",
        "  styleUrl: './headless-progress-bar-handoff-plain.component.css',",
        '})',
        'export class HeadlessProgressBarHandoffPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-progress-bar-handoff-plain.component.html',
      code: [
        '<section class="progress-example progress-example--plain">',
        '  <div class="progress-example-row">',
        '    <span>Preparing release</span>',
        '    <div tngProgressBar [indeterminate]="true" aria-label="Preparing release" class="progress-example-track">',
        '      <span tngProgressBarIndicator class="progress-example-indicator progress-example-indicator--indeterminate"></span>',
        '    </div>',
        '  </div>',
        '  <div class="progress-example-row">',
        '    <span>Rollout</span>',
        '    <div tngProgressBar [value]="42" class="progress-example-track">',
        '      <span tngProgressBarIndicator class="progress-example-indicator" [style.width.%]="42"></span>',
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
      title: 'headless-progress-bar-handoff-plain.component.css',
      code: [
        '.progress-example-indicator--indeterminate {',
        '  animation: tng-progress-bar-indeterminate 1.1s ease-in-out infinite;',
        '  width: 40%;',
        '}',
        '',
        '@keyframes tng-progress-bar-indeterminate {',
        '  0% { transform: translateX(-100%); }',
        '  100% { transform: translateX(250%); }',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly handoffTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-progress-bar-handoff-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngProgressBar, TngProgressBarIndicator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-progress-bar-handoff-tailwind',",
        '  standalone: true,',
        '  imports: [TngProgressBar, TngProgressBarIndicator],',
        "  templateUrl: './headless-progress-bar-handoff-tailwind.component.html',",
        "  styleUrl: './headless-progress-bar-handoff-tailwind.component.css',",
        '})',
        'export class HeadlessProgressBarHandoffTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-progress-bar-handoff-tailwind.component.html',
      code: [
        '<section class="grid gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="grid gap-1 text-sm">',
        '    <span class="text-[var(--tng-semantic-foreground-primary)]">Preparing release</span>',
        '    <div tngProgressBar [indeterminate]="true" aria-label="Preparing release" class="h-2 overflow-hidden rounded-full bg-[var(--tng-semantic-background-muted)]">',
        '      <span tngProgressBarIndicator class="block h-full w-2/5 animate-[tng-progress-bar-indeterminate_1.1s_ease-in-out_infinite] rounded-full bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_42%,var(--tng-semantic-accent-success)_58%)]"></span>',
        '    </div>',
        '  </div>',
        '  <div class="grid gap-1 text-sm">',
        '    <span class="text-[var(--tng-semantic-foreground-primary)]">Rollout</span>',
        '    <div tngProgressBar [value]="42" class="h-2 overflow-hidden rounded-full bg-[var(--tng-semantic-background-muted)]">',
        '      <span tngProgressBarIndicator class="block h-full rounded-full bg-[var(--tng-semantic-accent-brand)]" [style.width.%]="42"></span>',
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
      title: 'headless-progress-bar-handoff-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
