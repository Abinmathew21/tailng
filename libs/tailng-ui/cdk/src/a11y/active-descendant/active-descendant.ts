import {
  type TngActiveDescendantController,
  type TngActiveDescendantOptions,
} from './active-descendant.types';

function normalizeIds(ids: readonly string[] | undefined): readonly string[] {
  const uniqueIds: string[] = [];
  const seenIds = new Set<string>();

  for (const id of ids ?? []) {
    const normalizedId = id.trim();
    if (normalizedId.length === 0 || seenIds.has(normalizedId)) {
      continue;
    }

    seenIds.add(normalizedId);
    uniqueIds.push(normalizedId);
  }

  return uniqueIds;
}

function firstId(ids: readonly string[]): string | null {
  return ids[0] ?? null;
}

function lastId(ids: readonly string[]): string | null {
  return ids.length > 0 ? ids[ids.length - 1] ?? null : null;
}

class ActiveDescendantController implements TngActiveDescendantController {
  private activeId: string | null;
  private disabledIds: readonly string[];
  private readonly hostId: string;
  private itemIds: readonly string[];
  private readonly loop: boolean;

  public constructor(options: TngActiveDescendantOptions) {
    this.activeId = options.initialActiveId ?? null;
    this.disabledIds = normalizeIds(options.disabledIds);
    this.hostId = options.hostId;
    this.itemIds = normalizeIds(options.itemIds);
    this.loop = options.loop ?? true;
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
    if (this.activeId !== null) {
      attributes['aria-activedescendant'] = this.activeId;
    }

    return Object.freeze(attributes);
  }

  public moveNext(): string | null {
    return this.moveBy(1);
  }

  public movePrev(): string | null {
    return this.moveBy(-1);
  }

  public setDisabledIds(ids: readonly string[]): void {
    this.disabledIds = normalizeIds(ids);
    this.ensureActiveIdStillValid();
  }

  public setActiveId(id: string | null): string | null {
    if (id === null || this.canUseActiveId(id)) {
      this.activeId = id;
    }

    return this.activeId;
  }

  public setItemIds(ids: readonly string[]): void {
    this.itemIds = normalizeIds(ids);
    this.ensureActiveIdStillValid();
  }

  private canUseActiveId(id: string): boolean {
    if (this.itemIds.length === 0) {
      return true;
    }

    return this.itemIds.includes(id) && !this.disabledIds.includes(id);
  }

  private ensureActiveIdStillValid(): void {
    if (this.activeId === null) {
      return;
    }

    if (!this.canUseActiveId(this.activeId)) {
      this.activeId = null;
    }
  }

  private getEnabledIds(): readonly string[] {
    return this.itemIds.filter((id) => !this.disabledIds.includes(id));
  }

  private clearActiveIdWhenNoEnabledIds(): string | null {
    if (this.itemIds.length > 0) {
      this.activeId = null;
    }

    return this.activeId;
  }

  private resolveActiveIndex(enabledIds: readonly string[]): number {
    return this.activeId === null ? -1 : enabledIds.indexOf(this.activeId);
  }

  private setBoundaryActiveId(enabledIds: readonly string[], delta: -1 | 1): string | null {
    this.activeId = delta > 0 ? firstId(enabledIds) : lastId(enabledIds);
    return this.activeId;
  }

  private moveWithinEnabledIds(
    enabledIds: readonly string[],
    currentIndex: number,
    delta: -1 | 1,
  ): string | null {
    const nextIndex = currentIndex + delta;
    if (nextIndex >= 0 && nextIndex < enabledIds.length) {
      this.activeId = enabledIds[nextIndex] ?? null;
      return this.activeId;
    }

    if (this.loop) {
      return this.setBoundaryActiveId(enabledIds, delta);
    }

    return this.activeId;
  }

  private moveBy(delta: -1 | 1): string | null {
    const enabledIds = this.getEnabledIds();
    if (enabledIds.length === 0) {
      return this.clearActiveIdWhenNoEnabledIds();
    }

    const currentIndex = this.resolveActiveIndex(enabledIds);
    if (currentIndex < 0) {
      return this.setBoundaryActiveId(enabledIds, delta);
    }

    return this.moveWithinEnabledIds(enabledIds, currentIndex, delta);
  }
}

export function createActiveDescendantController(
  options: TngActiveDescendantOptions,
): TngActiveDescendantController {
  return new ActiveDescendantController(options);
}
