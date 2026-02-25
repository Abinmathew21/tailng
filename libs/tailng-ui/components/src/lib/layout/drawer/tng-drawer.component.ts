import { Component, input } from '@angular/core';
import { TngDrawer as TngDrawerPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-drawer',
  imports: [TngDrawerPrimitive],
  templateUrl: './tng-drawer.component.html',
  styleUrl: './tng-drawer.component.css',
})
export class TngDrawerComponent {
  public readonly ariaLabel = input<string>('Drawer');
}
