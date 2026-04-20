import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngTree as TngTreeComponent } from '@tailng-ui/components';
import type { TngTreeItem as TngTreeComponentItem } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

const overviewNodes: readonly TngTreeComponentItem[] = Object.freeze([
  { id: 'src', label: 'src' },
  { id: 'components', label: 'components', parentId: 'src' },
  { id: 'button', label: 'button.ts', parentId: 'components' },
  { id: 'input', label: 'input.ts', parentId: 'components' },
  { id: 'utils', label: 'utils', parentId: 'src' },
  { id: 'helpers', label: 'helpers.ts', parentId: 'utils' },
  { id: 'readme', label: 'README.md', parentId: 'src' },
]);

@Component({
  selector: 'app-tree-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngTreeComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tree-overview-page.component.html',
  styleUrl: './tree-overview-page.component.css',
})
export class TreeOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly overviewNodes = overviewNodes;
  protected readonly defaultExpandedIds = Object.freeze(['src', 'components']);

  protected readonly primitiveImportCode = [
    "import { TngTree, TngTreeItem, TngTreeGroup, TngTreeIndicator } from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngTree, type TngTreeItem } from '@tailng-ui/components';",
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tree-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngTree, type TngTreeItem } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-tree-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngTree],',
        "  templateUrl: './tree-overview-plain-css.component.html',",
        "  styleUrl: './tree-overview-plain-css.component.css',",
        '})',
        'export class TreeOverviewPlainCssComponent {',
        '  protected readonly treeNodes: readonly TngTreeItem[] = [',
        "    { id: 'src', label: 'src' },",
        "    { id: 'components', label: 'components', parentId: 'src' },",
        "    { id: 'button', label: 'button.ts', parentId: 'components' },",
        "    { id: 'input', label: 'input.ts', parentId: 'components' },",
        "    { id: 'utils', label: 'utils', parentId: 'src' },",
        "    { id: 'helpers', label: 'helpers.ts', parentId: 'utils' },",
        "    { id: 'readme', label: 'README.md', parentId: 'src' },",
        '  ];',
        '',
        "  protected readonly defaultExpandedIds = ['src', 'components'] as const;",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-overview-plain-css.component.html',
      code: [
        '<div class="tree-demo-shell">',
        '<tng-tree',
        '  [nodes]="treeNodes"',
        '  [defaultExpandedIds]="defaultExpandedIds"',
        '  [defaultSelectedId]="\'button\'"',
        '  ariaLabel="Project files"',
        '></tng-tree>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tree-overview-plain-css.component.css',
      code: [
        '.tree-demo-shell {',
        '  border: 1px solid var(--docs-border-subtle);',
        '  border-radius: 16px;',
        '  padding: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tree-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngTree, type TngTreeItem } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-tree-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngTree],',
        "  templateUrl: './tree-overview-tailwind.component.html',",
        "  styleUrl: './tree-overview-tailwind.component.css',",
        '})',
        'export class TreeOverviewTailwindComponent {',
        '  protected readonly treeNodes: readonly TngTreeItem[] = [',
        "    { id: 'src', label: 'src' },",
        "    { id: 'components', label: 'components', parentId: 'src' },",
        "    { id: 'button', label: 'button.ts', parentId: 'components' },",
        "    { id: 'input', label: 'input.ts', parentId: 'components' },",
        "    { id: 'utils', label: 'utils', parentId: 'src' },",
        "    { id: 'helpers', label: 'helpers.ts', parentId: 'utils' },",
        "    { id: 'readme', label: 'README.md', parentId: 'src' },",
        '  ];',
        '',
        "  protected readonly defaultExpandedIds = ['src', 'components'] as const;",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-tree',
        '    [nodes]="treeNodes"',
        '    [defaultExpandedIds]="defaultExpandedIds"',
        '    [defaultSelectedId]="\'button\'"',
        '    ariaLabel="Project files"',
        '  ></tng-tree>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tree-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
