import { Component, booleanAttribute, contentChildren, effect, input, output } from '@angular/core';
import { TngChip, TngChips as TngChipsPrimitive } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  selector: 'tng-chips',
  imports: [TngChipsPrimitive],
  templateUrl: './tng-chips.component.html',
  styleUrl: './tng-chips.component.css',
})
export class TngChipsComponent {
  private readonly projectedChips = contentChildren(TngChip, { descendants: true });

  public readonly ariaLabel = input<string | null>('Selected items');
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly values = input<readonly unknown[] | undefined>(undefined);
  public readonly defaultValues = input<readonly unknown[]>([]);

  public readonly chipRemove = output<unknown>();
  public readonly valuesChange = output<readonly unknown[]>();

  public constructor() {
    effect((onCleanup) => {
      const subscriptions = this.projectedChips().map((chip) =>
        chip.chipRemove.subscribe((value) => {
          this.onProjectedChipRemove(value);
        }),
      );

      onCleanup(() => {
        for (const subscription of subscriptions) {
          subscription.unsubscribe();
        }
      });
    });
  }

  private onProjectedChipRemove(value: unknown): void {
    if (this.disabled()) {
      return;
    }

    this.chipRemove.emit(value);

    const currentValues = this.values();
    if (currentValues === undefined) {
      return;
    }

    const index = currentValues.findIndex((item) => Object.is(item, value));
    if (index < 0) {
      return;
    }

    const nextValues = [...currentValues.slice(0, index), ...currentValues.slice(index + 1)];
    this.valuesChange.emit(nextValues);
  }
}
