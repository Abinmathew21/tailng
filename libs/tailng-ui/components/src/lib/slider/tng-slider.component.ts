import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  normalizeTngSliderMax,
  normalizeTngSliderMin,
  normalizeTngSliderStep,
  TngSlider as TngSliderPrimitive,
} from '@tailng-ui/primitives';

export function readTngSliderEventValue(event: unknown): number | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return Number(target.value);
}

@Component({
  selector: 'tng-slider',
  imports: [TngSliderPrimitive],
  templateUrl: './tng-slider.component.html',
  styleUrl: './tng-slider.component.css',
})
export class TngSlider {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngSliderMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngSliderMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly step = input<number, number | string>(1, {
    transform: (value: number | string): number =>
      normalizeTngSliderStep(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

  public readonly valueChange = output<number>();

  public onInput(event: unknown): void {
    const nextValue = readTngSliderEventValue(event);
    if (nextValue === null) {
      return;
    }

    this.valueChange.emit(nextValue);
  }
}
