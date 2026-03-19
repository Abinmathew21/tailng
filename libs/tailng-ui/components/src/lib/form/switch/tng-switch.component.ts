import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngSwitch as TngSwitchPrimitive } from '@tailng-ui/primitives';

type TngSwitchKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

export function toggleTngSwitchState(checked: boolean): boolean {
  return !checked;
}

export function resolveTngSwitchArrowKey(key: string): boolean | null {
  if (key === 'ArrowLeft') {
    return false;
  }

  if (key === 'ArrowRight') {
    return true;
  }

  return null;
}

@Component({
  standalone: true,
  selector: 'tng-switch',
  imports: [TngSwitchPrimitive],
  templateUrl: './tng-switch.component.html',
  styleUrl: './tng-switch.component.css',
})
export class TngSwitchComponent {
  public readonly ariaLabel = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string>('on');

  public readonly checkedChange = output<boolean>();

  public onKeydown(event: TngSwitchKeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    const nextValue = resolveTngSwitchArrowKey(event.key);
    if (nextValue === null || nextValue === this.checked()) {
      return;
    }

    event.preventDefault();
    this.checkedChange.emit(nextValue);
  }

  public onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.checkedChange.emit(toggleTngSwitchState(this.checked()));
  }
}
