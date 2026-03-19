import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngBreadcrumb]',
  exportAs: 'tngBreadcrumb',
})
export class TngBreadcrumb {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'breadcrumb' as const;
}

@Directive({
  selector: '[tngBreadcrumbList]',
  exportAs: 'tngBreadcrumbList',
})
export class TngBreadcrumbList {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'breadcrumb-list' as const;
}

@Directive({
  selector: '[tngBreadcrumbItem]',
  exportAs: 'tngBreadcrumbItem',
})
export class TngBreadcrumbItem {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'breadcrumb-item' as const;
}

@Directive({
  selector: '[tngBreadcrumbLink]',
  exportAs: 'tngBreadcrumbLink',
})
export class TngBreadcrumbLink {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'breadcrumb-link' as const;
}

@Directive({
  selector: '[tngBreadcrumbSeparator]',
  exportAs: 'tngBreadcrumbSeparator',
})
export class TngBreadcrumbSeparator {
  @HostBinding('attr.aria-hidden')
  protected readonly ariaHiddenAttr = 'true' as const;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'breadcrumb-separator' as const;
}
