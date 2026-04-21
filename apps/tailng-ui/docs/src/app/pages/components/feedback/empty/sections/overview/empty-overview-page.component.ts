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
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-empty-overview-page',
  imports: [
    TngCodeBlockComponent,
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
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = [
    'import {',
    '  TngEmptyActionsComponent,',
    '  TngEmptyComponent,',
    '  TngEmptyDescriptionComponent,',
    '  TngEmptyIconComponent,',
    '  TngEmptyTitleComponent,',
    "} from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'empty-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        'import {',
        '  TngEmptyActionsComponent,',
        '  TngEmptyComponent,',
        '  TngEmptyDescriptionComponent,',
        '  TngEmptyIconComponent,',
        '  TngEmptyTitleComponent,',
        "} from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-empty-overview-plain-css',",
        '  standalone: true,',
        '  imports: [',
        '    TngEmptyComponent,',
        '    TngEmptyIconComponent,',
        '    TngEmptyTitleComponent,',
        '    TngEmptyDescriptionComponent,',
        '    TngEmptyActionsComponent,',
        '  ],',
        "  templateUrl: './empty-overview-plain-css.component.html',",
        "  styleUrl: './empty-overview-plain-css.component.css',",
        '})',
        'export class EmptyOverviewPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-overview-plain-css.component.html',
      code: [
        '<section class="empty-preview-shell empty-preview-shell--plain">',
        '  <tng-empty align="start">',
        '    <tng-empty-icon>🔍</tng-empty-icon>',
        '    <tng-empty-title>No matching projects</tng-empty-title>',
        '    <tng-empty-description>',
        '      Adjust filters or clear search criteria to discover more projects.',
        '    </tng-empty-description>',
        '    <tng-empty-actions>',
        '      <button type="button" class="empty-preview-button empty-preview-button--subtle">',
        '        Clear filters',
        '      </button>',
        '      <button type="button" class="empty-preview-button">Create project</button>',
        '    </tng-empty-actions>',
        '  </tng-empty>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'empty-overview-plain-css.component.css',
      code: [
        '.empty-preview-shell {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.95rem;',
        '  padding: 0.95rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'empty-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        'import {',
        '  TngEmptyActionsComponent,',
        '  TngEmptyComponent,',
        '  TngEmptyDescriptionComponent,',
        '  TngEmptyIconComponent,',
        '  TngEmptyTitleComponent,',
        "} from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-empty-overview-tailwind',",
        '  standalone: true,',
        '  imports: [',
        '    TngEmptyComponent,',
        '    TngEmptyIconComponent,',
        '    TngEmptyTitleComponent,',
        '    TngEmptyDescriptionComponent,',
        '    TngEmptyActionsComponent,',
        '  ],',
        "  templateUrl: './empty-overview-tailwind.component.html',",
        "  styleUrl: './empty-overview-tailwind.component.css',",
        '})',
        'export class EmptyOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-overview-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-empty>',
        '    <tng-empty-icon>🗂️</tng-empty-icon>',
        '    <tng-empty-title>Nothing in this board</tng-empty-title>',
        '    <tng-empty-description>',
        '      Add your first card to begin planning this sprint.',
        '    </tng-empty-description>',
        '    <tng-empty-actions>',
        '      <button',
        '        type="button"',
        '        class="rounded-md border border-[var(--tng-semantic-border-default)] px-3 py-1 text-sm font-medium text-[var(--tng-semantic-foreground-primary)]"',
        '      >',
        '        Add card',
        '      </button>',
        '    </tng-empty-actions>',
        '  </tng-empty>',
        '</section>',
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
