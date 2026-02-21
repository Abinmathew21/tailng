import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: 'label[tngLabel]',
  exportAs: 'tngLabel',
})
export class TngLabel {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'label' as const;
}
