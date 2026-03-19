import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: 'label[tngLabel]',
  exportAs: 'tngLabel',
  standalone: true,
})
export class TngLabel {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-required')
  protected get dataRequiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'label' as const;
}
