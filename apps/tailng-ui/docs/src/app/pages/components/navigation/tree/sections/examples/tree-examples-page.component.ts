import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngTree as TngTreeComponent } from '@tailng-ui/components';
import type { TngTreeItem as TngTreeComponentItem } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

const fileTreeNodes: readonly TngTreeComponentItem[] = Object.freeze([
  { id: 'workspace', label: 'tailng-ui', description: 'Workspace root' },
  { id: 'libs', label: 'libs', description: 'Shared packages', parentId: 'workspace' },
  { id: 'components', label: 'components', parentId: 'libs' },
  { id: 'primitives', label: 'primitives', parentId: 'libs' },
  { id: 'theme', label: 'theme', parentId: 'libs' },
  { id: 'apps', label: 'apps', description: 'Deployable applications', parentId: 'workspace' },
  { id: 'docs', label: 'docs', parentId: 'apps' },
  { id: 'playground', label: 'playground-tailwind', parentId: 'apps' },
]);

const settingsTreeNodes: readonly TngTreeComponentItem[] = Object.freeze([
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance', parentId: 'general' },
  { id: 'theme-mode', label: 'Theme mode', parentId: 'appearance' },
  { id: 'font-size', label: 'Font size', parentId: 'appearance' },
  { id: 'privacy', label: 'Privacy', parentId: 'general' },
  { id: 'cookies', label: 'Cookies', parentId: 'privacy' },
  { id: 'tracking', label: 'Tracking', parentId: 'privacy' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'developer', label: 'Developer tools', parentId: 'advanced' },
  { id: 'experimental', label: 'Experimental', parentId: 'advanced', disabled: true },
]);

@Component({
  selector: 'app-tree-examples-page',
  imports: [
    TngTreeComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tree-examples-page.component.html',
  styleUrl: './tree-examples-page.component.css',
})
export class TreeExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly fileTreeNodes = fileTreeNodes;
  protected readonly fileTreeExpanded = Object.freeze(['workspace', 'libs', 'apps']);

  protected readonly settingsTreeNodes = settingsTreeNodes;
  protected readonly settingsTreeExpanded = Object.freeze(['general', 'appearance']);

  protected readonly fileTreePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tree-file-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngTree, type TngTreeItem } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-tree-file-browser-plain',",
        '  standalone: true,',
        '  imports: [TngTree],',
        "  templateUrl: './tree-file-plain.component.html',",
        "  styleUrl: './tree-file-plain.component.css',",
        '})',
        'export class TreeFileBrowserPlainComponent {',
        '  protected readonly fileTreeNodes: readonly TngTreeItem[] = [',
        "    { id: 'workspace', label: 'tailng-ui', description: 'Workspace root' },",
        "    { id: 'libs', label: 'libs', description: 'Shared packages', parentId: 'workspace' },",
        "    { id: 'components', label: 'components', parentId: 'libs' },",
        "    { id: 'primitives', label: 'primitives', parentId: 'libs' },",
        "    { id: 'theme', label: 'theme', parentId: 'libs' },",
        "    { id: 'apps', label: 'apps', description: 'Deployable applications', parentId: 'workspace' },",
        "    { id: 'docs', label: 'docs', parentId: 'apps' },",
        "    { id: 'playground', label: 'playground-tailwind', parentId: 'apps' },",
        '  ];',
        '',
        "  protected readonly defaultExpandedIds = ['workspace', 'libs', 'apps'] as const;",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-file-plain.component.html',
      code: [
        '<div class="tree-example-demo-shell">',
        '<tng-tree',
        '  [nodes]="fileTreeNodes"',
        '  [defaultExpandedIds]="defaultExpandedIds"',
        '  [defaultSelectedId]="\'components\'"',
        '  ariaLabel="Repository files"',
        '></tng-tree>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tree-file-plain.component.css',
      code: [
        '.tree-example-demo-shell {',
        '  border: 1px solid var(--docs-border-subtle);',
        '  border-radius: 16px;',
        '  padding: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly fileTreeTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tree-file-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngTree, type TngTreeItem } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-tree-file-browser-tailwind',",
        '  standalone: true,',
        '  imports: [TngTree],',
        "  templateUrl: './tree-file-tailwind.component.html',",
        "  styleUrl: './tree-file-tailwind.component.css',",
        '})',
        'export class TreeFileBrowserTailwindComponent {',
        '  protected readonly fileTreeNodes: readonly TngTreeItem[] = [',
        "    { id: 'workspace', label: 'tailng-ui', description: 'Workspace root' },",
        "    { id: 'libs', label: 'libs', description: 'Shared packages', parentId: 'workspace' },",
        "    { id: 'components', label: 'components', parentId: 'libs' },",
        "    { id: 'primitives', label: 'primitives', parentId: 'libs' },",
        "    { id: 'theme', label: 'theme', parentId: 'libs' },",
        "    { id: 'apps', label: 'apps', description: 'Deployable applications', parentId: 'workspace' },",
        "    { id: 'docs', label: 'docs', parentId: 'apps' },",
        "    { id: 'playground', label: 'playground-tailwind', parentId: 'apps' },",
        '  ];',
        '',
        "  protected readonly defaultExpandedIds = ['workspace', 'libs', 'apps'] as const;",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-file-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '<tng-tree',
        '  [nodes]="fileTreeNodes"',
        '  [defaultExpandedIds]="defaultExpandedIds"',
        '  [defaultSelectedId]="\'components\'"',
        '  ariaLabel="Repository files"',
        '></tng-tree>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tree-file-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly settingsPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tree-settings-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngTree, type TngTreeItem } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-tree-settings-plain',",
        '  standalone: true,',
        '  imports: [TngTree],',
        "  templateUrl: './tree-settings-plain.component.html',",
        "  styleUrl: './tree-settings-plain.component.css',",
        '})',
        'export class TreeSettingsPlainComponent {',
        '  protected readonly settingsNodes: readonly TngTreeItem[] = [',
        "    { id: 'general', label: 'General' },",
        "    { id: 'appearance', label: 'Appearance', parentId: 'general' },",
        "    { id: 'theme-mode', label: 'Theme mode', parentId: 'appearance' },",
        "    { id: 'font-size', label: 'Font size', parentId: 'appearance' },",
        "    { id: 'privacy', label: 'Privacy', parentId: 'general' },",
        "    { id: 'cookies', label: 'Cookies', parentId: 'privacy' },",
        "    { id: 'tracking', label: 'Tracking', parentId: 'privacy' },",
        "    { id: 'advanced', label: 'Advanced' },",
        "    { id: 'developer', label: 'Developer tools', parentId: 'advanced' },",
        "    { id: 'experimental', label: 'Experimental', parentId: 'advanced', disabled: true },",
        '  ];',
        '',
        "  protected readonly defaultExpandedIds = ['general', 'appearance'] as const;",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-settings-plain.component.html',
      code: [
        '<div class="tree-example-demo-shell">',
        '<tng-tree',
        '  [nodes]="settingsNodes"',
        '  [defaultExpandedIds]="defaultExpandedIds"',
        '  [defaultSelectedId]="\'theme-mode\'"',
        '  ariaLabel="Settings"',
        '></tng-tree>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tree-settings-plain.component.css',
      code: [
        '.tree-example-demo-shell {',
        '  border: 1px solid var(--docs-border-subtle);',
        '  border-radius: 16px;',
        '  padding: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly settingsTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tree-settings-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngTree, type TngTreeItem } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-tree-settings-tailwind',",
        '  standalone: true,',
        '  imports: [TngTree],',
        "  templateUrl: './tree-settings-tailwind.component.html',",
        "  styleUrl: './tree-settings-tailwind.component.css',",
        '})',
        'export class TreeSettingsTailwindComponent {',
        '  protected readonly settingsNodes: readonly TngTreeItem[] = [',
        "    { id: 'general', label: 'General' },",
        "    { id: 'appearance', label: 'Appearance', parentId: 'general' },",
        "    { id: 'theme-mode', label: 'Theme mode', parentId: 'appearance' },",
        "    { id: 'font-size', label: 'Font size', parentId: 'appearance' },",
        "    { id: 'privacy', label: 'Privacy', parentId: 'general' },",
        "    { id: 'cookies', label: 'Cookies', parentId: 'privacy' },",
        "    { id: 'tracking', label: 'Tracking', parentId: 'privacy' },",
        "    { id: 'advanced', label: 'Advanced' },",
        "    { id: 'developer', label: 'Developer tools', parentId: 'advanced' },",
        "    { id: 'experimental', label: 'Experimental', parentId: 'advanced', disabled: true },",
        '  ];',
        '',
        "  protected readonly defaultExpandedIds = ['general', 'appearance'] as const;",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-settings-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '<tng-tree',
        '  [nodes]="settingsNodes"',
        '  [defaultExpandedIds]="defaultExpandedIds"',
        '  [defaultSelectedId]="\'theme-mode\'"',
        '  ariaLabel="Settings"',
        '></tng-tree>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tree-settings-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
