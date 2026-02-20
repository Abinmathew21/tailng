import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngEmpty]',
  exportAs: 'tngEmpty',
})
export class TngEmpty {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'empty' as const;
}

@Directive({
  selector: '[tngEmptyIcon]',
  exportAs: 'tngEmptyIcon',
})
export class TngEmptyIcon {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'empty-icon' as const;
}

@Directive({
  selector: '[tngEmptyTitle]',
  exportAs: 'tngEmptyTitle',
})
export class TngEmptyTitle {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'empty-title' as const;
}

@Directive({
  selector: '[tngEmptyDescription]',
  exportAs: 'tngEmptyDescription',
})
export class TngEmptyDescription {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'empty-description' as const;
}

@Directive({
  selector: '[tngEmptyActions]',
  exportAs: 'tngEmptyActions',
})
export class TngEmptyActions {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'empty-actions' as const;
}
