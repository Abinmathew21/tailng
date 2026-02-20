import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngSwitch as TngSwitchPrimitive } from '@tailng-ui/primitives';

export function toggleTngSwitchState(checked: boolean): boolean {
  return !checked;
}

@Component({
  selector: 'tng-switch',
  imports: [TngSwitchPrimitive],
  templateUrl: './tng-switch.component.html',
  styleUrl: './tng-switch.component.css',
})
export class TngSwitch {
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  public readonly checkedChange = output<boolean>();

  public onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.checkedChange.emit(toggleTngSwitchState(this.checked()));
  }
}
