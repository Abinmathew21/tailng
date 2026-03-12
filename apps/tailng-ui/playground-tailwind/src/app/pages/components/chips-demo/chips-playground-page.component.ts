import { Component, signal } from '@angular/core';
import { TngChipsComponent } from '@tailng-ui/components';
import {
  TngChip,
  TngChipRemove,
  TngChips as TngChipsPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-chips-playground-page',
  imports: [TngChipsPrimitive, TngChip, TngChipRemove, TngChipsComponent],
  templateUrl: './chips-playground-page.component.html',
  styleUrl: './chips-playground-page.component.css',
})
export class ChipsPlaygroundPageComponent {
  readonly primitiveValues = signal<readonly string[]>(['Angular', 'CDK', 'A11y']);
  readonly componentValues = signal<readonly string[]>(['Button', 'Dialog', 'Menu']);

  onPrimitiveValuesChange(nextValues: readonly unknown[]): void {
    this.primitiveValues.set(nextValues as readonly string[]);
  }

  onComponentValuesChange(nextValues: readonly unknown[]): void {
    this.componentValues.set(nextValues as readonly string[]);
  }
}
