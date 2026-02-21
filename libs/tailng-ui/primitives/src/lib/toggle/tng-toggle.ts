import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngToggleAriaPressed(pressed: boolean): 'false' | 'true' {
  return pressed ? 'true' : 'false';
}

export function resolveTngToggleDataState(pressed: boolean): 'off' | 'on' {
  return pressed ? 'on' : 'off';
}

@Directive({
  selector: 'button[tngToggle]',
  exportAs: 'tngToggle',
})
export class TngToggle {
  public readonly pressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-pressed')
  protected get ariaPressedAttr(): 'false' | 'true' {
    return resolveTngToggleAriaPressed(this.pressed());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toggle' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'off' | 'on' {
    return resolveTngToggleDataState(this.pressed());
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;
}
