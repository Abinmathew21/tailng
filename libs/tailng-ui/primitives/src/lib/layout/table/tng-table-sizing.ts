import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  type OnDestroy,
  type OnInit,
  booleanAttribute,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { TngTable, TngTableCell, TngTableHeaderCell } from './tng-table';

export type TngTableColumnWidthMap = Readonly<Record<string, string>>;

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

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeWidthMap(value: unknown): Record<string, string> {
  if (typeof value !== 'object' || value === null) {
    return {};
  }

  const nextWidths: Record<string, string> = {};
  for (const [columnId, columnWidth] of Object.entries(value as Record<string, unknown>)) {
    const normalizedWidth = normalizeCssLength(columnWidth);
    if (normalizedWidth !== null) {
      nextWidths[columnId] = normalizedWidth;
    }
  }

  return nextWidths;
}

function parsePixelLength(value: string | null): number | null {
  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  if (/^-?\d+(\.\d+)?px$/u.test(trimmed)) {
    return Number.parseFloat(trimmed.slice(0, -2));
  }

  if (/^-?\d+(\.\d+)?$/u.test(trimmed)) {
    return Number.parseFloat(trimmed);
  }

  return null;
}

function measureWidth(element: HTMLElement): number {
  const rectWidth = element.getBoundingClientRect().width;
  if (Number.isFinite(rectWidth) && rectWidth > 0) {
    return rectWidth;
  }

  return element.offsetWidth;
}

@Directive({
  selector: 'table[tngTable][tngTableColumnSizing]',
  exportAs: 'tngTableColumnSizing',
})
export class TngTableColumnSizing {
  private readonly columns = new Set<TngTableColumn>();
  private readonly table = inject(TngTable);
  private uncontrolledWidths: Record<string, string> = {};
  private resizingColumnId: string | null = null;

  public readonly widths = input<Record<string, unknown> | null | undefined>(undefined, {
    alias: 'tngTableColumnWidths',
  });
  public readonly columnWidthsChange = output<TngTableColumnWidthMap>();

  @HostBinding('attr.data-column-sizing')
  protected readonly dataColumnSizing = '' as const;

  public getResolvedMaxWidth(column: TngTableColumn): string | null {
    const columnId = column.getColumnId();
    return columnId === null ? column.getMaxWidth() : this.resolveColumnMaxWidth(columnId);
  }

  public getResolvedMinWidth(column: TngTableColumn): string | null {
    const columnId = column.getColumnId();
    return columnId === null ? column.getMinWidth() : this.resolveColumnMinWidth(columnId);
  }

  public getResolvedWidth(column: TngTableColumn): string | null {
    const columnId = column.getColumnId();
    if (columnId === null) {
      return column.getDefaultWidth();
    }

    return this.clampWidthValue(
      this.getCurrentWidths()[columnId] ?? this.resolveColumnDefaultWidth(columnId) ?? column.getDefaultWidth(),
      columnId,
    );
  }

  public isResizing(columnId: string | null): boolean {
    return columnId !== null && this.resizingColumnId === columnId;
  }

  public registerColumn(column: TngTableColumn): void {
    this.columns.add(column);
  }

  public resize(columnId: string, startWidth: number, delta: number): void {
    const signedDelta = this.table.dir() === 'rtl' ? -delta : delta;
    const nextWidth = this.clampPixelWidth(columnId, startWidth + signedDelta);
    this.resizingColumnId = columnId;
    this.commit({
      ...this.getCurrentWidths(),
      [columnId]: `${nextWidth}px`,
    });
  }

  public resolveColumnPixelWidth(columnId: string): number {
    const resolvedWidth = this.clampWidthValue(
      this.getCurrentWidths()[columnId] ?? this.resolveColumnDefaultWidth(columnId),
      columnId,
    );
    const parsedWidth = parsePixelLength(resolvedWidth);
    if (parsedWidth !== null) {
      return parsedWidth;
    }

    const measuredWidth = this.resolveMeasuredWidth(columnId);
    return measuredWidth ?? 0;
  }

  public stopResize(): void {
    this.resizingColumnId = null;
  }

  public unregisterColumn(column: TngTableColumn): void {
    this.columns.delete(column);
  }

  private clampPixelWidth(columnId: string, width: number): number {
    const minWidth = parsePixelLength(this.resolveColumnMinWidth(columnId));
    const maxWidth = parsePixelLength(this.resolveColumnMaxWidth(columnId));
    let nextWidth = Math.max(0, width);

    if (minWidth !== null) {
      nextWidth = Math.max(nextWidth, minWidth);
    }

    if (maxWidth !== null) {
      nextWidth = Math.min(nextWidth, maxWidth);
    }

    return nextWidth;
  }

  private clampWidthValue(value: string | null, columnId: string): string | null {
    const parsedWidth = parsePixelLength(value);
    if (parsedWidth === null) {
      return value;
    }

    return `${this.clampPixelWidth(columnId, parsedWidth)}px`;
  }

  private commit(nextWidths: Record<string, string>): void {
    if (this.widths() === undefined) {
      this.uncontrolledWidths = nextWidths;
    }

    this.columnWidthsChange.emit(Object.freeze({ ...nextWidths }));
  }

  private getCurrentWidths(): Record<string, string> {
    return this.widths() === undefined ? this.uncontrolledWidths : normalizeWidthMap(this.widths());
  }

  private resolveColumnDefaultWidth(columnId: string): string | null {
    return this.findColumnsById(columnId)
      .map((column) => column.getDefaultWidth())
      .find((width): width is string => width !== null) ?? null;
  }

  private resolveColumnMaxWidth(columnId: string): string | null {
    const widths = this.findColumnsById(columnId)
      .map((column) => column.getMaxWidth())
      .filter((width): width is string => width !== null);
    if (widths.length === 0) {
      return null;
    }

    const pixelWidths = widths
      .map((width) => parsePixelLength(width))
      .filter((width): width is number => width !== null);
    if (pixelWidths.length === widths.length) {
      return `${Math.min(...pixelWidths)}px`;
    }

    return widths[0] ?? null;
  }

  private resolveColumnMinWidth(columnId: string): string | null {
    const widths = this.findColumnsById(columnId)
      .map((column) => column.getMinWidth())
      .filter((width): width is string => width !== null);
    if (widths.length === 0) {
      return null;
    }

    const pixelWidths = widths
      .map((width) => parsePixelLength(width))
      .filter((width): width is number => width !== null);
    if (pixelWidths.length === widths.length) {
      return `${Math.max(...pixelWidths)}px`;
    }

    return widths[0] ?? null;
  }

  private resolveMeasuredWidth(columnId: string): number | null {
    const elements = this.findColumnsById(columnId).map((column) => column.getHostElement());
    if (elements.length === 0) {
      return null;
    }

    return elements.reduce((maxWidth, element) => Math.max(maxWidth, measureWidth(element)), 0);
  }

  private findColumnsById(columnId: string): readonly TngTableColumn[] {
    return [...this.columns].filter((column) => column.getColumnId() === columnId);
  }
}

@Directive({
  selector: 'th[tngTableColumn],td[tngTableColumn]',
  exportAs: 'tngTableColumn',
})
export class TngTableColumn implements OnDestroy, OnInit {
  private readonly cell = inject(TngTableCell, {
    optional: true,
  });
  private readonly headerCell = inject(TngTableHeaderCell, {
    optional: true,
  });
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly sizing = inject(forwardRef(() => TngTableColumnSizing), {
    optional: true,
  }) as TngTableColumnSizing | null;

  public readonly columnId = input<string | null, unknown>(null, {
    alias: 'tngTableColumn',
    transform: normalizeOptionalString,
  });
  public readonly defaultWidth = input<string | null, unknown>(null, {
    alias: 'tngTableColumnWidth',
    transform: normalizeCssLength,
  });
  public readonly minWidth = input<string | null, unknown>(null, {
    alias: 'tngTableColumnMinWidth',
    transform: normalizeCssLength,
  });
  public readonly maxWidth = input<string | null, unknown>(null, {
    alias: 'tngTableColumnMaxWidth',
    transform: normalizeCssLength,
  });

  @HostBinding('attr.data-column-id')
  protected get dataColumnIdAttr(): string | null {
    return this.getColumnId();
  }

  @HostBinding('attr.data-column-max-width')
  protected get dataColumnMaxWidthAttr(): string | null {
    return this.getMaxWidth();
  }

  @HostBinding('attr.data-column-min-width')
  protected get dataColumnMinWidthAttr(): string | null {
    return this.getMinWidth();
  }

  @HostBinding('attr.data-column-width')
  protected get dataColumnWidthAttr(): string | null {
    return this.getDefaultWidth();
  }

  @HostBinding('style.max-width')
  protected get maxWidthAttr(): string | null {
    return this.sizing?.getResolvedMaxWidth(this) ?? this.getMaxWidth();
  }

  @HostBinding('style.min-width')
  protected get minWidthAttr(): string | null {
    return this.sizing?.getResolvedMinWidth(this) ?? this.getMinWidth();
  }

  @HostBinding('style.width')
  protected get widthAttr(): string | null {
    return this.sizing?.getResolvedWidth(this) ?? this.getDefaultWidth();
  }

  public ngOnDestroy(): void {
    this.sizing?.unregisterColumn(this);
  }

  public ngOnInit(): void {
    this.sizing?.registerColumn(this);
  }

  public getColumnId(): string | null {
    return this.columnId() ?? this.headerCell?.columnId() ?? this.cell?.columnId() ?? null;
  }

  public getDefaultWidth(): string | null {
    return this.defaultWidth();
  }

  public getHostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  public getMaxWidth(): string | null {
    return this.maxWidth();
  }

  public getMinWidth(): string | null {
    return this.minWidth();
  }
}

@Directive({
  selector: '[tngTableColumnResizer]',
  exportAs: 'tngTableColumnResizer',
})
export class TngTableColumnResizer implements OnDestroy {
  private readonly sizing = inject(TngTableColumnSizing, {
    optional: true,
  });
  private activeResize: Readonly<{
    columnId: string;
    startClientX: number;
    startWidth: number;
  }> | null = null;

  public readonly columnId = input<string | null, unknown>(null, {
    alias: 'tngTableColumnResizer',
    transform: normalizeOptionalString,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    alias: 'tngTableColumnResizerDisabled',
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-orientation')
  protected readonly ariaOrientation = 'vertical' as const;

  @HostBinding('attr.data-resizing')
  protected get dataResizingAttr(): '' | null {
    return this.sizing?.isResizing(this.columnId()) === true ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-column-resizer' as const;

  @HostBinding('style.cursor')
  protected readonly cursor = 'col-resize' as const;

  public ngOnDestroy(): void {
    this.activeResize = null;
    this.sizing?.stopResize();
  }

  @HostListener('document:mousemove', ['$event'])
  protected onDocumentMouseMove(event: MouseEvent): void {
    if (this.activeResize === null) {
      return;
    }

    event.preventDefault();
    this.sizing?.resize(
      this.activeResize.columnId,
      this.activeResize.startWidth,
      event.clientX - this.activeResize.startClientX,
    );
  }

  @HostListener('document:mouseup')
  protected onDocumentMouseUp(): void {
    this.activeResize = null;
    this.sizing?.stopResize();
  }

  @HostListener('mousedown', ['$event'])
  protected onMouseDown(event: MouseEvent): void {
    const columnId = this.columnId();
    if (
      event.button !== 0
      || this.disabled()
      || this.sizing === null
      || columnId === null
    ) {
      return;
    }

    event.preventDefault();
    this.activeResize = Object.freeze({
      columnId,
      startClientX: event.clientX,
      startWidth: this.sizing.resolveColumnPixelWidth(columnId),
    });
  }
}
