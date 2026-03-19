import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  TngTag as TngTagPrimitive,
  TngTagClose as TngTagClosePrimitive,
} from '@tailng-ui/primitives';

type TngTagAppearance = 'outline' | 'soft' | 'solid';
type TngTagShape = 'pill' | 'rounded';
type TngTagSize = 'md' | 'sm';
type TngTagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';

@Component({
  selector: 'tng-tag',
  imports: [TngTagPrimitive, TngTagClosePrimitive],
  templateUrl: './tng-tag.component.html',
  styleUrl: './tng-tag.component.css',
})
export class TngTagComponent {
  public readonly appearance = input<TngTagAppearance>('soft');
  public readonly closeAriaLabel = input<string | null>(null);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly label = input<string | null>(null);
  public readonly removable = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly shape = input<TngTagShape>('pill');
  public readonly size = input<TngTagSize>('md');
  public readonly tone = input<TngTagTone>('neutral');

  public readonly removed = output<void>();

  public onRemoved(): void {
    this.removed.emit();
  }
}
