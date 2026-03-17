import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngTree as TngTreeComponent } from '@tailng-ui/components';
import type { TngTreeItem as TngTreeComponentItem } from '@tailng-ui/components';
import {
  TngTree as TngTreePrimitive,
  TngTreeItem,
  TngTreeGroup,
  TngTreeIndicator,
} from '@tailng-ui/primitives';
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
    TngTreePrimitive,
    TngTreeItem,
    TngTreeGroup,
    TngTreeIndicator,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tree-overview-page.component.html',
  styleUrl: './tree-overview-page.component.css',
})
export class TreeOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly overviewNodes = overviewNodes;
  protected readonly defaultExpandedIds = Object.freeze(['src', 'components']);

  protected readonly primitiveImportCode = [
    "import { TngTree, TngTreeItem, TngTreeGroup, TngTreeIndicator } from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly componentImportCode =
    "import { TngTree } from '@tailng-ui/components';";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-overview-headless.component.html',
      code: [
        '<div tngTree [selectionMode]="\'single\'" aria-label="Project files">',
        '  <div tngTreeItem [value]="\'src\'" [defaultExpanded]="true">',
        '    <span tngTreeIndicator>📂</span> src',
        '    <div tngTreeGroup>',
        '      <div tngTreeItem [value]="\'index\'">',
        '        <span tngTreeIndicator>📄</span> index.ts',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tree-overview-plain-css.component.ts',
      code: [
        "readonly treeNodes: TngTreeItem[] = [",
        "  { id: 'src', label: 'src' },",
        "  { id: 'index', label: 'index.ts', parentId: 'src' },",
        '];',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-overview-plain-css.component.html',
      code: [
        '<tng-tree',
        '  [nodes]="treeNodes"',
        '  [defaultExpandedIds]="[\'src\']"',
        '  [ariaLabel]="\'Project files\'"',
        '  (selectedIdChange)="onSelect($event)"',
        '/>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-overview-tailwind.component.html',
      code: [
        '<div tngTree [selectionMode]="\'single\'"',
        '  class="rounded-xl border border-tng-border-subtle p-3 text-sm">',
        '  <div tngTreeItem [value]="\'src\'" [defaultExpanded]="true" class="cursor-pointer">',
        '    <span class="tree-row">',
        '      <span tngTreeIndicator class="mr-1 w-4 text-center text-xs">📂</span>src',
        '    </span>',
        '    <div tngTreeGroup class="ml-5 border-l border-tng-border-subtle pl-3">',
        '      <div tngTreeItem [value]="\'index\'" class="cursor-pointer">',
        '        <span class="tree-row">',
        '          <span tngTreeIndicator class="mr-1 w-4 text-center text-xs">📄</span>index.ts',
        '        </span>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>',
        '',
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

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
