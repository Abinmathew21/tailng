import {
  Component,
  ElementRef,
  HostBinding,
  LOCALE_ID,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import {
  computeOverlayPosition,
  type TngOverlayCollisionOptions,
  type TngOverlayOffset,
  type TngOverlayPlacement,
} from '@tailng-ui/cdk';
import {
  createDatepickerController,
  type TngCalendarView,
  type TngDateCell,
  type TngDateAdapter,
  type TngDateInputValue,
  type TngDateSelectionInput,
  type TngDateValue,
  type TngDatepickerCloseReason,
  type TngDatepickerDirection,
  type TngDatepickerOutputs,
  type TngDatepickerSelectionMode,
  type TngMonthOption,
  type TngWeekdayIndex,
  type TngYearOption,
} from '@tailng-ui/primitives';

type OptionalBooleanInput = boolean | null | string | undefined;
type TngDatepickerPlacement = 'auto' | 'bottom' | 'top';

type MaybeRect = Readonly<{
  height: number;
  left: number;
  top: number;
  width: number;
}>;

const OVERLAY_VIEWPORT_MARGIN = 12;
const OVERLAY_OFFSET = 9;

function rectFromClientRect(rect: DOMRect | ClientRect): MaybeRect {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

function viewportRect(windowRef: Window): MaybeRect {
  return {
    height: windowRef.innerHeight || 768,
    left: 0,
    top: 0,
    width: windowRef.innerWidth || 1024,
  };
}

function normalizeOptionalBooleanInput(value: OptionalBooleanInput): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return booleanAttribute(value);
}

function normalizeNumberInput(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function normalizeWeekdayInput(value: TngWeekdayIndex | number | string): TngWeekdayIndex {
  const normalized = Math.max(0, Math.min(6, Math.trunc(normalizeNumberInput(value))));
  return normalized as TngWeekdayIndex;
}

function isKeyboardEventTarget(value: EventTarget | null): value is HTMLElement {
  return value instanceof HTMLElement;
}

let nextDatepickerInputId = 0;

function createDatepickerInputId(): string {
  nextDatepickerInputId += 1;
  return `tng-datepicker-input-${nextDatepickerInputId}`;
}

@Component({
  selector: 'tng-datepicker',
  templateUrl: './tng-datepicker.component.html',
  styleUrl: './tng-datepicker.component.css',
})
export class TngDatepickerComponent<TDate = Date> implements OnDestroy {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly defaultLocale = inject(LOCALE_ID);
  private readonly fallbackInputId = createDatepickerInputId();
  private readonly ownerDocument = this.hostElement.nativeElement.ownerDocument ?? null;
  private readonly ownerWindow = this.ownerDocument?.defaultView ?? null;
  private readonly renderVersion = signal(0);
  private readonly overlayOpen = signal(false);
  private readonly resolvedOverlayPlacement = signal<'bottom' | 'top'>('bottom');
  private readonly anchorRef = viewChild<ElementRef<HTMLElement>>('anchorShell');
  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('triggerButton');
  private readonly overlayRef = viewChild<ElementRef<HTMLElement>>('overlayPanel');
  private overlayPlaceholder: Comment | null = null;
  private overlayOriginalParent: Node | null = null;
  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private overlayLayoutFrame: number | null = null;
  private appliedInitialState = false;
  private readonly controller = createDatepickerController<TDate>({
    allowManualInput: true,
    autoCommitView: false,
    closeOnEscape: true,
    closeOnOutsideClick: true,
    closeOnSelect: true,
    locale: this.defaultLocale,
    ownerDocument: this.ownerDocument,
    restoreFocus: true,
    showOutsideDays: true,
    trapFocus: true,
    value: null,
  });
  private readonly unsubscribe = this.controller.subscribe((event) => {
    this.renderVersion.update((value) => value + 1);

    switch (event.type) {
      case 'activeChange':
        this.activeDateChange.emit(event.activeDate);
        break;
      case 'closed':
        this.overlayOpen.set(false);
        this.openChange.emit(false);
        this.closed.emit(event.reason);
        break;
      case 'monthChange':
        this.monthChange.emit(event.visibleMonth);
        break;
      case 'opened':
        this.overlayOpen.set(true);
        this.openChange.emit(true);
        this.queueOverlayFocusSync();
        break;
      case 'valueChange':
        this.valueChange.emit(event.value);
        break;
      case 'viewChange':
        this.viewChange.emit(event.view);
        break;
      case 'yearChange':
        this.yearChange.emit(event.year);
        break;
    }
  });

  public readonly adapter = input<TngDateAdapter<TDate> | undefined>(undefined);
  public readonly allowDeselect = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly allowManualInput = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledBy = input<string | null>(null);
  public readonly autoCommitView = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly closeOnEscape = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnOutsideClick = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnSelect = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOthersOnOpen = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly defaultOpen = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly defaultValue = input<TngDateSelectionInput<TDate> | undefined>(undefined);
  public readonly direction = input<TngDatepickerDirection>('ltr');
  public readonly disableDate = input<((date: TDate) => boolean) | null>(null);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly fullWidth = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly id = input<string | null>(null);
  public readonly inputAriaLabel = input<string>('Date input');
  public readonly invalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly locale = input<string>(this.defaultLocale);
  public readonly maxDate = input<TngDateInputValue<TDate> | undefined>(undefined);
  public readonly minDate = input<TngDateInputValue<TDate> | undefined>(undefined);
  public readonly open = input<boolean | undefined, OptionalBooleanInput>(undefined, {
    transform: normalizeOptionalBooleanInput,
  });
  public readonly overlaySize = input<number, number | string>(320, {
    transform: normalizeNumberInput,
  });
  public readonly placement = input<TngDatepickerPlacement>('auto');
  public readonly placeholder = input<string>('MM-DD-YYYY');
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly restoreFocus = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly selectionMode = input<TngDatepickerSelectionMode>('single');
  public readonly showOutsideDays = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly today = input<TngDateInputValue<TDate> | undefined>(undefined);
  public readonly trapFocus = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly value = input<TngDateSelectionInput<TDate> | undefined>(undefined);
  public readonly weekStartsOn = input<TngWeekdayIndex, TngWeekdayIndex | number | string>(0, {
    transform: normalizeWeekdayInput,
  });
  public readonly yearPageSize = input<number, number | string>(24, {
    transform: normalizeNumberInput,
  });

  public readonly activeDateChange = output<TDate>();
  public readonly closed = output<TngDatepickerCloseReason>();
  public readonly monthChange = output<TDate>();
  public readonly openChange = output<boolean>();
  public readonly valueChange = output<TngDateValue<TDate>>();
  public readonly viewChange = output<TngCalendarView>();
  public readonly yearChange = output<number>();

  protected readonly outputs = computed(() => {
    this.renderVersion();
    return this.controller.getOutputs();
  });

  protected readonly invalidState = computed(
    () => this.invalid() || this.outputs().validationError !== null,
  );
  protected readonly currentOverlayPlacement = computed(() => this.resolvedOverlayPlacement());

  protected readonly materialPeriodLabel = computed(() => {
    const outputs = this.outputs();
    if (outputs.view === 'year') {
      const startYear = outputs.yearOptions[0]?.year;
      const endYear = outputs.yearOptions[outputs.yearOptions.length - 1]?.year;
      if (startYear !== undefined && endYear !== undefined) {
        return `${startYear} - ${endYear}`;
      }
    }

    if (outputs.view === 'month') {
      return this.controller.formatDate(outputs.visibleMonth, 'year-label');
    }

    return outputs.labelMonthYear;
  });

  @HostBinding('attr.data-full-width')
  protected get dataFullWidth(): '' | null {
    return this.fullWidth() ? '' : null;
  }

  public constructor() {
    effect(() => {
      const trigger = this.triggerRef()?.nativeElement ?? null;
      this.controller.registerTrigger(trigger);
    });

    effect(() => {
      const overlay = this.overlayRef()?.nativeElement ?? null;
      this.controller.registerOverlay(overlay);
      this.initializeOverlayPortal(overlay);
      this.renderVersion.update((value) => value + 1);
    });

    effect(() => {
      const overlay = this.overlayRef()?.nativeElement;
      if (overlay === undefined) {
        return;
      }

      if (this.overlayOpen()) {
        this.mountOverlayToBodyAndPosition();
        return;
      }

      this.restoreOverlayToPlaceholder();
    });

    effect(() => {
      this.placement();
      this.direction();
      this.overlaySize();

      if (!this.overlayOpen()) {
        return;
      }

      this.scheduleOverlayLayoutSync();
    });

    effect(() => {
      this.controller.setConfig({
        adapter: this.adapter(),
        allowDeselect: this.allowDeselect(),
        allowManualInput: this.allowManualInput(),
        ariaDescribedBy: this.ariaDescribedBy(),
        ariaLabel: this.ariaLabel(),
        ariaLabelledBy: this.ariaLabelledBy(),
        autoCommitView: this.autoCommitView(),
        closeOnEscape: this.closeOnEscape(),
        closeOnOutsideClick: this.closeOnOutsideClick(),
        closeOnSelect: this.closeOnSelect(),
        closeOthersOnOpen: this.closeOthersOnOpen(),
        direction: this.direction(),
        disableDate: this.disableDate() ?? undefined,
        disabled: this.disabled(),
        id: this.id() ?? undefined,
        locale: this.locale(),
        maxDate: this.maxDate(),
        minDate: this.minDate(),
        overlaySize: this.overlaySize(),
        ownerDocument: this.ownerDocument,
        restoreFocus: this.restoreFocus(),
        selectionMode: this.selectionMode(),
        showOutsideDays: this.showOutsideDays(),
        today: this.today(),
        trapFocus: this.trapFocus(),
        weekStartsOn: this.weekStartsOn(),
        yearPageSize: this.yearPageSize(),
      });

      const controlledValue = this.value();
      if (controlledValue !== undefined) {
        this.controller.setValue(controlledValue);
      }

      const controlledOpen = this.open();
      const currentOpen = this.controller.getOutputs().open;
      if (controlledOpen !== undefined) {
        this.controller.setOpen(controlledOpen);
      }

      if (!this.appliedInitialState) {
        if (controlledValue === undefined && this.defaultValue() !== undefined) {
          this.controller.setValue(this.defaultValue() as TngDateSelectionInput<TDate>);
        }

        if (controlledOpen === undefined && this.defaultOpen()) {
          this.controller.setOpen(true);
        }

        this.appliedInitialState = true;
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.overlayLayoutFrame !== null && this.ownerWindow !== null) {
      this.ownerWindow.cancelAnimationFrame(this.overlayLayoutFrame);
      this.overlayLayoutFrame = null;
    }

    this.teardownOverlayRepositionListeners();
    this.restoreOverlayToPlaceholder(true);
    this.unsubscribe();
    this.controller.destroy();
  }

  public clear(): void {
    this.controller.clear();
    this.controller.showDaysPanel();
    this.queueOverlayFocusSync();
  }

  public close(reason: TngDatepickerCloseReason = 'programmatic'): void {
    this.controller.close(reason);
  }

  public openDatepicker(): void {
    this.controller.open();
  }

  public showDaysPanel(): void {
    this.controller.showDaysPanel();
    this.queueOverlayFocusSync();
  }

  public showMonthsPanel(): void {
    this.controller.showMonthsPanel();
    this.queueOverlayFocusSync();
  }

  public showYearsPanel(): void {
    this.controller.showYearsPanel();
    this.queueOverlayFocusSync();
  }

  public toggleOpen(): void {
    this.controller.toggleOpen();
  }

  protected resolveInputId(): string {
    const id = this.id()?.trim();
    if (id !== undefined && id !== '') {
      return `${id}-input`;
    }

    return this.fallbackInputId;
  }

  protected isDayView(): boolean {
    return this.outputs().view === 'day';
  }

  protected isMonthView(): boolean {
    return this.outputs().view === 'month';
  }

  protected isYearView(): boolean {
    return this.outputs().view === 'year';
  }

  protected onDayCellClick(cell: Readonly<TngDateCell<TDate>>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.controller.handleCellClick(cell.date);
  }

  protected onInputBlur(): void {
    if (!this.allowManualInput()) {
      return;
    }

    this.controller.commitInputText();
    this.renderVersion.update((value) => value + 1);
  }

  protected onInputChange(event: Event): void {
    if (!this.allowManualInput()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.controller.setInputText(target.value);
    this.renderVersion.update((value) => value + 1);
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.allowManualInput()) {
      event.preventDefault();
      this.controller.commitInputText();
      this.renderVersion.update((value) => value + 1);
      return;
    }

    if (event.key === 'ArrowDown' && !this.outputs().open) {
      event.preventDefault();
      this.controller.open();
    }
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    this.controller.handleGridKeyDown(event);
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onMonthKeydown(event: KeyboardEvent): void {
    this.controller.handleMonthGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      this.controller.showDaysPanel();
    }
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onMonthOptionClick(option: Readonly<TngMonthOption<TDate>>): void {
    if (option.disabled) {
      return;
    }

    this.controller.selectMonth(option.index);
    this.controller.showDaysPanel();
    this.queueOverlayFocusSync();
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    this.controller.handleOverlayKeyDown(event);
  }

  protected onTriggerClick(): void {
    if (this.disabled()) {
      return;
    }

    this.controller.toggleOpen();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    this.controller.handleTriggerKeyDown(event);
  }

  protected onPeriodButtonClick(): void {
    if (this.isYearView()) {
      return;
    }

    this.controller.showYearsPanel();
    this.queueOverlayFocusSync();
  }

  protected onYearKeydown(event: KeyboardEvent): void {
    this.controller.handleYearGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      this.controller.showMonthsPanel();
    }
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onYearOptionClick(option: Readonly<TngYearOption<TDate>>): void {
    if (option.disabled) {
      return;
    }

    this.controller.selectYear(option.year);
    this.controller.showMonthsPanel();
    this.queueOverlayFocusSync();
  }

  protected pageBackward(): void {
    if (this.isDayView()) {
      this.controller.prevMonth();
      this.queueOverlayFocusSync();
      return;
    }

    if (this.isMonthView() || this.isYearView()) {
      this.controller.prevYear();
      this.queueOverlayFocusSync();
      return;
    }
  }

  protected pageForward(): void {
    if (this.isDayView()) {
      this.controller.nextMonth();
      this.queueOverlayFocusSync();
      return;
    }

    if (this.isMonthView() || this.isYearView()) {
      this.controller.nextYear();
      this.queueOverlayFocusSync();
      return;
    }
  }

  private queueOverlayFocusSync(): void {
    this.scheduleOverlayLayoutSync();

    queueMicrotask(() => {
      const focusActiveTarget = (): void => {
        const outputs = this.outputs();
        if (!outputs.open || this.ownerDocument === null) {
          return;
        }

        const targetId = this.resolveCurrentFocusTargetId(outputs);
        if (targetId === null) {
          return;
        }

        const target = this.ownerDocument.getElementById(targetId);
        if (!isKeyboardEventTarget(target)) {
          return;
        }

        target.focus();
      };

      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
          focusActiveTarget();
        });
        return;
      }

      setTimeout(() => {
        focusActiveTarget();
      }, 0);
    });
  }

  private resolveCurrentFocusTargetId(outputs: TngDatepickerOutputs<TDate>): string | null {
    if (outputs.view === 'day') {
      return outputs.cells.find((cell) => cell.active)?.id ?? null;
    }

    if (outputs.view === 'month') {
      return outputs.monthOptions.find((option) => option.active)?.id ?? null;
    }

    if (outputs.view === 'year') {
      return outputs.yearOptions.find((option) => option.active)?.id ?? null;
    }

    return null;
  }

  private shouldSyncOverlayFocusAfterPickerKey(key: string): boolean {
    return (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End' ||
      key === 'PageUp' ||
      key === 'PageDown' ||
      key === 'Enter' ||
      key === ' ' ||
      key === 'Escape'
    );
  }

  private isPickerActivationKey(key: string): boolean {
    return key === 'Enter' || key === ' ';
  }

  private scheduleOverlayLayoutSync(): void {
    if (!this.overlayOpen() || this.ownerWindow === null) {
      return;
    }

    if (this.overlayLayoutFrame !== null) {
      this.ownerWindow.cancelAnimationFrame(this.overlayLayoutFrame);
    }

    this.overlayLayoutFrame = this.ownerWindow.requestAnimationFrame(() => {
      this.overlayLayoutFrame = null;
      this.positionOverlay();
    });
  }

  private initializeOverlayPortal(overlay: HTMLElement | null): void {
    if (overlay === null || this.overlayPlaceholder !== null) {
      return;
    }

    const placeholderDocument = this.ownerDocument ?? document;
    this.overlayPlaceholder = placeholderDocument.createComment('tng-datepicker-overlay-anchor');
    this.overlayOriginalParent = overlay.parentNode;
    this.overlayOriginalParent?.insertBefore(this.overlayPlaceholder, overlay);
  }

  private positionOverlay(): void {
    const overlay = this.overlayRef()?.nativeElement;
    const anchor = this.anchorRef()?.nativeElement;
    if (overlay === undefined || anchor === undefined || this.ownerWindow === null) {
      return;
    }

    const anchorRect = rectFromClientRect(anchor.getBoundingClientRect());
    const viewport = viewportRect(this.ownerWindow);
    const width = Math.max(
      0,
      Math.min(anchorRect.width, viewport.width - OVERLAY_VIEWPORT_MARGIN * 2),
    );

    overlay.style.width = `${width}px`;
    overlay.style.maxWidth = `${Math.max(0, viewport.width - OVERLAY_VIEWPORT_MARGIN * 2)}px`;
    overlay.style.maxHeight = '';

    const overlayRect = rectFromClientRect(overlay.getBoundingClientRect());
    const result = computeOverlayPosition({
      anchorRect,
      collision: this.resolveOverlayCollision(this.placement()),
      direction: this.direction(),
      offset: this.resolveOverlayOffset(),
      overlayRect,
      placement: this.resolveOverlayPlacement(this.placement()),
      viewportRect: viewport,
    });

    overlay.style.left = `${result.x}px`;
    overlay.style.top = `${result.y}px`;

    const anchorBottom = anchorRect.top + anchorRect.height;
    const availableHeight =
      result.side === 'top'
        ? Math.max(0, Math.floor(anchorRect.top - OVERLAY_VIEWPORT_MARGIN - OVERLAY_OFFSET))
        : Math.max(
            0,
            Math.floor(viewport.height - anchorBottom - OVERLAY_VIEWPORT_MARGIN - OVERLAY_OFFSET),
          );

    if (availableHeight > 0) {
      overlay.style.maxHeight = `${availableHeight}px`;
    }

    this.resolvedOverlayPlacement.set(result.side === 'top' ? 'top' : 'bottom');
    overlay.style.visibility = '';
  }

  private mountOverlayToBodyAndPosition(): void {
    const overlay = this.overlayRef()?.nativeElement;
    if (overlay === undefined || this.ownerDocument === null) {
      return;
    }

    this.initializeOverlayPortal(overlay);
    this.setupOverlayRepositionListeners();

    if (overlay.parentNode !== this.ownerDocument.body) {
      this.ownerDocument.body.appendChild(overlay);
    }

    overlay.style.position = 'fixed';
    overlay.style.left = '0px';
    overlay.style.top = '0px';
    overlay.style.visibility = 'hidden';
    overlay.style.zIndex = '1000';

    queueMicrotask(() => {
      if (!this.overlayOpen()) {
        return;
      }

      this.positionOverlay();
    });
  }

  private restoreOverlayToPlaceholder(force = false): void {
    const overlay = this.overlayRef()?.nativeElement;
    if (overlay === undefined) {
      return;
    }

    if (!force && overlay.parentNode !== this.ownerDocument?.body) {
      return;
    }

    const placeholder = this.overlayPlaceholder;
    if (placeholder?.parentNode !== null && placeholder !== null) {
      placeholder.parentNode.insertBefore(overlay, placeholder);
    } else if (this.overlayOriginalParent !== null) {
      this.overlayOriginalParent.appendChild(overlay);
    }

    this.teardownOverlayRepositionListeners();
    this.resolvedOverlayPlacement.set(this.placement() === 'top' ? 'top' : 'bottom');
    overlay.style.left = '';
    overlay.style.maxHeight = '';
    overlay.style.maxWidth = '';
    overlay.style.position = '';
    overlay.style.top = '';
    overlay.style.visibility = '';
    overlay.style.width = '';
    overlay.style.zIndex = '';
  }

  private setupOverlayRepositionListeners(): void {
    if (this.ownerWindow === null || this.removeResizeListener !== null || this.removeScrollListener !== null) {
      return;
    }

    const schedule = (): void => {
      this.scheduleOverlayLayoutSync();
    };

    this.ownerWindow.addEventListener('resize', schedule);
    this.ownerWindow.addEventListener('scroll', schedule, true);
    this.removeResizeListener = () => this.ownerWindow?.removeEventListener('resize', schedule);
    this.removeScrollListener = () => this.ownerWindow?.removeEventListener('scroll', schedule, true);

    if ('ResizeObserver' in this.ownerWindow) {
      this.resizeObserver = new this.ownerWindow.ResizeObserver(() => {
        this.scheduleOverlayLayoutSync();
      });

      const anchor = this.anchorRef()?.nativeElement;
      if (anchor !== undefined) {
        this.resizeObserver.observe(anchor);
      }

      const overlay = this.overlayRef()?.nativeElement;
      if (overlay !== undefined) {
        this.resizeObserver.observe(overlay);
      }
    }
  }

  private teardownOverlayRepositionListeners(): void {
    this.removeResizeListener?.();
    this.removeScrollListener?.();
    this.removeResizeListener = null;
    this.removeScrollListener = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private resolveOverlayCollision(
    placement: TngDatepickerPlacement,
  ): TngOverlayCollisionOptions {
    return {
      flip: placement === 'auto',
      padding: OVERLAY_VIEWPORT_MARGIN,
      shift: true,
    };
  }

  private resolveOverlayOffset(): TngOverlayOffset {
    return { side: OVERLAY_OFFSET };
  }

  private resolveOverlayPlacement(placement: TngDatepickerPlacement): TngOverlayPlacement {
    return {
      align: 'start',
      side: placement === 'top' ? 'top' : 'bottom',
    };
  }
}
