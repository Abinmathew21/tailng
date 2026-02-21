export type TngDisclosureOptions = Readonly<{
  defaultOpen?: boolean;
  disabled?: boolean;
}>;

export type TngDisclosureState = Readonly<{
  disabled: boolean;
  open: boolean;
}>;

export type TngDisclosureController = Readonly<{
  close: () => boolean;
  getState: () => TngDisclosureState;
  isOpen: () => boolean;
  open: () => boolean;
  setDisabled: (disabled: boolean) => void;
  toggle: () => boolean;
}>;
