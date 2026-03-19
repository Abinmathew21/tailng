import {
  Directive,
  ElementRef,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TngTreeItem } from './tng-tree-item';

@Directive({
  selector: '[tngTreeGroup]',
  exportAs: 'tngTreeGroup',
})
export class TngTreeGroup implements OnInit, OnDestroy {
  public readonly parentItem = inject(TngTreeItem, { optional: true, skipSelf: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tree-group' as const;

  @HostBinding('attr.role')
  protected readonly role = 'group' as const;

  ngOnInit(): void {
    this.parentItem?.registerChildGroup();
  }

  ngOnDestroy(): void {
    this.parentItem?.unregisterChildGroup();
  }
}
