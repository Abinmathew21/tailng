import {
  type TngRovingFocusController,
  type TngRovingFocusOptions,
} from './roving-focus.types';

function normalizeIds(ids: readonly string[] | undefined): readonly string[] {
  const normalizedIds: string[] = [];
  const seenIds = new Set<string>();

  for (const id of ids ?? []) {
    const normalizedId = id.trim();
    if (normalizedId.length === 0 || seenIds.has(normalizedId)) {
      continue;
    }

    seenIds.add(normalizedId);
    normalizedIds.push(normalizedId);
  }

  return normalizedIds;
}

function findEnabledIds(
  itemIds: readonly string[],
  disabledIds: readonly string[],
): readonly string[] {
  return itemIds.filter((id) => !disabledIds.includes(id));
}

function firstEnabledId(enabledIds: readonly string[]): string | null {
  return enabledIds[0] ?? null;
}

function lastEnabledId(enabledIds: readonly string[]): string | null {
  return enabledIds.length > 0 ? enabledIds[enabledIds.length - 1] ?? null : null;
}

class RovingFocusController implements TngRovingFocusController {
  private activeId: string | null;
  private disabledIds: readonly string[];
  private itemIds: readonly string[];
  private readonly loop: boolean;

  public constructor(options: TngRovingFocusOptions) {
    this.disabledIds = normalizeIds(options.disabledIds);
    this.itemIds = normalizeIds(options.itemIds);
    this.loop = options.loop ?? true;

    const enabledIds = this.getEnabledIds();
    this.activeId = options.initialActiveId ?? firstEnabledId(enabledIds);
  }

  public clear(): void {
    this.activeId = null;
  }

  public end(): string | null {
    this.activeId = lastEnabledId(this.getEnabledIds());
    return this.activeId;
  }

  public getActiveId(): string | null {
    return this.activeId;
  }

  public home(): string | null {
    this.activeId = firstEnabledId(this.getEnabledIds());
    return this.activeId;
  }

  public moveNext(): string | null {
    return this.moveBy(1);
  }

  public movePrev(): string | null {
    return this.moveBy(-1);
  }

  public setActiveId(id: string | null): string | null {
    if (id === null || this.getEnabledIds().includes(id)) {
      this.activeId = id;
    }

    return this.activeId;
  }

  public setDisabledIds(ids: readonly string[]): void {
    this.disabledIds = normalizeIds(ids);
    this.ensureActiveIdStillValid();
  }

  public setItemIds(ids: readonly string[]): void {
    this.itemIds = normalizeIds(ids);
    this.ensureActiveIdStillValid();
  }

  private ensureActiveIdStillValid(): void {
    if (this.activeId === null) {
      return;
    }

    if (!this.getEnabledIds().includes(this.activeId)) {
      this.activeId = null;
    }
  }

  private getEnabledIds(): readonly string[] {
    return findEnabledIds(this.itemIds, this.disabledIds);
  }

  private moveBy(delta: -1 | 1): string | null {
    const enabledIds = this.getEnabledIds();
    if (enabledIds.length === 0) {
      return this.clearActiveId();
    }

    if (this.activeId === null) {
      return this.activeId;
    }

    return this.moveWithinEnabledIds(enabledIds, delta);
  }

  private clearActiveId(): string | null {
    this.activeId = null;
    return this.activeId;
  }

  private resolveBoundaryId(enabledIds: readonly string[], delta: -1 | 1): string | null {
    return delta > 0 ? firstEnabledId(enabledIds) : lastEnabledId(enabledIds);
  }

  private moveWithinEnabledIds(enabledIds: readonly string[], delta: -1 | 1): string | null {
    if (this.activeId === null) {
      return this.activeId;
    }

    const currentIndex = enabledIds.indexOf(this.activeId);
    if (currentIndex < 0) {
      this.activeId = this.resolveBoundaryId(enabledIds, delta);
      return this.activeId;
    }

    const nextIndex = currentIndex + delta;
    if (nextIndex >= 0 && nextIndex < enabledIds.length) {
      this.activeId = enabledIds[nextIndex] ?? null;
      return this.activeId;
    }

    return this.handleBoundaryMove(enabledIds, delta);
  }

  private handleBoundaryMove(enabledIds: readonly string[], delta: -1 | 1): string | null {
    if (!this.loop) {
      return this.activeId;
    }

    this.activeId = this.resolveBoundaryId(enabledIds, delta);
    return this.activeId;
  }
}

export function createRovingFocusController(
  options: TngRovingFocusOptions,
): TngRovingFocusController {
  return new RovingFocusController(options);
}
