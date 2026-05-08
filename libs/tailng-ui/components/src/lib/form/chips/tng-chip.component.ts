import { Component, booleanAttribute, input, output } from '@angular/core';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';

function normalizeLabel(value: unknown): string {
  if (value === null || value === undefined) {
    return 'item';
  }

  if (typeof value !== 'boolean' && typeof value !== 'number' && typeof value !== 'string') {
    return 'item';
  }

  const label = `${value}`.trim();
  return label.length > 0 ? label : 'item';
}

@Component({
  selector: 'tng-chip',
  imports: [TngChip, TngChipRemove],
  templateUrl: './tng-chip.component.html',
  styleUrl: './tng-chip.component.css',
})
export class TngChipComponent {
  public readonly value = input<unknown>(null);
  public readonly label = input<string | null>(null);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly removable = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly removeAriaLabel = input<string | null>(null);

  public readonly chipRemove = output<unknown>();

  protected resolvedLabel(): string {
    return normalizeLabel(this.label() ?? this.value());
  }
}
