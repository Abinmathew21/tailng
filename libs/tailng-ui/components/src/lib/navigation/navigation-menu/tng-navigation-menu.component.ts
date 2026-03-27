import { Component, input } from '@angular/core';
import { TngNavigationMenu as TngNavigationMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-navigation-menu',
  imports: [TngNavigationMenuPrimitive],
  templateUrl: './tng-navigation-menu.component.html',
  styleUrl: './tng-navigation-menu.component.css',
})
export class TngNavigationMenuComponent {
  public readonly ariaLabel = input<string>('Navigation Menu');
}
export { TngNavigationMenuComponent as TngNavigationMenu };
