export type TngActiveDescendantController = Readonly<{
  clear: () => void;
  getActiveId: () => string | null;
  getHostAttributes: () => Readonly<Record<string, string>>;
  moveNext: () => string | null;
  movePrev: () => string | null;
  setDisabledIds: (ids: readonly string[]) => void;
  setActiveId: (id: string | null) => string | null;
  setItemIds: (ids: readonly string[]) => void;
}>;

export type TngActiveDescendantOptions = Readonly<{
  disabledIds?: readonly string[];
  hostId: string;
  initialActiveId?: string | null;
  itemIds?: readonly string[];
  loop?: boolean;
}>;
