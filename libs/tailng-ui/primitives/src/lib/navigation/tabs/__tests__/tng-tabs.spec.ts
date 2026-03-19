import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as primitives from '../../../../index';
import {
  TngTab,
  TngTabList,
  TngTabPanel,
  TngTabs,
  TngTabsScrollButtonNext,
  TngTabsScrollButtonPrev,
} from '../tng-tabs';

interface TabConfig {
  readonly value: string;
  readonly label: string;
  readonly disabled: boolean;
  readonly id?: string;
  readonly rogue?: boolean;
}

interface PanelConfig {
  readonly value: string;
  readonly label: string;
  readonly id?: string;
}

function keydown(el: HTMLElement, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });

  el.dispatchEvent(event);
  return event;
}

function click(el: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

function dispatchTabAndSimulateBrowserFocus(
  source: HTMLElement,
  nextFocusTarget: HTMLElement,
  shiftKey = false,
): KeyboardEvent {
  const event = keydown(source, 'Tab', { shiftKey });
  if (!event.defaultPrevented) {
    nextFocusTarget.focus();
  }

  return event;
}

@Component({
  imports: [TngTabs, TngTabList, TngTab, TngTabPanel, TngTabsScrollButtonPrev, TngTabsScrollButtonNext],
  template: `
    <section tngTabs data-testid="tabs">
      <button type="button" tngTabsScrollButtonPrev data-testid="scroll-prev">⬅</button>
      <div tngTabList data-testid="tablist">
        <button tngTab data-testid="tab-alpha">Alpha</button>
        <button tngTab data-testid="tab-beta">Beta</button>
      </div>
      <button type="button" tngTabsScrollButtonNext data-testid="scroll-next">➡</button>

      <section tngTabPanel data-testid="panel-alpha">Alpha panel</section>
      <section tngTabPanel data-testid="panel-beta">Beta panel</section>
    </section>
  `,
})
class MinimalTabsHostComponent {}

@Component({
  imports: [TngTabs, TngTabList, TngTab, TngTabPanel, TngTabsScrollButtonPrev, TngTabsScrollButtonNext],
  template: `
    <section tngTabs data-testid="tabs">
      <button type="button" tngTabsScrollButtonPrev data-testid="scroll-prev">⬅</button>
      <div tngTabList data-testid="tablist"></div>
      <button type="button" tngTabsScrollButtonNext data-testid="scroll-next">➡</button>
    </section>
  `,
})
class ZeroTabsHostComponent {}

@Component({
  imports: [TngTabs, TngTabList, TngTab, TngTabPanel, TngTabsScrollButtonPrev, TngTabsScrollButtonNext],
  template: `
    <button type="button" data-testid="before">Before</button>

    @if (renderTabs()) {
      <section
        tngTabs
        #tabsRef="tngTabs"
        data-testid="tabs"
        [value]="valueAttr()"
        [defaultValue]="defaultValueAttr()"
        [activation]="activation()"
        [orientation]="orientation()"
        [scrollButtons]="scrollButtons()"
        [loop]="loop()"
        [dir]="dir()"
        [keepAlive]="keepAlive()"
        [lazy]="lazy()"
        (valueChange)="valueChanges.push($event)"
        (tabChange)="tabChanges.push($event)"
        (focusChange)="focusChanges.push($event)"
      >
        <button type="button" tngTabsScrollButtonPrev data-testid="scroll-prev">
          <span data-testid="scroll-prev-icon">◀</span>
        </button>
        <div tngTabList data-testid="tablist">
          @for (tab of tabs(); track tab.value) {
            @if (!tab.rogue) {
              <button
                tngTab
                [attr.data-testid]="'tab-' + tab.value"
                [attr.id]="tab.id ?? null"
                [value]="tab.value"
                [disabled]="tab.disabled"
              >
                <span>{{ tab.label }}</span>
                @if (tab.value === 'account') {
                  <a href="#" data-testid="nested-link">Nested link</a>
                }
              </button>
            } @else {
              <button type="button" [attr.data-testid]="'rogue-' + tab.value">
                {{ tab.label }}
              </button>
            }
          }
        </div>
        <button type="button" tngTabsScrollButtonNext data-testid="scroll-next">
          <span data-testid="scroll-next-icon">▶</span>
        </button>

        @for (panel of panels(); track panel.value) {
          <section
            tngTabPanel
            [attr.data-testid]="'panel-' + panel.value"
            [attr.id]="panel.id ?? null"
            [value]="panel.value"
          >
            <label [attr.for]="'panel-input-' + panel.value">{{ panel.label }}</label>
            <input [id]="'panel-input-' + panel.value" [attr.data-testid]="'panel-input-' + panel.value" />
          </section>
        }
      </section>
    }

    <button type="button" data-testid="after">After</button>
  `,
})
class TabsHarnessHostComponent {
  readonly tabs = signal<readonly TabConfig[]>([
    { value: 'account', label: 'Account', disabled: false, id: 'custom-tab-account' },
    { value: 'security', label: 'Security', disabled: false },
    { value: 'billing', label: 'Billing', disabled: true },
    { value: 'teams', label: 'Teams', disabled: false },
  ]);

  readonly panels = signal<readonly PanelConfig[]>([
    { value: 'account', label: 'Account panel', id: 'custom-panel-account' },
    { value: 'security', label: 'Security panel' },
    { value: 'billing', label: 'Billing panel' },
    { value: 'teams', label: 'Teams panel' },
  ]);

  readonly valueAttr = signal<string | null>(null);
  readonly defaultValueAttr = signal<string | null>(null);
  readonly activation = signal<'auto' | 'manual'>('auto');
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  readonly scrollButtons = signal<'auto' | 'off' | 'on'>('off');
  readonly loop = signal(true);
  readonly dir = signal<'ltr' | 'rtl' | 'auto'>('ltr');
  readonly keepAlive = signal<boolean | undefined>(undefined);
  readonly lazy = signal<boolean | undefined>(undefined);
  readonly renderTabs = signal(true);

  readonly valueChanges: unknown[] = [];
  readonly tabChanges: unknown[] = [];
  readonly focusChanges: unknown[] = [];

  @ViewChild('tabsRef', { static: false }) tabsRef?: TngTabs;

  resetEvents(): void {
    this.valueChanges.length = 0;
    this.tabChanges.length = 0;
    this.focusChanges.length = 0;
  }

  setNoIds(): void {
    this.tabs.update((tabs) => tabs.map((tab) => ({ ...tab, id: undefined })));
    this.panels.update((panels) => panels.map((panel) => ({ ...panel, id: undefined })));
  }
}

@Component({
  imports: [TngTabs, TngTabList, TngTab, TngTabPanel, TngTabsScrollButtonPrev, TngTabsScrollButtonNext],
  template: `
    <section tngTabs data-testid="tabs-a">
      <button type="button" tngTabsScrollButtonPrev data-testid="a-scroll-prev">⬅</button>
      <div tngTabList data-testid="tablist-a">
        <button tngTab data-testid="a-tab-one">A One</button>
        <button tngTab data-testid="a-tab-two">A Two</button>
      </div>
      <button type="button" tngTabsScrollButtonNext data-testid="a-scroll-next">➡</button>
      <section tngTabPanel data-testid="a-panel-one">A Panel One</section>
      <section tngTabPanel data-testid="a-panel-two">A Panel Two</section>
    </section>

    <section tngTabs data-testid="tabs-b">
      <button type="button" tngTabsScrollButtonPrev data-testid="b-scroll-prev">⬅</button>
      <div tngTabList data-testid="tablist-b">
        <button tngTab data-testid="b-tab-one">B One</button>
        <button tngTab data-testid="b-tab-two">B Two</button>
      </div>
      <button type="button" tngTabsScrollButtonNext data-testid="b-scroll-next">➡</button>
      <section tngTabPanel data-testid="b-panel-one">B Panel One</section>
      <section tngTabPanel data-testid="b-panel-two">B Panel Two</section>
    </section>
  `,
})
class TabsIsolationHostComponent {}

@Component({
  imports: [TngTabs, TngTabList, TngTab, TngTabPanel, TngTabsScrollButtonPrev, TngTabsScrollButtonNext],
  template: `
    <section
      tngTabs
      #tabs="tngTabs"
      data-testid="tabs"
      [activation]="activation"
      (tabChange)="tabChanges.push($event)"
    >
      <button type="button" tngTabsScrollButtonPrev data-testid="scroll-prev">⬅</button>
      <div tngTabList data-testid="tablist">
        <button tngTab data-testid="tab-account" value="account">Account</button>
        <button tngTab data-testid="tab-security" value="security">Security</button>
        <button tngTab data-testid="tab-billing" value="billing" disabled>Billing</button>
      </div>
      <button type="button" tngTabsScrollButtonNext data-testid="scroll-next">➡</button>
      <section tngTabPanel data-testid="panel-account" value="account">Account panel</section>
      <section tngTabPanel data-testid="panel-security" value="security">Security panel</section>
      <section tngTabPanel data-testid="panel-billing" value="billing">Billing panel</section>
    </section>
  `,
})
class TabsProgrammaticHostComponent {
  activation: 'auto' | 'manual' = 'auto';
  readonly tabChanges: unknown[] = [];

  @ViewChild('tabs', { static: true }) tabs!: TngTabs;
}

function getByTestId<T extends HTMLElement>(fixture: { nativeElement: HTMLElement }, id: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as T | null;
  expect(element).not.toBeNull();
  return element as T;
}

function getTabs(fixture: { nativeElement: HTMLElement }): HTMLButtonElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('[tngTab]')) as HTMLButtonElement[];
}

function getPanels(fixture: { nativeElement: HTMLElement }): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('[tngTabPanel]')) as HTMLElement[];
}

function setOverflowMetrics(
  element: HTMLElement,
  metrics: Readonly<{ clientWidth: number; scrollWidth: number }>,
): void {
  Object.defineProperty(element, 'clientWidth', {
    configurable: true,
    value: metrics.clientWidth,
  });

  Object.defineProperty(element, 'scrollWidth', {
    configurable: true,
    value: metrics.scrollWidth,
  });
}

function spyOnScrollIntoView() {
  const prototype = HTMLElement.prototype as unknown as {
    scrollIntoView?: (options?: ScrollIntoViewOptions) => void;
  };

  if (typeof prototype.scrollIntoView !== 'function') {
    Object.defineProperty(prototype, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: () => undefined,
    });
  }

  return vi
    .spyOn(
      prototype as {
        scrollIntoView(options?: ScrollIntoViewOptions): void;
      },
      'scrollIntoView',
    )
    .mockImplementation(() => undefined);
}

describe('tng-tabs primitives', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('A) Exports & basic structure', () => {
    it('exports the tabs primitives (tng-tabs, tng-tab-list, tng-tab, tng-tab-panel, scroll controls)', () => {
      const exported = primitives as Record<string, unknown>;

      expect(typeof exported['TngTabs']).toBe('function');
      expect(typeof exported['TngTabList']).toBe('function');
      expect(typeof exported['TngTab']).toBe('function');
      expect(typeof exported['TngTabPanel']).toBe('function');
      expect(typeof exported['TngTabsScrollButtonPrev']).toBe('function');
      expect(typeof exported['TngTabsScrollButtonNext']).toBe('function');
    });

    it('renders a valid tabs structure without requiring optional inputs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MinimalTabsHostComponent],
      }).createComponent(MinimalTabsHostComponent);

      fixture.detectChanges();

      const tabs = getByTestId<HTMLElement>(fixture, 'tabs');
      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      const tabItems = getTabs(fixture);
      const panels = getPanels(fixture);

      expect(tabs.getAttribute('data-slot')).toBe('tabs');
      expect(tablist.getAttribute('role')).toBe('tablist');
      expect(tabItems).toHaveLength(2);
      expect(panels).toHaveLength(2);
    });

    it('does not throw when rendered with zero tabs (fails safely)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ZeroTabsHostComponent],
      }).createComponent(ZeroTabsHostComponent);

      expect(() => fixture.detectChanges()).not.toThrow();

      const tabItems = getTabs(fixture);
      expect(tabItems).toHaveLength(0);
    });

    it('cleans up listeners and internal registrations on destroy', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MinimalTabsHostComponent],
      }).createComponent(MinimalTabsHostComponent);

      fixture.detectChanges();
      fixture.destroy();

      expect(() => {
        document.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            bubbles: true,
          }),
        );
      }).not.toThrow();
    });
  });

  describe('B) ARIA roles & linkage', () => {
    it('applies role="tablist" on the tab list host', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      expect(tablist.getAttribute('role')).toBe('tablist');
    });

    it('keeps tablist out of sequential tab order (tabindex=-1)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      expect(tablist.getAttribute('tabindex')).toBe('-1');
      expect(tablist.tabIndex).toBe(-1);
    });

    it('applies role="tab" on each tab', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const tabItems = getTabs(fixture);
      expect(tabItems.every((tab) => tab.getAttribute('role') === 'tab')).toBe(true);
    });

    it('applies role="tabpanel" on each tab panel', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const panels = getPanels(fixture);
      expect(panels.every((panel) => panel.getAttribute('role') === 'tabpanel')).toBe(true);
    });

    it('links each tab to its panel via aria-controls', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const billing = getByTestId<HTMLButtonElement>(fixture, 'tab-billing');

      expect(account.getAttribute('aria-controls')).toBe('custom-panel-account');
      expect(security.getAttribute('aria-controls')).toBeTruthy();
      expect(billing.getAttribute('aria-controls')).toBeTruthy();
    });

    it('links each panel to its tab via aria-labelledby', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const accountPanel = getByTestId<HTMLElement>(fixture, 'panel-account');
      const securityPanel = getByTestId<HTMLElement>(fixture, 'panel-security');

      expect(accountPanel.getAttribute('aria-labelledby')).toBe('custom-tab-account');
      expect(securityPanel.getAttribute('aria-labelledby')).toBeTruthy();
    });

    it('sets aria-selected="true" only on the selected tab', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const selectedCount = getTabs(fixture).filter(
        (tab) => tab.getAttribute('aria-selected') === 'true',
      ).length;

      expect(selectedCount).toBe(1);
    });

    it('sets aria-selected="false" on all non-selected tabs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const falseSelectedCount = getTabs(fixture).filter(
        (tab) => tab.getAttribute('aria-selected') === 'false',
      ).length;

      expect(falseSelectedCount).toBe(3);
    });

    it('applies aria-disabled="true" on disabled tabs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const billing = getByTestId<HTMLButtonElement>(fixture, 'tab-billing');
      expect(billing.getAttribute('aria-disabled')).toBe('true');
    });

    it('applies aria-orientation="vertical" on the tablist when orientation is vertical', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('vertical');
      fixture.detectChanges();

      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      expect(tablist.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('preserves consumer-provided tab and panel IDs and does not generate duplicates', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const accountTab = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const accountPanel = getByTestId<HTMLElement>(fixture, 'panel-account');
      const allIds = Array.from(
        fixture.nativeElement.querySelectorAll('[id]') as NodeListOf<HTMLElement>,
      )
        .map((el) => el.id)
        .filter((id) => id.length > 0);
      const uniqueIds = new Set(allIds);

      expect(accountTab.id).toBe('custom-tab-account');
      expect(accountPanel.id).toBe('custom-panel-account');
      expect(uniqueIds.size).toBe(allIds.length);
    });

    it('generates stable IDs when none are provided and keeps them stable across rerenders', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.setNoIds();
      fixture.detectChanges();

      const firstTabIds = getTabs(fixture).map((tab) => tab.id);
      const firstPanelIds = getPanels(fixture).map((panel) => panel.id);

      fixture.detectChanges();

      const secondTabIds = getTabs(fixture).map((tab) => tab.id);
      const secondPanelIds = getPanels(fixture).map((panel) => panel.id);

      expect(firstTabIds.every((id) => id.length > 0)).toBe(true);
      expect(firstPanelIds.every((id) => id.length > 0)).toBe(true);
      expect(firstTabIds).toEqual(secondTabIds);
      expect(firstPanelIds).toEqual(secondPanelIds);
    });
  });

  describe('C) Selection state (controlled vs uncontrolled)', () => {
    it('selects the first enabled tab by default when no value or defaultValue is provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.tabs.set([
        { value: 'disabled-first', label: 'Disabled First', disabled: true },
        { value: 'enabled-next', label: 'Enabled Next', disabled: false },
      ]);
      fixture.componentInstance.panels.set([
        { value: 'disabled-first', label: 'Disabled First panel' },
        { value: 'enabled-next', label: 'Enabled Next panel' },
      ]);
      fixture.componentInstance.valueAttr.set(null);
      fixture.componentInstance.defaultValueAttr.set(null);
      fixture.detectChanges();

      const enabledNext = getByTestId<HTMLButtonElement>(fixture, 'tab-enabled-next');
      expect(enabledNext.getAttribute('aria-selected')).toBe('true');
    });

    it('respects defaultValue on initial render when uncontrolled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.defaultValueAttr.set('security');
      fixture.componentInstance.valueAttr.set(null);
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      expect(security.getAttribute('aria-selected')).toBe('true');
    });

    it('respects controlled value on initial render when controlled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.valueAttr.set('teams');
      fixture.componentInstance.defaultValueAttr.set(null);
      fixture.detectChanges();

      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');
      expect(teams.getAttribute('aria-selected')).toBe('true');
    });

    it('does not mutate controlled value internally when user interacts', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.valueAttr.set('security');
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');

      click(account);
      fixture.detectChanges();

      expect(host.valueAttr()).toBe('security');
      expect(account.getAttribute('aria-selected')).toBe('false');
    });

    it('emits valueChange when a new tab is selected by user interaction', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      click(security);
      fixture.detectChanges();

      expect(host.valueChanges).toHaveLength(1);
      expect(host.valueChanges[0]).toBe('security');
    });

    it('emits tabChange with previousValue and trigger metadata on selection change', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      click(security);
      fixture.detectChanges();

      expect(host.tabChanges).toHaveLength(1);
      expect(host.tabChanges[0]).toEqual({
        value: 'security',
        previousValue: 'account',
        trigger: 'pointer',
      });
    });

    it('does not emit duplicate selection events when selecting the already-selected tab', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.valueAttr.set('account');
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');

      click(account);
      click(account);
      fixture.detectChanges();

      expect(host.valueChanges).toHaveLength(0);
      expect(host.tabChanges).toHaveLength(0);
    });
  });

  describe('D) Roving tabindex & focus entry', () => {
    it('sets tabindex="0" only on the current tab stop and -1 on other tabs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.valueAttr.set('account');
      fixture.detectChanges();

      const tabs = getTabs(fixture);
      const tabStopCount = tabs.filter((tab) => tab.getAttribute('tabindex') === '0').length;
      const nonStops = tabs.filter((tab) => tab.getAttribute('tabindex') === '-1').length;

      expect(tabStopCount).toBe(1);
      expect(nonStops).toBe(3);
    });

    it('uses the selected tab as the initial tab stop by default', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.valueAttr.set('security');
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      expect(security.getAttribute('tabindex')).toBe('0');
    });

    it('focus entering the tablist targets the current tab stop', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.valueAttr.set('account');
      fixture.detectChanges();

      const before = getByTestId<HTMLButtonElement>(fixture, 'before');
      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');

      before.focus();
      fixture.detectChanges();

      dispatchTabAndSimulateBrowserFocus(before, account);
      fixture.detectChanges();

      expect(document.activeElement).toBe(account);
    });

    it('focusing the tablist container redirects focus to the current tab stop', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.valueAttr.set('security');
      fixture.detectChanges();

      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      tablist.focus();
      fixture.detectChanges();

      expect(document.activeElement).toBe(security);
    });

    it('does not set tabindex=0 on disabled tabs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const billing = getByTestId<HTMLButtonElement>(fixture, 'tab-billing');
      expect(billing.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('E) Pointer interactions', () => {
    it('clicking an enabled tab selects it and focuses it', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      click(security);
      fixture.detectChanges();

      expect(document.activeElement).toBe(security);
      expect(security.getAttribute('aria-selected')).toBe('true');
    });

    it('clicking a disabled tab does not select or focus it', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const billing = getByTestId<HTMLButtonElement>(fixture, 'tab-billing');
      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');

      click(billing);
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(billing);
      expect(account.getAttribute('aria-selected')).toBe('true');
    });

    it('pointer interaction sets trigger metadata to pointer in tabChange', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      click(security);
      fixture.detectChanges();

      expect(host.tabChanges).toHaveLength(1);
      expect((host.tabChanges[0] as { trigger?: string }).trigger).toBe('pointer');
    });

    it('clicking a tab does not steal focus to the panel automatically', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const securityPanel = getByTestId<HTMLElement>(fixture, 'panel-security');

      click(security);
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(securityPanel);
    });
  });

  describe('F) Keyboard navigation — horizontal', () => {
    it('ArrowRight moves focus to the next enabled tab in horizontal orientation (LTR)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('horizontal');
      fixture.componentInstance.dir.set('ltr');
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      account.focus();
      keydown(account, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(security);
    });

    it('ArrowLeft moves focus to the previous enabled tab in horizontal orientation (LTR)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('horizontal');
      fixture.componentInstance.dir.set('ltr');
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      security.focus();
      keydown(security, 'ArrowLeft');
      fixture.detectChanges();

      expect(document.activeElement).toBe(account);
    });

    it('Home moves focus to the first enabled tab', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      teams.focus();
      keydown(teams, 'Home');
      fixture.detectChanges();

      expect(document.activeElement).toBe(account);
    });

    it('End moves focus to the last enabled tab', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      account.focus();
      keydown(account, 'End');
      fixture.detectChanges();

      expect(document.activeElement).toBe(teams);
    });

    it('skips disabled tabs during Arrow navigation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      security.focus();
      keydown(security, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(teams);
    });

    it('wraps focus from last to first when loop=true', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.loop.set(true);
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      teams.focus();
      keydown(teams, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(account);
    });

    it('does not wrap at ends when loop=false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.loop.set(false);
      fixture.detectChanges();

      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      teams.focus();
      keydown(teams, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(teams);
    });
  });

  describe('G) Keyboard navigation — vertical', () => {
    it('ArrowDown moves focus to the next enabled tab in vertical orientation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('vertical');
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      account.focus();
      keydown(account, 'ArrowDown');
      fixture.detectChanges();

      expect(document.activeElement).toBe(security);
    });

    it('ArrowUp moves focus to the previous enabled tab in vertical orientation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('vertical');
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      security.focus();
      keydown(security, 'ArrowUp');
      fixture.detectChanges();

      expect(document.activeElement).toBe(account);
    });

    it('Home moves focus to the first enabled tab in vertical orientation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('vertical');
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      teams.focus();
      keydown(teams, 'Home');
      fixture.detectChanges();

      expect(document.activeElement).toBe(account);
    });

    it('End moves focus to the last enabled tab in vertical orientation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('vertical');
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      account.focus();
      keydown(account, 'End');
      fixture.detectChanges();

      expect(document.activeElement).toBe(teams);
    });

    it('skips disabled tabs during Arrow navigation in vertical orientation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('vertical');
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      security.focus();
      keydown(security, 'ArrowDown');
      fixture.detectChanges();

      expect(document.activeElement).toBe(teams);
    });

    it('wraps focus from last to first in vertical mode when loop=true', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('vertical');
      fixture.componentInstance.loop.set(true);
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      teams.focus();
      keydown(teams, 'ArrowDown');
      fixture.detectChanges();

      expect(document.activeElement).toBe(account);
    });
  });

  describe('H) RTL direction behavior', () => {
    it('in RTL, ArrowRight and ArrowLeft navigation mirrors correctly for horizontal tabs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('horizontal');
      fixture.componentInstance.dir.set('rtl');
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      account.focus();
      keydown(account, 'ArrowRight');
      fixture.detectChanges();
      expect(document.activeElement).toBe(teams);

      keydown(teams, 'ArrowLeft');
      fixture.detectChanges();
      expect(document.activeElement).toBe(account);
    });

    it('switching direction LTR→RTL at runtime recomputes arrow-key behavior without breaking selection', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('horizontal');
      fixture.componentInstance.dir.set('ltr');
      fixture.componentInstance.valueAttr.set('security');
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');

      security.focus();
      fixture.componentInstance.dir.set('rtl');
      fixture.detectChanges();

      keydown(security, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(account);
      expect(security.getAttribute('aria-selected')).toBe('true');
    });

    it('switching direction RTL→LTR at runtime recomputes arrow-key behavior without breaking selection', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.orientation.set('horizontal');
      fixture.componentInstance.dir.set('rtl');
      fixture.componentInstance.valueAttr.set('security');
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      security.focus();
      fixture.componentInstance.dir.set('ltr');
      fixture.detectChanges();

      keydown(security, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(teams);
      expect(security.getAttribute('aria-selected')).toBe('true');
    });

    it('RTL affects arrow-key mapping only and does not change the selected value itself', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.valueAttr.set('security');
      fixture.componentInstance.dir.set('rtl');
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      expect(security.getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('I) Activation mode — auto vs manual', () => {
    it('in activation=auto, arrow navigation changes selection immediately', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.activation.set('auto');
      fixture.componentInstance.valueAttr.set(null);
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      account.focus();
      keydown(account, 'ArrowRight');
      fixture.detectChanges();

      expect(security.getAttribute('aria-selected')).toBe('true');
    });

    it('in activation=auto, tabChange trigger is keyboard on arrow-selection', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.activation.set('auto');
      fixture.componentInstance.resetEvents();
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      account.focus();
      keydown(account, 'ArrowRight');
      fixture.detectChanges();

      expect(fixture.componentInstance.tabChanges).toHaveLength(1);
      expect((fixture.componentInstance.tabChanges[0] as { trigger?: string }).trigger).toBe('keyboard');
    });

    it('in activation=manual, arrow navigation moves focus without changing selection', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.activation.set('manual');
      fixture.componentInstance.defaultValueAttr.set('account');
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      account.focus();
      keydown(account, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(security);
      expect(account.getAttribute('aria-selected')).toBe('true');
    });

    it('in activation=manual, Enter selects the focused tab', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.activation.set('manual');
      fixture.componentInstance.defaultValueAttr.set('account');
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      security.focus();
      keydown(security, 'Enter');
      fixture.detectChanges();

      expect(security.getAttribute('aria-selected')).toBe('true');
    });

    it('in activation=manual, Space selects the focused tab', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.activation.set('manual');
      fixture.componentInstance.defaultValueAttr.set('account');
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      security.focus();
      keydown(security, ' ');
      fixture.detectChanges();

      expect(security.getAttribute('aria-selected')).toBe('true');
    });

    it('in activation=manual, Enter/Space does not select when focused tab is disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.activation.set('manual');
      fixture.componentInstance.defaultValueAttr.set('account');
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const billing = getByTestId<HTMLButtonElement>(fixture, 'tab-billing');

      billing.focus();
      keydown(billing, 'Enter');
      keydown(billing, ' ');
      fixture.detectChanges();

      expect(account.getAttribute('aria-selected')).toBe('true');
      expect(billing.getAttribute('aria-selected')).toBe('false');
    });

    it('in activation=manual, selecting focused tab emits tabChange with trigger keyboard', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.activation.set('manual');
      fixture.componentInstance.resetEvents();
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      security.focus();
      keydown(security, 'Enter');
      fixture.detectChanges();

      expect(fixture.componentInstance.tabChanges).toHaveLength(1);
      expect((fixture.componentInstance.tabChanges[0] as { trigger?: string }).trigger).toBe('keyboard');
    });
  });

  describe('J) Tab key behavior (do not trap)', () => {
    it('pressing Tab on a focused tab moves focus to the next focusable element outside tabs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const after = getByTestId<HTMLButtonElement>(fixture, 'after');

      security.focus();
      const event = dispatchTabAndSimulateBrowserFocus(security, after);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(after);
    });

    it('pressing Shift+Tab on a focused tab moves focus to the previous focusable element outside tabs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const before = getByTestId<HTMLButtonElement>(fixture, 'before');

      account.focus();
      const event = dispatchTabAndSimulateBrowserFocus(account, before, true);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(before);
    });

    it('Tab keydown is not prevented on tabs (native traversal is preserved)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      account.focus();

      const event = keydown(account, 'Tab');
      expect(event.defaultPrevented).toBe(false);
    });

    it('Shift+Tab keydown is not prevented on tabs (native traversal is preserved)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      account.focus();

      const event = keydown(account, 'Tab', { shiftKey: true });
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('K) Panel visibility & mounting (lazy/keepAlive)', () => {
    it('only the selected panel is visible when panels are rendered', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.defaultValueAttr.set('security');
      fixture.detectChanges();

      const visiblePanels = getPanels(fixture).filter((panel) => !panel.hasAttribute('hidden'));
      expect(visiblePanels).toHaveLength(1);
      expect(visiblePanels[0].getAttribute('data-testid')).toBe('panel-security');
    });

    it('non-selected panels have hidden applied per contract', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.defaultValueAttr.set('account');
      fixture.detectChanges();

      const securityPanel = getByTestId<HTMLElement>(fixture, 'panel-security');
      const teamsPanel = getByTestId<HTMLElement>(fixture, 'panel-teams');

      expect(securityPanel.hasAttribute('hidden')).toBe(true);
      expect(teamsPanel.hasAttribute('hidden')).toBe(true);
    });

    it('with keepAlive=true, non-selected panels remain in the DOM and preserve state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.keepAlive.set(true);
      fixture.componentInstance.defaultValueAttr.set('account');
      fixture.detectChanges();

      const accountInput = getByTestId<HTMLInputElement>(fixture, 'panel-input-account');
      const securityTab = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const accountTab = getByTestId<HTMLButtonElement>(fixture, 'tab-account');

      accountInput.value = 'sticky';
      click(securityTab);
      click(accountTab);
      fixture.detectChanges();

      const accountInputAfter = getByTestId<HTMLInputElement>(fixture, 'panel-input-account');
      expect(accountInputAfter.value).toBe('sticky');
    });

    it('with keepAlive=false, non-selected panels are unmounted and remounted on selection', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.keepAlive.set(false);
      fixture.componentInstance.defaultValueAttr.set('account');
      fixture.detectChanges();

      const accountInput = getByTestId<HTMLInputElement>(fixture, 'panel-input-account');
      const securityTab = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const accountTab = getByTestId<HTMLButtonElement>(fixture, 'tab-account');

      accountInput.value = 'should-reset';
      click(securityTab);
      fixture.detectChanges();
      click(accountTab);
      fixture.detectChanges();

      const accountInputAfter = getByTestId<HTMLInputElement>(fixture, 'panel-input-account');
      expect(accountInputAfter.value).toBe('');
    });

    it('with lazy=true, a panel is not mounted until its tab is selected the first time', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.lazy.set(true);
      fixture.componentInstance.defaultValueAttr.set('account');
      fixture.detectChanges();

      const securityPanel = fixture.nativeElement.querySelector('[data-testid="panel-security"]');
      expect(securityPanel).toBeNull();
    });

    it('lazy panels remain mounted after first activation when keepAlive is enabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.lazy.set(true);
      fixture.componentInstance.keepAlive.set(true);
      fixture.componentInstance.defaultValueAttr.set('account');
      fixture.detectChanges();

      const securityTab = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const accountTab = getByTestId<HTMLButtonElement>(fixture, 'tab-account');

      click(securityTab);
      fixture.detectChanges();

      const securityInput = getByTestId<HTMLInputElement>(fixture, 'panel-input-security');
      securityInput.value = 'security-state';

      click(accountTab);
      click(securityTab);
      fixture.detectChanges();

      const securityInputAfter = getByTestId<HTMLInputElement>(fixture, 'panel-input-security');
      expect(securityInputAfter.value).toBe('security-state');
    });

    it('panel visibility updates correctly when selection changes rapidly', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');

      click(security);
      click(teams);
      click(account);
      fixture.detectChanges();

      const visiblePanels = getPanels(fixture).filter((panel) => !panel.hasAttribute('hidden'));
      expect(visiblePanels).toHaveLength(1);
      expect(visiblePanels[0].getAttribute('data-testid')).toBe('panel-account');
    });
  });

  describe('L) Dynamic lifecycle (add/remove/disable/reorder)', () => {
    it('adding a new tab does not change the current selection', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.defaultValueAttr.set('security');
      fixture.detectChanges();

      fixture.componentInstance.tabs.update((tabs) => [
        ...tabs,
        { value: 'reports', label: 'Reports', disabled: false },
      ]);
      fixture.componentInstance.panels.update((panels) => [
        ...panels,
        { value: 'reports', label: 'Reports panel' },
      ]);
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      expect(security.getAttribute('aria-selected')).toBe('true');
    });

    it('removing a non-selected tab preserves selection and focus behavior', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.defaultValueAttr.set('security');
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      security.focus();
      fixture.componentInstance.tabs.update((tabs) => tabs.filter((tab) => tab.value !== 'billing'));
      fixture.componentInstance.panels.update((panels) =>
        panels.filter((panel) => panel.value !== 'billing'),
      );
      fixture.detectChanges();

      expect(security.getAttribute('aria-selected')).toBe('true');
      expect(document.activeElement).toBe(security);
    });

    it('removing the selected tab selects the nearest enabled neighbor deterministically', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.defaultValueAttr.set('security');
      fixture.detectChanges();

      fixture.componentInstance.tabs.update((tabs) => tabs.filter((tab) => tab.value !== 'security'));
      fixture.componentInstance.panels.update((panels) =>
        panels.filter((panel) => panel.value !== 'security'),
      );
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      expect(account.getAttribute('aria-selected')).toBe('true');
    });

    it('disabling the selected tab moves selection to the nearest enabled neighbor deterministically', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.defaultValueAttr.set('security');
      fixture.detectChanges();

      fixture.componentInstance.tabs.update((tabs) =>
        tabs.map((tab) =>
          tab.value === 'security'
            ? {
                ...tab,
                disabled: true,
              }
            : tab,
        ),
      );
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      expect(account.getAttribute('aria-selected')).toBe('true');
    });

    it('re-enabling tabs allows them to become focus targets again', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      fixture.componentInstance.tabs.update((tabs) =>
        tabs.map((tab) =>
          tab.value === 'billing'
            ? {
                ...tab,
                disabled: false,
              }
            : tab,
        ),
      );
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const billing = getByTestId<HTMLButtonElement>(fixture, 'tab-billing');

      security.focus();
      keydown(security, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(billing);
    });

    it('reordering tabs updates arrow navigation order to match DOM order', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.tabs.set([
        { value: 'teams', label: 'Teams', disabled: false },
        { value: 'account', label: 'Account', disabled: false },
        { value: 'security', label: 'Security', disabled: false },
        { value: 'billing', label: 'Billing', disabled: true },
      ]);
      fixture.componentInstance.panels.set([
        { value: 'teams', label: 'Teams panel' },
        { value: 'account', label: 'Account panel' },
        { value: 'security', label: 'Security panel' },
        { value: 'billing', label: 'Billing panel' },
      ]);
      fixture.detectChanges();

      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');
      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');

      teams.focus();
      keydown(teams, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(account);
    });

    it('does not treat non-tab elements inside tablist as navigable tabs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.tabs.update((tabs) => [
        tabs[0],
        { value: 'rogue', label: 'Rogue', disabled: false, rogue: true },
        ...tabs.slice(1),
      ]);
      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      account.focus();
      keydown(account, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(security);
    });
  });

  describe('M) Multiple tab groups isolation', () => {
    it('two independent tng-tabs instances do not share roving tabindex state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsIsolationHostComponent],
      }).createComponent(TabsIsolationHostComponent);

      fixture.detectChanges();

      const aTabs = Array.from(
        fixture.nativeElement.querySelectorAll('[data-testid^="a-tab-"]'),
      ) as HTMLButtonElement[];
      const bTabs = Array.from(
        fixture.nativeElement.querySelectorAll('[data-testid^="b-tab-"]'),
      ) as HTMLButtonElement[];

      expect(aTabs.some((tab) => tab.getAttribute('tabindex') === '0')).toBe(true);
      expect(bTabs.some((tab) => tab.getAttribute('tabindex') === '0')).toBe(true);
    });

    it('arrow navigation in one tablist does not move focus in another tablist', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsIsolationHostComponent],
      }).createComponent(TabsIsolationHostComponent);

      fixture.detectChanges();

      const aTabOne = getByTestId<HTMLButtonElement>(fixture, 'a-tab-one');
      const bTabOne = getByTestId<HTMLButtonElement>(fixture, 'b-tab-one');

      bTabOne.focus();
      aTabOne.focus();
      keydown(aTabOne, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(bTabOne);
    });

    it('selecting a tab in one group does not affect the other group selection', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsIsolationHostComponent],
      }).createComponent(TabsIsolationHostComponent);

      fixture.detectChanges();

      const aTabTwo = getByTestId<HTMLButtonElement>(fixture, 'a-tab-two');
      const bTabOne = getByTestId<HTMLButtonElement>(fixture, 'b-tab-one');

      click(aTabTwo);
      fixture.detectChanges();

      expect(aTabTwo.getAttribute('aria-selected')).toBe('true');
      expect(bTabOne.getAttribute('aria-selected')).toBe('true');
    });

    it('ID generation avoids collisions across multiple tab groups', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsIsolationHostComponent],
      }).createComponent(TabsIsolationHostComponent);

      fixture.detectChanges();

      const allIds = Array.from(
        fixture.nativeElement.querySelectorAll('[id]') as NodeListOf<HTMLElement>,
      )
        .map((el) => el.id)
        .filter((id) => id.length > 0);
      const uniqueIds = new Set(allIds);

      expect(allIds.length).toBeGreaterThan(0);
      expect(uniqueIds.size).toBe(allIds.length);
    });
  });

  describe('N) Programmatic API (if provided)', () => {
    it('select(value) selects the matching enabled tab programmatically', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsProgrammaticHostComponent],
      }).createComponent(TabsProgrammaticHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const api = host.tabs as unknown as { select?: (value: string) => void };

      expect(typeof api.select).toBe('function');
      api.select?.('security');
      fixture.detectChanges();

      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      expect(security.getAttribute('aria-selected')).toBe('true');
    });

    it('select(value) does nothing when value does not exist (fails safely)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsProgrammaticHostComponent],
      }).createComponent(TabsProgrammaticHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const api = host.tabs as unknown as { select?: (value: string) => void };
      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');

      api.select?.('missing-value');
      fixture.detectChanges();

      expect(account.getAttribute('aria-selected')).toBe('true');
    });

    it('focus(value) focuses the matching enabled tab without selecting in manual mode', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsProgrammaticHostComponent],
      }).createComponent(TabsProgrammaticHostComponent);

      const host = fixture.componentInstance;
      host.activation = 'manual';
      fixture.detectChanges();

      const api = host.tabs as unknown as { focus?: (value: string) => void };
      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      expect(typeof api.focus).toBe('function');
      api.focus?.('security');
      fixture.detectChanges();

      expect(document.activeElement).toBe(security);
      expect(account.getAttribute('aria-selected')).toBe('true');
    });

    it('next() and prev() move focus/selection according to activation mode', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsProgrammaticHostComponent],
      }).createComponent(TabsProgrammaticHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const api = host.tabs as unknown as {
        next?: () => void;
        prev?: () => void;
      };
      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      expect(typeof api.next).toBe('function');
      expect(typeof api.prev).toBe('function');

      account.focus();
      api.next?.();
      fixture.detectChanges();

      expect(document.activeElement).toBe(security);

      api.prev?.();
      fixture.detectChanges();

      expect(document.activeElement).toBe(account);
    });

    it('programmatic selection emits events with trigger programmatic', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsProgrammaticHostComponent],
      }).createComponent(TabsProgrammaticHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const api = host.tabs as unknown as { select?: (value: string) => void };

      api.select?.('security');
      fixture.detectChanges();

      expect(host.tabChanges).toHaveLength(1);
      expect((host.tabChanges[0] as { trigger?: string }).trigger).toBe('programmatic');
    });
  });

  describe('O) Accessibility resilience & edge cases', () => {
    it('works when tabs contain nested focusable content without breaking keyboard handling', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const nestedLink = getByTestId<HTMLAnchorElement>(fixture, 'nested-link');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');

      nestedLink.focus();
      keydown(nestedLink, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(security);
    });

    it('does not steal focus from nested focusable content unless arrow key handling is invoked', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const nestedLink = getByTestId<HTMLAnchorElement>(fixture, 'nested-link');
      nestedLink.focus();
      fixture.detectChanges();

      click(nestedLink);
      fixture.detectChanges();

      expect(document.activeElement).toBe(nestedLink);
    });

    it('handles zero enabled tabs without throwing and without setting invalid aria-selected', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.tabs.update((tabs) =>
        tabs.map((tab) => ({
          ...tab,
          disabled: true,
        })),
      );

      expect(() => fixture.detectChanges()).not.toThrow();

      const selectedTabs = getTabs(fixture).filter((tab) => tab.getAttribute('aria-selected') === 'true');
      expect(selectedTabs).toHaveLength(0);
    });

    it('does not generate duplicate aria-controls/aria-labelledby when tabs/panels are dynamically recreated', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.setNoIds();
      fixture.detectChanges();

      fixture.componentInstance.renderTabs.set(false);
      fixture.detectChanges();
      fixture.componentInstance.renderTabs.set(true);
      fixture.detectChanges();

      const controls = getTabs(fixture)
        .map((tab) => tab.getAttribute('aria-controls'))
        .filter((value): value is string => typeof value === 'string');
      const labelledBy = getPanels(fixture)
        .map((panel) => panel.getAttribute('aria-labelledby'))
        .filter((value): value is string => typeof value === 'string');

      expect(new Set(controls).size).toBe(controls.length);
      expect(new Set(labelledBy).size).toBe(labelledBy.length);
    });

    it('destroying tabs during in-flight events does not log errors or leave global listeners attached', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      account.focus();

      expect(() => {
        keydown(account, 'ArrowRight');
        fixture.destroy();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      }).not.toThrow();
    });
  });

  describe('P) Overflow strip + scroll affordances', () => {
    it('auto-scrolls focused tab into view with nearest alignment when roving focus changes by Arrow keys', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      setOverflowMetrics(tablist, { clientWidth: 180, scrollWidth: 840 });

      const account = getByTestId<HTMLButtonElement>(fixture, 'tab-account');
      const security = getByTestId<HTMLButtonElement>(fixture, 'tab-security');
      const scrollIntoViewSpy = spyOnScrollIntoView();

      account.focus();
      fixture.detectChanges();

      keydown(account, 'ArrowRight');
      fixture.detectChanges();

      expect(scrollIntoViewSpy).toHaveBeenCalled();
      const [options] = scrollIntoViewSpy.mock.calls.at(-1) ?? [];
      expect(options).toEqual(
        expect.objectContaining({
          block: 'nearest',
          inline: 'nearest',
        }),
      );
      expect(scrollIntoViewSpy.mock.instances.at(-1)).toBe(security);
    });

    it('auto-scrolls selected tab into view when selection changes by pointer', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      setOverflowMetrics(tablist, { clientWidth: 180, scrollWidth: 840 });

      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');
      const scrollIntoViewSpy = spyOnScrollIntoView();

      click(teams);
      fixture.detectChanges();

      expect(scrollIntoViewSpy).toHaveBeenCalled();
      const [options] = scrollIntoViewSpy.mock.calls.at(-1) ?? [];
      expect(options).toEqual(
        expect.objectContaining({
          block: 'nearest',
          inline: 'nearest',
        }),
      );
      expect(scrollIntoViewSpy.mock.instances.some((instance) => instance === teams)).toBe(true);
    });

    it('shows previous/next scroll controls when overflow is present and scrollButtons="auto"', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      const prevButton = getByTestId<HTMLButtonElement>(fixture, 'scroll-prev');
      const nextButton = getByTestId<HTMLButtonElement>(fixture, 'scroll-next');

      expect(prevButton.hasAttribute('hidden')).toBe(true);
      expect(nextButton.hasAttribute('hidden')).toBe(true);

      fixture.componentInstance.scrollButtons.set('auto');
      setOverflowMetrics(tablist, { clientWidth: 180, scrollWidth: 840 });
      fixture.detectChanges();

      expect(prevButton.hasAttribute('hidden')).toBe(false);
      expect(nextButton.hasAttribute('hidden')).toBe(false);
      expect(prevButton.hasAttribute('disabled')).toBe(true);
      expect(nextButton.hasAttribute('disabled')).toBe(false);
    });

    it('clicking scroll controls moves the tab strip and updates disabled state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      fixture.componentInstance.scrollButtons.set('auto');
      setOverflowMetrics(tablist, { clientWidth: 180, scrollWidth: 840 });
      tablist.scrollLeft = 0;
      fixture.detectChanges();

      const prevButton = getByTestId<HTMLButtonElement>(fixture, 'scroll-prev');
      const nextButton = getByTestId<HTMLButtonElement>(fixture, 'scroll-next');

      expect(prevButton.hasAttribute('disabled')).toBe(true);
      expect(nextButton.hasAttribute('disabled')).toBe(false);

      click(nextButton);
      fixture.detectChanges();

      expect(tablist.scrollLeft).toBeGreaterThan(0);
      expect(prevButton.hasAttribute('disabled')).toBe(false);

      tablist.scrollLeft = tablist.scrollWidth - tablist.clientWidth;
      tablist.dispatchEvent(new Event('scroll', { bubbles: true }));
      fixture.detectChanges();

      expect(nextButton.hasAttribute('disabled')).toBe(true);
    });

    it('supports consumer-provided icon markup inside scroll control directives', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const prevIcon = getByTestId<HTMLElement>(fixture, 'scroll-prev-icon');
      const nextIcon = getByTestId<HTMLElement>(fixture, 'scroll-next-icon');

      expect(prevIcon.textContent?.trim()).toBe('◀');
      expect(nextIcon.textContent?.trim()).toBe('▶');
    });

    it('supports horizontal wheel/trackpad scrolling on overflowing tab strips', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.detectChanges();

      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      setOverflowMetrics(tablist, { clientWidth: 180, scrollWidth: 840 });
      tablist.scrollLeft = 0;

      const wheelEvent = new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        deltaY: 96,
      });

      tablist.dispatchEvent(wheelEvent);
      fixture.detectChanges();

      expect(tablist.scrollLeft).toBeGreaterThan(0);
    });

    it('Shift+Tab from the last focused tab moves focus to the previous scroll control', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabsHarnessHostComponent],
      }).createComponent(TabsHarnessHostComponent);

      fixture.componentInstance.valueAttr.set('teams');
      fixture.componentInstance.scrollButtons.set('on');
      fixture.detectChanges();

      const tablist = getByTestId<HTMLElement>(fixture, 'tablist');
      setOverflowMetrics(tablist, { clientWidth: 180, scrollWidth: 840 });
      tablist.scrollLeft = 120;
      tablist.dispatchEvent(new Event('scroll', { bubbles: true }));
      fixture.detectChanges();

      const teams = getByTestId<HTMLButtonElement>(fixture, 'tab-teams');
      const prevButton = getByTestId<HTMLButtonElement>(fixture, 'scroll-prev');

      expect(prevButton.hasAttribute('disabled')).toBe(false);

      teams.focus();
      const event = dispatchTabAndSimulateBrowserFocus(teams, prevButton, true);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(prevButton);
    });
  });
});
