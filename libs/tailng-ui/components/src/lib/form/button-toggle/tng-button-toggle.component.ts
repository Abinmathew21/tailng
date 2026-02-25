import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngButtonToggle as TngButtonTogglePrimitive } from '@tailng-ui/primitives';

export function toggleTngButtonToggleState(pressed: boolean): boolean {
  return !pressed;
}

@Component({
  selector: 'tng-button-toggle',
  imports: [TngButtonTogglePrimitive],
  templateUrl: './tng-button-toggle.component.html',
  styleUrl: './tng-button-toggle.component.css',
})
export class TngButtonToggleComponent {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly pressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  public readonly pressedChange = output<boolean>();

  public onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.pressedChange.emit(toggleTngButtonToggleState(this.pressed()));
  }
}
