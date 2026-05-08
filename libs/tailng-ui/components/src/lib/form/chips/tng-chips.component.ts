import {
  Component,
  booleanAttribute,
  contentChildren,
  effect,
  input,
  output,
  signal,
  type OnInit,
} from '@angular/core';
import { TngChip, TngChips as TngChipsPrimitive } from '@tailng-ui/primitives';
import { TngChipComponent } from './tng-chip.component';

function normalizeValues(values: readonly unknown[] | null | undefined): readonly unknown[] {
  if (!Array.isArray(values) || values.length === 0) {
    return [];
  }

  const normalizedValues = values as readonly unknown[];
  return normalizedValues.slice();
}

function removeFirstOccurrence(values: readonly unknown[], target: unknown): readonly unknown[] {
  const index = values.findIndex((item) => Object.is(item, target));
  if (index < 0) {
    return values;
  }

  return [...values.slice(0, index), ...values.slice(index + 1)];
}

function defaultItemLabel(item: unknown): string {
  if (item === null || item === undefined) {
    return 'item';
  }

  if (typeof item !== 'boolean' && typeof item !== 'number' && typeof item !== 'string') {
    return 'item';
  }

  const label = `${item}`.trim();
  return label.length > 0 ? label : 'item';
}

@Component({
  selector: 'tng-chips',
  imports: [TngChipComponent, TngChipsPrimitive],
  templateUrl: './tng-chips.component.html',
  styleUrl: './tng-chips.component.css',
})
export class TngChipsComponent implements OnInit {
  private readonly projectedPrimitiveChips = contentChildren(TngChip, { descendants: true });
  private readonly projectedComponentChips = contentChildren(TngChipComponent, { descendants: true });
  private readonly internalValues = signal<readonly unknown[]>([]);

  public readonly ariaLabel = input<string | null>('Selected items');
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly values = input<readonly unknown[] | undefined>(undefined);
  public readonly defaultValues = input<readonly unknown[]>([]);
  public readonly items = input<readonly unknown[] | undefined>(undefined);
  public readonly itemLabel = input<(item: unknown) => string>(defaultItemLabel);

  public readonly chipRemove = output<unknown>();
  public readonly valuesChange = output<readonly unknown[]>();

  public constructor() {
    effect((onCleanup) => {
      const subscriptions = [
        ...this.projectedPrimitiveChips().map((chip) =>
          chip.chipRemove.subscribe((value: unknown) => {
            this.onProjectedChipRemove(value);
          }),
        ),
        ...this.projectedComponentChips().map((chip) =>
          chip.chipRemove.subscribe((value: unknown) => {
            this.onProjectedChipRemove(value);
          }),
        ),
      ];

      onCleanup(() => {
        for (const subscription of subscriptions) {
          subscription.unsubscribe();
        }
      });
    });
  }

  public ngOnInit(): void {
    this.internalValues.set(normalizeValues(this.defaultValues()));
  }

  protected displayItems(): readonly unknown[] {
    return normalizeValues(this.items());
  }

  protected resolveItemLabel(item: unknown): string {
    return this.itemLabel()(item);
  }

  protected onChipRemove(value: unknown): void {
    if (this.disabled()) {
      return;
    }

    this.chipRemove.emit(value);

    const currentValues = this.values() ?? this.items() ?? this.internalValues();
    const nextValues = removeFirstOccurrence(currentValues, value);
    if (nextValues === currentValues) {
      return;
    }

    if (this.values() === undefined) {
      this.internalValues.set(nextValues);
    }

    this.valuesChange.emit(nextValues);
  }

  private onProjectedChipRemove(value: unknown): void {
    this.onChipRemove(value);
  }
}
