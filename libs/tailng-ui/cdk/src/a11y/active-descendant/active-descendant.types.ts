export type TngActiveDescendantController = Readonly<{
  clear: () => void;
  getActiveId: () => string | null;
  getHostAttributes: () => Readonly<Record<string, string>>;
  setActiveId: (id: string | null) => string | null;
}>;

export type TngActiveDescendantOptions = Readonly<{
  hostId: string;
  initialActiveId?: string | null;
}>;
