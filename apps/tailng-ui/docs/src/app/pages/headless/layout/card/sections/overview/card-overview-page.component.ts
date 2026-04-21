import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngCard,
  TngCardActions,
  TngCardContent,
  TngCardDescription,
  TngCardFooter,
  TngCardHeader,
  TngCardTitle,
} from '@tailng-ui/primitives';
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
  selector: 'app-headless-card-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngCard,
    TngCardHeader,
    TngCardTitle,
    TngCardDescription,
    TngCardContent,
    TngCardFooter,
    TngCardActions,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './card-overview-page.component.html',
  styleUrl: './card-overview-page.component.css',
})
export class HeadlessCardOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly importCode = [
    'import {',
    '  TngCard,',
    '  TngCardHeader,',
    '  TngCardTitle,',
    '  TngCardDescription,',
    '  TngCardContent,',
    '  TngCardFooter,',
    '  TngCardActions,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly usageCode = [
    '<article tngCard>',
    '  <header tngCardHeader>',
    '    <h3 tngCardTitle>Release status</h3>',
    '    <p tngCardDescription>Production rollout is complete and monitoring is stable.</p>',
    '  </header>',
    '',
    '  <section tngCardContent>',
    '    <p>Latency is below target across all regions.</p>',
    '  </section>',
    '',
    '  <footer tngCardFooter>',
    '    <div tngCardActions>',
    '      <button type="button">View report</button>',
    '      <button type="button">Promote</button>',
    '    </div>',
    '  </footer>',
    '</article>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-card-overview-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import {",
        "  TngCard,",
        "  TngCardActions,",
        "  TngCardContent,",
        "  TngCardDescription,",
        "  TngCardFooter,",
        "  TngCardHeader,",
        "  TngCardTitle,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-card-overview-plain',",
        '  standalone: true,',
        '  imports: [',
        '    TngCard,',
        '    TngCardHeader,',
        '    TngCardTitle,',
        '    TngCardDescription,',
        '    TngCardContent,',
        '    TngCardFooter,',
        '    TngCardActions,',
        '  ],',
        "  templateUrl: './headless-card-overview-plain.component.html',",
        "  styleUrl: './headless-card-overview-plain.component.css',",
        '})',
        'export class HeadlessCardOverviewPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-card-overview-plain.component.html',
      code: [
        '<article tngCard class="headless-card-preview">',
        '  <header tngCardHeader class="headless-card-preview__header">',
        '    <h3 tngCardTitle>Release status</h3>',
        '    <p tngCardDescription>Production rollout is complete and monitoring is stable.</p>',
        '  </header>',
        '  <section tngCardContent class="headless-card-preview__content">',
        '    <ul>',
        '      <li>Latency is below 120ms across all regions.</li>',
        '      <li>Error rate stayed under 0.2% for the last hour.</li>',
        '    </ul>',
        '  </section>',
        '  <footer tngCardFooter class="headless-card-preview__footer">',
        '    <div tngCardActions>',
        '      <button type="button" class="headless-card-preview__button">View report</button>',
        '      <button type="button" class="headless-card-preview__button headless-card-preview__button--primary">Promote</button>',
        '    </div>',
        '  </footer>',
        '</article>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-card-overview-plain.component.css',
      code: [
        '.headless-card-preview {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  display: grid;',
        '  gap: 0.85rem;',
        '  padding: 1rem;',
        '}',
        '',
        '.headless-card-preview__content ul {',
        '  margin: 0;',
        '  padding-left: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-card-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import {",
        "  TngCard,",
        "  TngCardActions,",
        "  TngCardContent,",
        "  TngCardDescription,",
        "  TngCardFooter,",
        "  TngCardHeader,",
        "  TngCardTitle,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-card-overview-tailwind',",
        '  standalone: true,',
        '  imports: [',
        '    TngCard,',
        '    TngCardHeader,',
        '    TngCardTitle,',
        '    TngCardDescription,',
        '    TngCardContent,',
        '    TngCardFooter,',
        '    TngCardActions,',
        '  ],',
        "  templateUrl: './headless-card-overview-tailwind.component.html',",
        "  styleUrl: './headless-card-overview-tailwind.component.css',",
        '})',
        'export class HeadlessCardOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-card-overview-tailwind.component.html',
      code: [
        '<article',
        '  tngCard',
        '  class="grid gap-4 rounded-2xl border border-slate-300 bg-white/95 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/70"',
        '>',
        '  <header tngCardHeader class="grid gap-1">',
        '    <h3 tngCardTitle class="m-0 text-lg font-semibold text-slate-950 dark:text-slate-50">Release status</h3>',
        '    <p tngCardDescription class="m-0 text-sm text-slate-600 dark:text-slate-300">Production rollout is complete and monitoring is stable.</p>',
        '  </header>',
        '  <section tngCardContent>',
        '    <ul class="m-0 space-y-2 pl-4 text-sm text-slate-700 dark:text-slate-200">',
        '      <li>Latency is below 120ms across all regions.</li>',
        '      <li>Error rate stayed under 0.2% for the last hour.</li>',
        '    </ul>',
        '  </section>',
        '  <footer tngCardFooter class="flex flex-wrap justify-end gap-2">',
        '    <div tngCardActions class="flex flex-wrap gap-2">',
        '      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">View report</button>',
        '      <button type="button" class="rounded-lg border border-sky-500 bg-sky-500 px-3 py-2 text-sm font-medium text-white">Promote</button>',
        '    </div>',
        '  </footer>',
        '</article>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-card-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
