import { Component, signal } from '@angular/core';
import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';
import {
  TngButtonToggle as TngButtonTogglePrimitive,
  TngButtonToggleGroup as TngButtonToggleGroupPrimitive,
  type TngButtonToggleValue,
} from '@tailng-ui/primitives';

type AlignOption = 'center' | 'left' | 'right';
type StyleOption = 'bold' | 'italic' | 'underline';

function toAlignOption(value: TngButtonToggleValue | null): AlignOption {
  if (value === 'center') {
    return 'center';
  }

  if (value === 'right') {
    return 'right';
  }

  return 'left';
}

function toStyleOptions(values: readonly TngButtonToggleValue[]): readonly StyleOption[] {
  const allowedValues = new Set<StyleOption>(['bold', 'italic', 'underline']);
  return values.filter((item): item is StyleOption =>
    allowedValues.has(item as StyleOption),
  );
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
})
export class ButtonTogglePlaygroundPageComponent {
  public readonly primitiveAlign = signal<AlignOption>('left');
  public readonly primitiveStyles = signal<readonly StyleOption[]>(['bold']);
  public readonly componentAlign = signal<AlignOption>('left');
  public readonly componentStyles = signal<readonly StyleOption[]>(['bold']);

  public onPrimitiveAlignChange(value: TngButtonToggleValue | null): void {
    this.primitiveAlign.set(toAlignOption(value));
  }

  public onPrimitiveStylesChange(values: readonly TngButtonToggleValue[]): void {
    this.primitiveStyles.set(toStyleOptions(values));
  }

  public onComponentAlignChange(value: TngButtonToggleValue | null): void {
    this.componentAlign.set(toAlignOption(value));
  }

  public onComponentStylesChange(values: readonly TngButtonToggleValue[]): void {
    this.componentStyles.set(toStyleOptions(values));
  }

  public formatValues(values: readonly string[]): string {
    if (values.length === 0) {
      return 'none';
    }

    return values.join(', ');
  }
}
