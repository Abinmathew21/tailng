import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngAccordion,
  TngAccordionItem,
  TngAccordionPanel,
  TngAccordionTrigger,
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
  selector: 'app-headless-accordion-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngAccordion,
    TngAccordionItem,
    TngAccordionTrigger,
    TngAccordionPanel,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './accordion-overview-page.component.html',
  styleUrls: ['./accordion-overview-page.component.css'],
})
export class HeadlessAccordionOverviewPageComponent implements OnDestroy {
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
    '  TngAccordion,',
    '  TngAccordionItem,',
    '  TngAccordionTrigger,',
    '  TngAccordionPanel,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly usageCode = [
    '<section tngAccordion aria-label="Workspace FAQ" [defaultValue]="\'ownership\'">',
    '  <article tngAccordionItem value="ownership">',
    '    <button tngAccordionTrigger type="button">Ownership model</button>',
    '    <div tngAccordionPanel>',
    '      Copy-paste mode keeps wrapper source in your app for long-term ownership.',
    '    </div>',
    '  </article>',
    '',
    '  <article tngAccordionItem value="testing">',
    '    <button tngAccordionTrigger type="button">Testing strategy</button>',
    '    <div tngAccordionPanel>',
    '      Primitive suites cover keyboard, pointer, and ARIA behavior.',
    '    </div>',
    '  </article>',
    '</section>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-accordion-overview-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import {",
        "  TngAccordion,",
        "  TngAccordionItem,",
        "  TngAccordionPanel,",
        "  TngAccordionTrigger,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-accordion-overview-plain',",
        '  standalone: true,',
        '  imports: [TngAccordion, TngAccordionItem, TngAccordionTrigger, TngAccordionPanel],',
        "  templateUrl: './headless-accordion-overview-plain.component.html',",
        "  styleUrl: './headless-accordion-overview-plain.component.css',",
        '})',
        'export class HeadlessAccordionOverviewPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-accordion-overview-plain.component.html',
      code: [
        '<section',
        '  tngAccordion',
        '  aria-label="Release FAQ"',
        '  [defaultValue]="\'ownership\'"',
        '  class="headless-accordion-preview-shell"',
        '>',
        '  <article tngAccordionItem value="ownership" class="headless-accordion-preview-item">',
        '    <button tngAccordionTrigger type="button" class="headless-accordion-preview-trigger">',
        '      Ownership model',
        '      <span aria-hidden="true" class="headless-accordion-preview-chevron">⌄</span>',
        '    </button>',
        '    <div tngAccordionPanel class="headless-accordion-preview-panel">',
        '      Copy-paste mode keeps source in your app for long-term ownership.',
        '    </div>',
        '  </article>',
        '',
        '  <article tngAccordionItem value="testing" class="headless-accordion-preview-item">',
        '    <button tngAccordionTrigger type="button" class="headless-accordion-preview-trigger">',
        '      Test coverage',
        '      <span aria-hidden="true" class="headless-accordion-preview-chevron">⌄</span>',
        '    </button>',
        '    <div tngAccordionPanel class="headless-accordion-preview-panel">',
        '      Primitive suites validate keyboard, pointer, and aria behavior.',
        '    </div>',
        '  </article>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-accordion-overview-plain.component.css',
      code: [
        '.headless-accordion-preview-shell {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 1rem;',
        '  overflow: hidden;',
        '}',
        '',
        '.headless-accordion-preview-trigger[data-state="open"] {',
        '  color: var(--tng-semantic-foreground-primary);',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-accordion-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import {",
        "  TngAccordion,",
        "  TngAccordionItem,",
        "  TngAccordionPanel,",
        "  TngAccordionTrigger,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-accordion-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngAccordion, TngAccordionItem, TngAccordionTrigger, TngAccordionPanel],',
        "  templateUrl: './headless-accordion-overview-tailwind.component.html',",
        "  styleUrl: './headless-accordion-overview-tailwind.component.css',",
        '})',
        'export class HeadlessAccordionOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-accordion-overview-tailwind.component.html',
      code: [
        '<section',
        '  tngAccordion',
        '  aria-label="Operational guide"',
        '  [defaultValue]="\'governance\'"',
        '  class="overflow-hidden rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)]"',
        '>',
        '  <article tngAccordionItem value="governance" class="border-b border-[var(--tng-semantic-border-subtle)] last:border-b-0">',
        '    <button',
        '      tngAccordionTrigger',
        '      type="button"',
        '      class="flex w-full items-center justify-between border-0 bg-transparent px-4 py-3 text-left font-medium text-[var(--tng-semantic-foreground-primary)]"',
        '    >',
        '      Governance',
        '      <span aria-hidden="true" class="text-sm text-[var(--tng-semantic-foreground-muted)]">⌄</span>',
        '    </button>',
        '    <div tngAccordionPanel class="px-4 pb-4 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">',
        '      Define release policy, reviewer gates, and rollback ownership.',
        '    </div>',
        '  </article>',
        '',
        '  <article tngAccordionItem value="delivery">',
        '    <button',
        '      tngAccordionTrigger',
        '      type="button"',
        '      class="flex w-full items-center justify-between border-0 bg-transparent px-4 py-3 text-left font-medium text-[var(--tng-semantic-foreground-primary)]"',
        '    >',
        '      Delivery',
        '      <span aria-hidden="true" class="text-sm text-[var(--tng-semantic-foreground-muted)]">⌄</span>',
        '    </button>',
        '    <div tngAccordionPanel class="px-4 pb-4 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">',
        '      Ship documentation and examples in the same milestone cadence.',
        '    </div>',
        '  </article>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-accordion-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
