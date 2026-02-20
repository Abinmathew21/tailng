export type TngFocusScopeState = Readonly<{
  active: boolean;
  lastFocusedId: string | null;
  restoreFocus: boolean;
}>;

export type TngFocusScopeOptions = Readonly<{
  restoreFocus?: boolean;
}>;

export type TngFocusScopeController = Readonly<{
  activate: () => void;
  deactivate: () => void;
  getState: () => TngFocusScopeState;
  recordFocus: (id: string | null) => void;
}>;
