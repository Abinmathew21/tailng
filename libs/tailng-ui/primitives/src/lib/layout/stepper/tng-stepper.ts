import type { DoCheck, OnDestroy, OnInit } from '@angular/core';
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  isDevMode,
  output,
} from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';

export type TngStepperOrientation = 'horizontal' | 'vertical';
export type TngStepperValue = string | number;
export type TngStepperDataState = 'completed' | 'current' | 'disabled' | 'error' | 'upcoming';
export type TngStepperActivationSource = 'keyboard' | 'pointer' | 'programmatic';

export type TngStepperValueChangeEvent = Readonly<{
  value: TngStepperValue;
  previousValue: TngStepperValue | null;
  trigger: TngStepperActivationSource;
}>;

type TngStepperFocusMove = 'first' | 'last' | 'next' | 'prev';

const createStepperTriggerId = createTngIdFactory('tng-stepper-trigger');
const createStepperPanelId = createTngIdFactory('tng-stepper-panel');
let nextStepperItemRegistrationOrder = 0;

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

function normalizeOrientationInput(value: unknown): TngStepperOrientation {
  return value === 'vertical' ? 'vertical' : 'horizontal';
}

function normalizeOptionalValueInput(value: unknown): TngStepperValue | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  return undefined;
}

function normalizeValueInput(value: unknown): TngStepperValue {
  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  return String(value);
}

function normalizeOptionalStringInput(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  return undefined;
}

function compareStepperItemsByDomPosition(a: TngStepperItem, b: TngStepperItem): number {
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

function valuesEqual(a: TngStepperValue | null, b: TngStepperValue | null): boolean {
  return a === b;
}

@Directive({
  selector: '[tngStepper]',
  exportAs: 'tngStepper',
})
export class TngStepper implements DoCheck, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly items = new Set<TngStepperItem>();
  private uncontrolledValue: TngStepperValue | null = null;
  private focusedValue: TngStepperValue | null = null;
  private lastSelectedValue: TngStepperValue | null = null;
  private lastSelectedIndex = -1;
  private initialized = false;
  private hasUserSelection = false;
  private hasExplicitFocus = false;
  private readonly duplicateWarnings = new Set<TngStepperValue>();

  public readonly value = input<TngStepperValue | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalValueInput,
  });
  public readonly defaultValue = input<TngStepperValue | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalValueInput,
  });
  public readonly orientation = input<TngStepperOrientation, unknown>('horizontal', {
    transform: normalizeOrientationInput,
  });
  public readonly linear = input<boolean, unknown>(false, {
    transform: normalizeBooleanInput,
  });
  public readonly loopFocus = input<boolean, unknown>(true, {
    transform: normalizeBooleanInput,
  });
  public readonly ariaLabel = input<string | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalStringInput,
  });
  public readonly ariaLabelledby = input<string | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalStringInput,
  });

  public readonly valueChange = output<TngStepperValue>();
  public readonly stepChange = output<TngStepperValueChangeEvent>();

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    return this.ariaLabel() ?? null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledbyAttr(): string | null {
    return this.ariaLabelledby() ?? null;
  }

  @HostBinding('attr.data-linear')
  protected get dataLinear(): '' | null {
    return this.linear() ? '' : null;
  }

  @HostBinding('attr.data-orientation')
  protected get dataOrientation(): TngStepperOrientation {
    return this.orientation();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'stepper' as const;

  public ngDoCheck(): void {
    this.syncStateFromRegistry();
  }

  public ngOnDestroy(): void {
    this.items.clear();
  }

  public registerItem(item: TngStepperItem): void {
    this.items.add(item);
    this.syncStateFromRegistry();
  }

  public unregisterItem(item: TngStepperItem): void {
    const orderedItems = [...this.getOrderedItems()].sort(
      (a, b) => a.getLastKnownIndex() - b.getLastKnownIndex(),
    );
    const removedValue = item.getValue();
    const selectedValue = this.getEffectiveValue();
    const removedIndex = valuesEqual(selectedValue, removedValue) ? this.lastSelectedIndex : item.getLastKnownIndex();
    this.items.delete(item);

    if (valuesEqual(selectedValue, removedValue)) {
      this.applyLifecycleSelection(this.resolveNearestEnabledValue(orderedItems, removedIndex));
    }

    if (valuesEqual(this.focusedValue, removedValue)) {
      this.focusedValue = this.resolveNearestEnabledValue(orderedItems, removedIndex);
      this.hasExplicitFocus = false;
    }

    this.syncStateFromRegistry();
  }

  public notifyItemMutated(item: TngStepperItem): void {
    if (this.isItemSelected(item) && item.disabled()) {
      this.applyLifecycleSelection(this.resolveNeighborForItem(item));
    }

    if (valuesEqual(this.focusedValue, item.getValue()) && item.disabled()) {
      this.focusedValue = this.resolveNeighborForItem(item);
      this.hasExplicitFocus = false;
    }

    this.syncStateFromRegistry();
  }

  public select(value: TngStepperValue): void {
    const item = this.findItemByValue(value);
    if (item === null) {
      return;
    }

    this.requestActivation(item, 'programmatic');
  }

  public focus(value: TngStepperValue): void {
    const item = this.findEnabledItemByValue(value);
    if (item === null) {
      return;
    }

    this.focusItem(item);
  }

  public next(): void {
    this.moveFocusFromCurrent('next');
  }

  public prev(): void {
    this.moveFocusFromCurrent('prev');
  }

  public getItemIndex(item: TngStepperItem): number {
    return this.getOrderedItems().indexOf(item);
  }

  public getItemCount(): number {
    return this.getOrderedItems().length;
  }

  public isItemSelected(item: TngStepperItem): boolean {
    return valuesEqual(this.getEffectiveValue(), item.getValue());
  }

  public isItemActivatable(item: TngStepperItem): boolean {
    if (item.disabled()) {
      return false;
    }

    if (!this.linear()) {
      return true;
    }

    if (this.isItemSelected(item) || item.completed()) {
      return true;
    }

    const selectedIndex = this.getSelectedIndex();
    const itemIndex = this.getItemIndex(item);
    return selectedIndex >= 0 && itemIndex >= 0 && itemIndex < selectedIndex;
  }

  public getItemState(item: TngStepperItem): TngStepperDataState {
    if (item.disabled()) {
      return 'disabled';
    }

    if (item.error()) {
      return 'error';
    }

    if (this.isItemSelected(item)) {
      return 'current';
    }

    if (item.completed()) {
      return 'completed';
    }

    return 'upcoming';
  }

  public getTriggerTabIndex(item: TngStepperItem): string {
    if (item.disabled()) {
      return '-1';
    }

    const tabStopValue = this.resolveCurrentTabStopValue();
    if (tabStopValue === null) {
      return '-1';
    }

    return valuesEqual(tabStopValue, item.getValue()) ? '0' : '-1';
  }

  public onTriggerFocused(item: TngStepperItem): void {
    if (!item.disabled()) {
      this.focusedValue = item.getValue();
      this.hasExplicitFocus = true;
    }
  }

  public onTriggerClicked(item: TngStepperItem, event: MouseEvent): void {
    if (!this.isItemActivatable(item)) {
      event.preventDefault();
      return;
    }

    this.requestActivation(item, 'pointer');
  }

  public onTriggerKeydown(item: TngStepperItem, event: KeyboardEvent): void {
    if (item.disabled() || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    if (this.handleFocusKey(item, event)) {
      return;
    }

    if (!this.isActivationKey(event.key)) {
      return;
    }

    event.preventDefault();
    this.requestActivation(item, 'keyboard');
  }

  private requestActivation(item: TngStepperItem, trigger: TngStepperActivationSource): void {
    if (!this.isItemActivatable(item)) {
      return;
    }

    const nextValue = item.getValue();
    const previousValue = this.getEffectiveValue();
    if (valuesEqual(previousValue, nextValue)) {
      return;
    }

    if (!this.isControlled()) {
      this.uncontrolledValue = nextValue;
      this.hasUserSelection = true;
    }

    this.focusedValue = nextValue;
    this.valueChange.emit(nextValue);
    this.stepChange.emit({ value: nextValue, previousValue, trigger });
    this.syncStateFromRegistry();
  }

  private syncStateFromRegistry(): void {
    this.warnForDuplicateValues();

    const enabledItems = this.getEnabledItems();
    if (enabledItems.length === 0) {
      this.clearSelectionState();
      return;
    }

    if (!this.initialized) {
      this.initializeSelection(enabledItems);
    }

    this.restoreRemovedDefaultSelectionIfNeeded();
    this.normalizeSelectionForCurrentItems(enabledItems);
    this.normalizeFocusForCurrentItems(enabledItems);
    this.syncDomAttributes();
  }

  private warnForDuplicateValues(): void {
    if (!isDevMode()) {
      return;
    }

    const seen = new Set<TngStepperValue>();
    for (const item of this.getOrderedItems()) {
      const value = item.getValue();
      if (!seen.has(value)) {
        seen.add(value);
        continue;
      }

      if (this.duplicateWarnings.has(value)) {
        continue;
      }

      this.duplicateWarnings.add(value);
      // eslint-disable-next-line no-console
      console.warn(`TngStepper: duplicate step value "${String(value)}" registered.`);
    }
  }

  private clearSelectionState(): void {
    this.uncontrolledValue = null;
    this.focusedValue = null;
    this.hasExplicitFocus = false;
    this.initialized = true;
    this.syncDomAttributes();
  }

  private initializeSelection(enabledItems: readonly TngStepperItem[]): void {
    this.initialized = true;
    if (this.isControlled()) {
      return;
    }

    const defaultValue = this.defaultValue();
    this.uncontrolledValue =
      defaultValue !== undefined && defaultValue !== null && this.findEnabledItemByValue(defaultValue) !== null
        ? defaultValue
        : (enabledItems[0]?.getValue() ?? null);
  }

  private normalizeSelectionForCurrentItems(enabledItems: readonly TngStepperItem[]): void {
    const selectedItem = this.findEnabledItemByValue(this.getEffectiveValue());
    if (selectedItem === null) {
      if (!this.isControlled()) {
        this.uncontrolledValue = this.resolveNearestEnabledValueForMissingSelection();
      }
      return;
    }

    this.restoreDefaultSelectionIfNeeded(enabledItems);
  }

  private restoreDefaultSelectionIfNeeded(enabledItems: readonly TngStepperItem[]): void {
    if (this.isControlled() || this.hasUserSelection) {
      return;
    }

    const defaultValue = this.defaultValue();
    if (defaultValue === undefined || defaultValue === null) {
      return;
    }

    if (enabledItems.some((item) => valuesEqual(item.getValue(), defaultValue))) {
      this.uncontrolledValue = defaultValue;
    }
  }

  private restoreRemovedDefaultSelectionIfNeeded(): void {
    if (this.isControlled() || this.hasUserSelection) {
      return;
    }

    const defaultValue = this.defaultValue();
    if (
      defaultValue === undefined ||
      defaultValue === null ||
      !valuesEqual(this.lastSelectedValue, defaultValue) ||
      this.findItemByValue(defaultValue) !== null
    ) {
      return;
    }

    const orderedItems = [...this.getOrderedItems()].sort(
      (a, b) => a.getLastKnownIndex() - b.getLastKnownIndex(),
    );
    this.uncontrolledValue = this.resolveNearestEnabledValue(orderedItems, this.lastSelectedIndex);
  }

  private normalizeFocusForCurrentItems(enabledItems: readonly TngStepperItem[]): void {
    if (
      this.hasExplicitFocus &&
      this.focusedValue !== null &&
      this.findEnabledItemByValue(this.focusedValue) !== null
    ) {
      return;
    }

    this.focusedValue = this.getEffectiveValue() ?? enabledItems[0]?.getValue() ?? null;
  }

  private syncDomAttributes(): void {
    const orderedItems = this.getOrderedItems();
    const itemCount = orderedItems.length;
    this.lastSelectedIndex = -1;
    this.lastSelectedValue = null;
    for (const [index, item] of orderedItems.entries()) {
      if (this.isItemSelected(item)) {
        this.lastSelectedIndex = index;
        this.lastSelectedValue = item.getValue();
      }
      item.syncDomAttributes({
        activatable: this.isItemActivatable(item),
        current: this.isItemSelected(item),
        index,
        state: this.getItemState(item),
        tabIndex: this.getTriggerTabIndex(item),
        total: itemCount,
      });
    }
  }

  private applyLifecycleSelection(value: TngStepperValue | null): void {
    if (!this.isControlled()) {
      this.uncontrolledValue = value;
    }
  }

  private handleFocusKey(item: TngStepperItem, event: KeyboardEvent): boolean {
    const move = this.resolveFocusMove(event.key);
    if (move === null) {
      return false;
    }

    if (this.moveFocus(item, move)) {
      event.preventDefault();
    }

    return true;
  }

  private isActivationKey(key: string): boolean {
    return key === 'Enter' || key === ' ' || key === 'Spacebar';
  }

  private resolveFocusMove(key: string): TngStepperFocusMove | null {
    if (key === 'Home') {
      return 'first';
    }

    if (key === 'End') {
      return 'last';
    }

    if (this.orientation() === 'vertical') {
      return this.resolveVerticalFocusMove(key);
    }

    return this.resolveHorizontalFocusMove(key);
  }

  private resolveVerticalFocusMove(key: string): TngStepperFocusMove | null {
    if (key === 'ArrowDown') {
      return 'next';
    }

    if (key === 'ArrowUp') {
      return 'prev';
    }

    return null;
  }

  private resolveHorizontalFocusMove(key: string): TngStepperFocusMove | null {
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') {
      return null;
    }

    const isRtl = this.resolveDirection() === 'rtl';
    const moveNext = key === (isRtl ? 'ArrowLeft' : 'ArrowRight');
    return moveNext ? 'next' : 'prev';
  }

  private moveFocusFromCurrent(move: 'next' | 'prev'): void {
    const current = this.findEnabledItemByValue(this.resolveCurrentTabStopValue()) ?? this.getEnabledItems()[0] ?? null;
    if (current !== null) {
      this.moveFocus(current, move);
    }
  }

  private moveFocus(source: TngStepperItem, move: TngStepperFocusMove): boolean {
    const enabledItems = this.getEnabledItems();
    if (enabledItems.length === 0) {
      return false;
    }

    const currentIndex = enabledItems.indexOf(source);
    if (currentIndex < 0) {
      return false;
    }

    const nextIndex = this.resolveFocusTargetIndex(enabledItems.length, currentIndex, move);
    if (nextIndex === null) {
      return false;
    }

    const target = enabledItems[nextIndex] ?? null;
    if (target === null || target === source) {
      return false;
    }

    this.focusItem(target);
    return true;
  }

  private resolveFocusTargetIndex(
    itemCount: number,
    currentIndex: number,
    move: TngStepperFocusMove,
  ): number | null {
    if (move === 'first') {
      return 0;
    }

    if (move === 'last') {
      return itemCount - 1;
    }

    if (move === 'next') {
      return this.resolveRelativeFocusTargetIndex(itemCount, currentIndex, 1);
    }

    return this.resolveRelativeFocusTargetIndex(itemCount, currentIndex, -1);
  }

  private resolveRelativeFocusTargetIndex(
    itemCount: number,
    currentIndex: number,
    delta: 1 | -1,
  ): number | null {
    const nextIndex = currentIndex + delta;
    if (nextIndex >= 0 && nextIndex < itemCount) {
      return nextIndex;
    }

    if (!this.loopFocus()) {
      return null;
    }

    return delta > 0 ? 0 : itemCount - 1;
  }

  private focusItem(item: TngStepperItem): void {
    this.focusedValue = item.getValue();
    this.hasExplicitFocus = true;
    item.focusTrigger();
  }

  private getEffectiveValue(): TngStepperValue | null {
    if (this.isControlled()) {
      return this.getControlledEffectiveValue();
    }

    return this.getUncontrolledEffectiveValue();
  }

  private getControlledEffectiveValue(): TngStepperValue | null {
    const controlledValue = this.value();
    if (controlledValue === undefined || controlledValue === null) {
      return null;
    }

    const controlledItem = this.findItemByValue(controlledValue);
    if (controlledItem === null) {
      return this.getEnabledItems()[0]?.getValue() ?? null;
    }

    if (controlledItem.disabled()) {
      return this.resolveNeighborForItem(controlledItem);
    }

    return controlledValue;
  }

  private getUncontrolledEffectiveValue(): TngStepperValue | null {
    if (!this.hasUserSelection) {
      const defaultValue = this.defaultValue();
      if (defaultValue !== undefined && defaultValue !== null && this.findEnabledItemByValue(defaultValue) !== null) {
        return defaultValue;
      }
    }

    return this.uncontrolledValue;
  }

  private isControlled(): boolean {
    return this.value() !== undefined;
  }

  private getSelectedIndex(): number {
    const value = this.getEffectiveValue();
    if (value === null) {
      return -1;
    }

    return this.getOrderedItems().findIndex((item) => valuesEqual(item.getValue(), value));
  }

  private resolveCurrentTabStopValue(): TngStepperValue | null {
    if (this.focusedValue !== null && this.findEnabledItemByValue(this.focusedValue) !== null) {
      return this.focusedValue;
    }

    const selectedValue = this.getEffectiveValue();
    if (selectedValue !== null && this.findEnabledItemByValue(selectedValue) !== null) {
      return selectedValue;
    }

    return this.getEnabledItems()[0]?.getValue() ?? null;
  }

  private resolveNeighborForItem(item: TngStepperItem): TngStepperValue | null {
    const orderedItems = this.getOrderedItems();
    return this.resolveNearestEnabledValue(orderedItems, orderedItems.indexOf(item));
  }

  private resolveNearestEnabledValue(
    orderedItems: readonly TngStepperItem[],
    index: number,
  ): TngStepperValue | null {
    for (let i = index - 1; i >= 0; i -= 1) {
      const item = orderedItems[i];
      if (item !== undefined && !item.disabled()) {
        return item.getValue();
      }
    }

    for (let i = index + 1; i < orderedItems.length; i += 1) {
      const item = orderedItems[i];
      if (item !== undefined && !item.disabled()) {
        return item.getValue();
      }
    }

    return null;
  }

  private resolveNearestEnabledValueForMissingSelection(): TngStepperValue | null {
    const controlledValue = this.getEffectiveValue();
    const orderedItems = this.getOrderedItems();
    const selectedIndex = orderedItems.findIndex((item) => valuesEqual(item.getValue(), controlledValue));
    if (selectedIndex >= 0) {
      return this.resolveNearestEnabledValue(orderedItems, selectedIndex);
    }

    return this.getEnabledItems()[0]?.getValue() ?? null;
  }

  private findItemByValue(value: TngStepperValue | null): TngStepperItem | null {
    if (value === null) {
      return null;
    }

    return this.getOrderedItems().find((item) => valuesEqual(item.getValue(), value)) ?? null;
  }

  private findEnabledItemByValue(value: TngStepperValue | null): TngStepperItem | null {
    const item = this.findItemByValue(value);
    return item !== null && !item.disabled() ? item : null;
  }

  private getEnabledItems(): readonly TngStepperItem[] {
    return this.getOrderedItems().filter((item) => !item.disabled());
  }

  private getOrderedItems(): readonly TngStepperItem[] {
    return Array.from(this.items).sort(compareStepperItemsByDomPosition);
  }

  private resolveDirection(): 'ltr' | 'rtl' {
    const host = this.hostRef.nativeElement;
    return host.closest('[dir="rtl"]') !== null ? 'rtl' : 'ltr';
  }
}

@Directive({
  selector: '[tngStepperItem]',
  exportAs: 'tngStepperItem',
})
export class TngStepperItem implements DoCheck, OnDestroy, OnInit {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly stepper = inject(TngStepper);
  private readonly registrationOrder = nextStepperItemRegistrationOrder++;
  private lastKnownIndex = -1;
  private trigger: TngStepperTrigger | null = null;
  private readonly connectors = new Set<TngStepperConnector>();
  private readonly panels = new Set<TngStepperPanel>();
  private readonly triggerId = createStepperTriggerId();

  public readonly value = input<TngStepperValue, unknown>(createStepperTriggerId(), {
    transform: normalizeValueInput,
  });
  public readonly completed = input<boolean, unknown>(false, {
    transform: normalizeBooleanInput,
  });
  public readonly optional = input<boolean, unknown>(false, {
    transform: normalizeBooleanInput,
  });
  public readonly disabled = input<boolean, unknown>(false, {
    transform: normalizeBooleanInput,
  });
  public readonly error = input<boolean, unknown>(false, {
    transform: normalizeBooleanInput,
  });
  public readonly label = input<string | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalStringInput,
  });
  public readonly description = input<string | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalStringInput,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'stepper-item' as const;

  public ngOnInit(): void {
    this.stepper.registerItem(this);
  }

  public ngDoCheck(): void {
    this.stepper.notifyItemMutated(this);
  }

  public ngOnDestroy(): void {
    this.stepper.unregisterItem(this);
  }

  public registerTrigger(trigger: TngStepperTrigger): void {
    this.trigger = trigger;
    this.stepper.notifyItemMutated(this);
  }

  public unregisterTrigger(trigger: TngStepperTrigger): void {
    if (this.trigger === trigger) {
      this.trigger = null;
      this.stepper.notifyItemMutated(this);
    }
  }

  public registerConnector(connector: TngStepperConnector): void {
    this.connectors.add(connector);
    this.stepper.notifyItemMutated(this);
  }

  public unregisterConnector(connector: TngStepperConnector): void {
    this.connectors.delete(connector);
    this.stepper.notifyItemMutated(this);
  }

  public registerPanel(panel: TngStepperPanel): void {
    this.panels.add(panel);
    this.stepper.notifyItemMutated(this);
  }

  public unregisterPanel(panel: TngStepperPanel): void {
    this.panels.delete(panel);
    this.stepper.notifyItemMutated(this);
  }

  public getValue(): TngStepperValue {
    return this.value();
  }

  public getHostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  public getRegistrationOrder(): number {
    return this.registrationOrder;
  }

  public getLastKnownIndex(): number {
    return this.lastKnownIndex;
  }

  public getTriggerId(): string {
    return this.trigger?.getId() ?? this.triggerId;
  }

  public getPanelId(): string | null {
    return Array.from(this.panels)[0]?.getId() ?? null;
  }

  public focusTrigger(): void {
    this.trigger?.focusSelf();
  }

  public syncDomAttributes(state: {
    readonly activatable: boolean;
    readonly current: boolean;
    readonly index: number;
    readonly state: TngStepperDataState;
    readonly tabIndex: string;
    readonly total: number;
  }): void {
    this.lastKnownIndex = state.index;
    const host = this.hostRef.nativeElement;
    host.setAttribute('data-state', state.state);
    host.setAttribute('data-step-index', String(state.index));
    this.setBooleanAttribute(host, 'data-optional', this.optional());

    this.trigger?.syncDomAttributes(state);
    for (const connector of this.connectors) {
      connector.syncDomAttributes(state.state);
    }
    for (const panel of this.panels) {
      panel.syncDomAttributes(state.current, this.getTriggerId());
    }
  }

  private setBooleanAttribute(element: HTMLElement, name: string, value: boolean): void {
    if (value) {
      element.setAttribute(name, '');
    } else {
      element.removeAttribute(name);
    }
  }
}

@Directive({
  selector: '[tngStepperTrigger]',
  exportAs: 'tngStepperTrigger',
})
export class TngStepperTrigger implements OnDestroy, OnInit {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly item = inject(TngStepperItem);
  private readonly stepper = inject(TngStepper);
  private readonly id = createStepperTriggerId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'stepper-trigger' as const;

  @HostBinding('attr.id')
  protected get idAttr(): string {
    const explicitId = this.hostRef.nativeElement.getAttribute('id');
    return explicitId ?? this.id;
  }

  @HostBinding('attr.type')
  protected get typeAttr(): 'button' | null {
    return this.hostRef.nativeElement.tagName.toLowerCase() === 'button' ? 'button' : null;
  }

  public ngOnInit(): void {
    this.item.registerTrigger(this);
  }

  public ngOnDestroy(): void {
    this.item.unregisterTrigger(this);
  }

  public getId(): string {
    return this.idAttr;
  }

  public focusSelf(): void {
    this.hostRef.nativeElement.focus();
  }

  public syncDomAttributes(state: {
    readonly activatable: boolean;
    readonly current: boolean;
    readonly index: number;
    readonly state: TngStepperDataState;
    readonly tabIndex: string;
    readonly total: number;
  }): void {
    const host = this.hostRef.nativeElement;
    if (state.current) {
      host.setAttribute('aria-current', 'step');
    } else {
      host.removeAttribute('aria-current');
    }

    if (!state.activatable) {
      host.setAttribute('aria-disabled', 'true');
    } else {
      host.removeAttribute('aria-disabled');
    }

    host.setAttribute('aria-label', this.resolveAriaLabel(state.index, state.total));
    host.setAttribute('data-state', state.state);
    host.setAttribute('data-step-index', String(state.index));
    host.setAttribute('tabindex', state.tabIndex);
    if (this.item.optional()) {
      host.setAttribute('data-optional', '');
    } else {
      host.removeAttribute('data-optional');
    }

    const panelId = this.item.getPanelId();
    if (panelId !== null) {
      host.setAttribute('aria-controls', panelId);
    } else {
      host.removeAttribute('aria-controls');
    }
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    this.stepper.onTriggerClicked(this.item, event);
  }

  @HostListener('focus')
  protected onFocus(): void {
    this.stepper.onTriggerFocused(this.item);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.stepper.onTriggerKeydown(this.item, event);
  }

  private resolveAriaLabel(index: number, total: number): string {
    const label = this.item.label() ?? this.hostRef.nativeElement.textContent?.trim() ?? 'Step';
    return [label, `Step ${index + 1} of ${total}`, this.resolveStateText()]
      .filter((part) => part.length > 0)
      .join(', ');
  }

  private resolveStateText(): string {
    if (this.item.error()) {
      return 'Error';
    }

    if (this.item.optional()) {
      return 'Optional';
    }

    if (this.item.completed()) {
      return 'Completed';
    }

    return '';
  }
}

@Directive({
  selector: '[tngStepperLabel]',
  exportAs: 'tngStepperLabel',
})
export class TngStepperLabel {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'stepper-label' as const;
}

@Directive({
  selector: '[tngStepperDescription]',
  exportAs: 'tngStepperDescription',
})
export class TngStepperDescription {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'stepper-description' as const;
}

@Directive({
  selector: '[tngStepperPanel]',
  exportAs: 'tngStepperPanel',
})
export class TngStepperPanel implements OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly item = inject(TngStepperItem);
  private readonly panelId = createStepperPanelId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'stepper-panel' as const;

  @HostBinding('attr.id')
  protected get id(): string {
    return this.panelId;
  }

  public constructor() {
    this.item.registerPanel(this);
  }

  public ngOnDestroy(): void {
    this.item.unregisterPanel(this);
  }

  public getId(): string {
    return this.panelId;
  }

  public syncDomAttributes(current: boolean, triggerId: string): void {
    const host = this.hostRef.nativeElement;
    host.setAttribute('aria-labelledby', triggerId);
    host.setAttribute('data-state', current ? 'active' : 'inactive');
    if (current) {
      host.removeAttribute('hidden');
    } else {
      host.setAttribute('hidden', '');
    }
  }
}

@Directive({
  selector: '[tngStepperConnector]',
  exportAs: 'tngStepperConnector',
})
export class TngStepperConnector implements OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly item = inject(TngStepperItem);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'stepper-connector' as const;

  public constructor() {
    this.item.registerConnector(this);
  }

  public ngOnDestroy(): void {
    this.item.unregisterConnector(this);
  }

  public syncDomAttributes(state: TngStepperDataState): void {
    this.hostRef.nativeElement.setAttribute('data-state', state);
  }
}
