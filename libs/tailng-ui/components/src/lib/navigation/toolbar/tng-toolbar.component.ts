import { Component, input } from '@angular/core';
import { TngToolbar as TngToolbarPrimitive } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  selector: 'tng-toolbar',
  imports: [TngToolbarPrimitive],
  templateUrl: './tng-toolbar.component.html',
  styleUrl: './tng-toolbar.component.css',
})
export class TngToolbarComponent {
  public readonly ariaLabel = input<string>('Toolbar');
}
