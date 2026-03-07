import { booleanAttribute, Component, input } from '@angular/core';
import {
  coerceTngPressAriaHasPopup,
  coerceTngPressNullableBoolean,
  TngPress as TngPressPrimitive,
} from '@tailng-ui/primitives';
import type { TngPressAriaHasPopup, TngPressType } from '@tailng-ui/primitives';

type NullableBooleanInput = boolean | null | string | undefined;
export type TngButtonAppearance = 'ghost' | 'outline' | 'solid';
export type TngButtonSize = 'lg' | 'md' | 'sm';
export type TngButtonTone = 'danger' | 'neutral' | 'primary' | 'success';

@Component({
  selector: 'tng-button',
  imports: [TngPressPrimitive],
  templateUrl: './tng-button.component.html',
  styleUrl: './tng-button.component.css',
})
export class TngButtonComponent {
  public readonly appearance = input<TngButtonAppearance>('solid');
  public readonly ariaControls = input<string | null>(null);
  public readonly ariaExpanded = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngPressNullableBoolean,
  });
  public readonly ariaHasPopup = input<
    TngPressAriaHasPopup | null,
    boolean | null | string | undefined
  >(null, {
    transform: coerceTngPressAriaHasPopup,
  });
  public readonly ariaPressed = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngPressNullableBoolean,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly size = input<TngButtonSize>('md');
  public readonly tone = input<TngButtonTone>('primary');
  public readonly type = input<TngPressType>('button');
}
