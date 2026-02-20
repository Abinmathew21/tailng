export type TngScrollLockStyle = {
  overflow?: string;
  paddingRight?: string;
};

export type TngReadonlyScrollLockStyle = Readonly<TngScrollLockStyle>;

export type TngScrollLockBody = Readonly<{
  style: TngReadonlyScrollLockStyle;
}>;

export type TngScrollLockDocument = Readonly<{
  body: TngScrollLockBody;
}>;

export type TngScrollLockOptions = Readonly<{
  documentRef?: TngScrollLockDocument | null;
  getScrollbarWidth?: () => number;
}>;

export type TngScrollLockManager = Readonly<{
  acquire: (lockId: string) => void;
  clear: () => void;
  getLockIds: () => readonly string[];
  isLocked: () => boolean;
  release: (lockId: string) => void;
}>;
