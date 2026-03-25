import { Component, HostBinding, input } from '@angular/core';
import { booleanAttribute } from '@angular/core';

import { TngInputGroup, TngPrefix, TngSuffix } from '@tailng-ui/primitives';

export type TngFormFieldAppearance = 'outline' | 'solid' | 'ghost';
export type TngFormFieldSize = 'sm' | 'md' | 'lg';
export type TngFormFieldTone = 'neutral' | 'primary' | 'success' | 'danger';

@Component({
  selector: 'tng-form-field',
  imports: [TngInputGroup, TngPrefix, TngSuffix],
  templateUrl: './tng-form-field.component.html',
  styleUrl: './tng-form-field.component.css',
})
export class TngFormFieldComponent {
  public readonly appearance = input<TngFormFieldAppearance>('outline');
  public readonly size = input<TngFormFieldSize>('md');
  public readonly tone = input<TngFormFieldTone>('neutral');

  public readonly fullWidth = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'form-field-wrapper' as const;

  @HostBinding('attr.data-appearance')
  protected get dataAppearance(): TngFormFieldAppearance {
    return this.appearance();
  }

  @HostBinding('attr.data-size')
  protected get dataSize(): TngFormFieldSize {
    return this.size();
  }

  @HostBinding('attr.data-tone')
  protected get dataTone(): TngFormFieldTone {
    return this.tone();
  }

  @HostBinding('attr.data-full-width')
  protected get dataFullWidth(): '' | null {
    return this.fullWidth() ? '' : null;
  }
}
