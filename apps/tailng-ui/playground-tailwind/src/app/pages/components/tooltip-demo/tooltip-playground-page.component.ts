import { Component, signal } from '@angular/core';
import { TngTooltipComponent } from '@tailng-ui/components';
import {
  TngTooltipContent as TngTooltipContentPrimitive,
  type TngTooltipSide,
  TngTooltipTrigger as TngTooltipTriggerPrimitive,
} from '@tailng-ui/primitives';

const tooltipSides = Object.freeze(['top', 'right', 'bottom', 'left'] as const);

@Component({
  selector: 'app-tooltip-playground-page',
  imports: [TngTooltipTriggerPrimitive, TngTooltipContentPrimitive, TngTooltipComponent],
  templateUrl: './tooltip-playground-page.component.html',
  styleUrl: './tooltip-playground-page.component.css',
})
export class TooltipPlaygroundPageComponent {
  protected readonly primitiveTooltipId = 'tooltip-primitive-demo';
  protected readonly sides = tooltipSides;
  protected readonly primitiveOpen = signal(false);
  protected readonly primitiveSide = signal<TngTooltipSide>('top');
}
