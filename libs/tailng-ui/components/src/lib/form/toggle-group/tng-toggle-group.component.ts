import { Component, input } from '@angular/core';
import { TngToggleGroup as TngToggleGroupPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-toggle-group',
  imports: [TngToggleGroupPrimitive],
  templateUrl: './tng-toggle-group.component.html',
  styleUrl: './tng-toggle-group.component.css',
})
export class TngToggleGroup {
  public readonly ariaLabel = input<string>('Toggle Group');
}
