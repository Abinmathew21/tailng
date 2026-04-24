import {
  Component,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  input,
  output,
} from '@angular/core';
import type { OnDestroy } from '@angular/core';

export type TngTableVirtualRange = Readonly<{
  end: number;
  start: number;
}>;

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

function normalizeCount(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.trunc(value));
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.trunc(parsed));
    }
  }

  return 0;
}

function normalizeItemSize(value: unknown): number {
  const normalized = normalizeCount(value);
  return normalized > 0 ? normalized : 1;
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

function rangeChanged(a: TngTableVirtualRange, b: TngTableVirtualRange): boolean {
  return a.start !== b.start || a.end !== b.end;
}

@Directive({
  selector: '[tngTableVirtual]',
  exportAs: 'tngTableVirtual',
})
export class TngTableVirtual implements OnDestroy {
  private lastEmittedRange: TngTableVirtualRange = Object.freeze({
    end: 0,
    start: 0,
  });
  private pendingRangeEmissionFrame: number | null = null;
  private pendingRangeEmissionTimeout: number | null = null;

  public constructor(@Inject(ElementRef) private readonly hostRef: ElementRef<HTMLElement>) {}

  public readonly itemCount = input<number, unknown>(0, {
    alias: 'tngTableVirtualItemCount',
    transform: normalizeCount,
  });
  public readonly itemSize = input<number, unknown>(1, {
    alias: 'tngTableVirtualItemSize',
    transform: normalizeItemSize,
  });
  public readonly overscan = input<number, unknown>(0, {
    alias: 'tngTableVirtualOverscan',
    transform: normalizeCount,
  });
  public readonly viewportHeight = input<number | null, unknown>(null, {
    alias: 'tngTableVirtualViewportHeight',
    transform: (value: unknown): number | null => {
      if (value === null || value === undefined || value === '') {
        return null;
      }

      return normalizeItemSize(value);
    },
  });

  public readonly rangeChange = output<TngTableVirtualRange>();

  @HostBinding('attr.data-virtual-end')
  protected get dataVirtualEndAttr(): string {
    return String(this.end());
  }

  @HostBinding('attr.data-virtual-start')
  protected get dataVirtualStartAttr(): string {
    return String(this.start());
  }

  @HostBinding('attr.data-virtualized')
  protected readonly dataVirtualized = '' as const;

  @HostBinding('style.max-height')
  protected get maxHeightAttr(): string | null {
    return normalizeCssLength(this.viewportHeight());
  }

  public afterSize(): number {
    const range = this.resolveRange();
    return Math.max(0, this.totalSize() - range.end * this.itemSize());
  }

  public beforeSize(): number {
    return this.start() * this.itemSize();
  }

  public end(): number {
    return this.resolveRange().end;
  }

  public range(): TngTableVirtualRange {
    return this.resolveRange();
  }

  public scrollToIndex(index: number): void {
    const maxIndex = Math.max(0, this.itemCount() - 1);
    this.hostRef.nativeElement.scrollTop = clamp(Math.trunc(index), 0, maxIndex) * this.itemSize();
    this.emitRangeIfChanged();
  }

  public slice<TValue>(items: readonly TValue[]): readonly TValue[] {
    const range = this.resolveRange();
    return items.slice(range.start, range.end);
  }

  public start(): number {
    return this.resolveRange().start;
  }

  public totalSize(): number {
    return this.itemCount() * this.itemSize();
  }

  public ngOnDestroy(): void {
    this.cancelScheduledRangeEmission();
  }

  @HostListener('scroll')
  protected onScroll(): void {
    this.scheduleRangeEmission();
  }

  private emitRangeIfChanged(): void {
    const nextRange = this.resolveRange();
    if (!rangeChanged(this.lastEmittedRange, nextRange)) {
      return;
    }

    this.lastEmittedRange = nextRange;
    this.rangeChange.emit(nextRange);
  }

  private cancelScheduledRangeEmission(): void {
    if (this.pendingRangeEmissionFrame !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.pendingRangeEmissionFrame);
      this.pendingRangeEmissionFrame = null;
    }

    if (this.pendingRangeEmissionTimeout !== null) {
      clearTimeout(this.pendingRangeEmissionTimeout);
      this.pendingRangeEmissionTimeout = null;
    }
  }

  private resolveRange(): TngTableVirtualRange {
    const itemCount = this.itemCount();
    if (itemCount === 0) {
      return Object.freeze({
        end: 0,
        start: 0,
      });
    }

    const itemSize = this.itemSize();
    const viewportHeight = this.resolveViewportHeight();
    const visibleCount = Math.max(1, Math.ceil(viewportHeight / itemSize));
    const firstVisibleIndex = clamp(
      Math.floor(this.hostRef.nativeElement.scrollTop / itemSize),
      0,
      Math.max(0, itemCount - 1),
    );
    const start = Math.max(0, firstVisibleIndex - this.overscan());
    const end = Math.min(itemCount, firstVisibleIndex + visibleCount + this.overscan());

    return Object.freeze({
      end,
      start,
    });
  }

  private resolveViewportHeight(): number {
    const explicitHeight = this.viewportHeight();
    if (explicitHeight !== null) {
      return explicitHeight;
    }

    const clientHeight = this.hostRef.nativeElement.clientHeight;
    return clientHeight > 0 ? clientHeight : this.itemSize();
  }

  private scheduleRangeEmission(): void {
    if (this.pendingRangeEmissionFrame !== null || this.pendingRangeEmissionTimeout !== null) {
      return;
    }

    if (typeof requestAnimationFrame === 'function') {
      this.pendingRangeEmissionFrame = requestAnimationFrame(() => {
        this.pendingRangeEmissionFrame = null;
        this.emitRangeIfChanged();
      });
      return;
    }

    this.pendingRangeEmissionTimeout = globalThis.setTimeout(() => {
      this.pendingRangeEmissionTimeout = null;
      this.emitRangeIfChanged();
    }, 0);
  }
}

@Component({
  selector: 'tr[tngTableVirtualSpacer]',
  exportAs: 'tngTableVirtualSpacer',
  template: `
    <td
      [attr.colspan]="colspan()"
      [style.border]="0"
      [style.height]="sizeCss()"
      [style.padding]="0"
    ></td>
  `,
})
export class TngTableVirtualSpacer {
  public readonly size = input<number, unknown>(0, {
    alias: 'tngTableVirtualSpacerSize',
    transform: normalizeCount,
  });
  public readonly colspan = input<number, unknown>(1, {
    alias: 'tngTableVirtualSpacerColspan',
    transform: normalizeItemSize,
  });

  @HostBinding('attr.aria-hidden')
  protected readonly ariaHidden = 'true' as const;

  @HostBinding('attr.data-size')
  protected get dataSizeAttr(): string {
    return String(this.size());
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-virtual-spacer' as const;

  @HostBinding('attr.role')
  protected readonly role = 'presentation' as const;

  public sizeCss(): string {
    return `${this.size()}px`;
  }
}
