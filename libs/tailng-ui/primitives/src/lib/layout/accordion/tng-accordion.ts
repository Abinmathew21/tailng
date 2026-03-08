import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';

export type TngAccordionType = 'single' | 'multiple';
export type TngAccordionValue = string | number;
export type TngAccordionTriggerSource = 'pointer' | 'keyboard' | 'programmatic';

export type TngAccordionExpandedChangeEvent = Readonly<{
  value: TngAccordionValue;
  expanded: boolean;
  previousValues: readonly TngAccordionValue[];
  values: readonly TngAccordionValue[];
  trigger: TngAccordionTriggerSource;
}>;

type TngAccordionNavigationAction = 'next' | 'prev' | 'first' | 'last';

const createAccordionItemValue = createTngIdFactory('tng-accordion-item');
const createAccordionTriggerId = createTngIdFactory('tng-accordion-trigger');
const createAccordionPanelId = createTngIdFactory('tng-accordion-panel');

let nextAccordionItemRegistrationOrder = 0;

function normalizeBooleanInput(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === '' || normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }
  }

  return false;
}

function normalizeAccordionType(value: unknown): TngAccordionType {
  return value === 'multiple' ? 'multiple' : 'single';
}

function normalizeAccordionValue(value: unknown): TngAccordionValue {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return value;
  }

  return String(value);
}

function normalizeOptionalAccordionValue(value: unknown): TngAccordionValue | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return normalizeAccordionValue(value);
}

function normalizeAccordionValueInput(
  value: unknown,
): TngAccordionValue | readonly TngAccordionValue[] | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeAccordionValue(entry));
  }

  return normalizeAccordionValue(value);
}

function compareAccordionItemsByDomPosition(a: TngAccordionItem, b: TngAccordionItem): number {
  const aElement = a.getHostElement();
  const bElement = b.getHostElement();

  if (aElement === bElement) {
    return a.getRegistrationOrder() - b.getRegistrationOrder();
  }

  const relativePosition = aElement.compareDocumentPosition(bElement);
  if (relativePosition & Node.DOCUMENT_POSITION_FOLLOWING) {
    return -1;
  }

  if (relativePosition & Node.DOCUMENT_POSITION_PRECEDING) {
    return 1;
  }

  return a.getRegistrationOrder() - b.getRegistrationOrder();
}

function toSet(values: readonly TngAccordionValue[]): Set<TngAccordionValue> {
  return new Set(values);
}

function setsEqual(a: ReadonlySet<TngAccordionValue>, b: ReadonlySet<TngAccordionValue>): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (const value of a) {
    if (!b.has(value)) {
      return false;
    }
  }

  return true;
}

@Directive({
  selector: '[tngAccordion]',
  exportAs: 'tngAccordion',
  standalone: true,
})
export class TngAccordion {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly items = new Set<TngAccordionItem>();
  private uncontrolledValues = new Set<TngAccordionValue>();
  private focusedValue: TngAccordionValue | null = null;
  private initialized = false;
  private lastType: TngAccordionType = 'single';
  private defaultValuesSnapshot: readonly TngAccordionValue[] = [];
  private hasUserInteraction = false;

  readonly type = input<TngAccordionType, unknown>('single', {
    transform: normalizeAccordionType,
  });
  readonly value = input<TngAccordionValue | readonly TngAccordionValue[] | null | undefined, unknown>(
    undefined,
    {
      transform: normalizeAccordionValueInput,
    },
  );
  readonly defaultValue = input<TngAccordionValue | readonly TngAccordionValue[] | null | undefined, unknown>(
    undefined,
    {
      transform: normalizeAccordionValueInput,
    },
  );
  readonly collapsible = input<boolean, unknown>(true, {
    transform: normalizeBooleanInput,
  });
  readonly disabled = input<boolean, unknown>(false, {
    transform: normalizeBooleanInput,
  });
  readonly loop = input<boolean, unknown>(true, {
    transform: normalizeBooleanInput,
  });
  readonly lazy = input<boolean, unknown>(false, {
    transform: normalizeBooleanInput,
  });
  readonly keepAlive = input<boolean, unknown>(true, {
    transform: normalizeBooleanInput,
  });

  readonly valueChange = output<TngAccordionValue | readonly TngAccordionValue[] | null>();
  readonly valuesChange = output<readonly TngAccordionValue[]>();
  readonly expandedChange = output<TngAccordionExpandedChangeEvent>();
  readonly openStart = output<TngAccordionValue>();
  readonly opened = output<TngAccordionValue>();
  readonly closeStart = output<TngAccordionValue>();
  readonly closed = output<TngAccordionValue>();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'accordion' as const;

  @HostBinding('attr.data-type')
  protected get dataType(): TngAccordionType {
    return this.type();
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): 'true' | 'false' {
    return this.disabled() ? 'true' : 'false';
  }

  ngDoCheck(): void {
    this.syncStateFromInputs('check');
  }

  ngOnDestroy(): void {
    this.items.clear();
  }

  registerItem(item: TngAccordionItem): void {
    this.items.add(item);
    this.syncStateFromInputs('registration');
  }

  unregisterItem(item: TngAccordionItem): void {
    const wasExpanded = this.getEffectiveValueSet().has(item.getValue());
    const removedValue = item.getValue();
    this.items.delete(item);

    if (wasExpanded && !this.isControlled()) {
      const next = new Set(this.uncontrolledValues);
      next.delete(removedValue);
      this.uncontrolledValues = next;
    }

    if (this.focusedValue !== null && this.focusedValue === removedValue) {
      this.focusedValue = null;
    }

    this.syncStateFromInputs('check');
  }

  notifyItemMutated(): void {
    this.syncStateFromInputs('check');
  }

  isItemExpanded(item: TngAccordionItem): boolean {
    return this.getEffectiveValueSet().has(item.getValue());
  }

  isItemDisabled(item: TngAccordionItem): boolean {
    return this.disabled() || item.disabled();
  }

  getTriggerTabIndex(item: TngAccordionItem): string {
    if (this.isItemDisabled(item)) {
      return '-1';
    }

    const focusableItem = this.resolveCurrentFocusableItem();
    if (focusableItem === null) {
      return '-1';
    }

    return focusableItem === item ? '0' : '-1';
  }

  onTriggerFocused(item: TngAccordionItem): void {
    if (this.isItemDisabled(item)) {
      return;
    }

    this.focusedValue = item.getValue();
  }

  onTriggerClicked(item: TngAccordionItem): void {
    this.requestToggle(item, 'pointer');
  }

  onTriggerKeydown(item: TngAccordionItem, event: KeyboardEvent): void {
    if (this.isItemDisabled(item) || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.requestToggle(item, 'keyboard');
      return;
    }

    const action = this.resolveNavigationAction(event.key);
    if (action === null) {
      return;
    }

    if (this.moveFocus(item, action)) {
      event.preventDefault();
    }
  }

  isPanelMounted(item: TngAccordionItem): boolean {
    if (this.isItemExpanded(item)) {
      item.markExpandedOnce();
      return true;
    }

    if (!this.keepAlive()) {
      return false;
    }

    if (!this.lazy()) {
      return true;
    }

    return item.hasExpandedOnce();
  }

  open(value: TngAccordionValue): void {
    this.requestSetExpanded(value, true, 'programmatic');
  }

  close(value: TngAccordionValue): void {
    this.requestSetExpanded(value, false, 'programmatic');
  }

  toggle(value: TngAccordionValue): void {
    const expanded = this.getEffectiveValueSet().has(value);
    this.requestSetExpanded(value, !expanded, 'programmatic');
  }

  getExpandedValues(): readonly TngAccordionValue[] {
    const effectiveSet = this.getEffectiveValueSet();
    return this.getOrderedItems()
      .map((item) => item.getValue())
      .filter((value) => effectiveSet.has(value));
  }

  private requestSetExpanded(value: TngAccordionValue, nextExpanded: boolean, trigger: TngAccordionTriggerSource): void {
    const item = this.getOrderedItems().find((candidate) => candidate.getValue() === value) ?? null;
    if (item === null) {
      return;
    }

    if (this.isItemExpanded(item) === nextExpanded) {
      return;
    }

    this.requestToggle(item, trigger, nextExpanded);
  }

  private requestToggle(
    item: TngAccordionItem,
    trigger: TngAccordionTriggerSource,
    forcedExpanded?: boolean,
  ): void {
    if (this.isItemDisabled(item)) {
      return;
    }

    const previous = this.getEffectiveValueSet();
    const next = new Set(previous);
    const itemValue = item.getValue();
    const currentlyExpanded = previous.has(itemValue);
    const shouldExpand = forcedExpanded ?? !currentlyExpanded;

    if (this.type() === 'single') {
      if (!shouldExpand && !this.collapsible()) {
        return;
      }

      next.clear();
      if (shouldExpand) {
        next.add(itemValue);
      }
    } else {
      if (shouldExpand) {
        next.add(itemValue);
      } else {
        next.delete(itemValue);
      }
    }

    if (setsEqual(previous, next)) {
      return;
    }

    if (!this.isControlled()) {
      this.uncontrolledValues = next;
    }

    this.hasUserInteraction = true;
    this.focusedValue = itemValue;
    const previousValues = this.mapSetToOrderedValues(previous);
    const nextValues = this.mapSetToOrderedValues(next);
    const expanded = next.has(itemValue);
    this.emitSelectionOutputs(itemValue, expanded, previousValues, nextValues, trigger);
    this.syncStateFromInputs('check');
  }

  private emitSelectionOutputs(
    value: TngAccordionValue,
    expanded: boolean,
    previousValues: readonly TngAccordionValue[],
    values: readonly TngAccordionValue[],
    trigger: TngAccordionTriggerSource,
  ): void {
    if (expanded) {
      this.openStart.emit(value);
    } else {
      this.closeStart.emit(value);
    }

    if (this.type() === 'single') {
      const nextSingle = values[0] ?? null;
      this.valueChange.emit(nextSingle);
    } else {
      this.valueChange.emit(values);
      this.valuesChange.emit(values);
    }

    this.expandedChange.emit({
      value,
      expanded,
      previousValues,
      values,
      trigger,
    });

    if (expanded) {
      this.opened.emit(value);
    } else {
      this.closed.emit(value);
    }
  }

  private resolveNavigationAction(key: string): TngAccordionNavigationAction | null {
    if (key === 'ArrowDown') {
      return 'next';
    }

    if (key === 'ArrowUp') {
      return 'prev';
    }

    if (key === 'Home') {
      return 'first';
    }

    if (key === 'End') {
      return 'last';
    }

    return null;
  }

  private moveFocus(item: TngAccordionItem, action: TngAccordionNavigationAction): boolean {
    const enabledItems = this.getEnabledItems();
    if (enabledItems.length === 0) {
      return false;
    }

    const currentIndex = enabledItems.indexOf(item);
    if (currentIndex < 0) {
      return false;
    }

    let nextIndex = currentIndex;
    if (action === 'first') {
      nextIndex = 0;
    } else if (action === 'last') {
      nextIndex = enabledItems.length - 1;
    } else if (action === 'next') {
      if (currentIndex + 1 < enabledItems.length) {
        nextIndex = currentIndex + 1;
      } else if (this.loop()) {
        nextIndex = 0;
      } else {
        return false;
      }
    } else if (action === 'prev') {
      if (currentIndex - 1 >= 0) {
        nextIndex = currentIndex - 1;
      } else if (this.loop()) {
        nextIndex = enabledItems.length - 1;
      } else {
        return false;
      }
    }

    const target = enabledItems[nextIndex] ?? null;
    if (target === null || target === item) {
      return false;
    }

    target.focusTrigger();
    this.focusedValue = target.getValue();
    return true;
  }

  private syncStateFromInputs(source: 'check' | 'registration'): void {
    if (!this.initialized) {
      this.initialized = this.initializeUncontrolledState(source);
      if (!this.initialized) {
        return;
      }
    }

    const nextType = this.type();
    if (nextType !== this.lastType) {
      this.lastType = nextType;
      if (!this.isControlled() && nextType === 'single' && this.uncontrolledValues.size > 1) {
        const first = this.mapSetToOrderedValues(this.uncontrolledValues)[0];
        this.uncontrolledValues = first === undefined ? new Set() : new Set([first]);
      }
    }

    if (!this.isControlled()) {
      this.uncontrolledValues = this.normalizeSetForCurrentItems(this.uncontrolledValues);

      if (!this.hasUserInteraction && this.defaultValuesSnapshot.length > 0) {
        const normalizedDefaultValues = this.normalizeSetForCurrentItems(toSet(this.defaultValuesSnapshot));
        if (!setsEqual(this.uncontrolledValues, normalizedDefaultValues)) {
          this.uncontrolledValues = normalizedDefaultValues;
        }
      }
    }

    this.ensureSingleModeNonCollapsibleSelection();
    this.ensureFocusedValueStillValid();
  }

  private initializeUncontrolledState(source: 'check' | 'registration'): boolean {
    if (this.isControlled()) {
      this.uncontrolledValues = new Set();
      return true;
    }

    if (this.items.size === 0) {
      this.uncontrolledValues = new Set();
      return false;
    }

    const defaultInput = this.defaultValue();
    const initialValues = this.normalizeValueInputToArray(defaultInput);
    this.defaultValuesSnapshot = initialValues;
    this.uncontrolledValues = this.normalizeSetForCurrentItems(toSet(initialValues));

    if (initialValues.length === 0) {
      return this.items.size > 0 || source === 'check';
    }

    const requiredValuesCount = new Set(initialValues).size;
    if (this.uncontrolledValues.size >= requiredValuesCount) {
      return true;
    }

    return source === 'check';
  }

  private ensureSingleModeNonCollapsibleSelection(): void {
    if (this.type() !== 'single' || this.collapsible()) {
      return;
    }

    const effectiveValues = this.getEffectiveValueSet();
    if (effectiveValues.size > 0) {
      return;
    }

    const firstEnabled = this.getEnabledItems()[0];
    if (firstEnabled === undefined) {
      return;
    }

    if (this.isControlled()) {
      return;
    }

    this.uncontrolledValues = new Set([firstEnabled.getValue()]);
  }

  private ensureFocusedValueStillValid(): void {
    const enabledItems = this.getEnabledItems();
    if (enabledItems.length === 0) {
      this.focusedValue = null;
      return;
    }

    if (this.focusedValue !== null && enabledItems.some((item) => item.getValue() === this.focusedValue)) {
      return;
    }

    const expandedSet = this.getEffectiveValueSet();
    const expandedItem =
      enabledItems.find((item) => expandedSet.has(item.getValue())) ??
      null;
    this.focusedValue = expandedItem?.getValue() ?? enabledItems[0]?.getValue() ?? null;
  }

  private isControlled(): boolean {
    return this.value() !== undefined;
  }

  private getEffectiveValueSet(): ReadonlySet<TngAccordionValue> {
    if (!this.isControlled()) {
      return this.uncontrolledValues;
    }

    const controlledValues = toSet(this.normalizeValueInputToArray(this.value()));
    return this.normalizeSetForCurrentItems(controlledValues);
  }

  private normalizeSetForCurrentItems(values: ReadonlySet<TngAccordionValue>): Set<TngAccordionValue> {
    const availableValues = new Set(this.getOrderedItems().map((item) => item.getValue()));
    const normalized = new Set<TngAccordionValue>();

    for (const value of values) {
      if (availableValues.has(value)) {
        normalized.add(value);
      }
    }

    if (this.type() === 'single') {
      const first = this.mapSetToOrderedValues(normalized)[0];
      return first === undefined ? new Set() : new Set([first]);
    }

    return normalized;
  }

  private normalizeValueInputToArray(
    value: TngAccordionValue | readonly TngAccordionValue[] | null | undefined,
  ): readonly TngAccordionValue[] {
    if (value === undefined || value === null) {
      return [];
    }

    if (Array.isArray(value)) {
      return [...value];
    }

    return [value as TngAccordionValue];
  }

  private mapSetToOrderedValues(values: ReadonlySet<TngAccordionValue>): readonly TngAccordionValue[] {
    return this.getOrderedItems()
      .map((item) => item.getValue())
      .filter((value) => values.has(value));
  }

  private getOrderedItems(): readonly TngAccordionItem[] {
    return Array.from(this.items).sort(compareAccordionItemsByDomPosition);
  }

  private getEnabledItems(): readonly TngAccordionItem[] {
    return this.getOrderedItems().filter((item) => !this.isItemDisabled(item));
  }

  private resolveCurrentFocusableItem(): TngAccordionItem | null {
    const enabledItems = this.getEnabledItems();
    if (enabledItems.length === 0) {
      return null;
    }

    if (this.focusedValue !== null) {
      const focusedItem = enabledItems.find((item) => item.getValue() === this.focusedValue) ?? null;
      if (focusedItem !== null) {
        return focusedItem;
      }
    }

    const expandedValues = this.getEffectiveValueSet();
    const expandedItem = enabledItems.find((item) => expandedValues.has(item.getValue())) ?? null;
    if (expandedItem !== null) {
      return expandedItem;
    }

    return enabledItems[0] ?? null;
  }

  getHostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }
}

@Directive({
  selector: '[tngAccordionItem]',
  exportAs: 'tngAccordionItem',
  standalone: true,
})
export class TngAccordionItem {
  private readonly root = inject(TngAccordion, { optional: true, host: true });
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly fallbackValue = createAccordionItemValue();
  private readonly registrationOrder = nextAccordionItemRegistrationOrder++;
  private trigger: TngAccordionTrigger | null = null;
  private panel: TngAccordionPanel | null = null;
  private expandedOnce = false;

  readonly value = input<TngAccordionValue | undefined, unknown>(undefined, {
    transform: normalizeOptionalAccordionValue,
  });
  readonly disabled = input<boolean, unknown>(false, {
    transform: normalizeBooleanInput,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'accordion-item' as const;

  @HostBinding('attr.data-state')
  protected get dataState(): 'open' | 'closed' {
    return this.root?.isItemExpanded(this) ? 'open' : 'closed';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): 'true' | 'false' {
    return this.disabled() ? 'true' : 'false';
  }

  ngOnInit(): void {
    this.root?.registerItem(this);
  }

  ngDoCheck(): void {
    this.root?.notifyItemMutated();
  }

  ngOnDestroy(): void {
    this.root?.unregisterItem(this);
  }

  getHostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  getRegistrationOrder(): number {
    return this.registrationOrder;
  }

  getValue(): TngAccordionValue {
    return this.value() ?? this.fallbackValue;
  }

  getAccordion(): TngAccordion | null {
    return this.root ?? null;
  }

  registerTrigger(trigger: TngAccordionTrigger): void {
    this.trigger = trigger;
  }

  unregisterTrigger(trigger: TngAccordionTrigger): void {
    if (this.trigger === trigger) {
      this.trigger = null;
    }
  }

  registerPanel(panel: TngAccordionPanel): void {
    this.panel = panel;
  }

  unregisterPanel(panel: TngAccordionPanel): void {
    if (this.panel === panel) {
      this.panel = null;
    }
  }

  focusTrigger(): void {
    this.trigger?.focusSelf();
  }

  getTriggerId(): string | null {
    return this.trigger?.getTriggerId() ?? null;
  }

  getPanelId(): string | null {
    return this.panel?.getPanelId() ?? null;
  }

  markExpandedOnce(): void {
    this.expandedOnce = true;
  }

  hasExpandedOnce(): boolean {
    return this.expandedOnce;
  }
}

@Directive({
  selector: '[tngAccordionTrigger]',
  exportAs: 'tngAccordionTrigger',
  standalone: true,
})
export class TngAccordionTrigger {
  private readonly item = inject(TngAccordionItem, { optional: true, host: true });
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly fallbackTriggerId =
    this.hostRef.nativeElement.getAttribute('id') ?? createAccordionTriggerId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'accordion-trigger' as const;

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolveTriggerId();
  }

  @HostBinding('attr.role')
  protected readonly role = 'button' as const;

  @HostBinding('attr.type')
  protected get typeAttr(): 'button' | null {
    return this.hostRef.nativeElement instanceof HTMLButtonElement ? 'button' : null;
  }

  @HostBinding('attr.tabindex')
  protected get tabIndexAttr(): string {
    if (this.item === null) {
      return this.hostRef.nativeElement.getAttribute('tabindex') ?? '0';
    }

    const root = this.item.getAccordion();
    return root?.getTriggerTabIndex(this.item) ?? '0';
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): 'true' | 'false' {
    if (this.item === null) {
      return 'false';
    }

    return this.item.getAccordion()?.isItemExpanded(this.item) ? 'true' : 'false';
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    return this.item?.getPanelId() ?? null;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    if (this.item === null) {
      return null;
    }

    return this.item.getAccordion()?.isItemDisabled(this.item) ? 'true' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    if (!(this.hostRef.nativeElement instanceof HTMLButtonElement) || this.item === null) {
      return null;
    }

    return this.item.getAccordion()?.isItemDisabled(this.item) ? '' : null;
  }

  @HostBinding('attr.data-state')
  protected get dataState(): 'open' | 'closed' {
    if (this.item === null) {
      return 'closed';
    }

    return this.item.getAccordion()?.isItemExpanded(this.item) ? 'open' : 'closed';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): 'true' | 'false' {
    if (this.item === null) {
      return 'false';
    }

    return this.item.getAccordion()?.isItemDisabled(this.item) ? 'true' : 'false';
  }

  ngOnInit(): void {
    this.item?.registerTrigger(this);
  }

  ngOnDestroy(): void {
    this.item?.unregisterTrigger(this);
  }

  getTriggerId(): string {
    return this.resolveTriggerId();
  }

  focusSelf(): void {
    this.hostRef.nativeElement.focus();
  }

  private resolveTriggerId(): string {
    const explicitId = this.hostRef.nativeElement.getAttribute('id');
    if (explicitId !== null && explicitId.length > 0) {
      return explicitId;
    }

    return this.fallbackTriggerId;
  }

  @HostListener('focus')
  protected onFocus(): void {
    if (this.item === null) {
      return;
    }

    this.item.getAccordion()?.onTriggerFocused(this.item);
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (this.item === null) {
      return;
    }

    const accordion = this.item.getAccordion();
    if (accordion?.isItemDisabled(this.item)) {
      event.preventDefault();
      return;
    }

    accordion?.onTriggerClicked(this.item);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.item === null) {
      return;
    }

    this.item.getAccordion()?.onTriggerKeydown(this.item, event);
  }
}

@Directive({
  selector: '[tngAccordionPanel]',
  exportAs: 'tngAccordionPanel',
  standalone: true,
})
export class TngAccordionPanel {
  private readonly item = inject(TngAccordionItem, { optional: true, host: true });
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly fallbackPanelId = this.hostRef.nativeElement.getAttribute('id') ?? createAccordionPanelId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'accordion-panel' as const;

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvePanelId();
  }

  @HostBinding('attr.role')
  protected readonly role = 'region' as const;

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledBy(): string | null {
    return this.item?.getTriggerId() ?? null;
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    if (this.item === null) {
      return '';
    }

    const accordion = this.item.getAccordion();
    if (accordion === null) {
      return '';
    }

    const isVisible = accordion.isItemExpanded(this.item) && accordion.isPanelMounted(this.item);
    return isVisible ? null : '';
  }

  @HostBinding('attr.data-state')
  protected get dataState(): 'open' | 'closed' {
    if (this.item === null) {
      return 'closed';
    }

    return this.item.getAccordion()?.isItemExpanded(this.item) ? 'open' : 'closed';
  }

  @HostBinding('attr.data-mounted')
  protected get dataMounted(): 'true' | 'false' {
    if (this.item === null) {
      return 'false';
    }

    return this.item.getAccordion()?.isPanelMounted(this.item) ? 'true' : 'false';
  }

  ngOnInit(): void {
    this.item?.registerPanel(this);
  }

  ngDoCheck(): void {
    if (this.item?.getAccordion()?.isItemExpanded(this.item)) {
      this.item.markExpandedOnce();
    }
  }

  ngOnDestroy(): void {
    this.item?.unregisterPanel(this);
  }

  getPanelId(): string {
    return this.resolvePanelId();
  }

  private resolvePanelId(): string {
    const explicitId = this.hostRef.nativeElement.getAttribute('id');
    if (explicitId !== null && explicitId.length > 0) {
      return explicitId;
    }

    return this.fallbackPanelId;
  }
}
