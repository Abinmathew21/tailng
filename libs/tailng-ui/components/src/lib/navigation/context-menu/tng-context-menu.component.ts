import { Component, input } from '@angular/core';
import { TngContextMenu as TngContextMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-context-menu',
  imports: [TngContextMenuPrimitive],
  templateUrl: './tng-context-menu.component.html',
  styleUrl: './tng-context-menu.component.css',
})
export class TngContextMenuComponent {
  public readonly ariaLabel = input<string>('Context Menu');
}
