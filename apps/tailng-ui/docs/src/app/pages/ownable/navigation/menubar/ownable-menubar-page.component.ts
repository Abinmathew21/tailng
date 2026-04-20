import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-menubar-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-menubar-page.component.html',
})
export class OwnableMenubarPageComponent {
  protected readonly usageCode = [
    '<tng-menubar ariaLabel="Workspace commands">',
    '  <div tngMenubarGroup>',
    '    <tng-menu #fileMenu="tngMenu" ariaLabel="File menu">',
    '      <button type="button" tngMenuItem tngMenuItemValue="New">New</button>',
    '      <button type="button" tngMenuItem tngMenuItemValue="Open">Open</button>',
    '    </tng-menu>',
    '    <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
    '  </div>',
    '</tng-menubar>',
    '',
  ].join('\n');
}
