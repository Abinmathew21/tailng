import { Component, computed, effect, input, output, signal, viewChild } from '@angular/core';
import type { ElementRef, OnDestroy } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import {
  createTreeModel,
  createTypeaheadController,
  type TngTreeModel,
  type TngTreeModelState,
  type TngTreeNode,
  type TngTypeaheadController,
  type TngTypeaheadItem,
} from '@tailng-ui/cdk';
import { TngTree as TngTreePrimitive } from '@tailng-ui/primitives';

const createTreeId = createTngIdFactory('tng-tree');

type TngTreeBoundary = 'first' | 'last';

type TngTreeKeyboardEvent = Readonly<{
  altKey: boolean;
  key: string;
  metaKey: boolean;
  preventDefault: () => void;
}>;

type TngTreePointerEvent = Readonly<{
  preventDefault: () => void;
  stopPropagation: () => void;
}>;

type TngTreeKeyAction =
  | 'collapse-or-parent'
  | 'expand-or-child'
  | 'move-next'
  | 'move-prev'
  | 'noop'
  | 'select'
  | 'to-end'
  | 'to-start'
  | 'typeahead';

type TngTreeLookup = Readonly<{
  byId: ReadonlyMap<string, TngTreeItem>;
  childrenByParent: ReadonlyMap<string, readonly string[]>;
}>;

type TngTreeRow = Readonly<{
  depth: number;
  description: string | null;
  disabled: boolean;
  hasChildren: boolean;
  id: string;
  label: string;
}>;

type TngTreeRunnableAction = Exclude<TngTreeKeyAction, 'noop' | 'typeahead'>;

export type TngTreeItem = Readonly<{
  description?: string | null;
  disabled?: boolean;
  id: string;
  label: string;
  parentId?: string | null;
}>;

const actionByKey: Readonly<Record<string, TngTreeKeyAction>> = Object.freeze({
  ArrowDown: 'move-next',
  ArrowLeft: 'collapse-or-parent',
  ArrowRight: 'expand-or-child',
  ArrowUp: 'move-prev',
  End: 'to-end',
  Home: 'to-start',
});

function toReadonlyArray<T>(values: readonly T[]): readonly T[] {
  return Object.freeze([...values]);
}

function toTreeModelNodes(items: readonly TngTreeItem[]): readonly TngTreeNode[] {
  return items.map((item) => ({
    disabled: item.disabled,
    id: item.id,
    parentId: item.parentId,
  }));
}

function createTreeLookup(items: readonly TngTreeItem[]): TngTreeLookup {
  const byId = new Map<string, TngTreeItem>();
  const childrenByParent = new Map<string, string[]>();

  for (const item of items) {
    byId.set(item.id, item);
  }

  for (const item of items) {
    const parentId = item.parentId ?? null;
    if (parentId === null || !byId.has(parentId)) {
      continue;
    }

    const children = childrenByParent.get(parentId) ?? [];
    children.push(item.id);
    childrenByParent.set(parentId, children);
  }

  const readonlyChildrenByParent = new Map<string, readonly string[]>();
  for (const [parentId, children] of childrenByParent.entries()) {
    readonlyChildrenByParent.set(parentId, toReadonlyArray(children));
  }

  return Object.freeze({
    byId,
    childrenByParent: readonlyChildrenByParent,
  });
}

function resolveDepth(
  nodeId: string,
  byId: Readonly<ReadonlyMap<string, TngTreeItem>>,
): number {
  let depth = 0;
  let parentId = byId.get(nodeId)?.parentId ?? null;
  const visited = new Set<string>();

  while (parentId !== null && byId.has(parentId) && !visited.has(parentId)) {
    visited.add(parentId);
    depth += 1;
    parentId = byId.get(parentId)?.parentId ?? null;
  }

  return depth;
}

function toTypeaheadItems(
  visibleIds: readonly string[],
  byId: Readonly<ReadonlyMap<string, TngTreeItem>>,
): readonly TngTypeaheadItem[] {
  return visibleIds
    .map((id) => byId.get(id))
    .filter((item): item is TngTreeItem => item !== undefined)
    .map((item) => ({
      disabled: item.disabled,
      id: item.id,
      text: item.label,
    }));
}

function toTreeItemDomId(treeId: string, nodeId: string): string {
  return `${treeId}-item-${nodeId}`;
}

function isPrintableTreeKey(key: string): boolean {
  return key.length === 1 && key.trim().length > 0;
}

function resolveSelectableId(
  candidateId: string | null,
  byId: Readonly<ReadonlyMap<string, TngTreeItem>>,
): string | null {
  if (candidateId === null) {
    return null;
  }

  const candidate = byId.get(candidateId);
  if (candidate === undefined || candidate.disabled === true) {
    return null;
  }

  return candidate.id;
}

function resolveFirstSelectableChildId(
  parentId: string,
  childrenByParent: Readonly<ReadonlyMap<string, readonly string[]>>,
  byId: Readonly<ReadonlyMap<string, TngTreeItem>>,
): string | null {
  const childIds = childrenByParent.get(parentId) ?? [];
  for (const childId of childIds) {
    if (resolveSelectableId(childId, byId) !== null) {
      return childId;
    }
  }

  return null;
}

function resolveSelectableAncestorId(
  nodeId: string,
  byId: Readonly<ReadonlyMap<string, TngTreeItem>>,
): string | null {
  let parentId = byId.get(nodeId)?.parentId ?? null;

  while (parentId !== null) {
    const candidate = byId.get(parentId);
    if (candidate === undefined) {
      return null;
    }

    if (candidate.disabled !== true) {
      return candidate.id;
    }

    parentId = candidate.parentId ?? null;
  }

  return null;
}

function resolveTreeKeyAction(event: TngTreeKeyboardEvent): TngTreeKeyAction {
  if (event.altKey || event.metaKey) {
    return 'noop';
  }

  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    return 'select';
  }

  return actionByKey[event.key] ?? 'typeahead';
}

function shouldPreventDefault(action: TngTreeKeyAction): boolean {
  return action !== 'noop' && action !== 'typeahead';
}

@Component({
  selector: 'tng-tree',
  imports: [TngTreePrimitive],
  templateUrl: './tng-tree.component.html',
  styleUrl: './tng-tree.component.css',
})
export class TngTreeComponent implements OnDestroy {
  public readonly ariaLabel = input<string>('Tree');
  public readonly defaultExpandedIds = input<readonly string[]>([]);
  public readonly defaultSelectedId = input<string | null>(null);
  public readonly nodes = input<readonly TngTreeItem[]>([]);

  public readonly selectedIdChange = output<string | null>();

  protected readonly activeDescendantId = computed((): string | null => {
    const activeId = this.activeId();
    if (activeId === null) {
      return null;
    }

    return this.toItemDomId(activeId);
  });
  protected readonly selectedId = signal<string | null>(null);
  protected readonly treeId = createTreeId();
  protected readonly visibleRows = computed((): readonly TngTreeRow[] => this.resolveVisibleRows());

  private readonly activeId = signal<string | null>(null);
  private readonly expandedIds = signal<readonly string[]>(Object.freeze([]));
  private readonly lookup = signal<TngTreeLookup>(createTreeLookup([]));
  private readonly rootRef = viewChild<ElementRef<HTMLElement>>('rootRef');
  private readonly visibleIds = signal<readonly string[]>(Object.freeze([]));

  private model: TngTreeModel = createTreeModel({ nodes: [] });
  private readonly typeahead: TngTypeaheadController = createTypeaheadController({ items: [] });

  private readonly keyActionHandlers: Readonly<Record<TngTreeRunnableAction, () => void>> =
    Object.freeze({
      'collapse-or-parent': (): void => this.handleArrowLeft(),
      'expand-or-child': (): void => this.handleArrowRight(),
      'move-next': (): void => this.applyState(this.model.moveNext()),
      'move-prev': (): void => this.applyState(this.model.movePrev()),
      select: (): void => this.selectActiveNode(),
      'to-end': (): void => this.moveToBoundary('last'),
      'to-start': (): void => this.moveToBoundary('first'),
    });

  private readonly syncInputsEffect = effect((): void => {
    this.rebuildFromInputs(this.nodes(), this.defaultExpandedIds(), this.defaultSelectedId());
  });

  public ngOnDestroy(): void {
    this.syncInputsEffect.destroy();
  }

  public onToggleClick(nodeId: string, event: TngTreePointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.hasChildren(nodeId)) {
      return;
    }

    this.focusRoot();
    this.applyState(this.model.toggle(nodeId));
    this.applyState(this.model.setActiveId(nodeId));
  }

  public onTreeFocus(): void {
    if (this.activeId() === null) {
      this.moveToBoundary('first');
    }
  }

  public onTreeItemClick(nodeId: string): void {
    const selectableId = resolveSelectableId(nodeId, this.lookup().byId);
    if (selectableId === null) {
      return;
    }

    this.focusRoot();
    this.applyState(this.model.setActiveId(selectableId));
    this.selectNode(selectableId);
  }

  public onTreeKeydown(event: TngTreeKeyboardEvent): void {
    const action = resolveTreeKeyAction(event);
    if (action === 'noop') {
      return;
    }

    if (action === 'typeahead') {
      this.handleTypeahead(event);
      return;
    }

    this.runKeyAction(action);
    if (shouldPreventDefault(action)) {
      event.preventDefault();
    }
  }

  protected isExpanded(nodeId: string): boolean {
    return this.expandedIds().includes(nodeId);
  }

  protected toItemDomId(nodeId: string): string {
    return toTreeItemDomId(this.treeId, nodeId);
  }

  private applyState(state: TngTreeModelState): void {
    this.activeId.set(state.activeId);
    this.expandedIds.set(state.expandedIds);
    this.visibleIds.set(state.visibleIds);
    this.typeahead.setItems(toTypeaheadItems(state.visibleIds, this.lookup().byId));
    this.typeahead.setActiveId(state.activeId);
  }

  private focusRoot(): void {
    this.rootRef()?.nativeElement.focus();
  }

  private handleArrowLeft(): void {
    const activeId = this.activeId();
    if (activeId === null) {
      return;
    }

    if (this.hasChildren(activeId) && this.isExpanded(activeId)) {
      this.applyState(this.model.collapse(activeId));
      return;
    }

    const ancestorId = resolveSelectableAncestorId(activeId, this.lookup().byId);
    if (ancestorId !== null) {
      this.applyState(this.model.setActiveId(ancestorId));
    }
  }

  private handleArrowRight(): void {
    const activeId = this.activeId();
    if (activeId === null) {
      this.moveToBoundary('first');
      return;
    }

    if (!this.hasChildren(activeId)) {
      return;
    }

    if (!this.isExpanded(activeId)) {
      this.applyState(this.model.expand(activeId));
      return;
    }

    const childId = resolveFirstSelectableChildId(
      activeId,
      this.lookup().childrenByParent,
      this.lookup().byId,
    );
    if (childId !== null) {
      this.applyState(this.model.setActiveId(childId));
    }
  }

  private handleTypeahead(event: TngTreeKeyboardEvent): void {
    if (!isPrintableTreeKey(event.key)) {
      return;
    }

    const state = this.typeahead.handleKey(event.key);
    if (state.activeId === null || state.activeId === this.activeId()) {
      return;
    }

    this.applyState(this.model.setActiveId(state.activeId));
    event.preventDefault();
  }

  private hasChildren(nodeId: string): boolean {
    return (this.lookup().childrenByParent.get(nodeId)?.length ?? 0) > 0;
  }

  private moveToBoundary(boundary: TngTreeBoundary): void {
    const ids = this.visibleIds();
    const byId = this.lookup().byId;
    const orderedIds = boundary === 'first' ? ids : [...ids].reverse();

    for (const candidateId of orderedIds) {
      const selectableId = resolveSelectableId(candidateId, byId);
      if (selectableId !== null) {
        this.applyState(this.model.setActiveId(selectableId));
        return;
      }
    }
  }

  private rebuildFromInputs(
    nodes: readonly TngTreeItem[],
    expandedIds: readonly string[],
    selectedId: string | null,
  ): void {
    const normalizedNodes = toReadonlyArray(nodes);
    const lookup = createTreeLookup(normalizedNodes);
    this.lookup.set(lookup);

    this.model = createTreeModel({
      expandedIds,
      nodes: toTreeModelNodes(normalizedNodes),
    });
    this.applyState(this.model.getState());

    const nextSelectedId = resolveSelectableId(selectedId, lookup.byId);
    this.selectedId.set(nextSelectedId);
    if (nextSelectedId !== null) {
      this.applyState(this.model.setActiveId(nextSelectedId));
    }
  }

  private resolveVisibleRows(): readonly TngTreeRow[] {
    const byId = this.lookup().byId;
    const childrenByParent = this.lookup().childrenByParent;
    const rows: TngTreeRow[] = [];

    for (const nodeId of this.visibleIds()) {
      const node = byId.get(nodeId);
      if (node === undefined) {
        continue;
      }

      rows.push(
        Object.freeze({
          depth: resolveDepth(node.id, byId),
          description: node.description ?? null,
          disabled: node.disabled === true,
          hasChildren: (childrenByParent.get(node.id)?.length ?? 0) > 0,
          id: node.id,
          label: node.label,
        }),
      );
    }

    return toReadonlyArray(rows);
  }

  private runKeyAction(action: TngTreeKeyAction): void {
    if (action === 'noop' || action === 'typeahead') {
      return;
    }

    this.keyActionHandlers[action]();
  }

  private selectActiveNode(): void {
    const activeId = this.activeId();
    if (activeId === null) {
      return;
    }

    const selectableId = resolveSelectableId(activeId, this.lookup().byId);
    if (selectableId !== null) {
      this.selectNode(selectableId);
    }
  }

  private selectNode(nodeId: string): void {
    this.selectedId.set(nodeId);
    this.selectedIdChange.emit(nodeId);
  }
}
export { TngTreeComponent as TngTree };
