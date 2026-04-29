import { Component, input } from '@angular/core';

@Component({
  selector: 'tng-toolbar',
  templateUrl: './tng-toolbar.component.html',
  styleUrl: './tng-toolbar.component.css',
})
export class TngToolbarComponent {
  public readonly ariaLabel = input<string>('Toolbar');
}
export { TngToolbarComponent as TngToolbar };
