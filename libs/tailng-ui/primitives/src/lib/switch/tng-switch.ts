import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngSwitchAriaChecked(checked: boolean): 'false' | 'true' {
  return checked ? 'true' : 'false';
}

export function resolveTngSwitchDataState(checked: boolean): 'checked' | 'unchecked' {
  return checked ? 'checked' : 'unchecked';
}

export function resolveTngSwitchAriaRequired(required: boolean): 'true' | null {
  return required ? 'true' : null;
}

@Directive({
  selector: 'button[tngSwitch]',
  exportAs: 'tngSwitch',
})
export class TngSwitch {
  public readonly ariaLabel = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-checked')
  protected get ariaCheckedAttr(): 'false' | 'true' {
    return resolveTngSwitchAriaChecked(this.checked());
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    return this.ariaLabel();
  }

  @HostBinding('attr.aria-required')
  protected get ariaRequiredAttr(): 'true' | null {
    return resolveTngSwitchAriaRequired(this.required());
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
