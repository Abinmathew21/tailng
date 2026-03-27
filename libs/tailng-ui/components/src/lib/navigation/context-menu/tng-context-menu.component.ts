import { Component, HostBinding, input } from '@angular/core';
import {
  TngContextMenu as TngContextMenuPrimitive,
  TngMenu as TngMenuPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'tng-context-menu',
  hostDirectives: [
    {
      directive: TngMenuPrimitive,
      inputs: ['loop', 'disabled', 'closeOnSelect', 'dismissOnOutsideClick', 'dismissOnFocusout'],
      outputs: ['tngMenuOpened', 'tngMenuClosed', 'tngMenuSelect'],
    },
    {
      directive: TngContextMenuPrimitive,
    },
  ],
  templateUrl: './tng-context-menu.component.html',
  styleUrl: './tng-context-menu.component.css',
  exportAs: 'tngContextMenuComponent',
})
export class TngContextMenuComponent {
  public readonly ariaLabel = input<string>('Context menu');

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }
}
export { TngContextMenuComponent as TngContextMenu };
