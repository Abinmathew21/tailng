import {
  type TngTreeModel,
  type TngTreeModelOptions,
  type TngTreeModelState,
  type TngTreeNode,
} from './tree-model.types';

type TngNodeIndex = Readonly<{
  byId: ReadonlyMap<string, TngTreeNode>;
  childrenByParent: ReadonlyMap<string, readonly string[]>;
  roots: readonly string[];
}>;

function freezeStringArray(values: readonly string[]): readonly string[] {
  return Object.freeze([...values]);
}

function createNodeIndex(nodes: readonly TngTreeNode[]): TngNodeIndex {
  const byId = new Map<string, TngTreeNode>();
  const childrenByParent = new Map<string, string[]>();
  const roots: string[] = [];

  for (const node of nodes) {
    byId.set(node.id, node);
  }

  for (const node of nodes) {
    const parentId = node.parentId ?? null;
    if (parentId === null || !byId.has(parentId)) {
      roots.push(node.id);
      continue;
    }

    const parentChildren = childrenByParent.get(parentId) ?? [];
    parentChildren.push(node.id);
    childrenByParent.set(parentId, parentChildren);
  }

  return Object.freeze({
    byId,
    childrenByParent,
    roots: freezeStringArray(roots),
  });
}

function toState(
  activeId: string | null,
  expandedIds: readonly string[],
  visibleIds: readonly string[],
): TngTreeModelState {
  return Object.freeze({
    activeId,
    expandedIds: freezeStringArray(expandedIds),
    visibleIds: freezeStringArray(visibleIds),
  });
}

class TreeModelController implements TngTreeModel {
  private activeId: string | null;
  private expandedIds: readonly string[];
  private index: TngNodeIndex;
  private visibleIds: readonly string[];

  public constructor(options: TngTreeModelOptions) {
    this.index = createNodeIndex(options.nodes);
    this.expandedIds = this.sanitizeExpandedIds(options.expandedIds ?? []);
    this.visibleIds = this.collectVisibleIds();
    this.activeId = this.resolveInitialActiveId(options.activeId ?? null);
  }

  public collapse(id: string): TngTreeModelState {
    if (!this.expandedIds.includes(id)) {
      return this.getState();
    }

    this.expandedIds = freezeStringArray(this.expandedIds.filter((expandedId) => expandedId !== id));
    return this.recompute();
  }

  public collapseAll(): TngTreeModelState {
    this.expandedIds = Object.freeze([]);
    return this.recompute();
  }

  public expand(id: string): TngTreeModelState {
    if (!this.index.byId.has(id) || !this.hasChildren(id) || this.expandedIds.includes(id)) {
      return this.getState();
    }

    this.expandedIds = freezeStringArray([...this.expandedIds, id]);
    return this.recompute();
  }

  public expandAll(): TngTreeModelState {
    const nextExpanded: string[] = [];
    for (const id of this.index.byId.keys()) {
      if (this.hasChildren(id)) {
        nextExpanded.push(id);
      }
    }

    this.expandedIds = freezeStringArray(nextExpanded);
    return this.recompute();
  }

  public getState(): TngTreeModelState {
    return toState(this.activeId, this.expandedIds, this.visibleIds);
  }

  public moveNext(): TngTreeModelState {
    this.activeId = this.resolveNextActiveId(1);
    return this.getState();
  }

  public movePrev(): TngTreeModelState {
    this.activeId = this.resolveNextActiveId(-1);
    return this.getState();
  }

  public setActiveId(id: string | null): TngTreeModelState {
    if (id !== null && (!this.visibleIds.includes(id) || !this.isSelectableId(id))) {
      return this.getState();
    }

    this.activeId = id;
    return this.getState();
  }

  public setNodes(nodes: readonly TngTreeNode[]): TngTreeModelState {
    this.index = createNodeIndex(nodes);
    this.expandedIds = this.sanitizeExpandedIds(this.expandedIds);
    return this.recompute();
  }

  public toggle(id: string): TngTreeModelState {
    return this.expandedIds.includes(id) ? this.collapse(id) : this.expand(id);
  }

  private collectVisibleIds(): readonly string[] {
    const visibleIds: string[] = [];
    const expandedSet = new Set(this.expandedIds);

    const visit = (id: string): void => {
      visibleIds.push(id);
      if (!expandedSet.has(id)) {
        return;
      }

      const children = this.index.childrenByParent.get(id) ?? [];
      for (const childId of children) {
        visit(childId);
      }
    };

    for (const rootId of this.index.roots) {
      visit(rootId);
    }

    return freezeStringArray(visibleIds);
  }

  private hasChildren(id: string): boolean {
    return (this.index.childrenByParent.get(id)?.length ?? 0) > 0;
  }

  private isSelectableId(id: string): boolean {
    const node = this.index.byId.get(id);
    return node !== undefined && node.disabled !== true;
  }

  private recompute(): TngTreeModelState {
    this.visibleIds = this.collectVisibleIds();
    this.activeId = this.resolveInitialActiveId(this.activeId);
    return this.getState();
  }

  private resolveInitialActiveId(candidateId: string | null): string | null {
    if (
      candidateId !== null &&
      this.visibleIds.includes(candidateId) &&
      this.isSelectableId(candidateId)
    ) {
      return candidateId;
    }

    for (const id of this.visibleIds) {
      if (this.isSelectableId(id)) {
        return id;
      }
    }

    return null;
  }

  private resolveNextActiveId(direction: -1 | 1): string | null {
    if (this.visibleIds.length === 0) {
      return null;
    }

    const currentIndex =
      this.activeId === null ? -1 : this.visibleIds.findIndex((id) => id === this.activeId);
    let candidateIndex = currentIndex + direction;
    while (candidateIndex >= 0 && candidateIndex < this.visibleIds.length) {
      const candidateId = this.visibleIds[candidateIndex];
      if (candidateId !== undefined && this.isSelectableId(candidateId)) {
        return candidateId;
      }
      candidateIndex += direction;
    }

    return this.activeId;
  }

  private sanitizeExpandedIds(candidateIds: readonly string[]): readonly string[] {
    const expandedIds: string[] = [];
    for (const id of candidateIds) {
      if (!this.index.byId.has(id) || !this.hasChildren(id) || expandedIds.includes(id)) {
        continue;
      }

      expandedIds.push(id);
    }

    return freezeStringArray(expandedIds);
  }
}

export function createTreeModel(options: TngTreeModelOptions): TngTreeModel {
  return new TreeModelController(options);
}
