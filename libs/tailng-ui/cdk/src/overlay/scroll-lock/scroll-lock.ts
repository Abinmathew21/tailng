import {
  type TngScrollLockDocument,
  type TngScrollLockStyle,
  type TngScrollLockManager,
  type TngScrollLockOptions,
} from './scroll-lock.types';

type TngBodySnapshot = Readonly<{
  overflow: string | null;
  paddingRight: string | null;
}>;

class ScrollLockManager implements TngScrollLockManager {
  private readonly documentRef: TngScrollLockDocument | null;
  private readonly getScrollbarWidth: () => number;
  private readonly lockIds = new Set<string>();
  private readonly enabled: boolean;
  private initialBodySnapshot: TngBodySnapshot | null = null;

  public constructor(options: Readonly<TngScrollLockOptions>) {
    this.documentRef = options.documentRef ?? null;
    this.enabled = this.documentRef !== null;
    this.getScrollbarWidth = options.getScrollbarWidth ?? (() : number => 0);
  }

  public acquire(lockId: string): void {
    if (this.lockIds.has(lockId)) {
      return;
    }

    this.lockIds.add(lockId);
    if (this.lockIds.size === 1) {
      this.applyLockStyles();
    }
  }

  public clear(): void {
    if (this.lockIds.size === 0) {
      return;
    }

    this.lockIds.clear();
    this.restoreLockStyles();
  }

  public getLockIds(): readonly string[] {
    return [...this.lockIds.values()];
  }

  public isLocked(): boolean {
    return this.lockIds.size > 0;
  }

  public release(lockId: string): void {
    if (!this.lockIds.has(lockId)) {
      return;
    }

    this.lockIds.delete(lockId);
    if (this.lockIds.size === 0) {
      this.restoreLockStyles();
    }
  }

  private applyLockStyles(): void {
    const style = this.getBodyStyle();
    if (style === null || !this.enabled) {
      return;
    }

    this.initialBodySnapshot = {
      overflow: style.overflow ?? null,
      paddingRight: style.paddingRight ?? null,
    };
    style.overflow = 'hidden';
    const scrollbarWidth = this.getScrollbarWidth();
    if (scrollbarWidth > 0) {
      style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  private restoreLockStyles(): void {
    if (!this.enabled || this.initialBodySnapshot === null) {
      return;
    }

    this.restoreStyleValue('overflow', this.initialBodySnapshot.overflow);
    this.restoreStyleValue('paddingRight', this.initialBodySnapshot.paddingRight);
    this.initialBodySnapshot = null;
  }

  private getBodyStyle(): TngScrollLockStyle | null {
    if (this.documentRef === null) {
      return null;
    }

    return this.documentRef.body.style as TngScrollLockStyle;
  }

  private restoreStyleValue(key: keyof TngScrollLockStyle, value: string | null): void {
    const style = this.getBodyStyle();
    if (style === null) {
      return;
    }

    if (value === null) {
      delete style[key];
      return;
    }

    style[key] = value;
  }
}

export function createScrollLockManager(
  options: Readonly<TngScrollLockOptions> = {},
): TngScrollLockManager {
  return new ScrollLockManager(options);
}

const globalScrollLockManagers = new WeakMap<object, TngScrollLockManager>();

export function getGlobalScrollLockManager(
  options: Readonly<TngScrollLockOptions> = {},
): TngScrollLockManager {
  const documentRef = options.documentRef ?? null;
  if (documentRef === null) {
    return createScrollLockManager(options);
  }

  const key = documentRef as object;
  const existing = globalScrollLockManagers.get(key);
  if (existing !== undefined) {
    return existing;
  }

  const manager = createScrollLockManager(options);
  globalScrollLockManagers.set(key, manager);
  return manager;
}
