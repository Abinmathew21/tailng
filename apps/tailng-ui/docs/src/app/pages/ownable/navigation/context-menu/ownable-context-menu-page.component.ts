import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-context-menu-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-context-menu-page.component.html',
})
export class OwnableContextMenuPageComponent {
  protected readonly usageCode = [
    '<div class="context-menu-shell context-menu-shell--anchored">',
    '  <div tabindex="0" [tngContextMenuTrigger]="assetMenu">Right-click target</div>',
    '  <tng-context-menu #assetMenu="tngContextMenu" ariaLabel="Asset actions">',
    '    <button type="button" tngMenuItem tngMenuItemValue="Rename">Rename</button>',
    '    <button type="button" tngMenuItem tngMenuItemValue="Archive">Archive</button>',
    '  </tng-context-menu>',
    '</div>',
    '',
  ].join('\n');
}
