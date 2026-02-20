import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngCard]',
  exportAs: 'tngCard',
})
export class TngCard {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card' as const;
}

@Directive({
  selector: '[tngCardHeader]',
  exportAs: 'tngCardHeader',
})
export class TngCardHeader {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-header' as const;
}

@Directive({
  selector: '[tngCardTitle]',
  exportAs: 'tngCardTitle',
})
export class TngCardTitle {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-title' as const;
}

@Directive({
  selector: '[tngCardDescription]',
  exportAs: 'tngCardDescription',
})
export class TngCardDescription {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-description' as const;
}

@Directive({
  selector: '[tngCardContent]',
  exportAs: 'tngCardContent',
})
export class TngCardContent {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-content' as const;
}

@Directive({
  selector: '[tngCardFooter]',
  exportAs: 'tngCardFooter',
})
export class TngCardFooter {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-footer' as const;
}
