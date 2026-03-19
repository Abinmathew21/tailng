import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  output,
  OnDestroy,
} from '@angular/core';
import {
  createRovingFocusController,
  createTreeModel,
  createTypeaheadController,
  resolveListNavigationKeyAction,
  type TngListNavigationAction,
  type TngRovingFocusController,
  type TngTypeaheadController,
  type TngTypeaheadItem,
  type TngTreeModel,
  type TngTreeModelState,
  type TngTreeNode,
} from '@tailng-ui/cdk';
import { TngTreeItem } from './tng-tree-item';
import {
  normalizeTreeBooleanInput,
  normalizeTreeOrientation,
  normalizeTreeSelectionMode,
  normalizeTreeValue,
  normalizeTreeValueInput,
  type TngTreeOrientation,
  type TngTreeSelectionMode,
  type TngTreeValue,
} from './tng-tree.transforms';

export type { TngTreeOrientation, TngTreeSelectionMode, TngTreeValue } from './tng-tree.transforms';

type TngTreeBoundary = 'start' | 'end';
type TngTreeHorizontalKeyAction = 'collapse-or-parent' | 'expand-or-child';

type TngTreeModelItem = Readonly<{
  id: string;
  item: TngTreeItem;
  parentId: string | null;
}>;

function setsEqual(a: ReadonlySet<TngTreeValue>, b: ReadonlySet<TngTreeValue>): boolean {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}

function isPrintableCharacter(value: string): boolean {
  return value.length === 1 && value.trim().length > 0;
}

function normalizeTypeaheadText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function hasDisallowedNavigationModifiers(event: KeyboardEvent): boolean {
  return event.altKey === true || event.ctrlKey === true || event.metaKey === true;
}

function resolveHorizontalTreeKeyAction(event: KeyboardEvent): TngTreeHorizontalKeyAction | null {
  if (hasDisallowedNavigationModifiers(event)) {
    return null;
  }

  if (event.key === 'ArrowLeft') {
    return 'collapse-or-parent';
  }

  if (event.key === 'ArrowRight') {
    return 'expand-or-child';
  }

  return null;
}

@Directive({
  selector: '[tngTree]',
  exportAs: 'tngTree',
})
export class TngTree implements OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly items = new Set<TngTreeItem>();
  private readonly modelIdByItem = new Map<TngTreeItem, string>();

  private readonly emptyModelNodes: readonly TngTreeNode[] = Object.freeze([]);
  private readonly emptyTypeaheadItems: readonly TngTypeaheadItem[] = Object.freeze([]);
  private model: TngTreeModel = createTreeModel({ nodes: this.emptyModelNodes });
  private modelState: TngTreeModelState = this.model.getState();
  private readonly roving: TngRovingFocusController = createRovingFocusController({
    itemIds: Object.freeze([]),
  });
  private readonly typeahead: TngTypeaheadController = createTypeaheadController({
    items: this.emptyTypeaheadItems,
  });

  private itemByModelId = new Map<string, TngTreeItem>();
  private childModelIdsByParentId = new Map<string, readonly string[]>();
  private nextModelId = 0;

  private uncontrolledSelection = new Set<TngTreeValue>();
  private initialized = false;

  readonly selectionMode = input<TngTreeSelectionMode, unknown>('none', {
    transform: normalizeTreeSelectionMode,
  });
  readonly orientation = input<TngTreeOrientation, unknown>('vertical', {
    transform: normalizeTreeOrientation,
  });
  readonly value = input<TngTreeValue | readonly TngTreeValue[] | null | undefined, unknown>(
    undefined,
    { transform: normalizeTreeValueInput },
  );
  readonly defaultValue = input<TngTreeValue | readonly TngTreeValue[] | null | undefined, unknown>(
    undefined,
    { transform: normalizeTreeValueInput },
  );
  readonly disabled = input<boolean, unknown>(false, {
    transform: normalizeTreeBooleanInput,
  });

  readonly valueChange = output<TngTreeValue | readonly TngTreeValue[] | null>();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tree' as const;

  @HostBinding('attr.role')
  protected readonly role = 'tree' as const;

  @HostBinding('attr.aria-orientation')
  protected get ariaOrientation(): string {
    return this.orientation();
  }

  @HostBinding('attr.aria-multiselectable')
  protected get ariaMultiselectable(): string | null {
    const mode = this.selectionMode();
    if (mode === 'none') return null;
    return mode === 'multiple' ? 'true' : 'false';
  }

  @HostBinding('attr.tabindex')
  protected get tabIndex(): string {
    if (this.disabled()) return '-1';

    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLElement &&
      this.hostRef.nativeElement.contains(activeElement) &&
      activeElement !== this.hostRef.nativeElement
    ) {
      return '-1';
    }

    return '0';
  }

  ngOnDestroy(): void {
    this.items.clear();
    this.modelIdByItem.clear();
    this.itemByModelId.clear();
    this.childModelIdsByParentId.clear();
  }

  registerItem(item: TngTreeItem): void {
    this.items.add(item);
    this.ensureModelId(item);
    if (!this.initialized && this.items.size > 0 && !this.isControlled()) {
      this.initializeUncontrolledState();
    }
    this.rebuildModel(this.resolvePreferredActiveId());
  }

  unregisterItem(item: TngTreeItem): void {
    const wasSelected = this.getEffectiveSelectionSet().has(item.getValue());
    this.items.delete(item);

    const modelId = this.modelIdByItem.get(item);
    if (modelId !== undefined) {
      this.modelIdByItem.delete(item);
      this.itemByModelId.delete(modelId);
    }

    if (wasSelected && !this.isControlled()) {
      const next = new Set(this.uncontrolledSelection);
      next.delete(item.getValue());
      this.uncontrolledSelection = next;
    }

    this.rebuildModel(this.resolvePreferredActiveId());
  }

  isItemSelected(item: TngTreeItem): boolean {
    if (this.selectionMode() === 'none') {
      return false;
    }
    return this.getEffectiveSelectionSet().has(item.getValue());
  }

  isItemDisabled(item: TngTreeItem): boolean {
    return this.disabled() || item.disabled();
  }

  getTriggerTabIndex(item: TngTreeItem): string {
    if (this.isItemDisabled(item)) {
      return '-1';
    }

    const modelId = this.resolveModelId(item);
    return modelId !== null && this.roving.getActiveId() === modelId ? '0' : '-1';
  }

  onItemFocused(item: TngTreeItem): void {
    if (this.isItemDisabled(item)) {
      return;
    }

    const modelId = this.resolveModelId(item);
    if (modelId !== null) {
      this.applyModelState(this.model.setActiveId(modelId));
    }
  }

  onItemClicked(item: TngTreeItem): void {
    if (this.isItemDisabled(item)) return;

    if (this.selectionMode() !== 'none') {
      this.requestToggleSelection(item);
    }

    const modelId = this.resolveModelId(item);
    if (modelId !== null) {
      this.applyModelState(this.model.setActiveId(modelId));
    }
  }

  onIndicatorClicked(item: TngTreeItem): void {
    if (this.isItemDisabled(item)) return;

    if (item.canExpand()) {
      item.setExpanded(!item.isExpanded());
      const modelId = this.resolveModelId(item);
      this.rebuildModel(modelId);
    }

    item.focusHost();
  }

  private isControlled(): boolean {
    return this.value() !== undefined;
  }

  private initializeUncontrolledState(): void {
    this.initialized = true;
    const defaultInput = this.defaultValue();
    let initialValues: readonly TngTreeValue[] = [];
    if (defaultInput !== undefined && defaultInput !== null) {
      initialValues = Array.isArray(defaultInput)
        ? defaultInput.map(normalizeTreeValue)
        : [normalizeTreeValue(defaultInput)];
    }
    this.uncontrolledSelection = new Set(initialValues);
  }

  private getEffectiveSelectionSet(): ReadonlySet<TngTreeValue> {
    if (!this.isControlled()) {
      return this.uncontrolledSelection;
    }

    const val = this.value();
    let controlledValues: readonly TngTreeValue[] = [];
    if (val !== undefined && val !== null) {
      controlledValues = Array.isArray(val) ? val.map(normalizeTreeValue) : [normalizeTreeValue(val)];
    }
    return new Set(controlledValues);
  }

  private requestToggleSelection(item: TngTreeItem): void {
    const mode = this.selectionMode();
    if (mode === 'none') return;

    const previous = this.getEffectiveSelectionSet();
    const next = new Set(previous);
    const itemValue = item.getValue();
    const currentlySelected = previous.has(itemValue);

    if (mode === 'single') {
      next.clear();
      if (!currentlySelected) {
        next.add(itemValue);
      }
    } else {
      if (!currentlySelected) {
        next.add(itemValue);
      } else {
        next.delete(itemValue);
      }
    }

    if (setsEqual(previous, next)) return;

    if (!this.isControlled()) {
      this.uncontrolledSelection = next;
    }

    const valList = Array.from(next);
    if (mode === 'single') {
      this.valueChange.emit(valList.length > 0 ? valList[0] : null);
    } else {
      this.valueChange.emit(valList);
    }
  }

  @HostListener('keydown', ['$event'])
  protected onHostKeydown(event: KeyboardEvent): void {
    const activeElement = document.activeElement as HTMLElement;
    if (
      !this.hostRef.nativeElement.contains(activeElement) &&
      activeElement !== this.hostRef.nativeElement
    ) {
      return;
    }

    this.rebuildModel(this.resolvePreferredActiveId());

    const horizontalAction = resolveHorizontalTreeKeyAction(event);
    if (horizontalAction !== null) {
      event.preventDefault();
      this.runHorizontalKeyAction(horizontalAction);
      return;
    }

    const action = resolveListNavigationKeyAction(event, {
      multiSelect: this.selectionMode() === 'multiple',
      orientation: 'vertical',
    });

    if (action !== null) {
      if (action.preventDefault) {
        event.preventDefault();
      }
      this.runResolvedNavigationAction(action);
      return;
    }

    if (this.handleTypeaheadKey(event)) {
      return;
    }

    if (event.key === '*') {
      // Optional: expand all siblings.
    }
  }

  @HostListener('focus')
  protected onHostFocus(): void {
    this.rebuildModel(this.resolvePreferredActiveId());
    const activeItem = this.resolveItemByModelId(this.roving.getActiveId());
    if (activeItem !== null) {
      this.focusItem(activeItem);
      return;
    }

    this.focusActiveItem();
  }

  private applyModelState(state: TngTreeModelState): void {
    this.modelState = state;
    this.roving.setItemIds(state.visibleIds);
    this.roving.setDisabledIds(this.resolveDisabledVisibleIds(state.visibleIds));
    this.roving.setActiveId(state.activeId);
    this.typeahead.setItems(this.resolveTypeaheadItems(state.visibleIds));
    this.typeahead.setActiveId(state.activeId);
  }

  private ensureModelId(item: TngTreeItem): string {
    const existingId = this.modelIdByItem.get(item);
    if (existingId !== undefined) {
      return existingId;
    }

    const id = `tng-tree-item-${this.nextModelId}`;
    this.nextModelId += 1;
    this.modelIdByItem.set(item, id);
    return id;
  }

  private resolveModelId(item: TngTreeItem | null): string | null {
    if (item === null) {
      return null;
    }

    return this.modelIdByItem.get(item) ?? null;
  }

  private resolveActiveItem(): TngTreeItem | null {
    return this.resolveItemByModelId(this.modelState.activeId);
  }

  private resolveItemByModelId(modelId: string | null): TngTreeItem | null {
    if (modelId === null) {
      return null;
    }
    return this.itemByModelId.get(modelId) ?? null;
  }

  private focusBoundaryItem(boundary: TngTreeBoundary): void {
    const visibleIds =
      boundary === 'start'
        ? this.modelState.visibleIds
        : [...this.modelState.visibleIds].reverse();

    for (const modelId of visibleIds) {
      const candidate = this.itemByModelId.get(modelId);
      if (candidate !== undefined && !this.isItemDisabled(candidate)) {
        this.focusItem(candidate);
        return;
      }
    }
  }

  private focusActiveItem(): void {
    const item = this.resolveActiveItem();
    if (item !== null) {
      this.focusItem(item);
    }
  }

  private focusItem(item: TngTreeItem): void {
    if (this.isItemDisabled(item)) {
      return;
    }

    const modelId = this.resolveModelId(item);
    if (modelId !== null) {
      this.applyModelState(this.model.setActiveId(modelId));
    }
    item.focusHost();
  }

  private resolveFirstVisibleEnabledChild(parentItem: TngTreeItem): TngTreeItem | null {
    const parentId = this.resolveModelId(parentItem);
    if (parentId === null) {
      return null;
    }

    const visibleIds = new Set(this.modelState.visibleIds);
    const childIds = this.childModelIdsByParentId.get(parentId) ?? [];
    for (const childId of childIds) {
      if (!visibleIds.has(childId)) {
        continue;
      }

      const childItem = this.itemByModelId.get(childId);
      if (childItem !== undefined && !this.isItemDisabled(childItem)) {
        return childItem;
      }
    }

    return null;
  }

  private resolveTypeaheadItems(visibleIds: readonly string[]): readonly TngTypeaheadItem[] {
    const items: TngTypeaheadItem[] = [];
    for (const modelId of visibleIds) {
      const item = this.itemByModelId.get(modelId);
      if (item === undefined) {
        continue;
      }

      items.push({
        disabled: this.isItemDisabled(item),
        id: modelId,
        text: this.resolveTypeaheadText(item),
      });
    }

    return Object.freeze(items);
  }

  private resolveDisabledVisibleIds(visibleIds: readonly string[]): readonly string[] {
    const disabledIds: string[] = [];
    for (const modelId of visibleIds) {
      const item = this.itemByModelId.get(modelId);
      if (item !== undefined && this.isItemDisabled(item)) {
        disabledIds.push(modelId);
      }
    }
    return Object.freeze(disabledIds);
  }

  private resolveTypeaheadText(item: TngTreeItem): string {
    const host = item.getHostElement();
    const ariaLabel = host.getAttribute('aria-label');
    if (ariaLabel !== null && ariaLabel.trim().length > 0) {
      return ariaLabel.trim();
    }

    const text = normalizeTypeaheadText(host.textContent ?? '');
    if (text.length > 0) {
      return text;
    }

    return String(item.getValue());
  }

  private handleTypeaheadKey(event: KeyboardEvent): boolean {
    if (!isPrintableCharacter(event.key)) {
      return false;
    }

    const state = this.typeahead.handleKey(event.key);
    if (state.activeId === null || state.activeId === this.modelState.activeId) {
      return false;
    }

    event.preventDefault();
    this.applyModelState(this.model.setActiveId(state.activeId));
    this.focusActiveItem();
    return true;
  }

  private runHorizontalKeyAction(action: TngTreeHorizontalKeyAction): void {
    if (action === 'expand-or-child') {
      this.expandOrMoveToChild();
      return;
    }

    this.collapseOrMoveToParent();
  }

  private runResolvedNavigationAction(action: TngListNavigationAction): void {
    switch (action.type) {
      case 'move-next':
        this.applyModelState(this.model.moveNext());
        this.focusActiveItem();
        return;
      case 'move-prev':
        this.applyModelState(this.model.movePrev());
        this.focusActiveItem();
        return;
      case 'move-first':
        this.focusBoundaryItem('start');
        return;
      case 'move-last':
        this.focusBoundaryItem('end');
        return;
      case 'select-active':
      case 'toggle-active': {
        const item = this.resolveActiveItem();
        if (item !== null) {
          this.onItemClicked(item);
        }
        return;
      }
      case 'exit':
      case 'select-all':
        return;
    }
  }

  private expandOrMoveToChild(): void {
    const item = this.resolveActiveItem();
    if (item === null) {
      return;
    }

    if (item.canExpand() && !item.isExpanded()) {
      item.setExpanded(true);
      this.rebuildModel(this.resolveModelId(item));
      this.focusItem(item);
      return;
    }

    if (item.canExpand() && item.isExpanded()) {
      const firstChild = this.resolveFirstVisibleEnabledChild(item);
      if (firstChild !== null) {
        this.focusItem(firstChild);
      }
    }
  }

  private collapseOrMoveToParent(): void {
    const item = this.resolveActiveItem();
    if (item === null) {
      return;
    }

    if (item.canExpand() && item.isExpanded()) {
      item.setExpanded(false);
      this.rebuildModel(this.resolveModelId(item));
      this.focusItem(item);
      return;
    }

    const parent = item.getParentItem();
    if (parent !== null && !this.isItemDisabled(parent)) {
      this.focusItem(parent);
    }
  }

  private rebuildModel(activeId: string | null): void {
    const ordered = this.buildOrderedModelItems();
    const nodes: TngTreeNode[] = ordered.map((entry) => ({
      disabled: entry.item.disabled(),
      id: entry.id,
      parentId: entry.parentId,
    }));

    const expandedIds: string[] = [];
    for (const entry of ordered) {
      if (entry.item.canExpand() && entry.item.isExpanded()) {
        expandedIds.push(entry.id);
      }
    }

    this.model = createTreeModel({
      activeId,
      expandedIds,
      nodes,
    });
    this.applyModelState(this.model.getState());
  }

  private buildOrderedModelItems(): readonly TngTreeModelItem[] {
    const sortedItems = Array.from(this.items).sort((a, b) => {
      const position = a.getHostElement().compareDocumentPosition(b.getHostElement());
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });

    const itemByModelId = new Map<string, TngTreeItem>();
    const childIdsByParent = new Map<string, string[]>();
    const ordered: TngTreeModelItem[] = [];

    for (const item of sortedItems) {
      const id = this.ensureModelId(item);
      const parentItem = item.getParentItem();
      const parentId = parentItem ? this.resolveModelId(parentItem) : null;

      ordered.push({
        id,
        item,
        parentId,
      });
      itemByModelId.set(id, item);

      if (parentId !== null) {
        const childIds = childIdsByParent.get(parentId) ?? [];
        childIds.push(id);
        childIdsByParent.set(parentId, childIds);
      }
    }

    const readonlyChildIdsByParent = new Map<string, readonly string[]>();
    for (const [parentId, childIds] of childIdsByParent.entries()) {
      readonlyChildIdsByParent.set(parentId, Object.freeze([...childIds]));
    }

    this.itemByModelId = itemByModelId;
    this.childModelIdsByParentId = readonlyChildIdsByParent;

    return Object.freeze(ordered);
  }

  private resolvePreferredActiveId(): string | null {
    return this.roving.getActiveId() ?? this.modelState.activeId;
  }
}
