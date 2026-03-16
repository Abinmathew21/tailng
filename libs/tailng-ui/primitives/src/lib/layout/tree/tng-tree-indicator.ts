import {
  Directive,
  HostBinding,
  inject,
} from '@angular/core';
import { TngTreeItem } from './tng-tree-item';

@Directive({
  selector: '[tngTreeIndicator]',
  exportAs: 'tngTreeIndicator',
  standalone: true,
})
export class TngTreeIndicator {
  private readonly item = inject(TngTreeItem, { optional: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tree-indicator' as const;

  @HostBinding('attr.data-expanded')
  protected get dataExpanded(): 'true' | 'false' {
    return this.item?.isExpanded() ? 'true' : 'false';
  }
}
