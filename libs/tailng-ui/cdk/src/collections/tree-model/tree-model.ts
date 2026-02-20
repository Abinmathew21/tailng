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

  return {
    byId,
    childrenByParent,
    roots,
  };
}

function toState(
  activeId: string | null,
  expandedIds: ReadonlySet<string>,
  visibleIds: readonly string[],
): TngTreeModelState {
  return Object.freeze({
    activeId,
    expandedIds: Object.freeze(Array.from(expandedIds)),
    visibleIds: Object.freeze([...visibleIds]),
  });
}

function resolveVisibleIds(
  index: TngNodeIndex,
  expandedIds: ReadonlySet<string>,
): readonly string[] {
  const visibleIds: string[] = [];

  const visit = (id: string): void => {
    visibleIds.push(id);
    if (!expandedIds.has(id)) {
      return;
    }

    const children = index.childrenByParent.get(id) ?? [];
    for (const childId of children) {
      visit(childId);
    }
  };

  for (const rootId of index.roots) {
    visit(rootId);
  }

  return visibleIds;
}

function isSelectable(node: TngTreeNode | undefined): boolean {
  return node !== undefined && node.disabled !== true;
}

function resolveInitialActiveId(
  candidateId: string | null | undefined,
  index: TngNodeIndex,
  visibleIds: readonly string[],
): string | null {
  if (
    candidateId !== null &&
    candidateId !== undefined &&
    visibleIds.includes(candidateId) &&
    isSelectable(index.byId.get(candidateId))
  ) {
    return candidateId;
  }

  return visibleIds.find((id) => isSelectable(index.byId.get(id))) ?? null;
}

function resolveNextActiveId(
  currentActiveId: string | null,
  visibleIds: readonly string[],
  index: TngNodeIndex,
  direction: -1 | 1,
): string | null {
  if (visibleIds.length === 0) {
    return null;
  }

  const currentIndex =
    currentActiveId === null ? -1 : visibleIds.findIndex((id) => id === currentActiveId);
  let candidateIndex = currentIndex + direction;

  while (candidateIndex >= 0 && candidateIndex < visibleIds.length) {
    const candidateId = visibleIds[candidateIndex];
    if (isSelectable(index.byId.get(candidateId))) {
      return candidateId;
    }
    candidateIndex += direction;
  }

  return currentActiveId;
}

function hasChildren(id: string, index: TngNodeIndex): boolean {
  return (index.childrenByParent.get(id)?.length ?? 0) > 0;
}

function sanitizeExpanded(
  expandedIds: ReadonlySet<string>,
  index: TngNodeIndex,
): ReadonlySet<string> {
  const nextExpanded = new Set<string>();
  for (const id of expandedIds) {
    if (index.byId.has(id) && hasChildren(id, index)) {
      nextExpanded.add(id);
    }
  }
  return nextExpanded;
}

export function createTreeModel(options: TngTreeModelOptions): TngTreeModel {
  let index = createNodeIndex(options.nodes);
  let expandedIds = sanitizeExpanded(new Set(options.expandedIds ?? []), index);
  let visibleIds = resolveVisibleIds(index, expandedIds);
  let activeId = resolveInitialActiveId(options.activeId ?? null, index, visibleIds);

  const getState = (): TngTreeModelState => toState(activeId, expandedIds, visibleIds);

  const recompute = (): TngTreeModelState => {
    visibleIds = resolveVisibleIds(index, expandedIds);
    activeId = resolveInitialActiveId(activeId, index, visibleIds);
    return getState();
  };

  const setActiveId = (id: string | null): TngTreeModelState => {
    if (
      id !== null &&
      (!visibleIds.includes(id) || !isSelectable(index.byId.get(id)))
    ) {
      return getState();
    }

    activeId = id;
    return getState();
  };

  const expand = (id: string): TngTreeModelState => {
    if (!index.byId.has(id) || !hasChildren(id, index)) {
      return getState();
    }

    expandedIds = new Set(expandedIds);
    expandedIds.add(id);
    return recompute();
  };

  const collapse = (id: string): TngTreeModelState => {
    if (!expandedIds.has(id)) {
      return getState();
    }

    expandedIds = new Set(expandedIds);
    expandedIds.delete(id);
    return recompute();
  };

  const toggle = (id: string): TngTreeModelState => {
    return expandedIds.has(id) ? collapse(id) : expand(id);
  };

  const expandAll = (): TngTreeModelState => {
    const nextExpanded = new Set<string>();
    for (const id of index.byId.keys()) {
      if (hasChildren(id, index)) {
        nextExpanded.add(id);
      }
    }
    expandedIds = nextExpanded;
    return recompute();
  };

  const collapseAll = (): TngTreeModelState => {
    expandedIds = new Set<string>();
    return recompute();
  };

  const setNodes = (nextNodes: readonly TngTreeNode[]): TngTreeModelState => {
    index = createNodeIndex(nextNodes);
    expandedIds = sanitizeExpanded(expandedIds, index);
    return recompute();
  };

  const moveNext = (): TngTreeModelState => {
    activeId = resolveNextActiveId(activeId, visibleIds, index, 1);
    return getState();
  };

  const movePrev = (): TngTreeModelState => {
    activeId = resolveNextActiveId(activeId, visibleIds, index, -1);
    return getState();
  };

  return Object.freeze({
    collapse,
    collapseAll,
    expand,
    expandAll,
    getState,
    moveNext,
    movePrev,
    setActiveId,
    setNodes,
    toggle,
  });
}
