import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  output,
  forwardRef,
} from '@angular/core';
import type { OnInit, OnDestroy } from '@angular/core';
import { TngTree } from './tng-tree';
import { TngTreeGroup } from './tng-tree-group';
import {
  normalizeOptionalBooleanAttribute,
  normalizeTreeBooleanInput,
  normalizeTreeValue,
  type TngTreeValue,
} from './tng-tree.transforms';

@Directive({
  selector: '[tngTreeItem]',
  exportAs: 'tngTreeItem',
  standalone: true,
})
export class TngTreeItem implements OnInit, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tree = inject(TngTree, { optional: true });
  private readonly parentGroup: TngTreeGroup | null = inject(forwardRef(() => TngTreeGroup), { optional: true, skipSelf: true }) as TngTreeGroup | null;

  public readonly value = input.required<TngTreeValue, unknown>({
    transform: normalizeTreeValue,
  });
  
  public readonly expanded = input<boolean, unknown>(undefined, {
    transform: normalizeOptionalBooleanAttribute,
  });
  
  public readonly defaultExpanded = input<boolean, unknown>(false, {
    transform: normalizeTreeBooleanInput,
  });
  
  public readonly disabled = input<boolean, unknown>(false, {
    transform: normalizeTreeBooleanInput,
  });

  public readonly expandedChange = output<boolean>();

  private uncontrolledExpanded = false;
  private hasChildrenStatus = false;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tree-item' as const;

  @HostBinding('attr.role')
  protected readonly role = 'treeitem' as const;

  @HostBinding('attr.aria-selected')
  protected get ariaSelected(): string | null {
    if (!this.tree || this.tree.selectionMode() === 'none') return null;
    return this.tree.isItemSelected(this) ? 'true' : 'false';
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): string | null {
    if (!this.canExpand()) return null;
    return this.isExpanded() ? 'true' : 'false';
  }

  @HostBinding('attr.tabindex')
  protected get tabIndex(): string {
    return this.tree ? this.tree.getTriggerTabIndex(this) : '-1';
  }

  @HostBinding('attr.data-expanded')
  protected get dataExpanded(): 'true' | 'false' {
    return this.isExpanded() ? 'true' : 'false';
  }

  @HostBinding('attr.data-selected')
  protected get dataSelected(): 'true' | 'false' {
     if (!this.tree || this.tree.selectionMode() === 'none') return 'false';
     return this.tree.isItemSelected(this) ? 'true' : 'false';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): 'true' | 'false' {
    return this.tree?.isItemDisabled(this) ? 'true' : 'false';
  }

  public ngOnInit(): void {
    if (this.expanded() === undefined) {
      this.uncontrolledExpanded = this.defaultExpanded();
    }
    this.tree?.registerItem(this);
  }

  public ngOnDestroy(): void {
    this.tree?.unregisterItem(this);
  }

  public getValue(): TngTreeValue {
    return this.value();
  }

  public getHostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  public getParentItem(): TngTreeItem | null {
    return this.parentGroup?.parentItem ?? null;
  }

  public isExpanded(): boolean {
    return this.expanded() ?? this.uncontrolledExpanded;
  }

  public setExpanded(expanded: boolean): void {
    if (this.disabled()) return;
    if (this.expanded() === undefined) {
      this.uncontrolledExpanded = expanded;
    }
    this.expandedChange.emit(expanded);
  }

  public canExpand(): boolean {
    return this.hasChildrenStatus || this.expanded() !== undefined || this.defaultExpanded();
  }

  public registerChildGroup(): void {
    this.hasChildrenStatus = true;
  }

  public unregisterChildGroup(): void {
    this.hasChildrenStatus = false;
  }

  @HostListener('focus')
  protected onFocus(): void {
    this.tree?.onItemFocused(this);
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.tree?.onItemClicked(this);
    this.focusHost(); // Ensure it receives focus mentally on click
  }

  public focusHost(): void {
    this.hostRef.nativeElement.focus();
  }
}
