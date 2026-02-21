export type TngTreeNode = Readonly<{
  disabled?: boolean;
  id: string;
  parentId?: string | null;
}>;

export type TngTreeModelOptions = Readonly<{
  activeId?: string | null;
  expandedIds?: readonly string[];
  nodes: readonly TngTreeNode[];
}>;

export type TngTreeModelState = Readonly<{
  activeId: string | null;
  expandedIds: readonly string[];
  visibleIds: readonly string[];
}>;

export type TngTreeModel = Readonly<{
  collapse: (id: string) => TngTreeModelState;
  collapseAll: () => TngTreeModelState;
  expand: (id: string) => TngTreeModelState;
  expandAll: () => TngTreeModelState;
  getState: () => TngTreeModelState;
  moveNext: () => TngTreeModelState;
  movePrev: () => TngTreeModelState;
  setActiveId: (id: string | null) => TngTreeModelState;
  setNodes: (nodes: readonly TngTreeNode[]) => TngTreeModelState;
  toggle: (id: string) => TngTreeModelState;
}>;
