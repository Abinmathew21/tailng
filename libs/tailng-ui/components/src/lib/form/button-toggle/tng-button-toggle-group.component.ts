import { Component, input } from '@angular/core';
import { TngButtonToggleGroup as TngButtonToggleGroupPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-button-toggle-group',
  imports: [TngButtonToggleGroupPrimitive],
  templateUrl: './tng-button-toggle-group.component.html',
  styleUrl: './tng-button-toggle-group.component.css',
})
export class TngButtonToggleGroup {
  public readonly ariaLabel = input<string>('Button Toggle Group');
}
