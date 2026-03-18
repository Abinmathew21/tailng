import {
  type TngActiveDescendantController,
  type TngActiveDescendantOptions,
} from './active-descendant.types';

function normalizeIds(ids: readonly string[] | undefined): readonly string[] {
  const uniqueIds: string[] = [];
  const seenIds = new Set<string>();

  for (const id of ids ?? []) {
    const normalizedId = id.trim();
    if (normalizedId.length === 0 || seenIds.has(normalizedId)) continue;

    seenIds.add(normalizedId);
    uniqueIds.push(normalizedId);
  }

  return uniqueIds;
}

function firstId(ids: readonly string[]): string | null {
  return ids[0] ?? null;
}

function lastId(ids: readonly string[]): string | null {
  return ids.length === 0 ? null : ids[ids.length - 1] ?? null;
}

function edgeId(ids: readonly string[], delta: -1 | 1): string | null {
  return delta > 0 ? firstId(ids) : lastId(ids);
}

function resolveMoveTarget(options: {
  readonly activeId: string | null;
  readonly delta: -1 | 1;
  readonly enabledIds: readonly string[];
  readonly loop: boolean;
}): string | null {
  const { activeId, delta, enabledIds, loop } = options;

  if (enabledIds.length === 0) return null;

  if (activeId === null) return edgeId(enabledIds, delta);

  const currentIndex = enabledIds.indexOf(activeId);
  if (currentIndex < 0) return edgeId(enabledIds, delta);

  const nextIndex = currentIndex + delta;
  if (nextIndex >= 0 && nextIndex < enabledIds.length) {
    return enabledIds[nextIndex] ?? null;
  }

  if (!loop) return activeId;

  return edgeId(enabledIds, delta);
}

type Item = Readonly<{ id: string; disabled: boolean }>;

class ActiveDescendantController implements TngActiveDescendantController {
  private activeId: string | null;
  private items: readonly Item[];
  private readonly hostId: string;
  private readonly loop: boolean;

  public constructor(options: TngActiveDescendantOptions) {
    this.activeId = options.initialActiveId ?? null;
    this.hostId = options.hostId;
    this.loop = options.loop ?? true;

    const itemIds = normalizeIds(options.itemIds);
    const disabledSet = new Set(normalizeIds(options.disabledIds));
    this.items = itemIds.map((id) => ({ id, disabled: disabledSet.has(id) }));

    this.ensureActiveIdStillValid();
  }

  public clear(): void {
    this.activeId = null;
  }

  public getActiveId(): string | null {
    return this.activeId;
  }

  public getHostAttributes(): Readonly<Record<string, string>> {
    const attributes: Record<string, string> = { id: this.hostId };
    if (this.activeId !== null) attributes['aria-activedescendant'] = this.activeId;
    return Object.freeze(attributes);
  }

  public moveNext(): string | null {
    return this.moveBy(1);
  }

  public movePrev(): string | null {
    return this.moveBy(-1);
  }

  public setDisabledIds(ids: readonly string[]): void {
    const disabledSet = new Set(normalizeIds(ids));
    this.items = this.items.map((x) => ({ ...x, disabled: disabledSet.has(x.id) }));
    this.ensureActiveIdStillValid();
  }

  public setActiveId(id: string | null): string | null {
    if (id === null || this.canUseActiveId(id)) {
      this.activeId = id;
    }
    return this.activeId;
  }

  public setItemIds(ids: readonly string[]): void {
    const nextIds = normalizeIds(ids);

    // preserve existing disabled flags where possible
    const prevDisabled = new Map(this.items.map((x) => [x.id, x.disabled] as const));
    this.items = nextIds.map((id) => ({ id, disabled: prevDisabled.get(id) ?? false }));

    this.ensureActiveIdStillValid();
  }

  private canUseActiveId(id: string): boolean {
    if (this.items.length === 0) return true;
    const item = this.items.find((x) => x.id === id);
    return !!item && !item.disabled;
  }

  private ensureActiveIdStillValid(): void {
    if (this.activeId === null) return;

    if (this.canUseActiveId(this.activeId)) return;

    // Active became invalid (removed or disabled). Reconcile based on *DOM order*.
    const prev = this.activeId;
    this.reconcileActiveAfterInvalidation(prev);
  }

  private findNextEnabledId(fromIndex: number): string | null {
    for (const it of this.items.slice(fromIndex + 1)) {
      if (!it.disabled) return it.id;
    }
    return null;
  }

  private findPrevEnabledId(fromIndex: number): string | null {
    for (const it of this.items.slice(0, fromIndex).reverse()) {
      if (!it.disabled) return it.id;
    }
    return null;
  }

  private findFirstEnabledId(): string | null {
    for (const it of this.items) {
      if (!it.disabled) return it.id;
    }
    return null;
  }

  private reconcileActiveAfterInvalidation(prevActive: string): void {
    const idx = this.items.findIndex((x) => x.id === prevActive);

    // If item is gone, just clear (user can navigate)
    if (idx < 0) {
      this.activeId = null;
      return;
    }

    // Prefer next enabled (DOM order)
    const next = this.findNextEnabledId(idx);
    if (next !== null) {
      this.activeId = next;
      return;
    }

    // If loop=true, wrap to start
    if (this.loop) {
      const wrapped = this.findFirstEnabledId();
      if (wrapped !== null) {
        this.activeId = wrapped;
        return;
      }
    }

    // Otherwise fallback to previous enabled
    const prev = this.findPrevEnabledId(idx);
    if (prev !== null) {
      this.activeId = prev;
      return;
    }

    // No enabled items
    this.activeId = null;
  }

  private getEnabledIds(): readonly string[] {
    return this.items.filter((x) => !x.disabled).map((x) => x.id);
  }

  private moveBy(delta: -1 | 1): string | null {
    const enabledIds = this.getEnabledIds();

    if (enabledIds.length === 0) {
      if (this.items.length > 0) this.activeId = null;
      return this.activeId;
    }

    this.activeId = resolveMoveTarget({
      activeId: this.activeId,
      delta,
      enabledIds,
      loop: this.loop,
    });

    return this.activeId;
  }
}

export function createActiveDescendantController(
  options: TngActiveDescendantOptions,
): TngActiveDescendantController {
  return new ActiveDescendantController(options);
}