import {
  Directive,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';
import { TngTree } from './tng-tree';
import { TngTreeItem } from './tng-tree-item';

@Directive({
  selector: '[tngTreeIndicator]',
  exportAs: 'tngTreeIndicator',
})
export class TngTreeIndicator {
  private readonly item = inject(TngTreeItem, { optional: true });
  private readonly tree = inject(TngTree, { optional: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tree-indicator' as const;

  @HostBinding('attr.data-expanded')
  protected get dataExpanded(): 'true' | 'false' {
    return this.item?.isExpanded() ? 'true' : 'false';
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.item && this.tree) {
      this.tree.onIndicatorClicked(this.item);
    }
  }
}
