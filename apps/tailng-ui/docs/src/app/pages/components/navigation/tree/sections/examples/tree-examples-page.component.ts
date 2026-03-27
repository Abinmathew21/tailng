import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngTree as TngTreeComponent } from '@tailng-ui/components';
import type { TngTreeItem as TngTreeComponentItem } from '@tailng-ui/components';
import {
  TngTree as TngTreePrimitive,
  TngTreeItem,
  TngTreeGroup,
  TngTreeIndicator,
} from '@tailng-ui/primitives';
import type { TngTreeValue } from '@tailng-ui/primitives';
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
    TngTreePrimitive,
    TngTreeItem,
    TngTreeGroup,
    TngTreeIndicator,
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
  protected readonly fileTreeSelected = signal<string>('components');

  protected readonly settingsTreeNodes = settingsTreeNodes;
  protected readonly settingsTreeExpanded = Object.freeze(['general', 'appearance']);
  protected readonly settingsTreeSelected = signal<string>('theme-mode');

  protected readonly headlessSelected = signal<string | null>(null);

  public onFileTreeSelect(nodeId: string | null): void {
    this.fileTreeSelected.set(nodeId ?? 'components');
  }

  public onSettingsTreeSelect(nodeId: string | null): void {
    this.settingsTreeSelected.set(nodeId ?? 'theme-mode');
  }

  public onHeadlessSelect(value: TngTreeValue | readonly TngTreeValue[] | null): void {
    const id = Array.isArray(value) ? (value[0] ?? null) : value;
    this.headlessSelected.set(id != null ? String(id) : null);
  }

  protected readonly fileTreeHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-file-headless.component.html',
      code: [
        '<div tngTree [selectionMode]="\'single\'" aria-label="Repository files">',
        '  <div tngTreeItem [value]="\'workspace\'" [defaultExpanded]="true">',
        '    <span tngTreeIndicator>📂</span> tailng-ui',
        '    <div tngTreeGroup>',
        '      <div tngTreeItem [value]="\'libs\'" [defaultExpanded]="true">',
        '        <span tngTreeIndicator>📂</span> libs',
        '        <div tngTreeGroup>',
        '          <div tngTreeItem [value]="\'components\'">',
        '            <span tngTreeIndicator>📄</span> components',
        '          </div>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly fileTreePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-file-plain.component.html',
      code: [
        '<tng-tree',
        '  [nodes]="fileTreeNodes"',
        '  [defaultExpandedIds]="fileTreeExpanded"',
        '  [defaultSelectedId]="\'components\'"',
        '  [ariaLabel]="\'Repository files\'"',
        '  (selectedIdChange)="onSelect($event)"',
        '/>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly fileTreeTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-file-tailwind.component.html',
      code: [
        '<tng-tree',
        '  [nodes]="fileTreeNodes"',
        '  [defaultExpandedIds]="fileTreeExpanded"',
        '  [defaultSelectedId]="\'components\'"',
        '  [ariaLabel]="\'Repository files\'"',
        '  (selectedIdChange)="onSelect($event)"',
        '/>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly settingsHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-settings-headless.component.html',
      code: [
        '<div tngTree [selectionMode]="\'single\'" aria-label="Settings">',
        '  <div tngTreeItem [value]="\'general\'" [defaultExpanded]="true">',
        '    <span tngTreeIndicator>⚙️</span> General',
        '    <div tngTreeGroup>',
        '      <div tngTreeItem [value]="\'appearance\'" [defaultExpanded]="true">',
        '        <span tngTreeIndicator>🎨</span> Appearance',
        '        <div tngTreeGroup>',
        '          <div tngTreeItem [value]="\'theme-mode\'">Theme mode</div>',
        '          <div tngTreeItem [value]="\'font-size\'">Font size</div>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly settingsPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-settings-plain.component.html',
      code: [
        '<tng-tree',
        '  [nodes]="settingsNodes"',
        '  [defaultExpandedIds]="[\'general\', \'appearance\']"',
        '  [defaultSelectedId]="\'theme-mode\'"',
        '  [ariaLabel]="\'Settings\'"',
        '  (selectedIdChange)="onSelect($event)"',
        '/>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly settingsTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tree-settings-tailwind.component.html',
      code: [
        '<tng-tree',
        '  [nodes]="settingsNodes"',
        '  [defaultExpandedIds]="[\'general\', \'appearance\']"',
        '  [defaultSelectedId]="\'theme-mode\'"',
        '  [ariaLabel]="\'Settings\'"',
        '  (selectedIdChange)="onSelect($event)"',
        '/>',
        '',
      ].join('\n'),
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
