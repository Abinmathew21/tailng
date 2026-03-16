import { Component, signal } from '@angular/core';
import { TngTooltip } from '@tailng-ui/components';
import {
  TngTooltip as TngTooltipPrimitive,
  TngTooltipContent as TngTooltipContentPrimitive,
  type TngTooltipSide,
  TngTooltipTrigger as TngTooltipTriggerPrimitive,
} from '@tailng-ui/primitives';

const tooltipSides = Object.freeze(['top', 'right', 'bottom', 'left'] as const);

@Component({
  selector: 'app-tooltip-playground-page',
  imports: [TngTooltipPrimitive, TngTooltipTriggerPrimitive, TngTooltipContentPrimitive, TngTooltip],
  templateUrl: './tooltip-playground-page.component.html',
  styleUrl: './tooltip-playground-page.component.css',
})
export class TooltipPlaygroundPageComponent {
  protected readonly primitiveTooltipId = 'tooltip-primitive-demo';
  protected readonly iconTooltipId = 'tooltip-icon-demo';
  protected readonly sides = tooltipSides;
  protected readonly primitiveSide = signal<TngTooltipSide>('top');
  protected readonly defaultWrapperOpen = signal(false);
  protected readonly fastWrapperOpen = signal(false);
}
