import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  TngTooltip as TngTooltipPrimitive,
  TngTooltipContent as TngTooltipContentPrimitive,
  TngTooltipTrigger as TngTooltipTriggerPrimitive,
  type TngTooltipSide,
  normalizeTngTooltipDelay as normalizeTngTooltipDelayPrimitive,
  shouldCloseTngTooltipForKey as shouldCloseTngTooltipForKeyPrimitive,
} from '@tailng-ui/primitives';

export function normalizeTngTooltipDelay(value: number): number {
  return normalizeTngTooltipDelayPrimitive(value);
}

export function shouldCloseTngTooltipForKey(key: string): boolean {
  return shouldCloseTngTooltipForKeyPrimitive(key);
}

@Component({
  selector: 'tng-tooltip',
  imports: [TngTooltipPrimitive, TngTooltipTriggerPrimitive, TngTooltipContentPrimitive],
  templateUrl: './tng-tooltip.component.html',
  styleUrl: './tng-tooltip.component.css',
})
export class TngTooltipComponent {
  public readonly ariaLabel = input<string | null>(null);
  public readonly closeDelay = input<number>(60);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly openDelay = input<number>(120);
  public readonly side = input<TngTooltipSide>('top');
  public readonly text = input<string>('More information');
  public readonly triggerLabel = input<string>('Info');

  public readonly openChange = output<boolean>();
}
