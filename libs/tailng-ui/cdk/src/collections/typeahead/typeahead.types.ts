export type TngTypeaheadItem = Readonly<{
  disabled?: boolean;
  id: string;
  text: string;
}>;

export type TngTypeaheadMatchStrategy = 'active' | 'start';

export type TngTypeaheadOptions = Readonly<{
  bufferResetMs?: number;
  initialActiveId?: string | null;
  items: readonly TngTypeaheadItem[];
  loop?: boolean;
  matchStrategy?: TngTypeaheadMatchStrategy;
}>;

export type TngTypeaheadResult = Readonly<{
  activeId: string | null;
  buffer: string;
}>;

export type TngTypeaheadController = Readonly<{
  getState: () => TngTypeaheadResult;
  handleKey: (key: string, timestampMs?: number) => TngTypeaheadResult;
  reset: () => void;
  setActiveId: (id: string | null) => string | null;
  setItems: (items: readonly TngTypeaheadItem[]) => void;
}>;
