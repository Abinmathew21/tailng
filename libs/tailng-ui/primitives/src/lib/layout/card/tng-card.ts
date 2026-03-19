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

@Directive({
  selector: '[tngCardMedia]',
  exportAs: 'tngCardMedia',
})
export class TngCardMedia {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-media' as const;
}

@Directive({
  selector: '[tngCardActions]',
  exportAs: 'tngCardActions',
})
export class TngCardActions {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-actions' as const;
}

@Directive({
  selector: '[tngCardDivider]',
  exportAs: 'tngCardDivider',
})
export class TngCardDivider {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-divider' as const;
}

@Directive({
  selector: '[tngCardLink]',
  exportAs: 'tngCardLink',
})
export class TngCardLink {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'card-link' as const;
}
