export type TngFocusScopeState = Readonly<{
  active: boolean;
  lastFocusedId: string | null;
  memberIds: readonly string[];
  restoreFocus: boolean;
  restoreFocusTargetId: string | null;
  trapActive: boolean;
  trapFocus: boolean;
}>;

export type TngFocusScopeOptions = Readonly<{
  members?: () => readonly string[];
  restoreFocus?: boolean;
  trapFocus?: boolean;
}>;

export type TngFocusScopeController = Readonly<{
  activate: (restoreFocusTargetId?: string | null) => void;
  deactivate: () => string | null;
  getState: () => TngFocusScopeState;
  isTrapActive: () => boolean;
  recordFocus: (id: string | null) => void;
  registerMember: (id: string) => void;
  resolveFocusCandidate: (candidateId: string | null) => string | null;
  unregisterMember: (id: string) => void;
}>;
