import { Component, signal } from '@angular/core';
import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';
import {
  TngButtonToggle as TngButtonTogglePrimitive,
  TngButtonToggleGroup as TngButtonToggleGroupPrimitive,
} from '@tailng-ui/primitives';

type AlignOption = 'center' | 'left' | 'right';
type StyleOption = 'bold' | 'italic' | 'underline';

function toggleSelection<TValue extends string>(
  values: readonly TValue[],
  value: TValue,
  pressed: boolean,
): readonly TValue[] {
  if (pressed) {
    return values.includes(value) ? values : [...values, value];
  }

  return values.filter((item) => item !== value);
}

@Component({
  selector: 'app-button-toggle-playground-page',
  imports: [
    TngButtonToggleComponent,
    TngButtonToggleGroupComponent,
    TngButtonTogglePrimitive,
    TngButtonToggleGroupPrimitive,
  ],
  templateUrl: './button-toggle-playground-page.component.html',
  styleUrl: './button-toggle-playground-page.component.css',
})
export class ButtonTogglePlaygroundPageComponent {
  public readonly componentAlign = signal<AlignOption>('left');
  public readonly componentStyles = signal<readonly StyleOption[]>(['bold']);
  public readonly primitiveAlign = signal<AlignOption>('left');
  public readonly primitiveStyles = signal<readonly StyleOption[]>(['bold']);

  public isSelected<TValue extends string>(values: readonly TValue[], value: TValue): boolean {
    return values.includes(value);
  }

  public onComponentAlignToggle(value: AlignOption, pressed: boolean): void {
    if (!pressed) {
      return;
    }

    this.componentAlign.set(value);
  }

  public onComponentStyleToggle(value: StyleOption, pressed: boolean): void {
    const nextValues = toggleSelection(this.componentStyles(), value, pressed);
    this.componentStyles.set(nextValues);
  }

  public onPrimitiveAlignChange(value: AlignOption): void {
    this.primitiveAlign.set(value);
  }

  public onPrimitiveStyleToggle(value: StyleOption): void {
    const isPressed = !this.primitiveStyles().includes(value);
    const nextValues = toggleSelection(this.primitiveStyles(), value, isPressed);
    this.primitiveStyles.set(nextValues);
  }
}
