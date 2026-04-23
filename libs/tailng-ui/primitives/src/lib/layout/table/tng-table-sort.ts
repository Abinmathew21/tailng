import {
  Directive,
  HostBinding,
  HostListener,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import type { OnDestroy, OnInit } from '@angular/core';
import {
  createTngSortController,
  type TngTableSortController,
  type TngTableAriaSort,
  type TngTableSortDirection,
  type TngTableSortState,
} from '@tailng-ui/cdk';

export type TngTableSortChange = Readonly<{
  activeColumnId: string | null;
  direction: TngTableSortDirection | null;
}>;

type TngSortHeaderKeydownEvent = Readonly<Pick<KeyboardEvent, 'key' | 'preventDefault'>>;

function normalizeSortDirection(value: unknown): TngTableSortDirection | null {
  if (value === 'asc' || value === 'desc') {
    return value;
  }

  return null;
}

@Directive({
  selector: '[tngTableSort]',
  exportAs: 'tngTableSort',
})
export class TngTableSort {
  private readonly registeredHeaderIds = new Set<string>();
  private uncontrolledActiveColumnId: string | null = null;
  private uncontrolledDirection: TngTableSortDirection | null = null;

  public readonly activeColumnId = input<string | null | undefined>(undefined, {
    alias: 'tngTableSortActive',
  });
  public readonly direction = input<TngTableSortDirection | null | undefined, unknown>(undefined, {
    alias: 'tngTableSortDirection',
    transform: normalizeSortDirection,
  });
  public readonly disableClear = input<boolean, boolean | string>(false, {
    alias: 'tngTableSortDisableClear',
    transform: booleanAttribute,
  });

  public readonly sortChange = output<TngTableSortChange>();

  @HostBinding('attr.data-sortable')
  protected readonly dataSortable = '' as const;

  @HostBinding('attr.data-sort-column')
  protected get dataSortColumnAttr(): string | null {
    return this.getState().activeColumnId;
  }

  @HostBinding('attr.data-sort-direction')
  protected get dataSortDirectionAttr(): TngTableSortDirection | null {
    return this.getState().direction;
  }

  public getAriaSort(columnId: string): TngTableAriaSort {
    return this.createController().getAriaSort(columnId);
  }

  public getDirectionFor(columnId: string): TngTableSortDirection | null {
    const state = this.getState();
    if (state.activeColumnId !== columnId) {
      return null;
    }

    return state.direction;
  }

  public getState(): TngTableSortState<string> {
    return Object.freeze({
      activeColumnId: this.activeColumnId() ?? this.uncontrolledActiveColumnId,
      direction: this.direction() ?? this.uncontrolledDirection,
      disableClear: this.disableClear(),
    });
  }

  public hasHeader(columnId: string): boolean {
    return this.registeredHeaderIds.has(columnId);
  }

  public registerHeader(columnId: string): void {
    this.registeredHeaderIds.add(columnId);
  }

  public set(
    activeColumnId: string | null,
    direction: TngTableSortDirection | null,
  ): TngTableSortState<string> {
    return this.commit(this.createController().set(activeColumnId, direction));
  }

  public toggle(columnId: string): TngTableSortState<string> {
    return this.commit(this.createController().toggle(columnId));
  }

  public unregisterHeader(columnId: string): void {
    this.registeredHeaderIds.delete(columnId);
  }

  private commit(nextState: TngTableSortState<string>): TngTableSortState<string> {
    if (this.activeColumnId() === undefined) {
      this.uncontrolledActiveColumnId = nextState.activeColumnId;
    }

    if (this.direction() === undefined) {
      this.uncontrolledDirection = nextState.direction;
    }

    this.sortChange.emit({
      activeColumnId: nextState.activeColumnId,
      direction: nextState.direction,
    });

    return this.getState();
  }

  private createController(): TngTableSortController<unknown, string> {
    const state = this.getState();

    return createTngSortController<unknown>({
      activeColumnId: state.activeColumnId,
      direction: state.direction,
      disableClear: state.disableClear,
    });
  }
}

@Directive({
  selector: 'th[tngSortHeader]',
  exportAs: 'tngSortHeader',
})
export class TngSortHeader implements OnDestroy, OnInit {
  private readonly sort = inject(TngTableSort, { optional: true });

  public readonly columnId = input.required<string>({
    alias: 'tngSortHeader',
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    alias: 'tngSortHeaderDisabled',
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-sort')
  protected get ariaSortAttr(): TngTableAriaSort | null {
    if (this.sort === null) {
      return null;
    }

    return this.sort.getAriaSort(this.columnId());
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-sort-header' as const;

  @HostBinding('attr.data-sort-active')
  protected get dataSortActiveAttr(): '' | null {
    return this.sort?.getDirectionFor(this.columnId()) !== null ? '' : null;
  }

  @HostBinding('attr.data-sort-direction')
  protected get dataSortDirectionAttr(): TngTableSortDirection | null {
    return this.sort?.getDirectionFor(this.columnId()) ?? null;
  }

  @HostBinding('attr.tabindex')
  protected get tabIndexAttr(): '-1' | '0' {
    if (this.sort === null || this.disabled()) {
      return '-1';
    }

    return '0';
  }

  public ngOnDestroy(): void {
    this.sort?.unregisterHeader(this.columnId());
  }

  public ngOnInit(): void {
    this.sort?.registerHeader(this.columnId());
  }

  @HostListener('click')
  protected onClick(): void {
    this.toggle();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngSortHeaderKeydownEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.toggle();
  }

  private toggle(): void {
    if (this.disabled() || this.sort === null) {
      return;
    }

    this.sort.toggle(this.columnId());
  }
}
