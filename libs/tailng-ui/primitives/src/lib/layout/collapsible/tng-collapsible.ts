import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngCollapsibleAriaExpanded(open: boolean): 'false' | 'true' {
  return open ? 'true' : 'false';
}

export function resolveTngCollapsibleDataState(open: boolean): 'closed' | 'open' {
  return open ? 'open' : 'closed';
}

@Directive({
  selector: '[tngCollapsible]',
  exportAs: 'tngCollapsible',
  standalone: true,
})
export class TngCollapsible {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'collapsible' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngCollapsibleDataState(this.open());
  }
}

@Directive({
  selector: 'button[tngCollapsibleTrigger]',
  exportAs: 'tngCollapsibleTrigger',
  standalone: true,
})
export class TngCollapsibleTrigger {
  public readonly contentId = input<string>('');
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-controls')
  protected get ariaControlsAttr(): string | null {
    const id = this.contentId().trim();
    return id.length > 0 ? id : null;
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpandedAttr(): 'false' | 'true' {
    return resolveTngCollapsibleAriaExpanded(this.open());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'collapsible-trigger' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngCollapsibleDataState(this.open());
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;
}

@Directive({
  selector: '[tngCollapsibleContent]',
  exportAs: 'tngCollapsibleContent',
  standalone: true,
})
export class TngCollapsibleContent {
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'collapsible-content' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngCollapsibleDataState(this.open());
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return this.open() ? null : '';
  }
}
