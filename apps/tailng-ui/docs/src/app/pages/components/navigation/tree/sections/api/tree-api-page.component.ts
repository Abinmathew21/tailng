import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-tree-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './tree-api-page.component.html',
  styleUrl: './tree-api-page.component.css',
})
export class TreeApiPageComponent {
  protected readonly primitiveUsageCode = [
    '<div tngTree [selectionMode]="\'single\'" aria-label="Files">',
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
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-tree',
    '  [nodes]="treeNodes"',
    '  [defaultExpandedIds]="[\'src\']"',
    '  [defaultSelectedId]="\'index\'"',
    '  [ariaLabel]="\'Files\'"',
    '  (selectedIdChange)="onSelect($event)"',
    '/>',
    '',
  ].join('\n');
}
