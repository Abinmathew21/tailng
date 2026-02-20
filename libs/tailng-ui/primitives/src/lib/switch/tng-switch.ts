import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngSwitchAriaChecked(checked: boolean): 'false' | 'true' {
  return checked ? 'true' : 'false';
}

export function resolveTngSwitchDataState(checked: boolean): 'checked' | 'unchecked' {
  return checked ? 'checked' : 'unchecked';
}

@Directive({
  selector: 'button[tngSwitch]',
  exportAs: 'tngSwitch',
})
export class TngSwitch {
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-checked')
  protected get ariaCheckedAttr(): 'false' | 'true' {
    return resolveTngSwitchAriaChecked(this.checked());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'switch' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'checked' | 'unchecked' {
    return resolveTngSwitchDataState(this.checked());
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.role')
  protected readonly roleAttr = 'switch' as const;

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;
}
