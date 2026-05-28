import {
  ChangeDetectorRef,
  Directive,
  HostBinding,
  HostListener,
  Input,
  afterEveryRender,
  type OnDestroy,
  type OnInit,
  type Signal,
  booleanAttribute,
  contentChildren,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import {
  createTngRowExpansionController,
  createTngRowSelectionController,
  resolveGridNavigationKeyAction,
  resolveNavigableGridCell,
  type TngGridNavigableCell,
  type TngGridNavigationActionType,
  type TngTableRowExpansionMode,
  type TngTableRowExpansionState,
  type TngTableRowSelectionState,
  type TngTableSelectionMode,
} from '@tailng-ui/cdk';

export type TngTableDirection = 'ltr' | 'rtl';
export type TngTableLayoutMode = 'auto' | 'fixed';
export type TngTableRowIdResolver<TValue = unknown> = (row: TValue, index: number) => string;
export type TngTableInteractionTrigger = 'keyboard' | 'pointer' | 'programmatic';
export type TngTableScrollAxis = 'both' | 'x' | 'y';
export type TngTableStickySide = 'end' | 'start';

export type TngTableSelectionChange = Readonly<{
  anchorId: string | null;
  changedId: string | null;
  selectedIds: readonly string[];
  trigger: TngTableInteractionTrigger;
}>;

export type TngTableExpansionChange = Readonly<{
  expanded: boolean;
  expandedIds: readonly string[];
  rowId: string;
  trigger: TngTableInteractionTrigger;
}>;

export type TngTableRowClickEvent = Readonly<{
  originalEvent: MouseEvent;
  rowId: string | null;
}>;

export type TngTableRowContextMenuEvent = Readonly<{
  originalEvent: MouseEvent;
  rowId: string | null;
}>;

export type TngTableCellClickEvent = Readonly<{
  columnId: string | null;
  originalEvent: MouseEvent;
  rowId: string | null;
}>;

type TngTableKeydownEvent = Readonly<Pick<KeyboardEvent, 'key' | 'preventDefault'>>;
type TngTableMovementActionType = Exclude<TngGridNavigationActionType, 'activate' | 'exit'>;
type TngTablePageDirection = 'backward' | 'forward';
type TngTableCellPosition = Readonly<{
  col: number;
  row: number;
}>;
type TngTableFocusableCell = TngTableCell | TngTableHeaderCell;
const tngTableInteractiveTargetSelector = [
  'a[href]',
  'button',
  'input',
  'label',
  'select',
  'summary',
  'textarea',
  '[contenteditable=""]',
  '[contenteditable="plaintext-only"]',
  '[contenteditable="true"]',
  '[data-tng-table-interactive]',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="link"]',
  '[role="listbox"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="textbox"]',
].join(',');

function createTngTableCellKey(position: TngTableCellPosition): string {
  return `${position.row}:${position.col}`;
}

function compareTngTableCellPositions(
  a: TngTableCellPosition,
  b: TngTableCellPosition,
): number {
  if (a.row !== b.row) {
    return a.row - b.row;
  }

  return a.col - b.col;
}

function isMovementActionType(
  actionType: TngGridNavigationActionType,
): actionType is TngTableMovementActionType {
  return actionType !== 'activate' && actionType !== 'exit';
}

function resolveTngTableCellPosition(
  element: HTMLTableCellElement,
): TngTableCellPosition | null {
  if (element.cellIndex < 0) {
    return null;
  }

  const rowElement = element.parentElement;
  if (!(rowElement instanceof HTMLTableRowElement) || rowElement.rowIndex < 0) {
    return null;
  }

  return Object.freeze({
    col: element.cellIndex,
    row: rowElement.rowIndex,
  });
}

function isInsideContainer(container: HTMLElement, value: unknown): value is Node {
  return value instanceof Node && container.contains(value);
}

function isFocusVisibleElement(value: Element): boolean {
  return value.matches(':focus-visible');
}

function hasTableKeyboardModifiers(event: KeyboardEvent): boolean {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
}

function hasInteractiveEventTarget(container: HTMLElement, target: unknown): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  const interactiveTarget = target.closest<HTMLElement>(tngTableInteractiveTargetSelector);
  return interactiveTarget !== null && interactiveTarget !== container && container.contains(interactiveTarget);
}

function resolveTngTablePageDirection(key: string): TngTablePageDirection | null {
  if (key === 'PageDown') {
    return 'forward';
  }

  if (key === 'PageUp') {
    return 'backward';
  }

  return null;
}

function normalizeCssLength(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}px`;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeTableLayoutMode(value: unknown): TngTableLayoutMode {
  return value === 'fixed' ? 'fixed' : 'auto';
}

function normalizeTableScrollAxis(value: unknown): TngTableScrollAxis {
  if (value === 'both' || value === 'y') {
    return value;
  }

  return 'x';
}

function normalizeTableStickySide(value: unknown): TngTableStickySide | null {
  return value === 'start' || value === 'end' ? value : null;
}

function resolveStickyPhysicalSide(
  side: TngTableStickySide,
  direction: TngTableDirection | null,
): 'left' | 'right' {
  if (side === 'start') {
    return direction === 'rtl' ? 'right' : 'left';
  }

  return direction === 'rtl' ? 'left' : 'right';
}

function normalizeTableDirection(value: unknown): TngTableDirection | null {
  if (value === 'ltr' || value === 'rtl') {
    return value;
  }

  return null;
}

export function resolveTngTableEmptyState(
  items: readonly unknown[] | null | undefined,
  loading: boolean,
): boolean {
  if (loading || items === null || items === undefined) {
    return false;
  }

  return items.length === 0;
}

function normalizeExpansionMode(value: unknown): TngTableRowExpansionMode {
  return value === 'single' ? 'single' : 'multiple';
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOptionalStringArray(value: readonly string[] | null | undefined): readonly string[] {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];
}

function normalizeSelectionMode(value: unknown): TngTableSelectionMode {
  return value === 'multiple' ? 'multiple' : 'single';
}

function normalizeBooleanOrNull(value: unknown): boolean | null {
  if (value === undefined || value === null) {
    return null;
  }

  return booleanAttribute(value);
}

@Directive({
  selector: 'thead[tngTableHeader]',
  exportAs: 'tngTableHeader',
})
export class TngTableHeader {
  public readonly sticky = input<boolean, boolean | string>(false, {
    alias: 'tngTableHeaderSticky',
    transform: booleanAttribute,
  });
  public readonly stickyOffset = input<string | null, unknown>(null, {
    alias: 'tngTableHeaderStickyOffset',
    transform: normalizeCssLength,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-header' as const;

  @HostBinding('attr.data-sticky')
  protected get dataStickyAttr(): '' | null {
    return this.isSticky() ? '' : null;
  }

  public getStickyInset(): string {
    return this.stickyOffset() ?? '0px';
  }

  public isSticky(): boolean {
    return this.sticky();
  }
}

@Directive({
  selector: 'tbody[tngTableBody]',
  exportAs: 'tngTableBody',
})
export class TngTableBody {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-body' as const;
}

@Directive({
  selector: 'tfoot[tngTableFooter]',
  exportAs: 'tngTableFooter',
})
export class TngTableFooter {
  public readonly sticky = input<boolean, boolean | string>(false, {
    alias: 'tngTableFooterSticky',
    transform: booleanAttribute,
  });
  public readonly stickyOffset = input<string | null, unknown>(null, {
    alias: 'tngTableFooterStickyOffset',
    transform: normalizeCssLength,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-footer' as const;

  @HostBinding('attr.data-sticky')
  protected get dataStickyAttr(): '' | null {
    return this.isSticky() ? '' : null;
  }

  public getStickyInset(): string {
    return this.stickyOffset() ?? '0px';
  }

  public isSticky(): boolean {
    return this.sticky();
  }
}

@Directive({
  selector: '[tngTableScrollContainer]',
  exportAs: 'tngTableScrollContainer',
})
export class TngTableScrollContainer {
  public readonly axis = input<TngTableScrollAxis, unknown>('x', {
    alias: 'tngTableScrollAxis',
    transform: normalizeTableScrollAxis,
  });
  public readonly dir = input<TngTableDirection | null, unknown>(null, {
    alias: 'dir',
    transform: normalizeTableDirection,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-scroll-container' as const;

  @HostBinding('attr.dir')
  protected get dirAttr(): TngTableDirection | null {
    return this.dir();
  }

  @HostBinding('attr.data-overflow-axis')
  protected get dataOverflowAxisAttr(): TngTableScrollAxis {
    return this.axis();
  }

  @HostBinding('style.display')
  protected readonly display = 'block';

  @HostBinding('style.max-width')
  protected readonly maxWidth = '100%';

  @HostBinding('style.direction')
  protected get directionStyleAttr(): TngTableDirection | null {
    return this.dir();
  }

  @HostBinding('style.overflow-x')
  protected get overflowXAttr(): 'auto' | 'hidden' {
    return this.axis() === 'x' || this.axis() === 'both' ? 'auto' : 'hidden';
  }

  @HostBinding('style.overflow-y')
  protected get overflowYAttr(): 'auto' | 'hidden' {
    return this.axis() === 'y' || this.axis() === 'both' ? 'auto' : 'hidden';
  }
}

@Directive({
  selector: 'table[tngTable][tngTableSelection]',
  exportAs: 'tngTableSelection',
})
export class TngTableSelection {
  private readonly rows = contentChildren(forwardRef(() => TngTableRow), {
    descendants: true,
  }) as Signal<readonly TngTableRow[]>;
  private uncontrolledAnchorId: string | null = null;
  private uncontrolledSelectedIds: readonly string[] = [];

  public readonly mode = input<TngTableSelectionMode, unknown>('single', {
    alias: 'tngTableSelectionMode',
    transform: normalizeSelectionMode,
  });
  public readonly selectedIds = input<readonly string[] | null | undefined>(undefined, {
    alias: 'tngTableSelectedIds',
  });

  public readonly selectionChange = output<TngTableSelectionChange>();

  @HostBinding('attr.data-selectable')
  protected readonly dataSelectable = '' as const;

  public clear(trigger: TngTableInteractionTrigger = 'programmatic'): TngTableRowSelectionState<string> {
    return this.commit(this.createController().clear(), null, trigger);
  }

  public isSelected(rowId: string): boolean {
    return this.createController().isSelected(rowId);
  }

  public replace(
    rowId: string,
    trigger: TngTableInteractionTrigger = 'programmatic',
  ): TngTableRowSelectionState<string> {
    return this.commit(this.createController().replace(rowId), rowId, trigger);
  }

  public selectAll(
    rowIds: readonly string[],
    trigger: TngTableInteractionTrigger = 'programmatic',
  ): TngTableRowSelectionState<string> {
    return this.commit(this.createController().selectAll(rowIds), rowIds[0] ?? null, trigger);
  }

  public toggle(
    rowId: string,
    trigger: TngTableInteractionTrigger = 'programmatic',
  ): TngTableRowSelectionState<string> {
    return this.commit(this.createController().toggle(rowId), rowId, trigger);
  }

  public toggleFromPointer(row: TngTableRow, event: MouseEvent): void {
    const rowId = row.rowId();
    if (rowId === null || row.isDisabled()) {
      return;
    }

    const controller = this.createController();
    const nextState = this.resolvePointerSelectionState(controller, rowId, event);

    this.commit(nextState, rowId, 'pointer');
  }

  private commit(
    nextState: TngTableRowSelectionState<string>,
    changedId: string | null,
    trigger: TngTableInteractionTrigger,
  ): TngTableRowSelectionState<string> {
    this.uncontrolledAnchorId = nextState.anchorId;

    if (this.selectedIds() === undefined) {
      this.uncontrolledSelectedIds = nextState.selectedIds;
    }

    this.selectionChange.emit(
      Object.freeze({
        anchorId: nextState.anchorId,
        changedId,
        selectedIds: nextState.selectedIds,
        trigger,
      }),
    );

    return nextState;
  }

  private createController(): ReturnType<typeof createTngRowSelectionController<string>> {
    return createTngRowSelectionController<string>({
      disabledIds: this.getDisabledRowIds(),
      initialAnchorId: this.getAnchorId(),
      initialSelectedIds: this.getCurrentSelectedIds(),
      mode: this.mode(),
    });
  }

  private getAnchorId(): string | null {
    const selectedIds = this.getCurrentSelectedIds();
    const lastSelectedId =
      selectedIds.length > 0 ? selectedIds[selectedIds.length - 1] ?? null : null;
    return this.uncontrolledAnchorId !== null && selectedIds.includes(this.uncontrolledAnchorId)
      ? this.uncontrolledAnchorId
      : lastSelectedId;
  }

  private getCurrentSelectedIds(): readonly string[] {
    const controlledSelectedIds = this.selectedIds();
    return controlledSelectedIds === undefined
      ? this.uncontrolledSelectedIds
      : normalizeOptionalStringArray(controlledSelectedIds);
  }

  private getDisabledRowIds(): readonly string[] {
    return this.rows()
      .filter((row) => row.isDisabled())
      .map((row) => row.rowId())
      .filter((rowId): rowId is string => rowId !== null);
  }

  private getOrderedRowIds(): readonly string[] {
    return this.rows()
      .map((row) => row.rowId())
      .filter((rowId): rowId is string => rowId !== null);
  }

  private resolvePointerSelectionState(
    controller: ReturnType<typeof createTngRowSelectionController<string>>,
    rowId: string,
    event: MouseEvent,
  ): TngTableRowSelectionState<string> {
    if (this.mode() !== 'multiple') {
      return controller.replace(rowId);
    }

    if (event.shiftKey) {
      return controller.selectRange(
        controller.getState().anchorId ?? rowId,
        rowId,
        this.getOrderedRowIds(),
      );
    }

    if (event.ctrlKey || event.metaKey) {
      return controller.toggle(rowId);
    }

    return controller.replace(rowId);
  }
}

@Directive({
  selector: 'table[tngTable][tngTableExpansion]',
  exportAs: 'tngTableExpansion',
})
export class TngTableExpansion {
  private uncontrolledExpandedIds: readonly string[] = [];

  public readonly expandedIds = input<readonly string[] | null | undefined>(undefined, {
    alias: 'tngTableExpandedIds',
  });
  public readonly mode = input<TngTableRowExpansionMode, unknown>('multiple', {
    alias: 'tngTableExpansionMode',
    transform: normalizeExpansionMode,
  });

  public readonly expansionChange = output<TngTableExpansionChange>();

  @HostBinding('attr.data-expandable')
  protected readonly dataExpandable = '' as const;

  public clear(trigger: TngTableInteractionTrigger = 'programmatic'): TngTableRowExpansionState<string> {
    const nextState = this.createController().clear();
    return this.commit(nextState, null, trigger);
  }

  public isExpanded(rowId: string): boolean {
    return this.createController().isExpanded(rowId);
  }

  public toggle(
    rowId: string,
    trigger: TngTableInteractionTrigger = 'programmatic',
  ): TngTableRowExpansionState<string> {
    const nextState = this.createController().toggle(rowId);
    return this.commit(nextState, rowId, trigger);
  }

  private commit(
    nextState: TngTableRowExpansionState<string>,
    rowId: string | null,
    trigger: TngTableInteractionTrigger,
  ): TngTableRowExpansionState<string> {
    if (this.expandedIds() === undefined) {
      this.uncontrolledExpandedIds = nextState.expandedIds;
    }

    if (rowId !== null) {
      this.expansionChange.emit(
        Object.freeze({
          expanded: nextState.expandedIds.includes(rowId),
          expandedIds: nextState.expandedIds,
          rowId,
          trigger,
        }),
      );
    }

    return nextState;
  }

  private createController(): ReturnType<typeof createTngRowExpansionController<string>> {
    return createTngRowExpansionController<string>({
      initialExpandedIds: this.getCurrentExpandedIds(),
      mode: this.mode(),
    });
  }

  private getCurrentExpandedIds(): readonly string[] {
    const controlledExpandedIds = this.expandedIds();
    return controlledExpandedIds === undefined
      ? this.uncontrolledExpandedIds
      : normalizeOptionalStringArray(controlledExpandedIds);
  }
}

@Directive({
  selector: 'tr[tngTableRow]',
  exportAs: 'tngTableRow',
})
export class TngTableRow {
  private readonly expansion = inject(forwardRef(() => TngTableExpansion), {
    optional: true,
  }) as TngTableExpansion | null;
  private readonly hostRef = inject<ElementRef<HTMLTableRowElement>>(ElementRef);
  private readonly selection = inject(forwardRef(() => TngTableSelection), {
    optional: true,
  }) as TngTableSelection | null;

  public readonly disabled = input<boolean, boolean | string>(false, {
    alias: 'tngTableRowDisabled',
    transform: booleanAttribute,
  });
  public readonly expanded = input<boolean | null, unknown>(null, {
    alias: 'tngTableRowExpanded',
    transform: normalizeBooleanOrNull,
  });
  public readonly rowId = input<string | null, unknown>(null, {
    alias: 'tngTableRowId',
    transform: normalizeOptionalString,
  });
  public readonly selected = input<boolean | null, unknown>(null, {
    alias: 'tngTableRowSelected',
    transform: normalizeBooleanOrNull,
  });

  public readonly rowClick = output<TngTableRowClickEvent>();
  public readonly rowContextMenu = output<TngTableRowContextMenuEvent>();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-row' as const;

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): string | null {
    return this.isDisabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-selected')
  protected get ariaSelectedAttr(): string | null {
    if (this.selected() === null && this.selection === null) {
      return null;
    }

    return this.isSelected() ? 'true' : 'false';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.data-expanded')
  protected get dataExpandedAttr(): '' | null {
    return this.isExpanded() ? '' : null;
  }

  @HostBinding('attr.data-row-id')
  protected get dataRowIdAttr(): string | null {
    return this.rowId();
  }

  @HostBinding('attr.data-selected')
  protected get dataSelectedAttr(): '' | null {
    return this.isSelected() ? '' : null;
  }

  public isDisabled(): boolean {
    return this.disabled();
  }

  public isExpanded(): boolean {
    const expanded = this.expanded();
    if (expanded !== null) {
      return expanded;
    }

    const rowId = this.rowId();
    return rowId !== null && this.expansion?.isExpanded(rowId) === true;
  }

  public isSelected(): boolean {
    const selected = this.selected();
    if (selected !== null) {
      return selected;
    }

    const rowId = this.rowId();
    return rowId !== null && this.selection?.isSelected(rowId) === true;
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (
      this.isDisabled()
      || event.defaultPrevented
      || hasInteractiveEventTarget(this.hostRef.nativeElement, event.target)
    ) {
      return;
    }

    this.selection?.toggleFromPointer(this, event);
    this.rowClick.emit(
      Object.freeze({
        originalEvent: event,
        rowId: this.rowId(),
      }),
    );
  }

  @HostListener('contextmenu', ['$event'])
  protected onContextMenu(event: MouseEvent): void {
    if (this.isDisabled()) {
      return;
    }

    this.rowContextMenu.emit(
      Object.freeze({
        originalEvent: event,
        rowId: this.rowId(),
      }),
    );
  }
}

@Directive({
  selector: 'td[tngTableCell]',
  exportAs: 'tngTableCell',
})
export class TngTableCell implements OnDestroy, OnInit {
  private readonly footer = inject(TngTableFooter, {
    optional: true,
  });
  private readonly hostRef = inject<ElementRef<HTMLTableCellElement>>(ElementRef);
  private readonly row = inject(TngTableRow, {
    optional: true,
  });
  private readonly table = inject(forwardRef(() => TngTable)) as TngTable;

  public readonly cellClick = output<TngTableCellClickEvent>();
  public readonly columnId = input<string | null, unknown>(null, {
    alias: 'tngTableColumnId',
    transform: normalizeOptionalString,
  });
  public readonly headers = input<string | null, unknown>(null, {
    alias: 'tngTableHeaders',
    transform: normalizeOptionalString,
  });
  public readonly stickyColumn = input<TngTableStickySide | null, unknown>(null, {
    alias: 'tngTableStickyColumn',
    transform: normalizeTableStickySide,
  });
  public readonly stickyOffset = input<string | null, unknown>(null, {
    alias: 'tngTableStickyOffset',
    transform: normalizeCssLength,
  });
  public readonly truncate = input<boolean, boolean | string>(false, {
    alias: 'tngTableTruncate',
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-cell' as const;

  @HostBinding('attr.data-column-id')
  protected get dataColumnIdAttr(): string | null {
    return this.columnId();
  }

  @HostBinding('attr.data-row-id')
  protected get dataRowIdAttr(): string | null {
    return this.row?.rowId() ?? null;
  }

  @HostBinding('attr.headers')
  protected get headersAttr(): string | null {
    return this.headers();
  }

  @HostBinding('attr.data-sticky')
  protected get dataStickyAttr(): '' | null {
    return this.isSectionSticky() || this.getStickySide() !== null ? '' : null;
  }

  @HostBinding('attr.data-sticky-footer')
  protected get dataStickyFooterAttr(): '' | null {
    return this.footer?.isSticky() === true ? '' : null;
  }

  @HostBinding('attr.data-sticky-side')
  protected get dataStickySideAttr(): TngTableStickySide | null {
    return this.getStickySide();
  }

  @HostBinding('attr.data-truncate')
  protected get dataTruncateAttr(): '' | null {
    return this.truncate() ? '' : null;
  }

  @HostBinding('attr.tabindex')
  protected get tabIndexAttr(): string {
    return this.table.getCellTabIndex(this);
  }

  @HostBinding('style.bottom')
  protected get bottomAttr(): string | null {
    return this.footer?.isSticky() === true ? this.footer.getStickyInset() : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): '' | null {
    return this.table.isCellFocused(this) ? '' : null;
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisibleAttr(): '' | null {
    return this.table.isCellFocusVisible(this) ? '' : null;
  }

  @HostBinding('style.left')
  protected get leftAttr(): string | null {
    return this.table.getCellStickyInset(this, 'left');
  }

  @HostBinding('style.overflow')
  protected get overflowAttr(): 'hidden' | null {
    return this.truncate() ? 'hidden' : null;
  }

  @HostBinding('style.position')
  protected get positionAttr(): 'sticky' | null {
    return this.table.getCellStickyPosition(this);
  }

  @HostBinding('style.right')
  protected get rightAttr(): string | null {
    return this.table.getCellStickyInset(this, 'right');
  }

  @HostBinding('style.text-overflow')
  protected get textOverflowAttr(): 'ellipsis' | null {
    return this.truncate() ? 'ellipsis' : null;
  }

  @HostBinding('style.white-space')
  protected get whiteSpaceAttr(): 'nowrap' | null {
    return this.truncate() ? 'nowrap' : null;
  }

  @HostBinding('style.z-index')
  protected get zIndexAttr(): string | null {
    return this.table.getCellStickyZIndex(this);
  }

  public ngOnDestroy(): void {
    this.table.onCellDestroy(this);
  }

  public ngOnInit(): void {
    this.table.registerCell(this);
  }

  public cellKey(): string | null {
    const position = this.getCellPosition();
    return position === null ? null : createTngTableCellKey(position);
  }

  public focusHost(): void {
    this.hostRef.nativeElement.focus();
  }

  public getCellPosition(): TngTableCellPosition | null {
    return resolveTngTableCellPosition(this.hostRef.nativeElement);
  }

  public getHostElement(): HTMLTableCellElement {
    return this.hostRef.nativeElement;
  }

  public getStickyOffset(): string | null {
    return this.stickyOffset();
  }

  public getStickySide(): TngTableStickySide | null {
    return this.stickyColumn();
  }

  public isDisabled(): boolean {
    return this.row?.isDisabled() === true;
  }

  public isFocusVisible(): boolean {
    return isFocusVisibleElement(this.hostRef.nativeElement);
  }

  public isSectionSticky(): boolean {
    return this.footer?.isSticky() === true;
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (
      this.isDisabled()
      || event.defaultPrevented
      || hasInteractiveEventTarget(this.hostRef.nativeElement, event.target)
    ) {
      return;
    }

    this.cellClick.emit(
      Object.freeze({
        columnId: this.columnId(),
        originalEvent: event,
        rowId: this.row?.rowId() ?? null,
      }),
    );
  }

  @HostListener('focus')
  protected onFocus(): void {
    this.table.onCellFocused(this);
  }

  @HostListener('pointerdown')
  protected onPointerDown(): void {
    this.table.onCellPointerDown(this);
  }
}

@Directive({
  selector: 'th[tngTableHeaderCell]',
  exportAs: 'tngTableHeaderCell',
})
export class TngTableHeaderCell implements OnDestroy, OnInit {
  private readonly header = inject(TngTableHeader, {
    optional: true,
  });
  private readonly hostRef = inject<ElementRef<HTMLTableCellElement>>(ElementRef);
  private readonly table = inject(forwardRef(() => TngTable)) as TngTable;

  public readonly columnId = input<string | null, unknown>(null, {
    alias: 'tngTableColumnId',
    transform: normalizeOptionalString,
  });
  public readonly stickyColumn = input<TngTableStickySide | null, unknown>(null, {
    alias: 'tngTableStickyColumn',
    transform: normalizeTableStickySide,
  });
  public readonly stickyOffset = input<string | null, unknown>(null, {
    alias: 'tngTableStickyOffset',
    transform: normalizeCssLength,
  });
  public readonly truncate = input<boolean, boolean | string>(false, {
    alias: 'tngTableTruncate',
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-header-cell' as const;

  @HostBinding('attr.data-column-id')
  protected get dataColumnIdAttr(): string | null {
    return this.columnId();
  }

  @HostBinding('attr.data-sticky')
  protected get dataStickyAttr(): '' | null {
    return this.isSectionSticky() || this.getStickySide() !== null ? '' : null;
  }

  @HostBinding('attr.data-sticky-header')
  protected get dataStickyHeaderAttr(): '' | null {
    return this.header?.isSticky() === true ? '' : null;
  }

  @HostBinding('attr.data-sticky-side')
  protected get dataStickySideAttr(): TngTableStickySide | null {
    return this.getStickySide();
  }

  @HostBinding('attr.data-truncate')
  protected get dataTruncateAttr(): '' | null {
    return this.truncate() ? '' : null;
  }

  @HostBinding('attr.tabindex')
  protected get tabIndexAttr(): string {
    return this.table.getCellTabIndex(this);
  }

  @HostBinding('style.left')
  protected get leftAttr(): string | null {
    return this.table.getCellStickyInset(this, 'left');
  }

  @HostBinding('style.overflow')
  protected get overflowAttr(): 'hidden' | null {
    return this.truncate() ? 'hidden' : null;
  }

  @HostBinding('style.position')
  protected get positionAttr(): 'sticky' | null {
    return this.table.getCellStickyPosition(this);
  }

  @HostBinding('style.right')
  protected get rightAttr(): string | null {
    return this.table.getCellStickyInset(this, 'right');
  }

  @HostBinding('style.text-overflow')
  protected get textOverflowAttr(): 'ellipsis' | null {
    return this.truncate() ? 'ellipsis' : null;
  }

  @HostBinding('style.top')
  protected get topAttr(): string | null {
    return this.header?.isSticky() === true ? this.header.getStickyInset() : null;
  }

  @HostBinding('style.white-space')
  protected get whiteSpaceAttr(): 'nowrap' | null {
    return this.truncate() ? 'nowrap' : null;
  }

  @HostBinding('style.z-index')
  protected get zIndexAttr(): string | null {
    return this.table.getCellStickyZIndex(this);
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): '' | null {
    return this.table.isCellFocused(this) ? '' : null;
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisibleAttr(): '' | null {
    return this.table.isCellFocusVisible(this) ? '' : null;
  }

  public ngOnDestroy(): void {
    this.table.onCellDestroy(this);
  }

  public ngOnInit(): void {
    this.table.registerCell(this);
  }

  public cellKey(): string | null {
    const position = this.getCellPosition();
    return position === null ? null : createTngTableCellKey(position);
  }

  public focusHost(): void {
    this.hostRef.nativeElement.focus();
  }

  public getCellPosition(): TngTableCellPosition | null {
    return resolveTngTableCellPosition(this.hostRef.nativeElement);
  }

  public getHostElement(): HTMLTableCellElement {
    return this.hostRef.nativeElement;
  }

  public getStickyOffset(): string | null {
    return this.stickyOffset();
  }

  public getStickySide(): TngTableStickySide | null {
    return this.stickyColumn();
  }

  public isDisabled(): boolean {
    return false;
  }

  public isFocusVisible(): boolean {
    return isFocusVisibleElement(this.hostRef.nativeElement);
  }

  public isSectionSticky(): boolean {
    return this.header?.isSticky() === true;
  }

  @HostListener('focus')
  protected onFocus(): void {
    this.table.onCellFocused(this);
  }

  @HostListener('pointerdown')
  protected onPointerDown(): void {
    this.table.onCellPointerDown(this);
  }
}

@Directive({
  selector: '[tngTableEmpty]',
  exportAs: 'tngTableEmpty',
})
export class TngTableEmpty {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-empty' as const;
}

@Directive({
  selector: '[tngTableLoading]',
  exportAs: 'tngTableLoading',
})
export class TngTableLoading {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-loading' as const;
}

@Directive({
  selector: '[tngTableError]',
  exportAs: 'tngTableError',
})
export class TngTableError {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-error' as const;
}

@Directive({
  selector: '[tngTableToolbar]',
  exportAs: 'tngTableToolbar',
})
export class TngTableToolbar {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-toolbar' as const;
}

@Directive({
  selector: '[tngTablePagination]',
  exportAs: 'tngTablePagination',
})
export class TngTablePagination {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-pagination' as const;
}

@Directive({
  selector: '[tngTableRowExpander]',
  exportAs: 'tngTableRowExpander',
})
export class TngTableRowExpander {
  private readonly expansion = inject(forwardRef(() => TngTableExpansion), {
    optional: true,
  }) as TngTableExpansion | null;
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public readonly rowId = input.required<string>({
    alias: 'tngTableRowExpander',
  });

  @HostBinding('attr.aria-expanded')
  protected get ariaExpandedAttr(): string | null {
    if (this.expansion === null) {
      return null;
    }

    return this.expansion.isExpanded(this.rowId()) ? 'true' : 'false';
  }

  @HostBinding('attr.data-expanded')
  protected get dataExpandedAttr(): '' | null {
    return this.expansion?.isExpanded(this.rowId()) ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-row-expander' as const;

  @HostListener('click')
  protected onClick(): void {
    this.toggle('pointer');
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngTableKeydownEvent): void {
    if (this.isNativeButton()) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.toggle('keyboard');
  }

  private isNativeButton(): boolean {
    return this.hostRef.nativeElement.tagName === 'BUTTON';
  }

  private toggle(trigger: TngTableInteractionTrigger): void {
    this.expansion?.toggle(this.rowId(), trigger);
  }
}

@Directive({
  selector: 'table[tngTable]',
  exportAs: 'tngTable',
})
export class TngTable implements OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLTableElement>>(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly headerSlots = contentChildren(TngTableHeader);
  private readonly footerSlots = contentChildren(TngTableFooter);
  private readonly cells = new Set<TngTableFocusableCell>();

  private activeCell: TngTableFocusableCell | null = null;
  private domFocusedCell: TngTableFocusableCell | null = null;
  private focusVisibleCell: TngTableFocusableCell | null = null;
  private pendingFocusTrigger: TngTableInteractionTrigger | null = null;
  private restoreFocusElement: HTMLElement | null = null;
  private shouldRestoreFocusOnDestroy = false;

  public readonly items = input<readonly unknown[] | null | undefined>(undefined);
  public readonly error = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly filterable = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly layout = input<TngTableLayoutMode, unknown>('auto', {
    alias: 'tngTableLayout',
    transform: normalizeTableLayoutMode,
  });
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly pageable = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly rowId = input<TngTableRowIdResolver | null>(null);
  public readonly dir = input<TngTableDirection | null, unknown>(null, {
    transform: normalizeTableDirection,
  });
  private ariaLabelValue: string | null = null;
  private ariaLabelledbyValue: string | null = null;

  @Input()
  public set ariaLabel(value: string | null) {
    this.ariaLabelValue = normalizeOptionalString(value);
  }

  @Input()
  public set ariaLabelledby(value: string | null) {
    this.ariaLabelledbyValue = normalizeOptionalString(value);
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table' as const;

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    return this.ariaLabelValue;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledbyAttr(): string | null {
    return this.ariaLabelledbyValue;
  }

  @HostBinding('attr.data-empty')
  protected get dataEmptyAttr(): '' | null {
    return resolveTngTableEmptyState(this.items(), this.loading()) ? '' : null;
  }

  @HostBinding('attr.data-error')
  protected get dataErrorAttr(): '' | null {
    return this.error() ? '' : null;
  }

  @HostBinding('attr.data-filterable')
  protected get dataFilterableAttr(): '' | null {
    return this.filterable() ? '' : null;
  }

  @HostBinding('attr.data-has-footer')
  protected get dataHasFooterAttr(): '' | null {
    return this.footerSlots().length > 0 ? '' : null;
  }

  @HostBinding('attr.data-has-header')
  protected get dataHasHeaderAttr(): '' | null {
    return this.headerSlots().length > 0 ? '' : null;
  }

  @HostBinding('attr.data-layout')
  protected get dataLayoutAttr(): TngTableLayoutMode {
    return this.layout();
  }

  @HostBinding('attr.data-loading')
  protected get dataLoadingAttr(): '' | null {
    return this.loading() ? '' : null;
  }

  @HostBinding('attr.data-pageable')
  protected get dataPageableAttr(): '' | null {
    return this.pageable() ? '' : null;
  }

  @HostBinding('attr.dir')
  protected get dirAttr(): TngTableDirection | null {
    return this.dir();
  }

  @HostBinding('style.table-layout')
  protected get tableLayoutAttr(): TngTableLayoutMode {
    return this.layout();
  }

  public ngOnDestroy(): void {
    const activeElement = this.hostRef.nativeElement.ownerDocument.activeElement;
    const restoreFocusElement = this.getRestoreFocusElement();
    const shouldRestoreFocus =
      restoreFocusElement !== null
      && (
        this.shouldRestoreFocusOnDestroy
        || this.domFocusedCell !== null
        || isInsideContainer(this.hostRef.nativeElement, activeElement)
      );
    if (shouldRestoreFocus) {
      restoreFocusElement.focus();
      queueMicrotask(() => {
        if (restoreFocusElement.isConnected) {
          restoreFocusElement.focus();
        }
      });
    }

    this.cells.clear();
    this.activeCell = null;
    this.domFocusedCell = null;
    this.focusVisibleCell = null;
    this.pendingFocusTrigger = null;
    this.restoreFocusElement = null;
    this.shouldRestoreFocusOnDestroy = false;
  }

  constructor() {
    afterEveryRender(() => {
      const prev = this.activeCell;
      this.ensureFallbackActiveCell();
      if (this.activeCell !== prev) {
        this.cdr.markForCheck();
      }
    });
  }

  public getCellTabIndex(cell: TngTableFocusableCell): string {
    if (this.isCellDisabled(cell)) {
      return '-1';
    }

    return this.getActiveCell() === cell ? '0' : '-1';
  }

  public isCellFocusVisible(cell: TngTableFocusableCell): boolean {
    return this.focusVisibleCell === cell;
  }

  public isCellFocused(cell: TngTableFocusableCell): boolean {
    return this.domFocusedCell === cell;
  }

  public getCellStickyInset(
    cell: TngTableFocusableCell,
    physicalSide: 'left' | 'right',
  ): string | null {
    const stickySide = cell.getStickySide();
    if (stickySide === null || resolveStickyPhysicalSide(stickySide, this.dir()) !== physicalSide) {
      return null;
    }

    return cell.getStickyOffset() ?? '0px';
  }

  public getCellStickyPosition(cell: TngTableFocusableCell): 'sticky' | null {
    return cell.isSectionSticky() || cell.getStickySide() !== null ? 'sticky' : null;
  }

  public getCellStickyZIndex(cell: TngTableFocusableCell): string | null {
    if (cell.isSectionSticky() && cell.getStickySide() !== null) {
      return '4';
    }

    if (cell.isSectionSticky()) {
      return '3';
    }

    return cell.getStickySide() !== null ? '2' : null;
  }

  public onCellFocused(cell: TngTableFocusableCell): void {
    if (this.isCellDisabled(cell)) {
      return;
    }

    const trigger = this.pendingFocusTrigger ?? 'programmatic';
    this.pendingFocusTrigger = null;
    this.activeCell = cell;
    this.domFocusedCell = cell;
    this.focusVisibleCell =
      trigger === 'keyboard' || cell.isFocusVisible()
        ? cell
        : null;
  }

  public onCellDestroy(cell: TngTableFocusableCell): void {
    if (
      this.domFocusedCell === cell
      || this.hostRef.nativeElement.ownerDocument.activeElement === cell.getHostElement()
    ) {
      this.shouldRestoreFocusOnDestroy = true;
    }

    this.unregisterCell(cell);
  }

  public onCellPointerDown(cell: TngTableFocusableCell): void {
    if (this.isCellDisabled(cell)) {
      return;
    }

    this.pendingFocusTrigger = 'pointer';
    this.focusVisibleCell = null;
  }

  public registerCell(cell: TngTableFocusableCell): void {
    this.cells.add(cell);
    this.ensureFallbackActiveCell();
  }

  public unregisterCell(cell: TngTableFocusableCell): void {
    this.cells.delete(cell);

    if (this.activeCell === cell) {
      this.activeCell = null;
    }

    if (this.domFocusedCell === cell) {
      this.domFocusedCell = null;
    }

    if (this.focusVisibleCell === cell) {
      this.focusVisibleCell = null;
    }
  }

  @HostListener('focusin', ['$event'])
  protected onFocusIn(event: FocusEvent): void {
    if (isInsideContainer(this.hostRef.nativeElement, event.relatedTarget)) {
      return;
    }

    if (event.relatedTarget instanceof HTMLElement) {
      this.restoreFocusElement = event.relatedTarget;
    }
  }

  @HostListener('focusout', ['$event'])
  protected onFocusOut(event: FocusEvent): void {
    if (isInsideContainer(this.hostRef.nativeElement, event.relatedTarget)) {
      return;
    }

    this.domFocusedCell = null;
    this.focusVisibleCell = null;
    this.pendingFocusTrigger = null;
  }

  @HostListener('keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    const activeCell = this.getKeydownActiveCell(event);
    if (activeCell === null) {
      return;
    }

    if (this.handleEscapeKey(event)) {
      return;
    }

    if (this.handlePageNavigation(event, activeCell)) {
      return;
    }

    const action = resolveGridNavigationKeyAction(event, {
      direction: this.dir() ?? 'ltr',
    });
    if (action === null || !isMovementActionType(action.type)) {
      return;
    }

    if (action.preventDefault) {
      event.preventDefault();
    }

    this.moveFocus(activeCell, action.type);
  }

  private ensureFallbackActiveCell(): void {
    if (this.activeCell !== null && this.cells.has(this.activeCell) && !this.isCellDisabled(this.activeCell)) {
      return;
    }

    this.activeCell = this.getFirstEnabledCell();
  }

  private findCellByPosition(position: TngTableCellPosition): TngTableFocusableCell | null {
    for (const cell of this.cells) {
      const candidate = cell.getCellPosition();
      if (candidate?.row === position.row && candidate.col === position.col) {
        return cell;
      }
    }

    return null;
  }

  private focusCell(
    cell: TngTableFocusableCell,
    trigger: TngTableInteractionTrigger,
  ): void {
    this.activeCell = cell;
    this.pendingFocusTrigger = trigger;

    if (trigger === 'keyboard') {
      this.focusVisibleCell = cell;
    }

    cell.focusHost();
  }

  private getActiveCell(): TngTableFocusableCell | null {
    return this.activeCell;
  }

  private getBoundaryCell(
    cells: readonly TngTableFocusableCell[],
    direction: TngTablePageDirection,
  ): TngTableFocusableCell | null {
    return direction === 'forward'
      ? cells[cells.length - 1] ?? null
      : cells[0] ?? null;
  }

  private getComputedBounds(): Readonly<{ colCount: number; rowCount: number }> {
    let maxCol = 0;
    let maxRow = 0;

    for (const cell of this.cells) {
      const position = cell.getCellPosition();
      if (position === null) {
        continue;
      }

      maxCol = Math.max(maxCol, position.col);
      maxRow = Math.max(maxRow, position.row);
    }

    return Object.freeze({
      colCount: maxCol + 1,
      rowCount: maxRow + 1,
    });
  }

  private getEnabledCells(): readonly TngTableFocusableCell[] {
    return [...this.cells]
      .filter((cell) => !this.isCellDisabled(cell) && cell.getCellPosition() !== null)
      .sort((a, b) => {
        const aPosition = a.getCellPosition();
        const bPosition = b.getCellPosition();
        if (aPosition === null && bPosition === null) {
          return 0;
        }

        if (aPosition === null) {
          return 1;
        }

        if (bPosition === null) {
          return -1;
        }

        return compareTngTableCellPositions(aPosition, bPosition);
      });
  }

  private getFirstEnabledCell(): TngTableFocusableCell | null {
    return this.getEnabledCells()[0] ?? null;
  }

  private getNavigableCells(): readonly TngGridNavigableCell[] {
    const navigableCells: TngGridNavigableCell[] = [];

    for (const cell of this.cells) {
      const position = cell.getCellPosition();
      if (position === null) {
        continue;
      }

      navigableCells.push({
        col: position.col,
        disabled: this.isCellDisabled(cell),
        row: position.row,
      });
    }

    return navigableCells;
  }

  private getKeydownActiveCell(event: KeyboardEvent): TngTableFocusableCell | null {
    const activeCell = this.getActiveCell();
    if (activeCell === null || this.isCellDisabled(activeCell)) {
      return null;
    }

    return event.target === activeCell.getHostElement() ? activeCell : null;
  }

  private getRestoreFocusElement(): HTMLElement | null {
    if (!this.restoreFocusElement?.isConnected) {
      return null;
    }

    return this.hostRef.nativeElement.contains(this.restoreFocusElement)
      ? null
      : this.restoreFocusElement;
  }

  private handleEscapeKey(event: KeyboardEvent): boolean {
    if (event.key !== 'Escape' || hasTableKeyboardModifiers(event)) {
      return false;
    }

    event.preventDefault();

    const restoreFocusElement = this.getRestoreFocusElement();
    if (restoreFocusElement !== null) {
      this.pendingFocusTrigger = 'programmatic';
      restoreFocusElement.focus();
      return true;
    }

    const activeElement = this.hostRef.nativeElement.ownerDocument.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }

    return true;
  }

  private handlePageNavigation(
    event: KeyboardEvent,
    activeCell: TngTableFocusableCell,
  ): boolean {
    const direction = resolveTngTablePageDirection(event.key);
    if (direction === null || hasTableKeyboardModifiers(event)) {
      return false;
    }

    const currentPosition = activeCell.getCellPosition();
    const enabledCells = this.getEnabledCells();
    if (currentPosition === null || enabledCells.length === 0) {
      return true;
    }

    event.preventDefault();

    const sameColumnCells = enabledCells.filter((cell) => {
      const position = cell.getCellPosition();
      return position !== null && position.col === currentPosition.col;
    });
    const targetCell = this.getBoundaryCell(sameColumnCells, direction)
      ?? this.getBoundaryCell(enabledCells, direction);

    if (targetCell !== null) {
      this.focusCell(targetCell, 'keyboard');
    }

    return true;
  }

  private isCellDisabled(cell: TngTableFocusableCell): boolean {
    return cell.isDisabled();
  }

  private moveFocus(
    activeCell: TngTableFocusableCell,
    actionType: TngTableMovementActionType,
  ): void {
    const currentPosition = activeCell.getCellPosition();
    if (currentPosition === null) {
      return;
    }

    const nextPosition = resolveNavigableGridCell(currentPosition, actionType, {
      bounds: this.getComputedBounds(),
      cells: this.getNavigableCells(),
    });
    if (nextPosition === null) {
      return;
    }

    const nextCell = this.findCellByPosition(nextPosition);
    if (nextCell === null || this.isCellDisabled(nextCell)) {
      return;
    }

    this.focusCell(nextCell, 'keyboard');
  }
}
