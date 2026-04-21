import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngEmpty,
  TngEmptyActions,
  TngEmptyDescription,
  TngEmptyIcon,
  TngEmptyTitle,
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
  selector: 'app-headless-empty-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngEmpty,
    TngEmptyIcon,
    TngEmptyTitle,
    TngEmptyDescription,
    TngEmptyActions,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './empty-overview-page.component.html',
  styleUrl: './empty-overview-page.component.css',
})
export class HeadlessEmptyOverviewPageComponent implements OnDestroy {
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
    '  TngEmpty,',
    '  TngEmptyActions,',
    '  TngEmptyDescription,',
    '  TngEmptyIcon,',
    '  TngEmptyTitle,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly compositionCode = [
    '<section tngEmpty class="report-empty" [attr.data-align]="\'start\'">',
    '  <div tngEmptyIcon>📭</div>',
    '  <h3 tngEmptyTitle>No reports yet</h3>',
    '  <p tngEmptyDescription>Create your first report to start tracking delivery health.</p>',
    '  <div tngEmptyActions>',
    '    <button type="button">Create report</button>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-empty-overview-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        'import {',
        '  TngEmpty,',
        '  TngEmptyActions,',
        '  TngEmptyDescription,',
        '  TngEmptyIcon,',
        '  TngEmptyTitle,',
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-empty-overview-plain',",
        '  standalone: true,',
        '  imports: [TngEmpty, TngEmptyIcon, TngEmptyTitle, TngEmptyDescription, TngEmptyActions],',
        "  templateUrl: './headless-empty-overview-plain.component.html',",
        "  styleUrl: './headless-empty-overview-plain.component.css',",
        '})',
        'export class HeadlessEmptyOverviewPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-empty-overview-plain.component.html',
      code: [
        '<section tngEmpty class="empty-preview empty-preview--plain">',
        '  <div tngEmptyIcon class="empty-preview-icon">📭</div>',
        '  <h3 tngEmptyTitle class="empty-preview-title">No invoices yet</h3>',
        '  <p tngEmptyDescription class="empty-preview-description">',
        '    Generate your first invoice to start tracking billing workflows.',
        '  </p>',
        '  <div tngEmptyActions class="empty-preview-actions">',
        '    <button type="button" class="empty-preview-button">Create invoice</button>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-empty-overview-plain.component.css',
      code: [
        '.empty-preview--plain {',
        '  border: 1px dashed var(--tng-semantic-accent-brand);',
        '  border-radius: 1rem;',
        '  display: grid;',
        '  gap: 0.6rem;',
        '  justify-items: center;',
        '  padding: 1.25rem;',
        '  text-align: center;',
        '}',
        '',
        '.empty-preview-actions {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.5rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-empty-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        'import {',
        '  TngEmpty,',
        '  TngEmptyActions,',
        '  TngEmptyDescription,',
        '  TngEmptyIcon,',
        '  TngEmptyTitle,',
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-empty-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngEmpty, TngEmptyIcon, TngEmptyTitle, TngEmptyDescription, TngEmptyActions],',
        "  templateUrl: './headless-empty-overview-tailwind.component.html',",
        "  styleUrl: './headless-empty-overview-tailwind.component.css',",
        '})',
        'export class HeadlessEmptyOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-empty-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <section tngEmpty class="grid gap-3 text-center">',
        '    <div tngEmptyIcon class="text-4xl leading-none text-[var(--tng-semantic-foreground-muted)]">🗂️</div>',
        '    <h3 tngEmptyTitle class="m-0 text-lg font-semibold text-[var(--tng-semantic-foreground-primary)]">',
        '      Nothing in this board',
        '    </h3>',
        '    <p tngEmptyDescription class="m-0 max-w-md text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">',
        '      Add your first card to begin planning this sprint.',
        '    </p>',
        '    <div tngEmptyActions class="flex flex-wrap justify-center gap-2">',
        '      <button',
        '        type="button"',
        '        class="rounded-md border border-[var(--tng-semantic-border-default)] px-3 py-1 text-sm font-medium text-[var(--tng-semantic-foreground-primary)]"',
        '      >',
        '        Add card',
        '      </button>',
        '    </div>',
        '  </section>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-empty-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
