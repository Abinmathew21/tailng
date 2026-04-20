import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngAccordionComponent,
  TngAccordionIndicator,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
  TngCodeBlockComponent,
} from '@tailng-ui/components';
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
  selector: 'app-accordion-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngAccordionComponent,
    TngAccordionIndicator,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './accordion-overview-page.component.html',
  styleUrl: './accordion-overview-page.component.css',
})
export class AccordionOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly componentImportCode = [
    'import {',
    '  TngAccordionComponent,',
    '  TngAccordionIndicator,',
    '  TngAccordionItemComponent,',
    '  TngAccordionTriggerComponent,',
    '  TngAccordionPanelComponent,',
    "} from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'accordion-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import {",
        "  TngAccordionComponent,",
        "  TngAccordionIndicator,",
        "  TngAccordionItemComponent,",
        "  TngAccordionPanelComponent,",
        "  TngAccordionTriggerComponent,",
        "} from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-accordion-overview-plain-css',",
        '  standalone: true,',
        '  imports: [',
        '    TngAccordionComponent,',
        '    TngAccordionIndicator,',
        '    TngAccordionItemComponent,',
        '    TngAccordionTriggerComponent,',
        '    TngAccordionPanelComponent,',
        '  ],',
        "  templateUrl: './accordion-overview-plain-css.component.html',",
        "  styleUrl: './accordion-overview-plain-css.component.css',",
        '})',
        'export class AccordionOverviewPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-overview-plain-css.component.html',
      code: [
        '<div class="accordion-preview-shell accordion-preview-shell--plain">',
        '  <tng-accordion ariaLabel="Release FAQ" [defaultValue]="\'ownership\'">',
        '    <tng-accordion-item value="ownership">',
        '      <tng-accordion-trigger class="accordion-preview-trigger">',
        '        Ownership model',
        '        <span tngAccordionIndicator aria-hidden="true" class="accordion-preview-chevron">⌄</span>',
        '      </tng-accordion-trigger>',
        '      <tng-accordion-panel class="accordion-preview-panel">',
        '        Copy-paste mode keeps source in your app for long-term ownership.',
        '      </tng-accordion-panel>',
        '    </tng-accordion-item>',
        '',
        '    <tng-accordion-item value="testing">',
        '      <tng-accordion-trigger class="accordion-preview-trigger">',
        '        Test coverage',
        '        <span tngAccordionIndicator aria-hidden="true" class="accordion-preview-chevron">⌄</span>',
        '      </tng-accordion-trigger>',
        '      <tng-accordion-panel class="accordion-preview-panel">',
        '        Primitive suites validate keyboard, pointer, and aria behavior.',
        '      </tng-accordion-panel>',
        '    </tng-accordion-item>',
        '  </tng-accordion>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'accordion-overview-plain-css.component.css',
      code: [
        '.accordion-preview-shell--plain {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.75rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'accordion-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import {",
        "  TngAccordionComponent,",
        "  TngAccordionIndicator,",
        "  TngAccordionItemComponent,",
        "  TngAccordionPanelComponent,",
        "  TngAccordionTriggerComponent,",
        "} from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-accordion-overview-tailwind',",
        '  standalone: true,',
        '  imports: [',
        '    TngAccordionComponent,',
        '    TngAccordionIndicator,',
        '    TngAccordionItemComponent,',
        '    TngAccordionTriggerComponent,',
        '    TngAccordionPanelComponent,',
        '  ],',
        "  templateUrl: './accordion-overview-tailwind.component.html',",
        "  styleUrl: './accordion-overview-tailwind.component.css',",
        '})',
        'export class AccordionOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-accordion ariaLabel="Operational guide" [defaultValue]="\'governance\'">',
        '    <tng-accordion-item value="governance">',
        '      <tng-accordion-trigger class="accordion-preview-trigger font-medium text-slate-900 dark:text-slate-100">',
        '        Governance',
        '        <span tngAccordionIndicator aria-hidden="true" class="accordion-preview-chevron">⌄</span>',
        '      </tng-accordion-trigger>',
        '      <tng-accordion-panel class="accordion-preview-panel text-slate-700 dark:text-slate-300">',
        '        Define release policy, reviewer gates, and rollback ownership.',
        '      </tng-accordion-panel>',
        '    </tng-accordion-item>',
        '',
        '    <tng-accordion-item value="delivery">',
        '      <tng-accordion-trigger class="accordion-preview-trigger font-medium text-slate-900 dark:text-slate-100">',
        '        Delivery',
        '        <span tngAccordionIndicator aria-hidden="true" class="accordion-preview-chevron">⌄</span>',
        '      </tng-accordion-trigger>',
        '      <tng-accordion-panel class="accordion-preview-panel text-slate-700 dark:text-slate-300">',
        '        Ship documentation and examples in the same milestone cadence.',
        '      </tng-accordion-panel>',
        '    </tng-accordion-item>',
        '  </tng-accordion>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'accordion-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
