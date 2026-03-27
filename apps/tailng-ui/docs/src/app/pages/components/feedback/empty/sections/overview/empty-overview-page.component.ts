import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import {
  TngCodeBlockComponent,
  TngEmptyActionsComponent,
  TngEmptyComponent,
  TngEmptyDescriptionComponent,
  TngEmptyIconComponent,
  TngEmptyTitleComponent,
} from '@tailng-ui/components';
import {
  TngEmpty as TngEmptyPrimitive,
  TngEmptyActions as TngEmptyActionsPrimitive,
  TngEmptyDescription as TngEmptyDescriptionPrimitive,
  TngEmptyIcon as TngEmptyIconPrimitive,
  TngEmptyTitle as TngEmptyTitlePrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-empty-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngEmptyPrimitive,
    TngEmptyIconPrimitive,
    TngEmptyTitlePrimitive,
    TngEmptyDescriptionPrimitive,
    TngEmptyActionsPrimitive,
    TngEmptyComponent,
    TngEmptyIconComponent,
    TngEmptyTitleComponent,
    TngEmptyDescriptionComponent,
    TngEmptyActionsComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './empty-overview-page.component.html',
  styleUrl: './empty-overview-page.component.css',
})
export class EmptyOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly primitiveImportCode = [
    "import { TngEmpty, TngEmptyIcon, TngEmptyTitle, TngEmptyDescription, TngEmptyActions } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngEmptyComponent, TngEmptyIconComponent, TngEmptyTitleComponent, TngEmptyDescriptionComponent, TngEmptyActionsComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'empty-overview-headless.component.ts',
      code: "import { TngEmpty, TngEmptyIcon, TngEmptyTitle, TngEmptyDescription, TngEmptyActions } from '@tailng-ui/primitives';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-overview-headless.component.html',
      code: [
        '<section tngEmpty class="empty-preview empty-preview--headless">',
        '  <div tngEmptyIcon class="empty-preview-icon">📭</div>',
        '  <h3 tngEmptyTitle class="empty-preview-title">No invoices yet</h3>',
        '  <p tngEmptyDescription class="empty-preview-description">',
        '    Generate your first invoice to start tracking billing workflows.',
        '  </p>',
        '  <div tngEmptyActions class="empty-preview-actions">',
        '    <button type="button">Create invoice</button>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'empty-overview-headless.component.css',
      code: [
        '.empty-preview--headless {',
        '  border: 1px dashed var(--tng-semantic-accent-brand);',
        '  border-radius: 1rem;',
        '  padding: 1.25rem;',
        '  text-align: center;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'empty-overview-plain-css.component.ts',
      code: "import { TngEmptyComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-overview-plain-css.component.html',
      code: [
        '<tng-empty align="start">',
        '  <tng-empty-icon>🔍</tng-empty-icon>',
        '  <tng-empty-title>No matching projects</tng-empty-title>',
        '  <tng-empty-description>',
        '    Adjust filters or clear search criteria to discover more projects.',
        '  </tng-empty-description>',
        '  <tng-empty-actions>',
        '    <button type="button">Clear filters</button>',
        '    <button type="button">Create project</button>',
        '  </tng-empty-actions>',
        '</tng-empty>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'empty-overview-plain-css.component.css',
      code: [
        '.plain-shell {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 1rem;',
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
      title: 'empty-overview-tailwind.component.ts',
      code: "import { TngEmptyComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-empty>',
        '    <tng-empty-icon>🗂️</tng-empty-icon>',
        '    <tng-empty-title>Nothing in this board</tng-empty-title>',
        '    <tng-empty-description>',
        '      Add your first card to begin planning this sprint.',
        '    </tng-empty-description>',
        '    <tng-empty-actions>',
        '      <button type="button" class="rounded-md border border-slate-400 px-3 py-1 text-sm">Add card</button>',
        '    </tng-empty-actions>',
        '  </tng-empty>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'empty-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
