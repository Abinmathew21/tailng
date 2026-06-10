import {
  ElementRef,
  booleanAttribute,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  TngButtonToggle as TngButtonTogglePrimitive,
  type TngButtonToggleValue,
} from '@tailng-ui/primitives';

export function toggleTngButtonToggleState(pressed: boolean): boolean {
  return !pressed;
}

function normalizeOptionalButtonToggleValue(
  value: unknown,
): TngButtonToggleValue | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  return String(value as unknown);
}

@Component({
  selector: 'tng-button-toggle',
  imports: [TngButtonTogglePrimitive],
  templateUrl: './tng-button-toggle.component.html',
  styleUrl: './tng-button-toggle.component.css',
})
export class TngButtonToggleComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly pressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly toggleValueInput = input<TngButtonToggleValue | null | undefined, unknown>(
    undefined,
    {
      alias: 'tngButtonToggleValue',
      transform: normalizeOptionalButtonToggleValue,
    },
  );
  public readonly valueInput = input<TngButtonToggleValue | null | undefined, unknown>(undefined, {
    alias: 'value',
    transform: normalizeOptionalButtonToggleValue,
  });

  public readonly pressedChange = output<boolean>();

  public onToggle(): void {
    if (this.disabled()) {
      return;
    }

    if (this.isInsideToggleGroup()) {
      return;
    }

    this.pressedChange.emit(toggleTngButtonToggleState(this.pressed()));
  }

  protected resolvedValue(): TngButtonToggleValue | null | undefined {
    const explicit = this.toggleValueInput();
    if (explicit !== undefined) {
      return explicit;
    }

    return this.valueInput();
  }

  private isInsideToggleGroup(): boolean {
    return this.hostRef.nativeElement.closest('[data-slot="button-toggle-group"]') !== null;
  }
}
