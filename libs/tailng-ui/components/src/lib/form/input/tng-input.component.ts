import { Component, HostBinding, input } from '@angular/core';
import { booleanAttribute } from '@angular/core';

import { TngInputGroup, TngInputLeading, TngInputTrailing } from '@tailng-ui/primitives';

export type TngInputAppearance = 'outline' | 'solid' | 'ghost';
export type TngInputSize = 'sm' | 'md' | 'lg';
export type TngInputTone = 'neutral' | 'primary' | 'success' | 'danger';

@Component({
  selector: 'tng-input',
  imports: [TngInputGroup, TngInputLeading, TngInputTrailing],
  templateUrl: './tng-input.component.html',
  styleUrl: './tng-input.component.css',
})
export class TngInputComponent {
  public readonly appearance = input<TngInputAppearance>('outline');
  public readonly size = input<TngInputSize>('md');
  public readonly tone = input<TngInputTone>('neutral');

  /** Default true so forms look consistent out-of-the-box */
  public readonly fullWidth = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-wrapper' as const;

  @HostBinding('attr.data-appearance')
  protected get dataAppearance(): TngInputAppearance {
    return this.appearance();
  }

  @HostBinding('attr.data-size')
  protected get dataSize(): TngInputSize {
    return this.size();
  }

  @HostBinding('attr.data-tone')
  protected get dataTone(): TngInputTone {
    return this.tone();
  }

  @HostBinding('attr.data-full-width')
  protected get dataFullWidth(): '' | null {
    return this.fullWidth() ? '' : null;
  }
}
