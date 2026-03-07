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

type TngTabsDirection = 'ltr' | 'rtl' | 'auto';
type TngTabsOrientation = 'horizontal' | 'vertical';
type TngTabsActivationMode = 'auto' | 'manual';
type TngTabsScrollButtonsMode = 'auto' | 'off' | 'on';
type TngTabsFocusMove = 'next' | 'prev' | 'first' | 'last';
type TngTabsFocusTrigger = 'pointer' | 'keyboard' | 'programmatic';
type TngTabsSelectionTrigger = 'pointer' | 'keyboard' | 'programmatic';

export type TngTabsValue = string | number;

export type TngTabChangeEvent = Readonly<{
  value: TngTabsValue;
  previousValue: TngTabsValue | null;
  trigger: TngTabsSelectionTrigger;
}>;

export type TngTabsFocusChangeEvent = Readonly<{
  value: TngTabsValue;
  previousValue: TngTabsValue | null;
  trigger: TngTabsFocusTrigger;
}>;

const createTabId = createTngIdFactory('tng-tab');
const createPanelId = createTngIdFactory('tng-tab-panel');
let nextRegistrationOrder = 0;

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

function normalizeOptionalBooleanInput(value: unknown): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return normalizeBooleanInput(value);
}

function normalizeDirectionInput(value: unknown): TngTabsDirection {
  if (value === 'ltr' || value === 'rtl' || value === 'auto') {
    return value;
  }

  return 'auto';
}

function normalizeOrientationInput(value: unknown): TngTabsOrientation {
  return value === 'vertical' ? 'vertical' : 'horizontal';
}

function normalizeActivationInput(value: unknown): TngTabsActivationMode {
  return value === 'manual' ? 'manual' : 'auto';
}

function normalizeScrollButtonsInput(value: unknown): TngTabsScrollButtonsMode {
  if (value === 'auto' || value === 'on' || value === 'off') {
    return value;
  }

  if (value === '' || value === true || value === 'true') {
    return 'auto';
  }

  return 'off';
}

function normalizeOptionalValueInput(value: unknown): TngTabsValue | null | undefined {
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

function normalizeOptionalStringInput(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  return String(value);
}

function valuesEqual(a: TngTabsValue | null, b: TngTabsValue | null): boolean {
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

@Directive({
  selector: '[tngTabs]',
  exportAs: 'tngTabs',
  standalone: true,
})
export class TngTabs {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tabs = new Set<TngTab>();
  private readonly panels = new Set<TngTabPanel>();
  private tabList: TngTabList | null = null;
  private scrollPrevControl: TngTabsScrollButtonPrev | null = null;
  private scrollNextControl: TngTabsScrollButtonNext | null = null;
  private uncontrolledValue: TngTabsValue | null = null;
  private focusedValue: TngTabsValue | null = null;
  private hasUserSelection = false;
  private initialized = false;

  readonly value = input<TngTabsValue | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalValueInput,
  });
  readonly defaultValue = input<TngTabsValue | null | undefined, unknown>(undefined, {
    transform: normalizeOptionalValueInput,
  });
  readonly activation = input<TngTabsActivationMode, unknown>('auto', {
    transform: normalizeActivationInput,
  });
  readonly orientation = input<TngTabsOrientation, unknown>('horizontal', {
    transform: normalizeOrientationInput,
  });
  readonly scrollButtons = input<TngTabsScrollButtonsMode, unknown>('off', {
    transform: normalizeScrollButtonsInput,
  });
  readonly loop = input<boolean, unknown>(true, {
    transform: normalizeBooleanInput,
  });
  readonly dir = input<TngTabsDirection, unknown>('auto', {
    transform: normalizeDirectionInput,
  });
  readonly disabled = input<boolean, unknown>(false, {
    transform: normalizeBooleanInput,
  });
  readonly lazy = input<boolean | undefined, unknown>(undefined, {
    transform: normalizeOptionalBooleanInput,
  });
  readonly keepAlive = input<boolean | undefined, unknown>(undefined, {
    transform: normalizeOptionalBooleanInput,
  });

  readonly valueChange = output<TngTabsValue | null>();
  readonly tabChange = output<TngTabChangeEvent>();
  readonly focusChange = output<TngTabsFocusChangeEvent>();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tabs' as const;

  @HostBinding('attr.data-orientation')
  protected get dataOrientation(): TngTabsOrientation {
    return this.orientation();
  }

  @HostBinding('attr.data-activation')
  protected get dataActivation(): TngTabsActivationMode {
    return this.activation();
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): 'true' | 'false' {
    return this.disabled() ? 'true' : 'false';
  }

  ngDoCheck(): void {
    this.syncStateFromRegistry();
  }

  isDisabled(): boolean {
    return this.disabled();
  }

  isKeepAliveEnabled(): boolean {
    return this.keepAlive() ?? true;
  }

  isLazyEnabled(): boolean {
    return this.lazy() ?? false;
  }

  select(value: TngTabsValue): void {
    const targetTab = this.findEnabledTabByValue(value);
    if (targetTab === null) {
      return;
    }

    this.requestSelection(targetTab, 'programmatic');
  }

  focus(value: TngTabsValue): void {
    const targetTab = this.findEnabledTabByValue(value);
    if (targetTab === null) {
      return;
    }

    this.moveFocusToTab(targetTab, 'programmatic');
    if (this.activation() === 'auto') {
      this.requestSelection(targetTab, 'programmatic');
    }
  }

  next(): void {
    this.moveFocusFromCurrentTab('next', 'programmatic');
  }

  prev(): void {
    this.moveFocusFromCurrentTab('prev', 'programmatic');
  }

  registerTab(tab: TngTab): void {
    this.tabs.add(tab);
  }

  unregisterTab(tab: TngTab): void {
    const orderedTabs = this.getOrderedTabs();
    const removedIndex = orderedTabs.indexOf(tab);
    const removedValue = tab.getValue();
    const selectedValue = this.getEffectiveSelectedValue();
    const focusedValue = this.resolveCurrentTabStopValue();

    this.tabs.delete(tab);

    if (selectedValue !== null && valuesEqual(selectedValue, removedValue)) {
      const nextSelectedValue = this.resolveNeighborValueOnRemoval(orderedTabs, removedIndex);
      this.applyLifecycleSelection(nextSelectedValue);
    }

    if (focusedValue !== null && valuesEqual(focusedValue, removedValue)) {
      const nextFocusedValue = this.resolveNeighborValueOnRemoval(orderedTabs, removedIndex);
      this.focusedValue = nextFocusedValue;
    }

    this.syncStateFromRegistry();
  }

  notifyTabMutated(tab: TngTab): void {
    const selectedValue = this.getEffectiveSelectedValue();
    if (selectedValue !== null && valuesEqual(selectedValue, tab.getValue()) && tab.isDisabledInContext()) {
      const replacement = this.resolveNeighborForDisabledTab(tab);
      this.applyLifecycleSelection(replacement);
    }

    const focusedValue = this.resolveCurrentTabStopValue();
    if (focusedValue !== null && valuesEqual(focusedValue, tab.getValue()) && tab.isDisabledInContext()) {
      this.focusedValue = this.resolveNeighborForDisabledTab(tab);
    }

    this.syncStateFromRegistry();
  }

  registerPanel(panel: TngTabPanel): void {
    this.panels.add(panel);
  }

  unregisterPanel(panel: TngTabPanel): void {
    this.panels.delete(panel);
    this.syncStateFromRegistry();
  }

  notifyPanelMutated(): void {
    this.syncStateFromRegistry();
  }

  registerScrollPrevControl(control: TngTabsScrollButtonPrev): void {
    this.scrollPrevControl = control;
  }

  unregisterScrollPrevControl(control: TngTabsScrollButtonPrev): void {
    if (this.scrollPrevControl === control) {
      this.scrollPrevControl = null;
    }
  }

  registerScrollNextControl(control: TngTabsScrollButtonNext): void {
    this.scrollNextControl = control;
  }

  unregisterScrollNextControl(control: TngTabsScrollButtonNext): void {
    if (this.scrollNextControl === control) {
      this.scrollNextControl = null;
    }
  }

  registerTabList(tabList: TngTabList): void {
    this.tabList = tabList;
  }

  unregisterTabList(tabList: TngTabList): void {
    if (this.tabList !== tabList) {
      return;
    }

    this.tabList = null;
  }

  onTabListScrolled(): void {}

  onTabListFocused(): void {
    if (this.disabled()) {
      return;
    }

    const enabledTabs = this.getEnabledTabs();
    if (enabledTabs.length === 0) {
      return;
    }

    const currentTabStopValue = this.resolveCurrentTabStopValue(enabledTabs);
    const currentTab =
      this.findEnabledTabByValue(currentTabStopValue, enabledTabs) ??
      enabledTabs[0] ??
      null;
    if (currentTab === null) {
      return;
    }

    currentTab.focusSelf();
  }

  handleTabListWheel(event: WheelEvent): void {
    if (this.orientation() !== 'horizontal') {
      return;
    }

    if (!this.isTabListOverflowing()) {
      return;
    }

    const dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (dominantDelta === 0) {
      return;
    }

    event.preventDefault();
    this.scrollTabListBy(dominantDelta);
  }

  isScrollButtonHidden(): boolean {
    return !this.shouldShowScrollButtons();
  }

  isScrollButtonDisabled(direction: 'next' | 'prev'): boolean {
    if (this.isScrollButtonHidden()) {
      return true;
    }

    const tabListElement = this.getTabListElement();
    if (tabListElement === null) {
      return true;
    }

    const maxScrollLeft = Math.max(0, tabListElement.scrollWidth - tabListElement.clientWidth);
    if (direction === 'prev') {
      return tabListElement.scrollLeft <= 0;
    }

    return tabListElement.scrollLeft >= maxScrollLeft;
  }

  onScrollButtonClick(direction: 'next' | 'prev', event: MouseEvent): void {
    if (this.isScrollButtonDisabled(direction)) {
      event.preventDefault();
      return;
    }

    const delta = direction === 'prev' ? -this.resolveTabListScrollStep() : this.resolveTabListScrollStep();
    this.scrollTabListBy(delta);
    event.preventDefault();
  }

  getTabIndex(tab: TngTab): string {
    if (this.disabled() || tab.isDisabledInContext()) {
      return '-1';
    }

    const tabStop = this.resolveCurrentTabStopValue();
    if (tabStop === null) {
      return '-1';
    }

    return valuesEqual(tabStop, tab.getValue()) ? '0' : '-1';
  }

  isTabSelected(tab: TngTab): boolean {
    const selectedValue = this.getEffectiveSelectedValue();
    if (selectedValue === null) {
      return false;
    }

    return valuesEqual(selectedValue, tab.getValue());
  }

  isTabFocused(tab: TngTab): boolean {
    const tabStop = this.resolveCurrentTabStopValue();
    return tabStop !== null && valuesEqual(tabStop, tab.getValue());
  }

  getPanelIdForTab(tab: TngTab): string | null {
    const explicitPanelId = tab.getExplicitPanelId();
    if (explicitPanelId !== null) {
      return explicitPanelId;
    }

    const matchedPanel = this.findPanelByValue(tab.getValue());
    if (matchedPanel !== null) {
      return matchedPanel.getPanelId();
    }

    const tabs = this.getOrderedTabs();
    const panels = this.getOrderedPanels();
    const tabIndex = tabs.indexOf(tab);
    if (tabIndex < 0) {
      return null;
    }

    return panels[tabIndex]?.getPanelId() ?? null;
  }

  getTabIdForPanel(panel: TngTabPanel): string | null {
    const explicitLabelledById = panel.getExplicitLabelledById();
    if (explicitLabelledById !== null) {
      return explicitLabelledById;
    }

    const matchedTab = this.findTabByValue(panel.getValue());
    if (matchedTab !== null) {
      return matchedTab.getItemId();
    }

    const tabs = this.getOrderedTabs();
    const panels = this.getOrderedPanels();
    const panelIndex = panels.indexOf(panel);
    if (panelIndex < 0) {
      return null;
    }

    return tabs[panelIndex]?.getItemId() ?? null;
  }

  isPanelActive(panel: TngTabPanel): boolean {
    const selectedValue = this.getEffectiveSelectedValue();
    if (selectedValue === null) {
      return false;
    }

    return valuesEqual(selectedValue, panel.getValue());
  }

  isPanelMounted(panel: TngTabPanel): boolean {
    if (this.isPanelActive(panel)) {
      panel.markActivated();
      return true;
    }

    const keepAlive = panel.unmountOnExit() ? false : this.isKeepAliveEnabled();
    if (!keepAlive) {
      return false;
    }

    if (!this.isLazyEnabled()) {
      return true;
    }

    return panel.hasActivated();
  }

  onTabFocused(tab: TngTab, trigger: TngTabsFocusTrigger): void {
    if (this.disabled() || tab.isDisabledInContext()) {
      return;
    }

    this.setFocusedValue(tab.getValue(), trigger);
    this.scrollTabIntoView(tab);
  }

  requestSelection(tab: TngTab, trigger: TngTabsSelectionTrigger): void {
    if (this.disabled() || tab.isDisabledInContext()) {
      return;
    }

    const nextValue = tab.getValue();
    const previousValue = this.getEffectiveSelectedValue();
    if (previousValue !== null && valuesEqual(previousValue, nextValue)) {
      return;
    }

    if (!this.isControlled()) {
      this.uncontrolledValue = nextValue;
      this.hasUserSelection = true;
    }

    this.focusedValue = nextValue;
    this.valueChange.emit(nextValue);
    this.tabChange.emit({
      value: nextValue,
      previousValue,
      trigger,
    });

    this.scrollTabIntoView(tab);
    this.syncStateFromRegistry();
  }

  handleTabKeydown(tab: TngTab, event: KeyboardEvent): void {
    if (this.disabled() || tab.isDisabledInContext()) {
      return;
    }

    const focusMove = this.resolveFocusMove(event.key);
    if (focusMove !== null) {
      event.preventDefault();
      this.moveFocusByAction(tab, focusMove, 'keyboard');
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
      return;
    }

    if (this.activation() === 'manual' || this.activation() === 'auto') {
      event.preventDefault();
      this.requestSelection(tab, 'keyboard');
    }
  }

  private resolveFocusMove(key: string): TngTabsFocusMove | null {
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
    sourceTab: TngTab,
    action: TngTabsFocusMove,
    trigger: TngTabsFocusTrigger,
  ): void {
    const enabledTabs = this.getEnabledTabs();
    if (enabledTabs.length === 0) {
      return;
    }

    const currentIndex = enabledTabs.indexOf(sourceTab);
    if (currentIndex < 0) {
      return;
    }

    const nextTab = this.resolveFocusTarget(enabledTabs, currentIndex, action);
    if (nextTab === null) {
      return;
    }

    this.moveFocusToTab(nextTab, trigger);
    if (this.activation() === 'auto') {
      this.requestSelection(nextTab, trigger === 'programmatic' ? 'programmatic' : 'keyboard');
    }
  }

  private moveFocusToTab(tab: TngTab, trigger: TngTabsFocusTrigger): void {
    if (this.disabled() || tab.isDisabledInContext()) {
      return;
    }

    this.setFocusedValue(tab.getValue(), trigger);
    tab.focusSelf();
  }

  private moveFocusFromCurrentTab(
    direction: 'next' | 'prev',
    trigger: TngTabsFocusTrigger,
  ): void {
    const enabledTabs = this.getEnabledTabs();
    if (enabledTabs.length === 0) {
      return;
    }

    const activeElement = this.hostRef.nativeElement.ownerDocument?.activeElement ?? null;
    const activeTab = this.findTabContainingElement(activeElement);
    const currentTab = activeTab ?? this.findEnabledTabByValue(this.resolveCurrentTabStopValue(), enabledTabs);
    if (currentTab === null) {
      return;
    }

    const currentIndex = enabledTabs.indexOf(currentTab);
    if (currentIndex < 0) {
      return;
    }

    const nextTab = this.resolveFocusTarget(enabledTabs, currentIndex, direction);
    if (nextTab === null) {
      return;
    }

    this.moveFocusToTab(nextTab, trigger);
    if (this.activation() === 'auto') {
      this.requestSelection(nextTab, trigger === 'programmatic' ? 'programmatic' : 'keyboard');
    }
  }

  private resolveFocusTarget(
    enabledTabs: readonly TngTab[],
    currentIndex: number,
    action: TngTabsFocusMove,
  ): TngTab | null {
    if (enabledTabs.length === 0 || currentIndex < 0) {
      return null;
    }

    if (action === 'first') {
      return enabledTabs[0] ?? null;
    }

    if (action === 'last') {
      return enabledTabs[enabledTabs.length - 1] ?? null;
    }

    if (action === 'next') {
      if (currentIndex + 1 < enabledTabs.length) {
        return enabledTabs[currentIndex + 1] ?? null;
      }

      return this.loop() ? (enabledTabs[0] ?? null) : (enabledTabs[currentIndex] ?? null);
    }

    if (currentIndex - 1 >= 0) {
      return enabledTabs[currentIndex - 1] ?? null;
    }

    return this.loop()
      ? (enabledTabs[enabledTabs.length - 1] ?? null)
      : (enabledTabs[currentIndex] ?? null);
  }

  private setFocusedValue(value: TngTabsValue, trigger: TngTabsFocusTrigger): void {
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

  private applyLifecycleSelection(nextValue: TngTabsValue | null): void {
    if (this.isControlled()) {
      return;
    }

    this.uncontrolledValue = nextValue;
    if (nextValue !== null) {
      this.focusedValue = nextValue;
    }
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

  private getSelectedValue(): TngTabsValue | null {
    if (this.isControlled()) {
      return this.value() as TngTabsValue;
    }

    return this.uncontrolledValue;
  }

  private getEffectiveSelectedValue(enabledTabs = this.getEnabledTabs()): TngTabsValue | null {
    if (enabledTabs.length === 0) {
      return null;
    }

    const selectedValue = this.getSelectedValue();
    if (selectedValue !== null && this.findEnabledTabByValue(selectedValue, enabledTabs) !== null) {
      return selectedValue;
    }

    return enabledTabs[0]?.getValue() ?? null;
  }

  private resolveCurrentTabStopValue(enabledTabs = this.getEnabledTabs()): TngTabsValue | null {
    if (enabledTabs.length === 0) {
      return null;
    }

    if (this.focusedValue !== null && this.findEnabledTabByValue(this.focusedValue, enabledTabs) !== null) {
      return this.focusedValue;
    }

    const selectedValue = this.getEffectiveSelectedValue(enabledTabs);
    if (selectedValue !== null) {
      return selectedValue;
    }

    return enabledTabs[0]?.getValue() ?? null;
  }

  private syncStateFromRegistry(): void {
    const enabledTabs = this.getEnabledTabs();

    if (!this.initialized) {
      this.initialized = true;
      if (!this.isControlled()) {
        const defaultValue = this.defaultValue();
        if (defaultValue !== undefined && defaultValue !== null) {
          this.uncontrolledValue = this.findEnabledTabByValue(defaultValue, enabledTabs)?.getValue() ?? null;
        } else {
          this.uncontrolledValue = enabledTabs[0]?.getValue() ?? null;
        }
      }
    }

    if (enabledTabs.length === 0) {
      if (!this.isControlled()) {
        this.uncontrolledValue = null;
      }
      this.focusedValue = null;
      return;
    }

    if (!this.isControlled()) {
      const defaultValue = this.defaultValue();
      if (!this.hasUserSelection && defaultValue !== undefined && defaultValue !== null) {
        const defaultTab = this.findEnabledTabByValue(defaultValue, enabledTabs);
        if (defaultTab !== null) {
          this.uncontrolledValue = defaultTab.getValue();
        } else if (this.uncontrolledValue === null) {
          this.uncontrolledValue = enabledTabs[0]?.getValue() ?? null;
        }
      } else {
        const current = this.uncontrolledValue;
        if (current === null || this.findEnabledTabByValue(current, enabledTabs) === null) {
          this.uncontrolledValue = enabledTabs[0]?.getValue() ?? null;
        }
      }
    }

    const selectedValue = this.getEffectiveSelectedValue(enabledTabs);
    if (selectedValue !== null) {
      this.findPanelByValue(selectedValue)?.markActivated();
    }

    this.focusedValue = this.resolveCurrentTabStopValue(enabledTabs);
  }

  private resolveNeighborValueOnRemoval(
    orderedTabs: readonly TngTab[],
    removedIndex: number,
  ): TngTabsValue | null {
    if (removedIndex < 0) {
      return this.getEnabledTabs()[0]?.getValue() ?? null;
    }

    for (let index = removedIndex + 1; index < orderedTabs.length; index += 1) {
      const candidate = orderedTabs[index];
      if (candidate !== undefined && !candidate.isDisabledInContext()) {
        return candidate.getValue();
      }
    }

    for (let index = removedIndex - 1; index >= 0; index -= 1) {
      const candidate = orderedTabs[index];
      if (candidate !== undefined && !candidate.isDisabledInContext()) {
        return candidate.getValue();
      }
    }

    return null;
  }

  private resolveNeighborForDisabledTab(tab: TngTab): TngTabsValue | null {
    const orderedTabs = this.getOrderedTabs();
    const currentIndex = orderedTabs.indexOf(tab);
    if (currentIndex < 0) {
      return this.getEnabledTabs()[0]?.getValue() ?? null;
    }

    for (let index = currentIndex - 1; index >= 0; index -= 1) {
      const candidate = orderedTabs[index];
      if (candidate !== undefined && !candidate.isDisabledInContext()) {
        return candidate.getValue();
      }
    }

    for (let index = currentIndex + 1; index < orderedTabs.length; index += 1) {
      const candidate = orderedTabs[index];
      if (candidate !== undefined && !candidate.isDisabledInContext()) {
        return candidate.getValue();
      }
    }

    return null;
  }

  private isControlled(): boolean {
    const value = this.value();
    return value !== undefined && value !== null;
  }

  private getOrderedTabs(): TngTab[] {
    const tabs = Array.from(this.tabs);
    tabs.sort((a, b) =>
      compareByDomPosition(
        a.getHostElement(),
        b.getHostElement(),
        a.getRegistrationOrder(),
        b.getRegistrationOrder(),
      ),
    );
    return tabs;
  }

  private getEnabledTabs(): TngTab[] {
    return this.getOrderedTabs().filter((tab) => !tab.isDisabledInContext());
  }

  private getOrderedPanels(): TngTabPanel[] {
    const panels = Array.from(this.panels);
    panels.sort((a, b) =>
      compareByDomPosition(
        a.getHostElement(),
        b.getHostElement(),
        a.getRegistrationOrder(),
        b.getRegistrationOrder(),
      ),
    );
    return panels;
  }

  private findTabByValue(value: TngTabsValue | null): TngTab | null {
    if (value === null) {
      return null;
    }

    const tabs = this.getOrderedTabs();
    return tabs.find((tab) => valuesEqual(tab.getValue(), value)) ?? null;
  }

  private findEnabledTabByValue(
    value: TngTabsValue | null,
    enabledTabs = this.getEnabledTabs(),
  ): TngTab | null {
    if (value === null) {
      return null;
    }

    return enabledTabs.find((tab) => valuesEqual(tab.getValue(), value)) ?? null;
  }

  private findPanelByValue(value: TngTabsValue | null): TngTabPanel | null {
    if (value === null) {
      return null;
    }

    const panels = this.getOrderedPanels();
    return panels.find((panel) => valuesEqual(panel.getValue(), value)) ?? null;
  }

  private findTabContainingElement(element: Element | null): TngTab | null {
    if (element === null) {
      return null;
    }

    const tabs = this.getOrderedTabs();
    return (
      tabs.find((tab) => {
        const host = tab.getHostElement();
        return host === element || host.contains(element);
      }) ?? null
    );
  }

  private getTabListElement(): HTMLElement | null {
    return this.tabList?.getHostElement() ?? null;
  }

  private isTabListOverflowing(): boolean {
    const tabListElement = this.getTabListElement();
    if (tabListElement === null) {
      return false;
    }

    return tabListElement.scrollWidth > tabListElement.clientWidth;
  }

  private shouldShowScrollButtons(): boolean {
    if (this.scrollPrevControl === null && this.scrollNextControl === null) {
      return false;
    }

    const mode = this.scrollButtons();
    if (mode === 'on') {
      return true;
    }

    if (mode !== 'auto') {
      return false;
    }

    return this.isTabListOverflowing();
  }

  private resolveTabListScrollStep(): number {
    const tabListElement = this.getTabListElement();
    if (tabListElement === null) {
      return 120;
    }

    return Math.max(80, Math.round(tabListElement.clientWidth * 0.7));
  }

  private scrollTabListBy(delta: number): void {
    const tabListElement = this.getTabListElement();
    if (tabListElement === null || delta === 0) {
      return;
    }

    tabListElement.scrollLeft += delta;
  }

  private scrollTabIntoView(tab: TngTab): void {
    if (!this.isTabListOverflowing()) {
      return;
    }

    const host = tab.getHostElement();
    const scrollIntoView = host.scrollIntoView as
      | ((options?: ScrollIntoViewOptions) => void)
      | undefined;
    if (typeof scrollIntoView !== 'function') {
      return;
    }

    scrollIntoView.call(host, {
      block: 'nearest',
      inline: 'nearest',
    });
  }
}

@Directive({
  selector: '[tngTabList]',
  exportAs: 'tngTabList',
  standalone: true,
})
export class TngTabList {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tabs = inject(TngTabs, { host: true });

  readonly ariaLabel = input<string | null | undefined, unknown>(undefined, {
    alias: 'ariaLabel',
    transform: normalizeOptionalStringInput,
  });
  readonly ariaLabelledby = input<string | null | undefined, unknown>(undefined, {
    alias: 'ariaLabelledby',
    transform: normalizeOptionalStringInput,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tab-list' as const;

  @HostBinding('attr.role')
  protected readonly role = 'tablist' as const;

  @HostBinding('attr.tabindex')
  protected readonly tabIndex = '-1' as const;

  @HostBinding('attr.aria-orientation')
  protected get ariaOrientation(): TngTabsOrientation {
    return this.tabs.orientation();
  }

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string | null {
    return this.ariaLabel() ?? null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get hostAriaLabelledby(): string | null {
    return this.ariaLabelledby() ?? null;
  }

  constructor() {
    this.tabs.registerTabList(this);
  }

  ngOnDestroy(): void {
    this.tabs.unregisterTabList(this);
  }

  @HostListener('wheel', ['$event'])
  protected onWheel(event: WheelEvent): void {
    this.tabs.handleTabListWheel(event);
  }

  @HostListener('scroll')
  protected onScroll(): void {
    this.tabs.onTabListScrolled();
  }

  @HostListener('focus')
  protected onFocus(): void {
    this.tabs.onTabListFocused();
  }

  getHostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }
}

@Directive({
  selector: '[tngTabsScrollButtonPrev]',
  exportAs: 'tngTabsScrollButtonPrev',
  standalone: true,
})
export class TngTabsScrollButtonPrev {
  private readonly tabs = inject(TngTabs, { host: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tabs-scroll-button-prev' as const;

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.tabs.isScrollButtonHidden() ? '' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabled(): '' | null {
    return this.tabs.isScrollButtonDisabled('prev') ? '' : null;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.tabs.isScrollButtonDisabled('prev') ? 'true' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): 'true' | 'false' {
    return this.tabs.isScrollButtonDisabled('prev') ? 'true' : 'false';
  }

  constructor() {
    this.tabs.registerScrollPrevControl(this);
  }

  ngOnDestroy(): void {
    this.tabs.unregisterScrollPrevControl(this);
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    this.tabs.onScrollButtonClick('prev', event);
  }
}

@Directive({
  selector: '[tngTabsScrollButtonNext]',
  exportAs: 'tngTabsScrollButtonNext',
  standalone: true,
})
export class TngTabsScrollButtonNext {
  private readonly tabs = inject(TngTabs, { host: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tabs-scroll-button-next' as const;

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.tabs.isScrollButtonHidden() ? '' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabled(): '' | null {
    return this.tabs.isScrollButtonDisabled('next') ? '' : null;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.tabs.isScrollButtonDisabled('next') ? 'true' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): 'true' | 'false' {
    return this.tabs.isScrollButtonDisabled('next') ? 'true' : 'false';
  }

  constructor() {
    this.tabs.registerScrollNextControl(this);
  }

  ngOnDestroy(): void {
    this.tabs.unregisterScrollNextControl(this);
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    this.tabs.onScrollButtonClick('next', event);
  }
}

@Directive({
  selector: '[tngTab]',
  exportAs: 'tngTab',
  standalone: true,
})
export class TngTab {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tabs = inject(TngTabs, { host: true });
  private resolvedId = createTabId();
  private readonly registrationOrder = nextRegistrationOrder++;
  private lastKnownValue: TngTabsValue | null = null;
  private lastKnownDisabled = false;

  readonly valueInput = input<TngTabsValue | null | undefined, unknown>(undefined, {
    alias: 'value',
    transform: normalizeOptionalValueInput,
  });
  readonly disabledInput = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: normalizeBooleanInput,
  });
  readonly panelId = input<string | null | undefined, unknown>(undefined, {
    alias: 'panelId',
    transform: normalizeOptionalStringInput,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tab' as const;

  @HostBinding('attr.role')
  protected readonly role = 'tab' as const;

  @HostBinding('attr.id')
  protected get id(): string {
    return this.resolvedId;
  }

  @HostBinding('attr.tabindex')
  protected get tabIndex(): string {
    return this.tabs.getTabIndex(this);
  }

  @HostBinding('attr.aria-selected')
  protected get ariaSelected(): 'true' | 'false' {
    return this.tabs.isTabSelected(this) ? 'true' : 'false';
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    return this.tabs.getPanelIdForTab(this);
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.isDisabledInContext() ? 'true' : null;
  }

  @HostBinding('attr.disabled')
  protected get hostDisabled(): '' | null {
    return this.isDisabledInContext() ? '' : null;
  }

  @HostBinding('attr.data-selected')
  protected get dataSelected(): 'true' | 'false' {
    return this.tabs.isTabSelected(this) ? 'true' : 'false';
  }

  @HostBinding('attr.data-focused')
  protected get dataFocused(): 'true' | 'false' {
    return this.tabs.isTabFocused(this) ? 'true' : 'false';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): 'true' | 'false' {
    return this.isDisabledInContext() ? 'true' : 'false';
  }

  constructor() {
    this.tabs.registerTab(this);
  }

  ngOnInit(): void {
    this.syncResolvedIdFromHost();
    this.lastKnownValue = this.getValue();
    this.lastKnownDisabled = this.isDisabledInContext();
  }

  ngDoCheck(): void {
    const idChanged = this.syncResolvedIdFromHost();
    const currentValue = this.getValue();
    const currentDisabled = this.isDisabledInContext();

    if (
      idChanged ||
      !valuesEqual(this.lastKnownValue, currentValue) ||
      this.lastKnownDisabled !== currentDisabled
    ) {
      this.lastKnownValue = currentValue;
      this.lastKnownDisabled = currentDisabled;
      this.tabs.notifyTabMutated(this);
    }
  }

  ngOnDestroy(): void {
    this.tabs.unregisterTab(this);
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (this.isDisabledInContext()) {
      event.preventDefault();
      return;
    }

    const target = event.target;
    if (target instanceof Element && target !== this.hostRef.nativeElement) {
      if (isFocusableInteractiveElement(target) && this.hostRef.nativeElement.contains(target)) {
        return;
      }
    }

    this.focusSelf();
    this.tabs.requestSelection(this, 'pointer');
  }

  @HostListener('focus')
  protected onFocus(): void {
    if (this.isDisabledInContext()) {
      return;
    }

    this.tabs.onTabFocused(this, 'pointer');
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.tabs.handleTabKeydown(this, event);
  }

  getRegistrationOrder(): number {
    return this.registrationOrder;
  }

  getHostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  getItemId(): string {
    return this.resolvedId;
  }

  getValue(): TngTabsValue {
    const explicitValue = this.valueInput();
    if (explicitValue !== undefined && explicitValue !== null) {
      return explicitValue;
    }

    const hostValue = this.hostRef.nativeElement.getAttribute('value');
    if (hostValue !== null && hostValue.length > 0) {
      return hostValue;
    }

    return this.resolvedId;
  }

  getExplicitPanelId(): string | null {
    return this.panelId() ?? null;
  }

  isDisabledInContext(): boolean {
    if (this.tabs.isDisabled()) {
      return true;
    }

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

@Directive({
  selector: '[tngTabPanel]',
  exportAs: 'tngTabPanel',
  standalone: true,
})
export class TngTabPanel {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tabs = inject(TngTabs, { host: true });
  private resolvedId = createPanelId();
  private readonly registrationOrder = nextRegistrationOrder++;
  private mounted = true;
  private activated = false;
  private anchor: Comment | null = null;
  private lastKnownValue: TngTabsValue | null = null;

  readonly valueInput = input<TngTabsValue | null | undefined, unknown>(undefined, {
    alias: 'value',
    transform: normalizeOptionalValueInput,
  });
  readonly labelledById = input<string | null | undefined, unknown>(undefined, {
    alias: 'labelledById',
    transform: normalizeOptionalStringInput,
  });
  readonly unmountOnExit = input<boolean, unknown>(false, {
    alias: 'unmountOnExit',
    transform: normalizeBooleanInput,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tab-panel' as const;

  @HostBinding('attr.role')
  protected readonly role = 'tabpanel' as const;

  @HostBinding('attr.id')
  protected get id(): string {
    return this.resolvedId;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    return this.getExplicitLabelledById() ?? this.tabs.getTabIdForPanel(this);
  }

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    if (this.tabs.isPanelActive(this)) {
      this.markActivated();
      return null;
    }

    return '';
  }

  @HostBinding('attr.data-active')
  protected get dataActive(): 'true' | 'false' {
    return this.tabs.isPanelActive(this) ? 'true' : 'false';
  }

  constructor() {
    this.tabs.registerPanel(this);
  }

  ngOnInit(): void {
    this.syncResolvedIdFromHost();
    this.lastKnownValue = this.getValue();
    this.syncMountState();
  }

  ngDoCheck(): void {
    const idChanged = this.syncResolvedIdFromHost();
    const currentValue = this.getValue();
    if (idChanged || !valuesEqual(this.lastKnownValue, currentValue)) {
      this.lastKnownValue = currentValue;
      this.tabs.notifyPanelMutated();
    }

    this.syncMountState();
  }

  ngOnDestroy(): void {
    this.tabs.unregisterPanel(this);
    this.removeAnchor();
  }

  getRegistrationOrder(): number {
    return this.registrationOrder;
  }

  getHostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  getPanelId(): string {
    return this.resolvedId;
  }

  getValue(): TngTabsValue {
    const explicitValue = this.valueInput();
    if (explicitValue !== undefined && explicitValue !== null) {
      return explicitValue;
    }

    const hostValue = this.hostRef.nativeElement.getAttribute('value');
    if (hostValue !== null && hostValue.length > 0) {
      return hostValue;
    }

    return this.resolvedId;
  }

  getExplicitLabelledById(): string | null {
    return this.labelledById() ?? null;
  }

  hasActivated(): boolean {
    return this.activated;
  }

  markActivated(): void {
    this.activated = true;
  }

  private syncMountState(): void {
    const shouldMount = this.tabs.isPanelMounted(this);
    if (shouldMount) {
      this.mountHost();
      return;
    }

    this.unmountHost();
  }

  private mountHost(): void {
    if (this.mounted) {
      return;
    }

    const anchor = this.ensureAnchor();
    const parent = anchor.parentNode;
    if (parent === null) {
      return;
    }

    parent.insertBefore(this.hostRef.nativeElement, anchor);
    this.mounted = true;
  }

  private unmountHost(): void {
    if (!this.mounted) {
      return;
    }

    const host = this.hostRef.nativeElement;
    const parent = host.parentNode;
    if (parent === null) {
      return;
    }

    const anchor = this.ensureAnchor();
    if (anchor.parentNode !== parent) {
      parent.insertBefore(anchor, host);
    }

    parent.removeChild(host);
    this.mounted = false;

    if (!this.tabs.isKeepAliveEnabled() || this.unmountOnExit()) {
      this.resetTransientFormState();
    }
  }

  private ensureAnchor(): Comment {
    if (this.anchor !== null) {
      return this.anchor;
    }

    this.anchor = this.hostRef.nativeElement.ownerDocument.createComment('tng-tab-panel');
    return this.anchor;
  }

  private removeAnchor(): void {
    if (this.anchor === null) {
      return;
    }

    this.anchor.parentNode?.removeChild(this.anchor);
    this.anchor = null;
  }

  private resetTransientFormState(): void {
    const controls = this.hostRef.nativeElement.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >('input, textarea, select');

    controls.forEach((control) => {
      if (control instanceof HTMLInputElement) {
        if (control.type === 'checkbox' || control.type === 'radio') {
          control.checked = control.defaultChecked;
        } else {
          control.value = '';
        }
        return;
      }

      if (control instanceof HTMLTextAreaElement) {
        control.value = '';
        return;
      }

      control.selectedIndex = -1;
    });
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
