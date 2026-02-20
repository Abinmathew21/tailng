import { Component, input } from '@angular/core';
import { TngTag as TngTagPrimitive } from '@tailng-ui/primitives';

type TngTagAppearance = 'outline' | 'soft' | 'solid';
type TngTagShape = 'pill' | 'rounded';
type TngTagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';

@Component({
  selector: 'tng-tag',
  imports: [TngTagPrimitive],
  templateUrl: './tng-tag.component.html',
  styleUrl: './tng-tag.component.css',
})
export class TngTag {
  public readonly appearance = input<TngTagAppearance>('soft');
  public readonly shape = input<TngTagShape>('pill');
  public readonly tone = input<TngTagTone>('neutral');
}
