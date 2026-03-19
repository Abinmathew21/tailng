import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';

type TngButtonToggleDirection = 'ltr' | 'rtl' | 'auto';
type TngButtonToggleOrientation = 'horizontal' | 'vertical';
type TngButtonToggleActivationMode = 'auto' | 'manual';
type TngButtonToggleType = 'single' | 'multiple';
type TngButtonToggleFocusMove = 'next' | 'prev' | 'first' | 'last';
type TngButtonToggleActionTrigger = 'pointer' | 'keyboard' | 'programmatic';
type TngButtonToggleFocusTrigger = 'pointer' | 'keyboard' | 'programmatic';

export type TngButtonToggleValue = string | number;

export type TngButtonToggleChangeEvent = Readonly<{
  value: TngButtonToggleValue;
  selected: boolean;
  previousValue: TngButtonToggleValue | null;
  previousValues: readonly TngButtonToggleValue[];
  values: readonly TngButtonToggleValue[];
  trigger: TngButtonToggleActionTrigger;
}>;

export type TngButtonToggleFocusChangeEvent = Readonly<{
  value: TngButtonToggleValue;
  previousValue: TngButtonToggleValue | null;
  trigger: TngButtonToggleFocusTrigger;
}>;

const createToggleId = createTngIdFactory('tng-button-toggle-item');
let nextRegistrationOrder = 0;

function normalizeDirectionInput(value: unknown): TngButtonToggleDirection {
  if (value === 'ltr' || value === 'rtl' || value === 'auto') {
    return value;
  }

  return 'auto';
}

function normalizeOrientationInput(value: unknown): TngButtonToggleOrientation {
  return value === 'vertical' ? 'vertical' : 'horizontal';
}

function normalizeActivationInput(value: unknown): TngButtonToggleActivationMode {
  return value === 'manual' ? 'manual' : 'auto';
}

function normalizeTypeInput(value: unknown): TngButtonToggleType {
  return value === 'multiple' ? 'multiple' : 'single';
}

function normalizeOptionalValueInput(value: unknown): TngButtonToggleValue | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  return String(value);
}

function normalizeValueArrayInput(value: unknown): readonly TngButtonToggleValue[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeOptionalValueInput(item))
      .filter((item): item is TngButtonToggleValue => item !== null && item !== undefined);
  }

  if (value instanceof Set) {
    return Array.from(value)
      .map((item) => normalizeOptionalValueInput(item))
      .filter((item): item is TngButtonToggleValue => item !== null && item !== undefined);
  }

  const normalized = normalizeOptionalValueInput(value);
  if (normalized === null || normalized === undefined) {
    return [];
  }

  return [normalized];
}

function normalizeOptionalValueArrayInput(
  value: unknown,
): readonly TngButtonToggleValue[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  return normalizeValueArrayInput(value);
}

function uniqueValues(values: readonly TngButtonToggleValue[]): readonly TngButtonToggleValue[] {
  const unique = new Set<TngButtonToggleValue>();
  for (const value of values) {
    unique.add(value);
  }

  return Array.from(unique);
}

function valuesEqual(a: TngButtonToggleValue | null, b: TngButtonToggleValue | null): boolean {
  return a === b;
}

function compareByDomPosition(
  aElement: HTMLElement,
  bElement: HTMLElement,
  aOrder: number,
  bOrder: number,
): number {
  if (aElement === bElement) {
    return 0;
  }

  const relativePosition = aElement.compareDocumentPosition(bElement);
  if (relativePosition & Node.DOCUMENT_POSITION_FOLLOWING) {
    return -1;
  }

  if (relativePosition & Node.DOCUMENT_POSITION_PRECEDING) {
    return 1;
  }

  return aOrder - bOrder;
}

function isFocusableInteractiveElement(element: Element): boolean {
  return (
    element.matches('a[href]') ||
    element.matches('button') ||
    element.matches('input') ||
    element.matches('select') ||
    element.matches('textarea') ||
    element.matches('[tabindex]') ||
    element.matches('[contenteditable="true"]')
  );
}

function setsEqual(
  a: ReadonlySet<TngButtonToggleValue>,
  b: ReadonlySet<TngButtonToggleValue>,
): boolean {
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

export function resolveTngButtonToggleAriaPressed(pressed: boolean): 'false' | 'true' {
  return pressed ? 'true' : 'false';
}

export function resolveTngButtonToggleDataState(pressed: boolean): 'off' | 'on' {
  return pressed ? 'on' : 'off';
}

@Directive({
  selector: '[tngButtonToggleGroup]',
  exportAs: 'tngButtonToggleGroup',
})
export class TngButtonToggleGroup {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly toggles = new Set<TngButtonToggle>();

  private initializedType: TngButtonToggleType | null = null;
  private uncontrolledSingleValue: TngButtonToggleValue | null = null;
  private uncontrolledMultipleValues = new Set<TngButtonToggleValue>();
  private focusedValue: TngButtonToggleValue | null = null;
  private hasSingleUserSelection = false;
  private hasMultipleUserSelection = false;

  readonly type = input<TngButtonToggleType, unknown>('single', {
    transform: normalizeTypeInput,
  });
  readonly controlledValueInput = input<TngButtonToggleValue | null | undefined, unknown>(
    undefined,
    {
      alias: 'tngButtonToggleValue',
      transform: normalizeOptionalValueInput,
    },
  );
  readonly controlledValuesInput = input<readonly TngButtonToggleValue[] | undefined, unknown>(
    undefined,
    {
      alias: 'tngButtonToggleValues',
      transform: normalizeOptionalValueArrayInput,
    },
  );
  readonly defaultValueInput = input<TngButtonToggleValue | null | undefined, unknown>(undefined, {
    alias: 'tngButtonToggleDefaultValue',
    transform: normalizeOptionalValueInput,
  });
  readonly defaultValuesInput = input<readonly TngButtonToggleValue[] | undefined, unknown>(
    undefined,
    {
      alias: 'tngButtonToggleDefaultValues',
      transform: normalizeOptionalValueArrayInput,
    },
  );
  readonly value = input<TngButtonToggleValue | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalValueInput,
  });
  readonly values = input<readonly TngButtonToggleValue[] | undefined, unknown>(undefined, {
    transform: normalizeOptionalValueArrayInput,
  });
  readonly defaultValue = input<TngButtonToggleValue | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalValueInput,
  });
  readonly defaultValues = input<readonly TngButtonToggleValue[], unknown>([], {
    transform: normalizeValueArrayInput,
  });
  readonly allowEmpty = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly orientation = input<TngButtonToggleOrientation, unknown>('horizontal', {
    transform: normalizeOrientationInput,
  });
  readonly loop = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly activation = input<TngButtonToggleActivationMode, unknown>('auto', {
    transform: normalizeActivationInput,
  });
  readonly dir = input<TngButtonToggleDirection, unknown>('auto', {
    transform: normalizeDirectionInput,
  });

  readonly valueChange = output<TngButtonToggleValue | null>();
  readonly valuesChange = output<readonly TngButtonToggleValue[]>();
  readonly toggleChange = output<TngButtonToggleChangeEvent>();
  readonly focusChange = output<TngButtonToggleFocusChangeEvent>();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'button-toggle-group' as const;

  @HostBinding('attr.data-type')
  protected get dataType(): TngButtonToggleType {
    return this.type();
  }

  @HostBinding('attr.data-orientation')
  protected get dataOrientation(): TngButtonToggleOrientation {
    return this.orientation();
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): 'true' | 'false' {
    return this.disabled() ? 'true' : 'false';
  }

  @HostBinding('attr.role')
  protected get roleAttr(): 'radiogroup' | 'group' {
    return this.type() === 'single' ? 'radiogroup' : 'group';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.disabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-orientation')
  protected get ariaOrientation(): TngButtonToggleOrientation {
    return this.orientation();
  }

  ngDoCheck(): void {
    this.syncStateFromRegistry();
  }

  registerToggle(toggle: TngButtonToggle): void {
    this.toggles.add(toggle);
  }

  unregisterToggle(toggle: TngButtonToggle): void {
    const orderedToggles = this.getOrderedToggles();
    const removedIndex = orderedToggles.indexOf(toggle);
    const removedValue = toggle.getValue();

    const selectedSingleValue = this.getEffectiveSingleSelectedValue();
    const focusedValue = this.resolveCurrentTabStopValue();

    this.toggles.delete(toggle);

    if (
      this.type() === 'single' &&
      !this.isSingleControlled() &&
      selectedSingleValue !== null &&
      valuesEqual(selectedSingleValue, removedValue)
    ) {
      this.uncontrolledSingleValue = this.allowEmpty()
        ? null
        : this.resolveNeighborValueOnRemoval(orderedToggles, removedIndex);
    }

    if (this.type() === 'multiple' && !this.isMultipleControlled()) {
      this.uncontrolledMultipleValues.delete(removedValue);
    }

    if (focusedValue !== null && valuesEqual(focusedValue, removedValue)) {
      this.focusedValue = this.resolveNeighborValueOnRemoval(orderedToggles, removedIndex);
    }

    this.syncStateFromRegistry();
  }

  notifyToggleMutated(toggle: TngButtonToggle): void {
    void toggle;
    this.syncStateFromRegistry();
  }

  isDisabled(): boolean {
    return this.disabled();
  }

  getToggleRole(): 'radio' | null {
    return this.type() === 'single' ? 'radio' : null;
  }

  getToggleTabIndex(toggle: TngButtonToggle): string {
    if (this.disabled() || toggle.isDisabledInContext()) {
      return '-1';
    }

    const tabStop = this.resolveCurrentTabStopValue();
    if (tabStop === null) {
      return '-1';
    }

    return valuesEqual(tabStop, toggle.getValue()) ? '0' : '-1';
  }

  getToggleAriaChecked(toggle: TngButtonToggle): 'true' | 'false' | null {
    if (this.type() !== 'single') {
      return null;
    }

    return this.isToggleSelected(toggle) ? 'true' : 'false';
  }

  getToggleAriaPressed(toggle: TngButtonToggle): 'true' | 'false' | null {
    if (this.type() !== 'multiple') {
      return null;
    }

    return resolveTngButtonToggleAriaPressed(this.isToggleSelected(toggle));
  }

  isToggleSelected(toggle: TngButtonToggle): boolean {
    if (this.type() === 'single') {
      const selectedValue = this.getEffectiveSingleSelectedValue();
      if (selectedValue === null) {
        return false;
      }

      return valuesEqual(selectedValue, toggle.getValue());
    }

    const selectedValues = this.getEffectiveMultipleSelectedValues();
    return selectedValues.has(toggle.getValue());
  }

  isToggleFocused(toggle: TngButtonToggle): boolean {
    const tabStop = this.resolveCurrentTabStopValue();
    if (tabStop === null) {
      return false;
    }

    return valuesEqual(tabStop, toggle.getValue());
  }

  onToggleFocused(toggle: TngButtonToggle, trigger: TngButtonToggleFocusTrigger): void {
    if (this.disabled() || toggle.isDisabledInContext()) {
      return;
    }

    this.setFocusedValue(toggle.getValue(), trigger);
  }

  activateToggle(toggle: TngButtonToggle, trigger: TngButtonToggleActionTrigger): void {
    if (this.disabled() || toggle.isDisabledInContext()) {
      return;
    }

    this.setFocusedValue(toggle.getValue(), trigger === 'programmatic' ? 'programmatic' : 'pointer');

    if (this.type() === 'single') {
      this.requestSingleToggle(toggle.getValue(), trigger);
      return;
    }

    this.requestMultipleToggle(toggle.getValue(), trigger);
  }

  handleToggleKeydown(toggle: TngButtonToggle, event: KeyboardEvent): void {
    if (this.disabled() || toggle.isDisabledInContext()) {
      return;
    }

    const focusMove = this.resolveFocusMove(event.key);
    if (focusMove !== null) {
      event.preventDefault();
      this.moveFocusByAction(toggle, focusMove, 'keyboard');
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
      return;
    }

    event.preventDefault();
    this.activateToggle(toggle, 'keyboard');
  }

  select(value: TngButtonToggleValue): void {
    const targetToggle = this.findEnabledToggleByValue(value);
    if (targetToggle === null) {
      return;
    }

    if (this.type() === 'single') {
      this.requestSingleSelection(value, 'programmatic');
      return;
    }

    this.requestMultipleSelection(value, true, 'programmatic');
  }

  deselect(value: TngButtonToggleValue): void {
    if (this.type() === 'single') {
      const selectedValue = this.getEffectiveSingleSelectedValue();
      if (
        selectedValue === null ||
        !valuesEqual(selectedValue, value) ||
        (!this.allowEmpty() && this.findEnabledToggleByValue(value) !== null)
      ) {
        return;
      }

      this.applySingleSelection(null, value, false, 'programmatic');
      return;
    }

    this.requestMultipleSelection(value, false, 'programmatic');
  }

  toggle(value: TngButtonToggleValue): void {
    if (this.type() === 'single') {
      const selectedValue = this.getEffectiveSingleSelectedValue();
      if (selectedValue !== null && valuesEqual(selectedValue, value) && this.allowEmpty()) {
        this.applySingleSelection(null, value, false, 'programmatic');
        return;
      }

      this.requestSingleSelection(value, 'programmatic');
      return;
    }

    this.requestMultipleToggle(value, 'programmatic');
  }

  focus(value: TngButtonToggleValue): void {
    const targetToggle = this.findEnabledToggleByValue(value);
    if (targetToggle === null) {
      return;
    }

    this.moveFocusToToggle(targetToggle, 'programmatic');
  }

  next(): void {
    this.moveFocusFromCurrentToggle('next', 'programmatic');
  }

  prev(): void {
    this.moveFocusFromCurrentToggle('prev', 'programmatic');
  }

  private requestSingleSelection(
    nextValue: TngButtonToggleValue,
    trigger: TngButtonToggleActionTrigger,
  ): void {
    const targetToggle = this.findEnabledToggleByValue(nextValue);
    if (targetToggle === null) {
      return;
    }

    const selectedValue = this.getEffectiveSingleSelectedValue();
    if (selectedValue !== null && valuesEqual(selectedValue, nextValue)) {
      return;
    }

    this.applySingleSelection(nextValue, nextValue, true, trigger);
  }

  private requestSingleToggle(
    nextValue: TngButtonToggleValue,
    trigger: TngButtonToggleActionTrigger,
  ): void {
    const targetToggle = this.findEnabledToggleByValue(nextValue);
    if (targetToggle === null) {
      return;
    }

    const selectedValue = this.getEffectiveSingleSelectedValue();
    if (selectedValue !== null && valuesEqual(selectedValue, nextValue)) {
      if (!this.allowEmpty()) {
        return;
      }

      this.applySingleSelection(null, nextValue, false, trigger);
      return;
    }

    this.applySingleSelection(nextValue, nextValue, true, trigger);
  }

  private applySingleSelection(
    nextValue: TngButtonToggleValue | null,
    toggledValue: TngButtonToggleValue,
    selected: boolean,
    trigger: TngButtonToggleActionTrigger,
  ): void {
    const previousValue = this.getEffectiveSingleSelectedValue();
    if (valuesEqual(previousValue, nextValue)) {
      return;
    }

    if (!this.isSingleControlled()) {
      this.uncontrolledSingleValue = nextValue;
      this.hasSingleUserSelection = true;
    }

    this.valueChange.emit(nextValue);
    this.toggleChange.emit({
      value: toggledValue,
      selected,
      previousValue,
      previousValues: previousValue === null ? [] : [previousValue],
      values: nextValue === null ? [] : [nextValue],
      trigger,
    });

    this.syncStateFromRegistry();
  }

  private requestMultipleSelection(
    value: TngButtonToggleValue,
    shouldSelect: boolean,
    trigger: TngButtonToggleActionTrigger,
  ): void {
    const targetToggle = this.findEnabledToggleByValue(value);
    if (targetToggle === null) {
      return;
    }

    const previousSelection = this.getEffectiveMultipleSelectedValues();
    const nextSelection = new Set(previousSelection);

    if (shouldSelect) {
      nextSelection.add(value);
    } else {
      nextSelection.delete(value);
    }

    if (setsEqual(previousSelection, nextSelection)) {
      return;
    }

    this.applyMultipleSelection(nextSelection, value, shouldSelect, trigger);
  }

  private requestMultipleToggle(
    value: TngButtonToggleValue,
    trigger: TngButtonToggleActionTrigger,
  ): void {
    const targetToggle = this.findEnabledToggleByValue(value);
    if (targetToggle === null) {
      return;
    }

    const previousSelection = this.getEffectiveMultipleSelectedValues();
    const nextSelection = new Set(previousSelection);
    const selected = !nextSelection.has(value);

    if (selected) {
      nextSelection.add(value);
    } else {
      nextSelection.delete(value);
    }

    this.applyMultipleSelection(nextSelection, value, selected, trigger);
  }

  private applyMultipleSelection(
    nextSelection: ReadonlySet<TngButtonToggleValue>,
    toggledValue: TngButtonToggleValue,
    selected: boolean,
    trigger: TngButtonToggleActionTrigger,
  ): void {
    const previousSelection = this.getEffectiveMultipleSelectedValues();
    if (setsEqual(previousSelection, nextSelection)) {
      return;
    }

    if (!this.isMultipleControlled()) {
      this.uncontrolledMultipleValues = new Set(nextSelection);
      this.hasMultipleUserSelection = true;
    }

    const previousValues = this.getSelectedValuesInDomOrder(previousSelection);
    const values = this.getSelectedValuesInDomOrder(nextSelection);

    this.valuesChange.emit(values);
    this.toggleChange.emit({
      value: toggledValue,
      selected,
      previousValue: null,
      previousValues,
      values,
      trigger,
    });

    this.syncStateFromRegistry();
  }

  private resolveFocusMove(key: string): TngButtonToggleFocusMove | null {
    if (key === 'Home') {
      return 'first';
    }

    if (key === 'End') {
      return 'last';
    }

    if (this.orientation() === 'vertical') {
      if (key === 'ArrowDown') {
        return 'next';
      }

      if (key === 'ArrowUp') {
        return 'prev';
      }

      return null;
    }

    if (key !== 'ArrowLeft' && key !== 'ArrowRight') {
      return null;
    }

    const isRtl = this.resolveDirection() === 'rtl';
    const moveToNext = key === (isRtl ? 'ArrowLeft' : 'ArrowRight');
    return moveToNext ? 'next' : 'prev';
  }

  private moveFocusByAction(
    sourceToggle: TngButtonToggle,
    action: TngButtonToggleFocusMove,
    trigger: TngButtonToggleFocusTrigger,
  ): void {
    const enabledToggles = this.getEnabledToggles();
    if (enabledToggles.length === 0) {
      return;
    }

    const currentIndex = enabledToggles.indexOf(sourceToggle);
    if (currentIndex < 0) {
      return;
    }

    const nextToggle = this.resolveFocusTarget(enabledToggles, currentIndex, action);
    if (nextToggle === null) {
      return;
    }

    this.moveFocusToToggle(nextToggle, trigger);

    if (this.activation() === 'auto' && this.type() === 'single') {
      this.requestSingleSelection(nextToggle.getValue(), trigger === 'programmatic' ? 'programmatic' : 'keyboard');
    }
  }

  private moveFocusToToggle(
    toggle: TngButtonToggle,
    trigger: TngButtonToggleFocusTrigger,
  ): void {
    if (this.disabled() || toggle.isDisabledInContext()) {
      return;
    }

    this.setFocusedValue(toggle.getValue(), trigger);
    toggle.focusSelf();
  }

  private moveFocusFromCurrentToggle(
    direction: 'next' | 'prev',
    trigger: TngButtonToggleFocusTrigger,
  ): void {
    const enabledToggles = this.getEnabledToggles();
    if (enabledToggles.length === 0) {
      return;
    }

    const activeElement = this.hostRef.nativeElement.ownerDocument?.activeElement ?? null;
    const activeToggle = this.findToggleContainingElement(activeElement);
    const currentToggle =
      activeToggle ?? this.findEnabledToggleByValue(this.resolveCurrentTabStopValue(), enabledToggles);

    if (currentToggle === null) {
      return;
    }

    const currentIndex = enabledToggles.indexOf(currentToggle);
    if (currentIndex < 0) {
      return;
    }

    const nextToggle = this.resolveFocusTarget(enabledToggles, currentIndex, direction);
    if (nextToggle === null) {
      return;
    }

    this.moveFocusToToggle(nextToggle, trigger);

    if (this.activation() === 'auto' && this.type() === 'single') {
      this.requestSingleSelection(nextToggle.getValue(), trigger === 'programmatic' ? 'programmatic' : 'keyboard');
    }
  }

  private resolveFocusTarget(
    enabledToggles: readonly TngButtonToggle[],
    currentIndex: number,
    action: TngButtonToggleFocusMove,
  ): TngButtonToggle | null {
    if (enabledToggles.length === 0 || currentIndex < 0) {
      return null;
    }

    if (action === 'first') {
      return enabledToggles[0] ?? null;
    }

    if (action === 'last') {
      return enabledToggles[enabledToggles.length - 1] ?? null;
    }

    if (action === 'next') {
      if (currentIndex + 1 < enabledToggles.length) {
        return enabledToggles[currentIndex + 1] ?? null;
      }

      return this.loop()
        ? (enabledToggles[0] ?? null)
        : (enabledToggles[currentIndex] ?? null);
    }

    if (currentIndex - 1 >= 0) {
      return enabledToggles[currentIndex - 1] ?? null;
    }

    return this.loop()
      ? (enabledToggles[enabledToggles.length - 1] ?? null)
      : (enabledToggles[currentIndex] ?? null);
  }

  private setFocusedValue(
    value: TngButtonToggleValue,
    trigger: TngButtonToggleFocusTrigger,
  ): void {
    const previousValue = this.focusedValue;
    if (previousValue !== null && valuesEqual(previousValue, value)) {
      return;
    }

    this.focusedValue = value;
    this.focusChange.emit({
      value,
      previousValue,
      trigger,
    });
  }

  private resolveDirection(): 'ltr' | 'rtl' {
    const configuredDirection = this.dir();
    if (configuredDirection !== 'auto') {
      return configuredDirection;
    }

    const host = this.hostRef.nativeElement;
    const nearestDirection =
      host.closest<HTMLElement>('[dir]')?.getAttribute('dir') ??
      host.ownerDocument?.documentElement.getAttribute('dir');

    return nearestDirection?.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
  }

  private syncStateFromRegistry(): void {
    const currentType = this.type();
    const enabledToggles = this.getEnabledToggles();

    if (this.initializedType !== currentType) {
      this.initializedType = currentType;
      this.focusedValue = null;
      this.hasSingleUserSelection = false;
      this.hasMultipleUserSelection = false;

      if (currentType === 'single') {
        this.uncontrolledMultipleValues.clear();
        if (!this.isSingleControlled()) {
          this.uncontrolledSingleValue = this.resolveInitialSingleValue(enabledToggles);
        }
      } else {
        this.uncontrolledSingleValue = null;
        if (!this.isMultipleControlled()) {
          this.uncontrolledMultipleValues = new Set(
            this.resolveInitialMultipleValues(enabledToggles),
          );
        }
      }
    }

    if (enabledToggles.length === 0) {
      if (currentType === 'single' && !this.isSingleControlled()) {
        this.uncontrolledSingleValue = null;
      }

      if (currentType === 'multiple' && !this.isMultipleControlled()) {
        this.uncontrolledMultipleValues.clear();
      }

      this.focusedValue = null;
      return;
    }

    if (currentType === 'single') {
      this.syncSingleState(enabledToggles);
    } else {
      this.syncMultipleState(enabledToggles);
    }

    this.focusedValue = this.resolveCurrentTabStopValue(enabledToggles);
  }

  private syncSingleState(enabledToggles: readonly TngButtonToggle[]): void {
    if (this.isSingleControlled()) {
      return;
    }

    const currentValue = this.uncontrolledSingleValue;
    const hasEnabledCurrentValue =
      currentValue !== null && this.findEnabledToggleByValue(currentValue, enabledToggles) !== null;

    if (hasEnabledCurrentValue) {
      return;
    }

    this.uncontrolledSingleValue = this.allowEmpty()
      ? null
      : (enabledToggles[0]?.getValue() ?? null);
  }

  private syncMultipleState(enabledToggles: readonly TngButtonToggle[]): void {
    if (this.isMultipleControlled()) {
      return;
    }

    const enabledSet = new Set(enabledToggles.map((toggle) => toggle.getValue()));

    const nextValues = new Set<TngButtonToggleValue>();
    for (const value of this.uncontrolledMultipleValues) {
      if (enabledSet.has(value)) {
        nextValues.add(value);
      }
    }

    this.uncontrolledMultipleValues = nextValues;
  }

  private resolveInitialSingleValue(
    enabledToggles: readonly TngButtonToggle[],
  ): TngButtonToggleValue | null {
    if (enabledToggles.length === 0) {
      return null;
    }

    const defaultValue = this.getDefaultSingleValueInput();
    if (
      defaultValue !== undefined &&
      defaultValue !== null &&
      this.findEnabledToggleByValue(defaultValue, enabledToggles) !== null
    ) {
      return defaultValue;
    }

    if (this.allowEmpty()) {
      return null;
    }

    return enabledToggles[0]?.getValue() ?? null;
  }

  private resolveInitialMultipleValues(
    enabledToggles: readonly TngButtonToggle[],
  ): readonly TngButtonToggleValue[] {
    if (enabledToggles.length === 0) {
      return [];
    }

    const defaultValues = new Set(uniqueValues(this.getDefaultMultipleValuesInput()));
    if (defaultValues.size === 0) {
      return [];
    }

    const selectedValues: TngButtonToggleValue[] = [];
    for (const toggle of enabledToggles) {
      const value = toggle.getValue();
      if (defaultValues.has(value)) {
        selectedValues.push(value);
      }
    }

    return selectedValues;
  }

  private resolveNeighborValueOnRemoval(
    orderedToggles: readonly TngButtonToggle[],
    removedIndex: number,
  ): TngButtonToggleValue | null {
    if (removedIndex < 0) {
      return this.getEnabledToggles()[0]?.getValue() ?? null;
    }

    for (let index = removedIndex + 1; index < orderedToggles.length; index += 1) {
      const candidate = orderedToggles[index];
      if (candidate !== undefined && !candidate.isSelfDisabled()) {
        return candidate.getValue();
      }
    }

    for (let index = removedIndex - 1; index >= 0; index -= 1) {
      const candidate = orderedToggles[index];
      if (candidate !== undefined && !candidate.isSelfDisabled()) {
        return candidate.getValue();
      }
    }

    return null;
  }

  private resolveNeighborForUnavailableToggle(toggle: TngButtonToggle): TngButtonToggleValue | null {
    const orderedToggles = this.getOrderedToggles();
    const currentIndex = orderedToggles.indexOf(toggle);

    if (currentIndex < 0) {
      return this.getEnabledToggles()[0]?.getValue() ?? null;
    }

    for (let index = currentIndex + 1; index < orderedToggles.length; index += 1) {
      const candidate = orderedToggles[index];
      if (candidate !== undefined && !candidate.isSelfDisabled()) {
        return candidate.getValue();
      }
    }

    for (let index = currentIndex - 1; index >= 0; index -= 1) {
      const candidate = orderedToggles[index];
      if (candidate !== undefined && !candidate.isSelfDisabled()) {
        return candidate.getValue();
      }
    }

    return null;
  }

  private isSingleControlled(): boolean {
    if (this.type() !== 'single') {
      return false;
    }

    return this.getControlledSingleValueInput() !== undefined;
  }

  private isMultipleControlled(): boolean {
    if (this.type() !== 'multiple') {
      return false;
    }

    return this.getControlledMultipleValuesInput() !== undefined;
  }

  private getEffectiveSingleSelectedValue(
    enabledToggles = this.getEnabledToggles(),
  ): TngButtonToggleValue | null {
    if (this.type() !== 'single' || enabledToggles.length === 0) {
      return null;
    }

    let selectedValue = this.isSingleControlled()
      ? ((this.getControlledSingleValueInput() ?? null) as TngButtonToggleValue | null)
      : this.uncontrolledSingleValue;

    if (!this.isSingleControlled() && !this.hasSingleUserSelection) {
      const defaultValue = this.getDefaultSingleValueInput();
      if (
        defaultValue !== undefined &&
        defaultValue !== null &&
        this.findEnabledToggleByValue(defaultValue, enabledToggles) !== null
      ) {
        selectedValue = defaultValue;
      } else if (defaultValue === null) {
        selectedValue = null;
      }
    }

    if (
      selectedValue !== null &&
      this.findEnabledToggleByValue(selectedValue, enabledToggles) !== null
    ) {
      return selectedValue;
    }

    if (this.allowEmpty()) {
      return null;
    }

    return enabledToggles[0]?.getValue() ?? null;
  }

  private getEffectiveMultipleSelectedValues(
    enabledToggles = this.getEnabledToggles(),
  ): ReadonlySet<TngButtonToggleValue> {
    if (this.type() !== 'multiple' || enabledToggles.length === 0) {
      return new Set<TngButtonToggleValue>();
    }

    const sourceValues = this.isMultipleControlled()
      ? uniqueValues(this.getControlledMultipleValuesInput() ?? [])
      : (!this.hasMultipleUserSelection
        ? uniqueValues(this.getDefaultMultipleValuesInput())
        : Array.from(this.uncontrolledMultipleValues));

    const sourceSet = new Set(sourceValues);
    const selectedSet = new Set<TngButtonToggleValue>();

    for (const toggle of enabledToggles) {
      const value = toggle.getValue();
      if (sourceSet.has(value)) {
        selectedSet.add(value);
      }
    }

    return selectedSet;
  }

  private resolveCurrentTabStopValue(
    enabledToggles = this.getEnabledToggles(),
  ): TngButtonToggleValue | null {
    if (enabledToggles.length === 0) {
      return null;
    }

    if (
      this.focusedValue !== null &&
      this.findEnabledToggleByValue(this.focusedValue, enabledToggles) !== null
    ) {
      return this.focusedValue;
    }

    if (this.type() === 'single') {
      const selectedValue = this.getEffectiveSingleSelectedValue(enabledToggles);
      if (selectedValue !== null) {
        return selectedValue;
      }

      return enabledToggles[0]?.getValue() ?? null;
    }

    const selectedValues = this.getEffectiveMultipleSelectedValues(enabledToggles);
    for (const toggle of enabledToggles) {
      const value = toggle.getValue();
      if (selectedValues.has(value)) {
        return value;
      }
    }

    return enabledToggles[0]?.getValue() ?? null;
  }

  private getSelectedValuesInDomOrder(
    selectedValues: ReadonlySet<TngButtonToggleValue>,
    orderedToggles = this.getOrderedToggles(),
  ): readonly TngButtonToggleValue[] {
    if (selectedValues.size === 0) {
      return [];
    }

    const values: TngButtonToggleValue[] = [];
    for (const toggle of orderedToggles) {
      const value = toggle.getValue();
      if (selectedValues.has(value) && !toggle.isSelfDisabled()) {
        values.push(value);
      }
    }

    return values;
  }

  private getOrderedToggles(): TngButtonToggle[] {
    const toggles = Array.from(this.toggles);
    toggles.sort((a, b) =>
      compareByDomPosition(
        a.getHostElement(),
        b.getHostElement(),
        a.getRegistrationOrder(),
        b.getRegistrationOrder(),
      ),
    );

    return toggles;
  }

  private getEnabledToggles(): TngButtonToggle[] {
    return this.getOrderedToggles().filter((toggle) => !toggle.isSelfDisabled());
  }

  private findEnabledToggleByValue(
    value: TngButtonToggleValue | null,
    enabledToggles: readonly TngButtonToggle[] = this.getEnabledToggles(),
  ): TngButtonToggle | null {
    if (value === null) {
      return null;
    }

    return enabledToggles.find((toggle) => valuesEqual(toggle.getValue(), value)) ?? null;
  }

  private findToggleContainingElement(element: Element | null): TngButtonToggle | null {
    if (element === null) {
      return null;
    }

    const toggles = this.getOrderedToggles();
    return (
      toggles.find((toggle) => {
        const host = toggle.getHostElement();
        return host === element || host.contains(element);
      }) ?? null
    );
  }

  private getControlledSingleValueInput(): TngButtonToggleValue | null | undefined {
    const explicit = this.controlledValueInput();
    if (explicit !== undefined) {
      return explicit;
    }

    return this.value();
  }

  private getControlledMultipleValuesInput(): readonly TngButtonToggleValue[] | undefined {
    const explicit = this.controlledValuesInput();
    if (explicit !== undefined) {
      return explicit;
    }

    return this.values();
  }

  private getDefaultSingleValueInput(): TngButtonToggleValue | null | undefined {
    const explicit = this.defaultValueInput();
    if (explicit !== undefined) {
      return explicit;
    }

    return this.defaultValue();
  }

  private getDefaultMultipleValuesInput(): readonly TngButtonToggleValue[] {
    const explicit = this.defaultValuesInput();
    if (explicit !== undefined) {
      return explicit;
    }

    return this.defaultValues();
  }
}

@Directive({
  selector: 'button[tngButtonToggle]',
  exportAs: 'tngButtonToggle',
})
export class TngButtonToggle {
  private readonly hostRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private readonly group = inject(TngButtonToggleGroup, { optional: true });
  private resolvedId = createToggleId();
  private readonly registrationOrder = nextRegistrationOrder++;
  private lastKnownValue: TngButtonToggleValue | null = null;
  private lastKnownDisabled = false;

  readonly toggleValueInput = input<TngButtonToggleValue | null | undefined, unknown>(undefined, {
    alias: 'tngButtonToggleValue',
    transform: normalizeOptionalValueInput,
  });
  readonly valueInput = input<TngButtonToggleValue | null | undefined, unknown>(undefined, {
    alias: 'value',
    transform: normalizeOptionalValueInput,
  });
  readonly disabledInput = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  readonly pressedInput = input<boolean, unknown>(false, {
    alias: 'pressed',
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'button-toggle' as const;

  @HostBinding('attr.id')
  protected get id(): string {
    return this.resolvedId;
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;

  @HostBinding('attr.role')
  protected get roleAttr(): 'radio' | null {
    return this.group?.getToggleRole() ?? null;
  }

  @HostBinding('attr.tabindex')
  protected get tabIndexAttr(): string | null {
    if (this.group === null) {
      return null;
    }

    return this.group.getToggleTabIndex(this);
  }

  @HostBinding('attr.aria-checked')
  protected get ariaCheckedAttr(): 'true' | 'false' | null {
    if (this.group === null) {
      return null;
    }

    return this.group.getToggleAriaChecked(this);
  }

  @HostBinding('attr.aria-pressed')
  protected get ariaPressedAttr(): 'true' | 'false' | null {
    if (this.group !== null) {
      return this.group.getToggleAriaPressed(this);
    }

    return resolveTngButtonToggleAriaPressed(this.pressedInput());
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): 'true' | null {
    return this.isDisabledInContext() ? 'true' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): 'true' | 'false' {
    return this.isDisabledInContext() ? 'true' : 'false';
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): 'true' | 'false' {
    if (this.group === null) {
      return 'false';
    }

    return this.group.isToggleFocused(this) ? 'true' : 'false';
  }

  @HostBinding('attr.data-selected')
  protected get dataSelectedAttr(): 'true' | 'false' {
    if (this.group === null) {
      return this.pressedInput() ? 'true' : 'false';
    }

    return this.group.isToggleSelected(this) ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'on' | 'off' {
    return resolveTngButtonToggleDataState(this.dataSelectedAttr === 'true');
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.isDisabledInContext() ? '' : null;
  }

  constructor() {
    this.group?.registerToggle(this);
  }

  ngOnInit(): void {
    this.syncResolvedIdFromHost();
    this.lastKnownValue = this.getValue();
    this.lastKnownDisabled = this.isDisabledInContext();
    this.group?.notifyToggleMutated(this);
  }

  ngDoCheck(): void {
    this.syncResolvedIdFromHost();
    this.lastKnownValue = this.getValue();
    this.lastKnownDisabled = this.isDisabledInContext();
  }

  ngOnDestroy(): void {
    this.group?.unregisterToggle(this);
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (this.isDisabledInContext()) {
      event.preventDefault();
      return;
    }

    if (this.group === null) {
      return;
    }

    const target = event.target;
    if (target instanceof Element && target !== this.hostRef.nativeElement) {
      if (isFocusableInteractiveElement(target) && this.hostRef.nativeElement.contains(target)) {
        return;
      }
    }

    this.focusSelf();
    this.group.activateToggle(this, 'pointer');
  }

  @HostListener('focus')
  protected onFocus(): void {
    if (this.group === null || this.isDisabledInContext()) {
      return;
    }

    this.group.onToggleFocused(this, 'pointer');
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.group?.handleToggleKeydown(this, event);
  }

  getRegistrationOrder(): number {
    return this.registrationOrder;
  }

  getHostElement(): HTMLButtonElement {
    return this.hostRef.nativeElement;
  }

  getValue(): TngButtonToggleValue {
    const explicitValue = this.toggleValueInput() ?? this.valueInput();
    if (explicitValue !== undefined && explicitValue !== null) {
      return explicitValue;
    }

    const hostPropertyValue = this.hostRef.nativeElement.value;
    if (typeof hostPropertyValue === 'string' && hostPropertyValue.length > 0) {
      return hostPropertyValue;
    }

    const hostValue = this.hostRef.nativeElement.getAttribute('value');
    if (hostValue !== null && hostValue.length > 0) {
      return hostValue;
    }

    return this.resolvedId;
  }

  isDisabledInContext(): boolean {
    if (this.group?.isDisabled()) {
      return true;
    }

    return this.disabledInput();
  }

  isSelfDisabled(): boolean {
    return this.disabledInput();
  }

  focusSelf(): void {
    this.hostRef.nativeElement.focus();
  }

  private syncResolvedIdFromHost(): boolean {
    const hostId = this.hostRef.nativeElement.getAttribute('id');
    if (hostId === null || hostId.length === 0 || hostId === this.resolvedId) {
      return false;
    }

    this.resolvedId = hostId;
    return true;
  }
}
