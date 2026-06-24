import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Injector,
  computed,
  effect,
  inject,
  input,
  signal,
  type OnInit,
  type Signal,
} from '@angular/core';
import type {
  TngDateCell,
  TngDatepickerAttributeMap,
  TngDatepickerController,
  TngDatepickerOutputs,
  TngMonthOption,
  TngYearOption,
} from './datepicker.types';

type TngDatepickerControllerLike = TngDatepickerController<any>;
export type TngBoundDatepicker<TDate> = Readonly<{
  outputs: Signal<TngDatepickerOutputs<TDate>>;
  periodLabel: Signal<string>;
}>;

export function resolveTngDatepickerPeriodLabel<TDate>(
  controller: TngDatepickerController<TDate>,
  outputs: TngDatepickerOutputs<TDate>,
): string {
  if (outputs.view === 'year') {
    const startYear = outputs.yearOptions[0]?.year;
    const endYear = outputs.yearOptions[outputs.yearOptions.length - 1]?.year;
    if (startYear !== undefined && endYear !== undefined) {
      return `${startYear} - ${endYear}`;
    }
  }

  if (outputs.view === 'month') {
    return controller.formatDate(outputs.visibleMonth, 'year-label');
  }

  return outputs.labelMonthYear;
}

export function bindTngDatepicker<TDate>(
  controller: TngDatepickerController<TDate>,
): TngBoundDatepicker<TDate> {
  const destroyRef = inject(DestroyRef);
  const version = signal(0);
  const unsubscribe = controller.subscribe(() => {
    version.update((value) => value + 1);
  });

  destroyRef.onDestroy(() => unsubscribe());

  const outputs = computed(() => {
    version();
    return controller.getOutputs();
  });

  const periodLabel = computed(() => resolveTngDatepickerPeriodLabel(controller, outputs()));

  return Object.freeze({ outputs, periodLabel });
}

function resolveCurrentFocusTargetId(outputs: TngDatepickerOutputs<unknown>): string | null {
  if (outputs.view === 'day') {
    const gridAttributes = outputs.getGridAttributes();
    if (gridAttributes['aria-activedescendant'] !== undefined) {
      return gridAttributes.id ?? null;
    }

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

function shouldSyncOverlayFocusAfterPickerKey(key: string): boolean {
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

function isPickerActivationKey(key: string): boolean {
  return key === 'Enter' || key === ' ';
}

function queueDatepickerOverlayFocusSync(
  controller: TngDatepickerControllerLike,
  ownerDocument: Document | null,
): void {
  const targetDocument = ownerDocument ?? document;

  queueMicrotask(() => {
    const focusTarget = (): void => {
      const outputs = controller.getOutputs();
      if (!outputs.open) {
        return;
      }

      const targetId = resolveCurrentFocusTargetId(outputs);
      if (targetId === null) {
        return;
      }

      const target = targetDocument.getElementById(targetId);
      if (!(target instanceof HTMLElement)) {
        return;
      }

      target.focus();
    };

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => focusTarget());
      return;
    }

    setTimeout(() => focusTarget(), 0);
  });
}

function resolveAttribute(
  attributes: TngDatepickerAttributeMap,
  key: string,
): string | null {
  return attributes[key] ?? null;
}

@Directive()
abstract class TngDatepickerControllerPart implements OnInit {
  protected readonly injector = inject(Injector);
  protected readonly ownerDocument =
    inject(ElementRef<HTMLElement>).nativeElement.ownerDocument ?? null;
  protected readonly renderVersion = signal(0);
  public abstract readonly controller: Signal<TngDatepickerControllerLike>;

  public ngOnInit(): void {
    effect(
      (onCleanup) => {
        const controller = this.controller();
        const unsubscribe = controller.subscribe(() => {
          this.renderVersion.update((value) => value + 1);
        });

        onCleanup(() => unsubscribe());
      },
      { injector: this.injector },
    );
  }

  protected syncOverlayFocus(): void {
    queueDatepickerOverlayFocusSync(this.controller(), this.ownerDocument);
  }
}

@Directive({
  selector: '[tngDatepickerHost]',
  exportAs: 'tngDatepickerHost',
  standalone: true,
})
export class TngDatepickerHost extends TngDatepickerControllerPart {
  public readonly controller = input.required<TngDatepickerControllerLike>({
    alias: 'tngDatepickerHost',
  });

  private readonly attributes = computed(() => {
    this.renderVersion();
    return this.controller().getOutputs().getHostAttributes();
  });

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedby(): string | null {
    return resolveAttribute(this.attributes(), 'aria-describedby');
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabel(): string | null {
    return resolveAttribute(this.attributes(), 'aria-label');
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    return resolveAttribute(this.attributes(), 'aria-labelledby');
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'data-disabled');
  }

  @HostBinding('attr.data-open')
  protected get dataOpen(): string | null {
    return resolveAttribute(this.attributes(), 'data-open');
  }

  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    return resolveAttribute(this.attributes(), 'data-slot');
  }

  @HostBinding('attr.data-view')
  protected get dataView(): string | null {
    return resolveAttribute(this.attributes(), 'data-view');
  }

  @HostBinding('attr.dir')
  protected get dir(): string | null {
    return resolveAttribute(this.attributes(), 'dir');
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    return resolveAttribute(this.attributes(), 'role');
  }
}

@Directive({
  selector: 'input[tngDatepickerInput]',
  exportAs: 'tngDatepickerInput',
  standalone: true,
})
export class TngDatepickerInput extends TngDatepickerControllerPart {
  private readonly inputElement = inject<ElementRef<HTMLInputElement>>(ElementRef);
  public readonly controller = input.required<TngDatepickerControllerLike>({
    alias: 'tngDatepickerInput',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'datepicker-input' as const;

  @HostBinding('value')
  protected get valueProp(): string {
    this.renderVersion();
    return this.controller().getOutputs().inputText;
  }

  @HostBinding('attr.aria-invalid')
  protected get ariaInvalid(): 'true' | null {
    this.renderVersion();
    return this.controller().getOutputs().validationError !== null ? 'true' : null;
  }

  @HostListener('blur')
  protected onBlur(): void {
    this.controller().commitInputText();
  }

  @HostListener('input')
  protected onInput(): void {
    this.controller().setInputText(this.inputElement.nativeElement.value);
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.controller().getOutputs().open) {
      return;
    }

    this.controller().open();
    this.syncOverlayFocus();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.controller().getOutputs().open) {
        this.controller().open();
        this.syncOverlayFocus();
        return;
      }

      this.controller().commitInputText();
      return;
    }

    if (event.key === 'ArrowDown' && !this.controller().getOutputs().open) {
      event.preventDefault();
      this.controller().open();
      this.syncOverlayFocus();
    }
  }
}

@Directive({
  selector: 'button[tngDatepickerTrigger]',
  exportAs: 'tngDatepickerTrigger',
  standalone: true,
})
export class TngDatepickerTrigger extends TngDatepickerControllerPart {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly controller = input.required<TngDatepickerControllerLike>({
    alias: 'tngDatepickerTrigger',
  });

  public override ngOnInit(): void {
    super.ngOnInit();

    effect(
      (onCleanup) => {
        const controller = this.controller();
        const element = this.elementRef.nativeElement;
        controller.registerTrigger(element);

        onCleanup(() => controller.registerTrigger(null));
      },
      { injector: this.injector },
    );
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'datepicker-trigger' as const;

  @HostBinding('attr.aria-haspopup')
  protected get ariaHaspopup(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['aria-haspopup'] ?? null;
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['aria-expanded'] ?? null;
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['aria-controls'] ?? null;
  }

  @HostBinding('attr.data-open')
  protected get dataOpen(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['data-open'] ?? null;
  }

  @HostBinding('attr.tabindex')
  protected get tabindex(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['tabindex'] ?? null;
  }

  @HostListener('click')
  protected onClick(): void {
    const wasOpen = this.controller().getOutputs().open;
    this.controller().toggleOpen();
    if (!wasOpen && this.controller().getOutputs().open) {
      this.syncOverlayFocus();
    }
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const wasOpen = this.controller().getOutputs().open;
    this.controller().handleTriggerKeyDown(event);
    if (!wasOpen && this.controller().getOutputs().open) {
      this.syncOverlayFocus();
    }
  }
}

@Directive({
  selector: 'button[tngDatepickerPrevButton]',
  exportAs: 'tngDatepickerPrevButton',
  standalone: true,
})
export class TngDatepickerPrevButton extends TngDatepickerControllerPart {
  public readonly controller = input.required<TngDatepickerControllerLike>({
    alias: 'tngDatepickerPrevButton',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'datepicker-nav-button' as const;

  @HostListener('click')
  protected onClick(): void {
    if (this.controller().getOutputs().view === 'day') {
      this.controller().prevMonth();
    } else {
      this.controller().prevYear();
    }

    this.syncOverlayFocus();
  }
}

@Directive({
  selector: 'button[tngDatepickerNextButton]',
  exportAs: 'tngDatepickerNextButton',
  standalone: true,
})
export class TngDatepickerNextButton extends TngDatepickerControllerPart {
  public readonly controller = input.required<TngDatepickerControllerLike>({
    alias: 'tngDatepickerNextButton',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'datepicker-nav-button' as const;

  @HostListener('click')
  protected onClick(): void {
    if (this.controller().getOutputs().view === 'day') {
      this.controller().nextMonth();
    } else {
      this.controller().nextYear();
    }

    this.syncOverlayFocus();
  }
}

@Directive({
  selector: 'button[tngDatepickerPeriodButton]',
  exportAs: 'tngDatepickerPeriodButton',
  standalone: true,
})
export class TngDatepickerPeriodButton extends TngDatepickerControllerPart {
  public readonly controller = input.required<TngDatepickerControllerLike>({
    alias: 'tngDatepickerPeriodButton',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'datepicker-period-button' as const;

  @HostBinding('attr.data-interactive')
  protected get dataInteractive(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().view !== 'year' ? 'true' : null;
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.controller().getOutputs().view === 'year') {
      return;
    }

    this.controller().showYearsPanel();
    this.syncOverlayFocus();
  }
}

@Directive({
  selector: '[tngDatepickerDayGrid]',
  exportAs: 'tngDatepickerDayGrid',
  standalone: true,
})
export class TngDatepickerDayGrid extends TngDatepickerControllerPart {
  public readonly controller = input.required<TngDatepickerControllerLike>({
    alias: 'tngDatepickerDayGrid',
  });
  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getGridAttributes()['data-slot'] ?? 'datepicker-grid';
  }

  @HostBinding('attr.id')
  protected get id(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getGridAttributes().id ?? null;
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getGridAttributes()['role'] ?? null;
  }

  @HostBinding('attr.aria-activedescendant')
  protected get ariaActiveDescendant(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getGridAttributes()['aria-activedescendant'] ?? null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getGridAttributes()['aria-labelledby'] ?? null;
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.controller().handleGridKeyDown(event);
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.syncOverlayFocus();
    }
  }
}

@Directive({
  selector: 'button[tngDatepickerDayCell]',
  exportAs: 'tngDatepickerDayCell',
  standalone: true,
})
export class TngDatepickerDayCell extends TngDatepickerControllerPart {
  private readonly dayGrid = inject(TngDatepickerDayGrid);
  public readonly controller = computed(() => this.dayGrid.controller());
  public readonly cell = input.required<Readonly<TngDateCell<any>>>({
    alias: 'tngDatepickerDayCell',
  });

  private readonly attributes = computed(() => {
    this.renderVersion();
    return this.controller().getOutputs().getCellAttributes(this.cell());
  });

  @HostBinding('attr.id')
  protected get id(): string | null {
    return this.attributes().id ?? null;
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    return resolveAttribute(this.attributes(), 'role');
  }

  @HostBinding('attr.tabindex')
  protected get tabindex(): string | null {
    return resolveAttribute(this.attributes(), 'tabindex');
  }

  @HostBinding('disabled')
  protected get disabled(): boolean {
    return this.cell().disabled;
  }

  @HostBinding('attr.aria-current')
  protected get ariaCurrent(): string | null {
    return resolveAttribute(this.attributes(), 'aria-current');
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'aria-disabled');
  }

  @HostBinding('attr.aria-selected')
  protected get ariaSelected(): string | null {
    return resolveAttribute(this.attributes(), 'aria-selected');
  }

  @HostBinding('attr.data-active')
  protected get dataActive(): string | null {
    return resolveAttribute(this.attributes(), 'data-active');
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'data-disabled');
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisible(): string | null {
    return resolveAttribute(this.attributes(), 'data-focus-visible');
  }

  @HostBinding('attr.data-hidden')
  protected get dataHidden(): string | null {
    return resolveAttribute(this.attributes(), 'data-hidden');
  }

  @HostBinding('attr.data-in-month')
  protected get dataInMonth(): string | null {
    return resolveAttribute(this.attributes(), 'data-in-month');
  }

  @HostBinding('attr.data-in-range')
  protected get dataInRange(): string | null {
    return resolveAttribute(this.attributes(), 'data-in-range');
  }

  @HostBinding('attr.data-range-end')
  protected get dataRangeEnd(): string | null {
    return resolveAttribute(this.attributes(), 'data-range-end');
  }

  @HostBinding('attr.data-range-start')
  protected get dataRangeStart(): string | null {
    return resolveAttribute(this.attributes(), 'data-range-start');
  }

  @HostBinding('attr.data-selected')
  protected get dataSelected(): string | null {
    return resolveAttribute(this.attributes(), 'data-selected');
  }

  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    return resolveAttribute(this.attributes(), 'data-slot');
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    const cell = this.cell();
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.controller().handleCellClick(cell.date, { shiftKey: event.shiftKey });
    this.syncOverlayFocus();
  }

  @HostListener('pointerenter')
  protected onPointerEnter(): void {
    const cell = this.cell();
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.controller().handleCellPointerEnter(cell.date);
  }
}

@Directive({
  selector: '[tngDatepickerMonthGrid]',
  exportAs: 'tngDatepickerMonthGrid',
  standalone: true,
})
export class TngDatepickerMonthGrid extends TngDatepickerControllerPart {
  public readonly controller = input.required<TngDatepickerControllerLike>({
    alias: 'tngDatepickerMonthGrid',
  });
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'datepicker-grid' as const;

  @HostBinding('attr.role')
  protected readonly role = 'grid' as const;

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.controller().handleMonthGridKeyDown(event);
    if (isPickerActivationKey(event.key)) {
      this.controller().showDaysPanel();
    }
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.syncOverlayFocus();
    }
  }
}

@Directive({
  selector: 'button[tngDatepickerMonthOption]',
  exportAs: 'tngDatepickerMonthOption',
  standalone: true,
})
export class TngDatepickerMonthOption extends TngDatepickerControllerPart {
  private readonly monthGrid = inject(TngDatepickerMonthGrid);
  public readonly controller = computed(() => this.monthGrid.controller());
  public readonly option = input.required<Readonly<TngMonthOption<any>>>({
    alias: 'tngDatepickerMonthOption',
  });

  private readonly attributes = computed(() => {
    this.renderVersion();
    return this.controller().getOutputs().getMonthAttributes(this.option());
  });

  @HostBinding('attr.id')
  protected get id(): string | null {
    return this.attributes().id ?? null;
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    return resolveAttribute(this.attributes(), 'role');
  }

  @HostBinding('attr.tabindex')
  protected get tabindex(): string | null {
    return resolveAttribute(this.attributes(), 'tabindex');
  }

  @HostBinding('disabled')
  protected get disabled(): boolean {
    return this.option().disabled;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'aria-disabled');
  }

  @HostBinding('attr.aria-selected')
  protected get ariaSelected(): string | null {
    return resolveAttribute(this.attributes(), 'aria-selected');
  }

  @HostBinding('attr.data-active')
  protected get dataActive(): string | null {
    return resolveAttribute(this.attributes(), 'data-active');
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'data-disabled');
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisible(): string | null {
    return resolveAttribute(this.attributes(), 'data-focus-visible');
  }

  @HostBinding('attr.data-selected')
  protected get dataSelected(): string | null {
    return resolveAttribute(this.attributes(), 'data-selected');
  }

  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    return resolveAttribute(this.attributes(), 'data-slot');
  }

  @HostListener('click')
  protected onClick(): void {
    const option = this.option();
    if (option.disabled) {
      return;
    }

    this.controller().selectMonth(option.index);
    this.controller().showDaysPanel();
    this.syncOverlayFocus();
  }
}

@Directive({
  selector: '[tngDatepickerYearGrid]',
  exportAs: 'tngDatepickerYearGrid',
  standalone: true,
})
export class TngDatepickerYearGrid extends TngDatepickerControllerPart {
  public readonly controller = input.required<TngDatepickerControllerLike>({
    alias: 'tngDatepickerYearGrid',
  });
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'datepicker-grid' as const;

  @HostBinding('attr.role')
  protected readonly role = 'grid' as const;

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.controller().handleYearGridKeyDown(event);
    if (isPickerActivationKey(event.key)) {
      this.controller().showMonthsPanel();
    }
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.syncOverlayFocus();
    }
  }
}

@Directive({
  selector: 'button[tngDatepickerYearOption]',
  exportAs: 'tngDatepickerYearOption',
  standalone: true,
})
export class TngDatepickerYearOption extends TngDatepickerControllerPart {
  private readonly yearGrid = inject(TngDatepickerYearGrid);
  public readonly controller = computed(() => this.yearGrid.controller());
  public readonly option = input.required<Readonly<TngYearOption<any>>>({
    alias: 'tngDatepickerYearOption',
  });

  private readonly attributes = computed(() => {
    this.renderVersion();
    return this.controller().getOutputs().getYearAttributes(this.option());
  });

  @HostBinding('attr.id')
  protected get id(): string | null {
    return this.attributes().id ?? null;
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    return resolveAttribute(this.attributes(), 'role');
  }

  @HostBinding('attr.tabindex')
  protected get tabindex(): string | null {
    return resolveAttribute(this.attributes(), 'tabindex');
  }

  @HostBinding('disabled')
  protected get disabled(): boolean {
    return this.option().disabled;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'aria-disabled');
  }

  @HostBinding('attr.aria-selected')
  protected get ariaSelected(): string | null {
    return resolveAttribute(this.attributes(), 'aria-selected');
  }

  @HostBinding('attr.data-active')
  protected get dataActive(): string | null {
    return resolveAttribute(this.attributes(), 'data-active');
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'data-disabled');
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisible(): string | null {
    return resolveAttribute(this.attributes(), 'data-focus-visible');
  }

  @HostBinding('attr.data-selected')
  protected get dataSelected(): string | null {
    return resolveAttribute(this.attributes(), 'data-selected');
  }

  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    return resolveAttribute(this.attributes(), 'data-slot');
  }

  @HostListener('click')
  protected onClick(): void {
    const option = this.option();
    if (option.disabled) {
      return;
    }

    this.controller().selectYear(option.year);
    this.controller().showMonthsPanel();
    this.syncOverlayFocus();
  }
}
