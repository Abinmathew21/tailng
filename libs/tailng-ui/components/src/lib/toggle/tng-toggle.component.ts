import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngToggle as TngTogglePrimitive } from '@tailng-ui/primitives';

export function toggleTngToggleState(pressed: boolean): boolean {
  return !pressed;
}

export function resolveTngToggleAriaLabel(
  pressed: boolean,
  pressedLabel: string,
  unpressedLabel: string,
): string {
  return pressed ? pressedLabel : unpressedLabel;
}

@Component({
  selector: 'tng-toggle',
  imports: [TngTogglePrimitive],
  templateUrl: './tng-toggle.component.html',
  styleUrl: './tng-toggle.component.css',
})
export class TngToggle {
  public readonly pressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly pressedLabel = input<string>('Enabled');
  public readonly unpressedLabel = input<string>('Disabled');

  public readonly pressedChange = output<boolean>();

  public onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.pressedChange.emit(toggleTngToggleState(this.pressed()));
  }

  public getAriaLabel(): string {
    return resolveTngToggleAriaLabel(
      this.pressed(),
      this.pressedLabel(),
      this.unpressedLabel(),
    );
  }
}
