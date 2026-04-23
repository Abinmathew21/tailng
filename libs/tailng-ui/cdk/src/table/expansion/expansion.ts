import type {
  TngTableRowExpansionController,
  TngTableRowExpansionMode,
  TngTableRowExpansionOptions,
  TngTableRowExpansionState,
} from './expansion.types';

class TngTableRowExpansionControllerImpl<TId>
  implements TngTableRowExpansionController<TId>
{
  private readonly mode: TngTableRowExpansionMode;
  private readonly expandedIds = new Set<TId>();

  public constructor(options: TngTableRowExpansionOptions<TId>) {
    this.mode = options.mode ?? 'multiple';

    const initialExpandedIds =
      this.mode === 'single'
        ? options.initialExpandedIds?.slice(0, 1) ?? []
        : (options.initialExpandedIds ?? []);

    for (const id of initialExpandedIds) {
      this.expandedIds.add(id);
    }
  }

  public clear(): TngTableRowExpansionState<TId> {
    this.expandedIds.clear();
    return this.getState();
  }

  public collapse(id: TId): TngTableRowExpansionState<TId> {
    this.expandedIds.delete(id);
    return this.getState();
  }

  public expand(id: TId): TngTableRowExpansionState<TId> {
    if (this.mode === 'single') {
      this.expandedIds.clear();
    }

    this.expandedIds.add(id);
    return this.getState();
  }

  public getState(): TngTableRowExpansionState<TId> {
    return Object.freeze({
      expandedIds: Object.freeze([...this.expandedIds]),
      mode: this.mode,
    });
  }

  public isExpanded(id: TId): boolean {
    return this.expandedIds.has(id);
  }

  public toggle(id: TId): TngTableRowExpansionState<TId> {
    if (this.expandedIds.has(id)) {
      return this.collapse(id);
    }

    return this.expand(id);
  }
}

export function createTngRowExpansionController<TId>(
  options: TngTableRowExpansionOptions<TId> = {},
): TngTableRowExpansionController<TId> {
  return new TngTableRowExpansionControllerImpl(options);
}
