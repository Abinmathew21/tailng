import { Component, input } from '@angular/core';
import { TngMenubar as TngMenubarPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-menubar',
  imports: [TngMenubarPrimitive],
  templateUrl: './tng-menubar.component.html',
  styleUrl: './tng-menubar.component.css',
})
export class TngMenubar {
  public readonly ariaLabel = input<string>('Menubar');
}
