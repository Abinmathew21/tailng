import { Component, HostBinding, input } from '@angular/core';
import { booleanAttribute } from '@angular/core';

import { TngInputGroup, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';

export type TngInputFieldAppearance = 'outline' | 'solid' | 'ghost';
export type TngInputFieldSize = 'sm' | 'md' | 'lg';
export type TngInputFieldTone = 'neutral' | 'primary' | 'success' | 'danger';

@Component({
  selector: 'tng-input-field',
  imports: [TngInputGroup, TngInputFieldPrefix, TngInputFieldSuffix],
  templateUrl: './tng-input-field.component.html',
  styleUrl: './tng-input-field.component.css',
})
export class TngInputFieldComponent {
  public readonly appearance = input<TngInputFieldAppearance>('outline');
  public readonly size = input<TngInputFieldSize>('md');
  public readonly tone = input<TngInputFieldTone>('neutral');

  public readonly fullWidth = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-field-wrapper' as const;

  @HostBinding('attr.data-appearance')
  protected get dataAppearance(): TngInputFieldAppearance {
    return this.appearance();
  }

  @HostBinding('attr.data-size')
  protected get dataSize(): TngInputFieldSize {
    return this.size();
  }

  @HostBinding('attr.data-tone')
  protected get dataTone(): TngInputFieldTone {
    return this.tone();
  }

  @HostBinding('attr.data-full-width')
  protected get dataFullWidth(): '' | null {
    return this.fullWidth() ? '' : null;
  }
}
