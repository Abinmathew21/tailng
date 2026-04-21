import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import {
  TngCardActionsComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
  TngCodeBlockComponent,
} from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-card-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCardFooterComponent,
    TngCardActionsComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './card-overview-page.component.html',
  styleUrl: './card-overview-page.component.css',
})
export class CardOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = [
    'import {',
    '  TngCardActionsComponent,',
    '  TngCardComponent,',
    '  TngCardContentComponent,',
    '  TngCardDescriptionComponent,',
    '  TngCardFooterComponent,',
    '  TngCardHeaderComponent,',
    '  TngCardTitleComponent,',
    "} from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'card-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import {",
        "  TngCardActionsComponent,",
        "  TngCardComponent,",
        "  TngCardContentComponent,",
        "  TngCardDescriptionComponent,",
        "  TngCardFooterComponent,",
        "  TngCardHeaderComponent,",
        "  TngCardTitleComponent,",
        "} from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-card-overview-plain-css',",
        '  standalone: true,',
        '  imports: [',
        '    TngCardComponent,',
        '    TngCardHeaderComponent,',
        '    TngCardTitleComponent,',
        '    TngCardDescriptionComponent,',
        '    TngCardContentComponent,',
        '    TngCardFooterComponent,',
        '    TngCardActionsComponent,',
        '  ],',
        "  templateUrl: './card-overview-plain-css.component.html',",
        "  styleUrl: './card-overview-plain-css.component.css',",
        '})',
        'export class CardOverviewPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-overview-plain-css.component.html',
      code: [
        '<div class="card-preview-shell card-preview-shell--plain">',
        '  <tng-card variant="outline" tone="info" padding="md">',
        '    <tng-card-header>',
        '      <tng-card-title>Release status</tng-card-title>',
        '      <tng-card-description>Production rollout is complete and monitoring is stable.</tng-card-description>',
        '    </tng-card-header>',
        '    <tng-card-content>',
        '      <ul>',
        '        <li>Latency is below 120ms across all regions.</li>',
        '        <li>Error rate remained under 0.2% for the last hour.</li>',
        '      </ul>',
        '    </tng-card-content>',
        '    <tng-card-footer>',
        '      <tng-card-actions>',
        '        <button type="button">View report</button>',
        '        <button type="button">Promote</button>',
        '      </tng-card-actions>',
        '    </tng-card-footer>',
        '  </tng-card>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'card-overview-plain-css.component.css',
      code: [
        '.card-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  padding: 1rem;',
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
      title: 'card-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import {",
        "  TngCardActionsComponent,",
        "  TngCardComponent,",
        "  TngCardContentComponent,",
        "  TngCardDescriptionComponent,",
        "  TngCardFooterComponent,",
        "  TngCardHeaderComponent,",
        "  TngCardTitleComponent,",
        "} from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-card-overview-tailwind',",
        '  standalone: true,',
        '  imports: [',
        '    TngCardComponent,',
        '    TngCardHeaderComponent,',
        '    TngCardTitleComponent,',
        '    TngCardDescriptionComponent,',
        '    TngCardContentComponent,',
        '    TngCardFooterComponent,',
        '    TngCardActionsComponent,',
        '  ],',
        "  templateUrl: './card-overview-tailwind.component.html',",
        "  styleUrl: './card-overview-tailwind.component.css',",
        '})',
        'export class CardOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-card variant="outline" tone="primary" padding="lg" interactive>',
        '    <tng-card-header>',
        '      <tng-card-title>Release status</tng-card-title>',
        '      <tng-card-description>Production rollout is complete and monitoring is stable.</tng-card-description>',
        '    </tng-card-header>',
        '    <tng-card-content>',
        '      <ul class="space-y-2 pl-4">',
        '        <li>Latency is below 120ms across all regions.</li>',
        '        <li>Error rate remained under 0.2% for the last hour.</li>',
        '      </ul>',
        '    </tng-card-content>',
        '    <tng-card-footer>',
        '      <tng-card-actions>',
        '        <button type="button">View report</button>',
        '        <button type="button">Promote</button>',
        '      </tng-card-actions>',
        '    </tng-card-footer>',
        '  </tng-card>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'card-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
