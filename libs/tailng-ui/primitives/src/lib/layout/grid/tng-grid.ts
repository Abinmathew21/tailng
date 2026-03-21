import type {
  OnDestroy,
  OnInit} from '@angular/core';
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import {
  resolveGridNavigationKeyAction,
  resolveNavigableGridCell,
  type TngGridCellPosition,
  type TngGridNavigableCell,
  type TngGridNavigationActionType,
} from '@tailng-ui/cdk';

export type TngGridDirection = 'ltr' | 'rtl';
export type TngGridSelectionMode = 'none' | 'single';
export type TngGridCellRole = 'columnheader' | 'gridcell' | 'rowheader';
export type TngGridInteractionTrigger = 'keyboard' | 'pointer' | 'programmatic';
export type TngGridCellValue = Readonly<TngGridCellPosition>;

export type TngGridFocusChangeEvent = Readonly<{
  col: number;
  previousCol: number | null;
  previousRow: number | null;
  row: number;
  trigger: TngGridInteractionTrigger;
}>;

export type TngGridActivateEvent = Readonly<{
  col: number;
  row: number;
  trigger: Extract<TngGridInteractionTrigger, 'keyboard' | 'pointer'>;
}>;

type TngGridNullablePosition = TngGridCellValue | null;

function coerceFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeIndex(value: unknown): number {
  return Math.max(0, Math.trunc(coerceFiniteNumber(value) ?? 0));
}

function normalizeOptionalIndex(value: unknown): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === '') {
    return null;
  }

  const numberValue = coerceFiniteNumber(value);
  if (numberValue === null) {
    return null;
  }

  return Math.max(0, Math.trunc(numberValue));
}

function normalizeCount(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const numberValue = coerceFiniteNumber(value);
  if (numberValue === null) {
    return null;
  }

  return Math.max(1, Math.trunc(numberValue));
}

function normalizeSpan(value: unknown): number {
  return Math.max(1, Math.trunc(coerceFiniteNumber(value) ?? 1));
}

function normalizeDirection(value: unknown): TngGridDirection {
  return value === 'rtl' ? 'rtl' : 'ltr';
}

function normalizeSelectionMode(value: unknown): TngGridSelectionMode {
  return value === 'single' ? 'single' : 'none';
}

function normalizeCellRole(value: unknown): TngGridCellRole {
  if (value === 'rowheader' || value === 'columnheader') {
    return value;
  }

  return 'gridcell';
}

function normalizeGridValueInput(value: unknown): TngGridCellValue | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'object' && value !== null && 'row' in value && 'col' in value) {
    const row = normalizeOptionalIndex((value as { row: unknown }).row);
    const col = normalizeOptionalIndex((value as { col: unknown }).col);
    if (row === undefined || row === null || col === undefined || col === null) {
      return null;
    }

    return Object.freeze({ col, row });
  }

  return null;
}

function createCellKey(value: TngGridCellValue): string {
  return `${value.row}:${value.col}`;
}

function compareCellValues(a: TngGridCellValue, b: TngGridCellValue): number {
  if (a.row !== b.row) {
    return a.row - b.row;
  }

  return a.col - b.col;
}

function positionsEqual(a: TngGridNullablePosition, b: TngGridNullablePosition): boolean {
  if (a === null || b === null) {
    return a === b;
  }

  return a.row === b.row && a.col === b.col;
}

function focusChangeEvent(
  current: TngGridCellValue,
  previous: TngGridNullablePosition,
  trigger: TngGridInteractionTrigger,
): TngGridFocusChangeEvent {
  return Object.freeze({
    col: current.col,
    previousCol: previous?.col ?? null,
    previousRow: previous?.row ?? null,
    row: current.row,
    trigger,
  });
}

@Directive({
  selector: '[tngGrid]',
  exportAs: 'tngGrid',
})
export class TngGrid implements OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cells = new Set<TngGridCell>();
  private readonly cellByKey = new Map<string, TngGridCell>();

  private uncontrolledFocus: TngGridNullablePosition = null;
  private uncontrolledSelection: TngGridNullablePosition = null;
  private selectionInitialized = false;
  private ariaLabelValue: string | null = null;
  private ariaColcountValue: number | null = null;
  private ariaRowcountValue: number | null = null;
  private domFocusedKey: string | null = null;
  private focusVisibleKey: string | null = null;
  private lastActivatedKey: string | null = null;
  private pendingFocusTrigger: TngGridInteractionTrigger | null = null;

  public readonly dir = input<TngGridDirection, unknown>('ltr', {
    transform: normalizeDirection,
  });
  public readonly focusCol = input<number | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalIndex,
  });
  public readonly focusRow = input<number | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalIndex,
  });
  public readonly selectionMode = input<TngGridSelectionMode, unknown>('none', {
    transform: normalizeSelectionMode,
  });
  public readonly value = input<TngGridNullablePosition | undefined, unknown>(undefined, {
    transform: normalizeGridValueInput,
  });
  public readonly defaultValue = input<TngGridNullablePosition | undefined, unknown>(undefined, {
    transform: normalizeGridValueInput,
  });
  public readonly wrap = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  public readonly focusRowChange = output<number | null>();
  public readonly focusColChange = output<number | null>();
  public readonly focusChange = output<TngGridFocusChangeEvent>();
  public readonly valueChange = output<TngGridNullablePosition>();
  public readonly cellActivate = output<TngGridActivateEvent>();

  @Input()
  public set ariaLabel(value: string | null) {
    this.ariaLabelValue = value;
  }

  @Input()
  public set ariaColcount(value: unknown) {
    this.ariaColcountValue = normalizeCount(value);
  }

  @Input()
  public set ariaRowcount(value: unknown) {
    this.ariaRowcountValue = normalizeCount(value);
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'grid' as const;

  @HostBinding('attr.role')
  protected readonly role = 'grid' as const;

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    return this.ariaLabelValue;
  }

  @HostBinding('attr.aria-colcount')
  protected get ariaColcountAttr(): string | null {
    const explicitCount = this.ariaColcountValue;
    if (explicitCount !== null) {
      return String(explicitCount);
    }

    const computedCount = this.getComputedBounds().colCount;
    return this.cells.size > 0 ? String(computedCount) : null;
  }

  @HostBinding('attr.aria-rowcount')
  protected get ariaRowcountAttr(): string | null {
    const explicitCount = this.ariaRowcountValue;
    if (explicitCount !== null) {
      return String(explicitCount);
    }

    const computedCount = this.getComputedBounds().rowCount;
    return this.cells.size > 0 ? String(computedCount) : null;
  }

  public ngOnDestroy(): void {
    this.cells.clear();
    this.cellByKey.clear();
  }

  public registerCell(cell: TngGridCell): void {
    this.cells.add(cell);
    this.cellByKey.set(cell.cellKey(), cell);
    this.ensureUncontrolledSelectionInitialized();
    this.ensureFallbackFocus();
  }

  public unregisterCell(cell: TngGridCell): void {
    this.cells.delete(cell);
    this.cellByKey.delete(cell.cellKey());

    if (this.lastActivatedKey === cell.cellKey()) {
      this.lastActivatedKey = null;
    }

    if (this.focusVisibleKey === cell.cellKey()) {
      this.focusVisibleKey = null;
    }

    if (this.domFocusedKey === cell.cellKey()) {
      this.domFocusedKey = null;
    }

    if (
      !this.isFocusControlled()
      && this.uncontrolledFocus !== null
      && createCellKey(this.uncontrolledFocus) === cell.cellKey()
    ) {
      this.uncontrolledFocus = null;
    }

    if (
      !this.isSelectionControlled()
      && this.uncontrolledSelection !== null
      && createCellKey(this.uncontrolledSelection) === cell.cellKey()
    ) {
      this.uncontrolledSelection = null;
    }

    this.ensureFallbackFocus();
  }

  public isCellActivated(cell: TngGridCell): boolean {
    return this.lastActivatedKey === cell.cellKey();
  }

  public isCellDisabled(cell: TngGridCell): boolean {
    return cell.disabled();
  }

  public isCellFocusVisible(cell: TngGridCell): boolean {
    return this.focusVisibleKey === cell.cellKey();
  }

  public isCellFocused(cell: TngGridCell): boolean {
    return this.domFocusedKey === cell.cellKey();
  }

  public isCellTabStop(cell: TngGridCell): boolean {
    const active = this.getActiveCell();
    return active !== null && active.cellKey() === cell.cellKey();
  }

  public isCellSelected(cell: TngGridCell): boolean {
    const explicitSelected = cell.selected();
    if (explicitSelected !== null) {
      return explicitSelected;
    }

    const selectedValue = this.getSelectedValue();
    return selectedValue !== null && cell.matchesValue(selectedValue);
  }

  public getCellTabIndex(cell: TngGridCell): string {
    if (this.isCellDisabled(cell)) {
      return '-1';
    }

    return this.isCellTabStop(cell) ? '0' : '-1';
  }

  public onCellClicked(cell: TngGridCell): void {
    if (this.isCellDisabled(cell)) {
      return;
    }

    if (this.selectionMode() === 'single') {
      this.requestSelection(cell.getValue());
    }
  }

  public onCellFocused(cell: TngGridCell): void {
    if (this.isCellDisabled(cell)) {
      return;
    }

    const trigger = this.pendingFocusTrigger ?? 'programmatic';
    this.pendingFocusTrigger = null;
    this.domFocusedKey = cell.cellKey();
    this.requestFocus(cell.getValue(), trigger);
    this.focusVisibleKey = trigger === 'keyboard' || cell.isFocusVisible()
      ? cell.cellKey()
      : null;
  }

  public onCellPointerDown(cell: TngGridCell): void {
    if (this.isCellDisabled(cell)) {
      return;
    }

    this.pendingFocusTrigger = 'pointer';
    this.focusVisibleKey = null;
  }

  public onCellSelectionRequest(cell: TngGridCell, trigger: Extract<TngGridInteractionTrigger, 'keyboard' | 'pointer'>): void {
    if (this.isCellDisabled(cell)) {
      return;
    }

    this.lastActivatedKey = cell.cellKey();
    if (this.selectionMode() === 'single') {
      this.requestSelection(cell.getValue());
    }

    this.cellActivate.emit(
      Object.freeze({
        col: cell.colIndex(),
        row: cell.rowIndex(),
        trigger,
      }),
    );
  }

  @HostListener('focusout', ['$event'])
  protected onFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && this.hostRef.nativeElement.contains(nextTarget)) {
      return;
    }

    this.domFocusedKey = null;
    this.focusVisibleKey = null;
    this.pendingFocusTrigger = null;
  }

  @HostListener('keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    const activeCell = this.getActiveCell();
    if (activeCell === null || this.isCellDisabled(activeCell)) {
      return;
    }

    const action = resolveGridNavigationKeyAction(event, {
      direction: this.dir(),
    });
    if (action === null) {
      return;
    }

    if (action.preventDefault) {
      event.preventDefault();
    }

    if (action.type === 'exit') {
      return;
    }

    if (action.type === 'activate') {
      this.onCellSelectionRequest(activeCell, 'keyboard');
      return;
    }

    this.moveFocus(activeCell, action.type);
  }

  private ensureFallbackFocus(): void {
    if (this.isFocusControlled()) {
      return;
    }

    const currentFocus = this.uncontrolledFocus;
    if (currentFocus !== null) {
      const currentCell = this.cellByKey.get(createCellKey(currentFocus));
      if (currentCell !== undefined && !this.isCellDisabled(currentCell)) {
        return;
      }
    }

    const fallback = this.getFirstEnabledCell();
    this.uncontrolledFocus = fallback?.getValue() ?? null;
  }

  private ensureUncontrolledSelectionInitialized(): void {
    if (this.selectionInitialized || this.isSelectionControlled()) {
      return;
    }

    this.selectionInitialized = true;
    this.uncontrolledSelection = this.defaultValue() ?? null;
  }

  private getActiveCell(): TngGridCell | null {
    const focusValue = this.getFocusValue();
    if (focusValue === null) {
      return this.getFirstEnabledCell();
    }

    return this.cellByKey.get(createCellKey(focusValue)) ?? this.getFirstEnabledCell();
  }

  private getComputedBounds(): Readonly<{ colCount: number; rowCount: number }> {
    const explicitColcount = this.ariaColcountValue;
    const explicitRowcount = this.ariaRowcountValue;
    if (explicitColcount !== null && explicitRowcount !== null) {
      return Object.freeze({
        colCount: explicitColcount,
        rowCount: explicitRowcount,
      });
    }

    let maxCol = 0;
    let maxRow = 0;
    for (const cell of this.cells) {
      maxCol = Math.max(maxCol, cell.colIndex());
      maxRow = Math.max(maxRow, cell.rowIndex());
    }

    return Object.freeze({
      colCount: explicitColcount ?? maxCol + 1,
      rowCount: explicitRowcount ?? maxRow + 1,
    });
  }

  private getFirstEnabledCell(): TngGridCell | null {
    const enabledCells = this.getEnabledCells();
    return enabledCells[0] ?? null;
  }

  private getEnabledCells(): readonly TngGridCell[] {
    return [...this.cells]
      .filter((cell) => !this.isCellDisabled(cell))
      .sort((a, b) => compareCellValues(a.getValue(), b.getValue()));
  }

  private getFocusValue(): TngGridNullablePosition {
    if (this.isFocusControlled()) {
      const row = this.focusRow();
      const col = this.focusCol();
      if (row === null || col === null || row === undefined || col === undefined) {
        return this.getFirstEnabledCell()?.getValue() ?? null;
      }

      const controlled = Object.freeze({ col, row });
      const controlledCell = this.cellByKey.get(createCellKey(controlled));
      if (controlledCell !== undefined && !this.isCellDisabled(controlledCell)) {
        return controlled;
      }

      return this.getFirstEnabledCell()?.getValue() ?? null;
    }

    if (this.uncontrolledFocus !== null) {
      const activeCell = this.cellByKey.get(createCellKey(this.uncontrolledFocus));
      if (activeCell !== undefined && !this.isCellDisabled(activeCell)) {
        return this.uncontrolledFocus;
      }
    }

    return this.getFirstEnabledCell()?.getValue() ?? null;
  }

  private getNavigableCells(): readonly TngGridNavigableCell[] {
    return [...this.cells].map((cell) => ({
      col: cell.colIndex(),
      disabled: this.isCellDisabled(cell),
      row: cell.rowIndex(),
    }));
  }

  private getSelectedValue(): TngGridNullablePosition {
    if (this.selectionMode() === 'none') {
      return null;
    }

    if (this.isSelectionControlled()) {
      return this.value() ?? null;
    }

    return this.uncontrolledSelection;
  }

  private isFocusControlled(): boolean {
    return this.focusRow() !== undefined && this.focusCol() !== undefined;
  }

  private isSelectionControlled(): boolean {
    return this.value() !== undefined;
  }

  private moveFocus(activeCell: TngGridCell, actionType: Exclude<TngGridNavigationActionType, 'activate' | 'exit'>): void {
    const nextValue = resolveNavigableGridCell(activeCell.getValue(), actionType, {
      bounds: this.getComputedBounds(),
      cells: this.getNavigableCells(),
      wrap: this.wrap(),
    });

    if (nextValue === null) {
      return;
    }

    const nextCell = this.cellByKey.get(createCellKey(nextValue));
    if (nextCell === undefined || this.isCellDisabled(nextCell)) {
      return;
    }

    this.pendingFocusTrigger = 'keyboard';
    this.requestFocus(nextValue, 'keyboard');
    this.focusVisibleKey = nextCell.cellKey();
    nextCell.focusHost();
  }

  private requestFocus(value: TngGridCellValue, trigger: TngGridInteractionTrigger): void {
    const previous = this.getFocusValue();
    if (positionsEqual(previous, value)) {
      return;
    }

    if (!this.isFocusControlled()) {
      this.uncontrolledFocus = value;
    }

    this.focusRowChange.emit(value.row);
    this.focusColChange.emit(value.col);
    this.focusChange.emit(focusChangeEvent(value, previous, trigger));
  }

  private requestSelection(value: TngGridNullablePosition): void {
    const previous = this.getSelectedValue();
    if (positionsEqual(previous, value)) {
      return;
    }

    if (!this.isSelectionControlled()) {
      this.uncontrolledSelection = value;
    }

    this.valueChange.emit(value);
  }
}

@Directive({
  selector: '[tngGridRow]',
  exportAs: 'tngGridRow',
})
export class TngGridRow {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'grid-row' as const;

  @HostBinding('attr.role')
  protected readonly role = 'row' as const;
}

@Directive({
  selector: '[tngGridCell]',
  exportAs: 'tngGridCell',
})
export class TngGridCell implements OnInit, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly grid = inject(TngGrid);

  public readonly rowIndex = input.required<number, unknown>({
    transform: normalizeIndex,
  });
  public readonly colIndex = input.required<number, unknown>({
    transform: normalizeIndex,
  });
  public readonly rowSpan = input<number, unknown>(1, {
    transform: normalizeSpan,
  });
  public readonly colSpan = input<number, unknown>(1, {
    transform: normalizeSpan,
  });
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly selected = input<boolean | null, unknown>(null, {
    transform: (value: unknown): boolean | null => {
      if (value === undefined || value === null) {
        return null;
      }

      return booleanAttribute(value);
    },
  });
  public readonly cellRole = input<TngGridCellRole, unknown>('gridcell', {
    transform: normalizeCellRole,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'gridcell' as const;

  @HostBinding('attr.role')
  protected get roleAttr(): TngGridCellRole {
    return this.cellRole();
  }

  @HostBinding('attr.tabindex')
  protected get tabIndexAttr(): string {
    return this.grid.getCellTabIndex(this);
  }

  @HostBinding('attr.aria-rowindex')
  protected get ariaRowIndexAttr(): string {
    return String(this.rowIndex() + 1);
  }

  @HostBinding('attr.aria-colindex')
  protected get ariaColIndexAttr(): string {
    return String(this.colIndex() + 1);
  }

  @HostBinding('attr.aria-rowspan')
  protected get ariaRowSpanAttr(): string | null {
    return this.rowSpan() > 1 ? String(this.rowSpan()) : null;
  }

  @HostBinding('attr.aria-colspan')
  protected get ariaColSpanAttr(): string | null {
    return this.colSpan() > 1 ? String(this.colSpan()) : null;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): string | null {
    return this.grid.isCellDisabled(this) ? 'true' : null;
  }

  @HostBinding('attr.aria-selected')
  protected get ariaSelectedAttr(): string | null {
    if (this.cellRole() !== 'gridcell' && this.selected() === null) {
      return null;
    }

    if (this.cellRole() !== 'gridcell' && this.selected() !== null) {
      return this.selected() ? 'true' : 'false';
    }

    if (this.grid.selectionMode() === 'none' && this.selected() === null) {
      return null;
    }

    return this.grid.isCellSelected(this) ? 'true' : 'false';
  }

  @HostBinding('attr.data-row-index')
  protected get dataRowIndexAttr(): string {
    return String(this.rowIndex());
  }

  @HostBinding('attr.data-col-index')
  protected get dataColIndexAttr(): string {
    return String(this.colIndex());
  }

  @HostBinding('attr.data-row-span')
  protected get dataRowSpanAttr(): string | null {
    return this.rowSpan() > 1 ? String(this.rowSpan()) : null;
  }

  @HostBinding('attr.data-col-span')
  protected get dataColSpanAttr(): string | null {
    return this.colSpan() > 1 ? String(this.colSpan()) : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.grid.isCellDisabled(this) ? '' : null;
  }

  @HostBinding('attr.data-selected')
  protected get dataSelectedAttr(): '' | null {
    return this.grid.isCellSelected(this) ? '' : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): '' | null {
    return this.grid.isCellFocused(this) ? '' : null;
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisibleAttr(): '' | null {
    return this.grid.isCellFocusVisible(this) ? '' : null;
  }

  @HostBinding('attr.data-activated')
  protected get dataActivatedAttr(): '' | null {
    return this.grid.isCellActivated(this) ? '' : null;
  }

  public ngOnInit(): void {
    this.grid.registerCell(this);
  }

  public ngOnDestroy(): void {
    this.grid.unregisterCell(this);
  }

  public cellKey(): string {
    return createCellKey(this.getValue());
  }

  public focusHost(): void {
    this.hostRef.nativeElement.focus();
  }

  public getHostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  public getValue(): TngGridCellValue {
    return Object.freeze({
      col: this.colIndex(),
      row: this.rowIndex(),
    });
  }

  public isFocusVisible(): boolean {
    return this.hostRef.nativeElement.matches(':focus-visible');
  }

  public matchesValue(value: TngGridCellValue): boolean {
    return this.rowIndex() === value.row && this.colIndex() === value.col;
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.grid.isCellDisabled(this)) {
      return;
    }

    this.grid.onCellClicked(this);
  }

  @HostListener('dblclick')
  protected onDoubleClick(): void {
    if (this.grid.isCellDisabled(this)) {
      return;
    }

    this.grid.onCellSelectionRequest(this, 'pointer');
  }

  @HostListener('focus')
  protected onFocus(): void {
    this.grid.onCellFocused(this);
  }

  @HostListener('pointerdown')
  protected onPointerDown(): void {
    this.grid.onCellPointerDown(this);
  }
}
