import { Component, input } from '@angular/core';
import { TngTabs as TngTabsPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-tabs',
  imports: [TngTabsPrimitive],
  templateUrl: './tng-tabs.component.html',
  styleUrl: './tng-tabs.component.css',
})
export class TngTabs {
  public readonly ariaLabel = input<string>('Tabs');
}
