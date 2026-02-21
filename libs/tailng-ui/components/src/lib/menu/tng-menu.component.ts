import { Component, input } from '@angular/core';
import { TngMenu as TngMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-menu',
  imports: [TngMenuPrimitive],
  templateUrl: './tng-menu.component.html',
  styleUrl: './tng-menu.component.css',
})
export class TngMenu {
  public readonly ariaLabel = input<string>('Menu');
}
