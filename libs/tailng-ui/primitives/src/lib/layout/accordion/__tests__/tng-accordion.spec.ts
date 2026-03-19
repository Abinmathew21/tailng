import { Component, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  type TngAccordionExpandedChangeEvent,
  TngAccordion,
  type TngAccordionValue,
  TngAccordionItem,
  TngAccordionPanel,
  TngAccordionTrigger,
} from '../tng-accordion';

interface AccordionHarnessItem {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly triggerId?: string;
  readonly panelId?: string;
}

function queryByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T | null {
  return fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as T | null;
}

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = queryByTestId<T>(fixture, testId);
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element;
}

function click(element: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

function keydown(element: HTMLElement, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
    ...init,
  });

  element.dispatchEvent(event);
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
  imports: [TngAccordion, TngAccordionItem, TngAccordionTrigger, TngAccordionPanel],
  template: `
    <button type="button" data-testid="before">Before</button>

    <section
      tngAccordion
      #accordionRef="tngAccordion"
      data-testid="accordion"
      [type]="type()"
      [value]="value()"
      [defaultValue]="defaultValue()"
      [collapsible]="collapsible()"
      [disabled]="disabled()"
      [loop]="loop()"
      [lazy]="lazy()"
      [keepAlive]="keepAlive()"
      (valueChange)="valueChanges.push($event)"
      (valuesChange)="valuesChanges.push($event)"
      (expandedChange)="expandedChanges.push($event)"
      (openStart)="openStarts.push($event)"
      (opened)="openedEvents.push($event)"
      (closeStart)="closeStarts.push($event)"
      (closed)="closedEvents.push($event)"
    >
      @for (item of items(); track item.value) {
        <article
          tngAccordionItem
          [value]="item.value"
          [disabled]="item.disabled ?? false"
          [attr.data-testid]="'item-' + item.value"
        >
          <button
            tngAccordionTrigger
            type="button"
            [attr.data-testid]="'trigger-' + item.value"
            [attr.id]="item.triggerId ?? null"
          >
            {{ item.label }}
          </button>

          <div
            tngAccordionPanel
            [attr.data-testid]="'panel-' + item.value"
            [attr.id]="item.panelId ?? null"
          >
            <button type="button" [attr.data-testid]="'panel-action-' + item.value">
              Action {{ item.label }}
            </button>
            <span [attr.data-testid]="'panel-content-' + item.value">{{ item.label }} panel</span>
          </div>
        </article>
      }
      <div data-testid="noise-node">Noise</div>
    </section>

    <button type="button" data-testid="after">After</button>
  `,
})
class AccordionHarnessHostComponent {
  readonly type = signal<'single' | 'multiple'>('single');
  readonly value = signal<TngAccordionValue | readonly TngAccordionValue[] | null | undefined>(undefined);
  readonly defaultValue = signal<TngAccordionValue | readonly TngAccordionValue[] | null | undefined>(
    undefined,
  );
  readonly collapsible = signal(true);
  readonly disabled = signal(false);
  readonly loop = signal(true);
  readonly lazy = signal(false);
  readonly keepAlive = signal(true);

  readonly items = signal<readonly AccordionHarnessItem[]>([
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
    { value: 'three', label: 'Three' },
  ]);

  readonly valueChanges: Array<TngAccordionValue | readonly TngAccordionValue[] | null> = [];
  readonly valuesChanges: Array<readonly TngAccordionValue[]> = [];
  readonly expandedChanges: TngAccordionExpandedChangeEvent[] = [];
  readonly openStarts: TngAccordionValue[] = [];
  readonly openedEvents: TngAccordionValue[] = [];
  readonly closeStarts: TngAccordionValue[] = [];
  readonly closedEvents: TngAccordionValue[] = [];

  @ViewChild('accordionRef', { static: true })
  accordionRef?: TngAccordion;
}

@Component({
  imports: [TngAccordion],
  template: `<section tngAccordion data-testid="empty-accordion"></section>`,
})
class EmptyAccordionHostComponent {}

@Component({
  imports: [TngAccordion, TngAccordionItem, TngAccordionTrigger, TngAccordionPanel],
  template: `
    <section tngAccordion data-testid="outer">
      <article tngAccordionItem value="outer-1">
        <button tngAccordionTrigger type="button" data-testid="outer-trigger-1">Outer 1</button>
        <div tngAccordionPanel data-testid="outer-panel-1">
          <section tngAccordion data-testid="inner">
            <article tngAccordionItem value="inner-a">
              <button tngAccordionTrigger type="button" data-testid="inner-trigger-a">Inner A</button>
              <div tngAccordionPanel data-testid="inner-panel-a">Inner A panel</div>
            </article>
            <article tngAccordionItem value="inner-b">
              <button tngAccordionTrigger type="button" data-testid="inner-trigger-b">Inner B</button>
              <div tngAccordionPanel data-testid="inner-panel-b">Inner B panel</div>
            </article>
          </section>
        </div>
      </article>
      <article tngAccordionItem value="outer-2">
        <button tngAccordionTrigger type="button" data-testid="outer-trigger-2">Outer 2</button>
        <div tngAccordionPanel data-testid="outer-panel-2">Outer 2 panel</div>
      </article>
    </section>
  `,
})
class NestedAccordionHostComponent {}

@Component({
  imports: [TngAccordion, TngAccordionItem, TngAccordionTrigger, TngAccordionPanel],
  template: `
    <section tngAccordion data-testid="accordion-a">
      <article tngAccordionItem value="a-1">
        <button tngAccordionTrigger type="button" data-testid="a-trigger-1">A1</button>
        <div tngAccordionPanel data-testid="a-panel-1">A1 panel</div>
      </article>
      <article tngAccordionItem value="a-2">
        <button tngAccordionTrigger type="button" data-testid="a-trigger-2">A2</button>
        <div tngAccordionPanel data-testid="a-panel-2">A2 panel</div>
      </article>
    </section>

    <section tngAccordion data-testid="accordion-b">
      <article tngAccordionItem value="b-1">
        <button tngAccordionTrigger type="button" data-testid="b-trigger-1">B1</button>
        <div tngAccordionPanel data-testid="b-panel-1">B1 panel</div>
      </article>
      <article tngAccordionItem value="b-2">
        <button tngAccordionTrigger type="button" data-testid="b-trigger-2">B2</button>
        <div tngAccordionPanel data-testid="b-panel-2">B2 panel</div>
      </article>
    </section>
  `,
})
class AccordionIsolationHostComponent {}

@Component({
  imports: [TngAccordion, TngAccordionItem, TngAccordionTrigger, TngAccordionPanel],
  template: `
    <section tngAccordion data-testid="text-only-accordion">
      <article tngAccordionItem value="one">
        <div tngAccordionTrigger data-testid="text-trigger-one">Section one</div>
        <div tngAccordionPanel data-testid="text-panel-one">Section one content</div>
      </article>
      <article tngAccordionItem value="two">
        <div tngAccordionTrigger data-testid="text-trigger-two">Section two</div>
        <div tngAccordionPanel data-testid="text-panel-two">Section two content</div>
      </article>
      <article tngAccordionItem value="three">
        <div tngAccordionTrigger data-testid="text-trigger-three">Section three</div>
        <div tngAccordionPanel data-testid="text-panel-three">Section three content</div>
      </article>
    </section>
  `,
})
class AccordionTextOnlyHostComponent {}

@Component({
  imports: [TngAccordion, TngAccordionItem, TngAccordionTrigger, TngAccordionPanel],
  template: `
    <section tngAccordion data-testid="section-item-accordion">
      <article tngAccordionItem value="one">
        <div tngAccordionTrigger data-testid="section-trigger-one">Section one</div>
        <button type="button" data-testid="section-item-one">Section one action</button>
        <div tngAccordionPanel data-testid="section-panel-one">Section one content</div>
      </article>
      <article tngAccordionItem value="two">
        <div tngAccordionTrigger data-testid="section-trigger-two">Section two</div>
        <button type="button" data-testid="section-item-two">Section two action</button>
        <div tngAccordionPanel data-testid="section-panel-two">Section two content</div>
      </article>
      <article tngAccordionItem value="three">
        <div tngAccordionTrigger data-testid="section-trigger-three">Section three</div>
        <button type="button" data-testid="section-item-three">Section three action</button>
        <div tngAccordionPanel data-testid="section-panel-three">Section three content</div>
      </article>
    </section>
  `,
})
class AccordionSectionItemTabHostComponent {}

@Component({
  imports: [TngAccordion, TngAccordionItem, TngAccordionTrigger, TngAccordionPanel],
  template: `
    <section
      tngAccordion
      data-testid="section-panel-item-accordion"
      type="multiple"
      [defaultValue]="['one', 'three']"
    >
      <article tngAccordionItem value="one">
        <div tngAccordionTrigger data-testid="panel-trigger-one">Section one</div>
        <div tngAccordionPanel data-testid="panel-one">
          <button type="button" data-testid="panel-item-one">Section one action</button>
        </div>
      </article>
      <article tngAccordionItem value="two">
        <div tngAccordionTrigger data-testid="panel-trigger-two">Section two</div>
        <div tngAccordionPanel data-testid="panel-two">
          <button type="button" data-testid="panel-item-two">Section two action</button>
        </div>
      </article>
      <article tngAccordionItem value="three">
        <div tngAccordionTrigger data-testid="panel-trigger-three">Section three</div>
        <div tngAccordionPanel data-testid="panel-three">
          <button type="button" data-testid="panel-item-three">Section three action</button>
        </div>
      </article>
    </section>
  `,
})
class AccordionPanelItemTabHostComponent {}

describe('tng-accordion primitives blocks A-N', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('A) Exports & basic structure', () => {
    it('exports the accordion primitives (`tng-accordion`, `tng-accordion-item`, `tng-accordion-trigger`, `tng-accordion-panel`)', () => {
      expect(typeof TngAccordion).toBe('function');
      expect(typeof TngAccordionItem).toBe('function');
      expect(typeof TngAccordionTrigger).toBe('function');
      expect(typeof TngAccordionPanel).toBe('function');
    });

    it('renders a valid accordion with one item without requiring optional inputs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.items.set([{ value: 'one', label: 'One' }]);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'accordion').getAttribute('data-slot')).toBe('accordion');
      expect(getByTestId<HTMLElement>(fixture, 'item-one').getAttribute('data-slot')).toBe('accordion-item');
      expect(getByTestId<HTMLElement>(fixture, 'trigger-one').getAttribute('data-slot')).toBe('accordion-trigger');
      expect(getByTestId<HTMLElement>(fixture, 'panel-one').getAttribute('data-slot')).toBe('accordion-panel');
    });

    it('does not throw when rendered with zero items (fails safely)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [EmptyAccordionHostComponent],
      }).createComponent(EmptyAccordionHostComponent);

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('cleans up listeners and registrations on destroy', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.detectChanges();
      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');

      fixture.destroy();
      expect(() => keydown(trigger, 'ArrowDown')).not.toThrow();
      expect(() => click(trigger)).not.toThrow();
    });
  });

  describe('B) ARIA roles, attributes & linkage', () => {
    it('trigger renders as a button (or `role=\"button\"`) and is focusable', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      expect(trigger.tagName).toBe('BUTTON');
      expect(trigger.getAttribute('role')).toBe('button');
      expect(trigger.getAttribute('tabindex')).toBe('0');
    });

    it('trigger sets `aria-expanded=\"false\"` when its panel is collapsed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'trigger-one').getAttribute('aria-expanded')).toBe('false');
    });

    it('trigger sets `aria-expanded=\"true\"` when its panel is expanded', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();
      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'trigger-one').getAttribute('aria-expanded')).toBe('true');
    });

    it('trigger sets `aria-controls=\"<panelId>\"` linking to its panel', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLElement>(fixture, 'trigger-one');
      const panel = getByTestId<HTMLElement>(fixture, 'panel-one');
      expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    });

    it('panel sets `aria-labelledby=\"<triggerId>\"` linking back to its trigger', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLElement>(fixture, 'trigger-one');
      const panel = getByTestId<HTMLElement>(fixture, 'panel-one');
      expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
    });

    it('panel sets `role=\"region\"` by default (or per contract) and is labelled by the trigger', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const panel = getByTestId<HTMLElement>(fixture, 'panel-one');
      expect(panel.getAttribute('role')).toBe('region');
      expect(panel.getAttribute('aria-labelledby')).toBe(getByTestId<HTMLElement>(fixture, 'trigger-one').id);
    });

    it('preserves consumer-provided trigger and panel IDs and does not generate duplicates', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.items.set([
        { value: 'alpha', label: 'Alpha', triggerId: 'custom-trigger-alpha', panelId: 'custom-panel-alpha' },
        { value: 'beta', label: 'Beta', triggerId: 'custom-trigger-beta', panelId: 'custom-panel-beta' },
      ]);
      fixture.detectChanges();

      const triggerIds = [
        getByTestId<HTMLElement>(fixture, 'trigger-alpha').id,
        getByTestId<HTMLElement>(fixture, 'trigger-beta').id,
      ];
      const panelIds = [
        getByTestId<HTMLElement>(fixture, 'panel-alpha').id,
        getByTestId<HTMLElement>(fixture, 'panel-beta').id,
      ];

      expect(triggerIds).toEqual(['custom-trigger-alpha', 'custom-trigger-beta']);
      expect(panelIds).toEqual(['custom-panel-alpha', 'custom-panel-beta']);
      expect(new Set(triggerIds).size).toBe(2);
      expect(new Set(panelIds).size).toBe(2);
    });

    it('generates stable IDs when none are provided and keeps them stable across rerenders', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLElement>(fixture, 'trigger-one');
      const panel = getByTestId<HTMLElement>(fixture, 'panel-one');
      const triggerId = trigger.id;
      const panelId = panel.id;

      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'trigger-one').id).toBe(triggerId);
      expect(getByTestId<HTMLElement>(fixture, 'panel-one').id).toBe(panelId);
    });
  });

  describe('C) Default state & configuration', () => {
    it('defaults to all items collapsed when no value/defaultValue is provided (or first expanded per contract)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(true);
      expect(getByTestId<HTMLElement>(fixture, 'panel-two').hasAttribute('hidden')).toBe(true);
    });

    it('respects `defaultValue/defaultValues` on initial render when uncontrolled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.defaultValue.set(['one', 'three']);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
      expect(getByTestId<HTMLElement>(fixture, 'panel-two').hasAttribute('hidden')).toBe(true);
      expect(getByTestId<HTMLElement>(fixture, 'panel-three').hasAttribute('hidden')).toBe(false);
    });

    it('respects controlled `value/values` on initial render when controlled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.type.set('single');
      fixture.componentInstance.value.set('two');
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(true);
      expect(getByTestId<HTMLElement>(fixture, 'panel-two').hasAttribute('hidden')).toBe(false);
    });

    it('in single mode, expands only one item at a time by default', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      click(getByTestId<HTMLElement>(fixture, 'trigger-two'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(true);
      expect(getByTestId<HTMLElement>(fixture, 'panel-two').hasAttribute('hidden')).toBe(false);
    });

    it('in multiple mode, allows multiple items to be expanded simultaneously', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      click(getByTestId<HTMLElement>(fixture, 'trigger-two'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
      expect(getByTestId<HTMLElement>(fixture, 'panel-two').hasAttribute('hidden')).toBe(false);
    });

    it('with `collapsible=false` in single mode, keeps one item expanded at all times (if supported)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.collapsible.set(false);
      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
    });

    it('with `collapsible=true` in single mode, allows collapsing the currently expanded item', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.collapsible.set(true);
      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(true);
    });
  });

  describe('D) Controlled vs uncontrolled updates', () => {
    it('does not mutate controlled selection state internally on user interaction', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.value.set('one');
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-two'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
      expect(getByTestId<HTMLElement>(fixture, 'panel-two').hasAttribute('hidden')).toBe(true);
      expect(fixture.componentInstance.valueChanges.at(-1)).toBe('two');
    });

    it('emits `valueChange/valuesChange` when expansion changes due to user interaction', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      click(getByTestId<HTMLElement>(fixture, 'trigger-two'));
      fixture.detectChanges();

      expect(fixture.componentInstance.valuesChanges).toEqual([['one'], ['one', 'two']]);
      expect(fixture.componentInstance.valueChanges).toEqual([['one'], ['one', 'two']]);
    });

    it('emits `expandedChange` with trigger metadata (`pointer|keyboard|programmatic`) when expansion changes', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      keydown(getByTestId<HTMLElement>(fixture, 'trigger-two'), 'Enter');
      fixture.componentInstance.accordionRef?.open('three');
      fixture.detectChanges();

      const triggers = fixture.componentInstance.expandedChanges.map((event) => event.trigger);
      expect(triggers).toEqual(['pointer', 'keyboard', 'programmatic']);
    });

    it('does not emit duplicate change events when toggling an item to its current state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      fixture.componentInstance.accordionRef?.open('one');
      fixture.componentInstance.accordionRef?.open('one');
      fixture.detectChanges();

      expect(fixture.componentInstance.expandedChanges).toHaveLength(1);
      expect(fixture.componentInstance.openedEvents).toEqual(['one']);
    });
  });

  describe('E) Pointer interactions', () => {
    it('clicking a trigger expands its panel when collapsed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
    });

    it('clicking a trigger collapses its panel when expanded and collapsible allows it', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(true);
    });

    it('clicking a disabled trigger does not expand or collapse', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.items.set([
        { value: 'one', label: 'One', disabled: true },
        { value: 'two', label: 'Two' },
      ]);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(true);
      expect(fixture.componentInstance.expandedChanges).toHaveLength(0);
    });

    it('pointer interaction emits change events with trigger metadata `pointer` (if included)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(fixture.componentInstance.expandedChanges.at(-1)?.trigger).toBe('pointer');
    });

    it('clicking within the panel content does not toggle the accordion', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'panel-action-one'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
      expect(fixture.componentInstance.expandedChanges).toHaveLength(0);
    });
  });

  describe('F) Keyboard interaction — activation', () => {
    it('Enter on a focused trigger toggles its panel', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      trigger.focus();
      keydown(trigger, 'Enter');
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
    });

    it('Space on a focused trigger toggles its panel', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      trigger.focus();
      keydown(trigger, ' ');
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
    });

    it('trigger prevents default Space scroll behavior when used for toggling', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const event = keydown(getByTestId<HTMLElement>(fixture, 'trigger-one'), ' ');
      expect(event.defaultPrevented).toBe(true);
    });

    it('disabled trigger does not toggle on Enter or Space', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.items.set([
        { value: 'one', label: 'One', disabled: true },
        { value: 'two', label: 'Two' },
      ]);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLElement>(fixture, 'trigger-one');
      keydown(trigger, 'Enter');
      keydown(trigger, ' ');
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(true);
    });
  });

  describe('G) Keyboard interaction — roving focus between triggers', () => {
    it('ArrowDown moves focus to the next enabled trigger', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      const second = getByTestId<HTMLButtonElement>(fixture, 'trigger-two');
      first.focus();
      const event = keydown(first, 'ArrowDown');

      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(second);
    });

    it('ArrowUp moves focus to the previous enabled trigger', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      const second = getByTestId<HTMLButtonElement>(fixture, 'trigger-two');
      second.focus();
      const event = keydown(second, 'ArrowUp');

      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(first);
    });

    it('Home moves focus to the first enabled trigger', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      const third = getByTestId<HTMLButtonElement>(fixture, 'trigger-three');
      third.focus();
      keydown(third, 'Home');

      expect(document.activeElement).toBe(first);
    });

    it('End moves focus to the last enabled trigger', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      const third = getByTestId<HTMLButtonElement>(fixture, 'trigger-three');
      first.focus();
      keydown(first, 'End');

      expect(document.activeElement).toBe(third);
    });

    it('skips disabled triggers during Arrow navigation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.items.set([
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two', disabled: true },
        { value: 'three', label: 'Three' },
      ]);
      fixture.detectChanges();

      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      const third = getByTestId<HTMLButtonElement>(fixture, 'trigger-three');
      first.focus();
      keydown(first, 'ArrowDown');

      expect(document.activeElement).toBe(third);
    });

    it('wraps focus from last to first when `loop=true`', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.loop.set(true);
      fixture.detectChanges();

      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      const third = getByTestId<HTMLButtonElement>(fixture, 'trigger-three');
      third.focus();
      keydown(third, 'ArrowDown');

      expect(document.activeElement).toBe(first);
    });

    it('does not wrap at ends when `loop=false`', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.loop.set(false);
      fixture.detectChanges();

      const third = getByTestId<HTMLButtonElement>(fixture, 'trigger-three');
      third.focus();
      const event = keydown(third, 'ArrowDown');

      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(third);
    });

    it('does not trap Tab or Shift+Tab and allows native traversal out of the accordion', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const before = getByTestId<HTMLButtonElement>(fixture, 'before');
      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      const after = getByTestId<HTMLButtonElement>(fixture, 'after');

      first.focus();
      const tabEvent = dispatchTabAndSimulateBrowserFocus(first, after);
      const shiftTabEvent = dispatchTabAndSimulateBrowserFocus(first, before, true);

      expect(tabEvent.defaultPrevented).toBe(false);
      expect(shiftTabEvent.defaultPrevented).toBe(false);
    });

    it('tabs through text-only accordion sections in DOM order', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionTextOnlyHostComponent],
      }).createComponent(AccordionTextOnlyHostComponent);
      fixture.detectChanges();

      const first = getByTestId<HTMLElement>(fixture, 'text-trigger-one');
      const second = getByTestId<HTMLElement>(fixture, 'text-trigger-two');
      const third = getByTestId<HTMLElement>(fixture, 'text-trigger-three');

      first.focus();
      keydown(first, 'Tab');
      expect(document.activeElement).toBe(second);

      keydown(second, 'Tab');
      expect(document.activeElement).toBe(third);
    });

    it('tabs from each section trigger into its section item, then to the next section trigger', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionSectionItemTabHostComponent],
      }).createComponent(AccordionSectionItemTabHostComponent);
      fixture.detectChanges();

      const triggerOne = getByTestId<HTMLElement>(fixture, 'section-trigger-one');
      const itemOne = getByTestId<HTMLButtonElement>(fixture, 'section-item-one');
      const triggerTwo = getByTestId<HTMLElement>(fixture, 'section-trigger-two');
      const itemTwo = getByTestId<HTMLButtonElement>(fixture, 'section-item-two');
      const triggerThree = getByTestId<HTMLElement>(fixture, 'section-trigger-three');

      triggerOne.focus();
      keydown(triggerOne, 'Tab');
      expect(document.activeElement).toBe(itemOne);

      keydown(itemOne, 'Tab');
      expect(document.activeElement).toBe(triggerTwo);

      keydown(triggerTwo, 'Tab');
      expect(document.activeElement).toBe(itemTwo);

      keydown(itemTwo, 'Tab');
      expect(document.activeElement).toBe(triggerThree);
    });

    it('skips closed section items while tabbing between section triggers', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionPanelItemTabHostComponent],
      }).createComponent(AccordionPanelItemTabHostComponent);
      fixture.detectChanges();

      const triggerOne = getByTestId<HTMLElement>(fixture, 'panel-trigger-one');
      const itemOne = getByTestId<HTMLButtonElement>(fixture, 'panel-item-one');
      const triggerTwo = getByTestId<HTMLElement>(fixture, 'panel-trigger-two');
      const triggerThree = getByTestId<HTMLElement>(fixture, 'panel-trigger-three');
      const panelTwo = getByTestId<HTMLElement>(fixture, 'panel-two');
      const itemTwo = getByTestId<HTMLButtonElement>(fixture, 'panel-item-two');

      expect(panelTwo.hasAttribute('hidden')).toBe(true);
      expect(itemTwo.closest('[hidden]')).not.toBeNull();

      triggerOne.focus();
      keydown(triggerOne, 'Tab');
      expect(document.activeElement).toBe(itemOne);

      keydown(itemOne, 'Tab');
      expect(document.activeElement).toBe(triggerTwo);

      keydown(triggerTwo, 'Tab');
      expect(document.activeElement).toBe(triggerThree);
    });
  });

  describe('H) Panel visibility & mounting', () => {
    it('collapsed panel is hidden using `hidden` attribute (or display:none) per contract', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(true);
    });

    it('expanded panel is visible and removes the `hidden` attribute', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();
      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
    });

    it('with `keepAlive=true`, collapsed panels remain mounted and preserve state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.keepAlive.set(true);
      fixture.detectChanges();

      const panel = getByTestId<HTMLElement>(fixture, 'panel-one');
      expect(panel.getAttribute('data-mounted')).toBe('true');
    });

    it('with `keepAlive=false`, collapsed panels are unmounted and remounted on expand', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.keepAlive.set(false);
      fixture.detectChanges();

      const panel = getByTestId<HTMLElement>(fixture, 'panel-one');
      expect(panel.getAttribute('data-mounted')).toBe('false');

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();
      expect(panel.getAttribute('data-mounted')).toBe('true');
    });

    it('with `lazy=true`, a panel is not mounted until first expansion', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.lazy.set(true);
      fixture.componentInstance.keepAlive.set(true);
      fixture.detectChanges();

      const panel = getByTestId<HTMLElement>(fixture, 'panel-one');
      expect(panel.getAttribute('data-mounted')).toBe('false');

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();
      expect(panel.getAttribute('data-mounted')).toBe('true');

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();
      expect(panel.getAttribute('data-mounted')).toBe('true');
    });

    it('panel visibility updates correctly during rapid toggles', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLElement>(fixture, 'trigger-one');
      click(trigger);
      click(trigger);
      click(trigger);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
      expect(getByTestId<HTMLElement>(fixture, 'trigger-one').getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('I) Disabled state behavior', () => {
    it('disabling the entire accordion prevents expanding/collapsing via pointer and keyboard', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLElement>(fixture, 'trigger-one');
      click(trigger);
      keydown(trigger, 'Enter');
      keydown(trigger, ' ');
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(true);
    });

    it('disabling the entire accordion preserves current expanded state (per contract)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();
      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();
      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
    });

    it('disabling an expanded item collapses it only if your contract specifies auto-collapse', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.defaultValue.set('one');
      fixture.componentInstance.items.set([
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
      ]);
      fixture.detectChanges();

      fixture.componentInstance.items.set([
        { value: 'one', label: 'One', disabled: true },
        { value: 'two', label: 'Two' },
      ]);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
    });

    it('disabled items are excluded from focus navigation targets', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.items.set([
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two', disabled: true },
        { value: 'three', label: 'Three' },
      ]);
      fixture.detectChanges();

      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      const third = getByTestId<HTMLButtonElement>(fixture, 'trigger-three');
      first.focus();
      keydown(first, 'ArrowDown');
      expect(document.activeElement).toBe(third);
    });
  });

  describe('J) Dynamic lifecycle (add/remove/reorder)', () => {
    it('adding a new item does not change existing expanded state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      fixture.componentInstance.items.update((items) => [...items, { value: 'four', label: 'Four' }]);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
      expect(getByTestId<HTMLElement>(fixture, 'panel-four').hasAttribute('hidden')).toBe(true);
    });

    it('removing a collapsed item preserves expanded state of others', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      fixture.componentInstance.items.set([
        { value: 'one', label: 'One' },
        { value: 'three', label: 'Three' },
      ]);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
      expect(queryByTestId<HTMLElement>(fixture, 'item-two')).toBeNull();
    });

    it('removing an expanded item updates the expanded state deterministically (single mode selects nearest/none per contract)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      fixture.componentInstance.items.set([
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ]);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-two').hasAttribute('hidden')).toBe(true);
      expect(getByTestId<HTMLElement>(fixture, 'panel-three').hasAttribute('hidden')).toBe(true);
    });

    it('reordering items updates arrow navigation order to match DOM order', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      fixture.componentInstance.items.set([
        { value: 'three', label: 'Three' },
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
      ]);
      fixture.detectChanges();

      const triggerThree = getByTestId<HTMLButtonElement>(fixture, 'trigger-three');
      const triggerOne = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      triggerThree.focus();
      keydown(triggerThree, 'ArrowDown');

      expect(document.activeElement).toBe(triggerOne);
    });

    it('reordering items preserves expansion by value/key and not by index', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.defaultValue.set('two');
      fixture.detectChanges();

      fixture.componentInstance.items.set([
        { value: 'three', label: 'Three' },
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
      ]);
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'panel-two').hasAttribute('hidden')).toBe(false);
    });

    it('ignores non-accordion elements for registration and navigation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      const second = getByTestId<HTMLButtonElement>(fixture, 'trigger-two');
      const noise = getByTestId<HTMLElement>(fixture, 'noise-node');

      first.focus();
      keydown(first, 'ArrowDown');
      expect(document.activeElement).toBe(second);
      expect(document.activeElement).not.toBe(noise);
    });
  });

  describe('K) Multiple accordion instances isolation', () => {
    it('two independent accordions do not share roving focus state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionIsolationHostComponent],
      }).createComponent(AccordionIsolationHostComponent);
      fixture.detectChanges();

      const aFirst = getByTestId<HTMLButtonElement>(fixture, 'a-trigger-1');
      const aSecond = getByTestId<HTMLButtonElement>(fixture, 'a-trigger-2');
      const bFirst = getByTestId<HTMLButtonElement>(fixture, 'b-trigger-1');

      aFirst.focus();
      keydown(aFirst, 'ArrowDown');
      expect(document.activeElement).toBe(aSecond);
      expect(document.activeElement).not.toBe(bFirst);
    });

    it('expanding an item in one accordion does not affect the other accordion', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionIsolationHostComponent],
      }).createComponent(AccordionIsolationHostComponent);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'a-trigger-1'));
      fixture.detectChanges();

      expect(getByTestId<HTMLElement>(fixture, 'a-panel-1').hasAttribute('hidden')).toBe(false);
      expect(getByTestId<HTMLElement>(fixture, 'b-panel-1').hasAttribute('hidden')).toBe(true);
    });

    it('generated IDs avoid collisions across multiple accordions on the same page', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionIsolationHostComponent],
      }).createComponent(AccordionIsolationHostComponent);
      fixture.detectChanges();

      const triggerIds = [
        getByTestId<HTMLElement>(fixture, 'a-trigger-1').id,
        getByTestId<HTMLElement>(fixture, 'a-trigger-2').id,
        getByTestId<HTMLElement>(fixture, 'b-trigger-1').id,
        getByTestId<HTMLElement>(fixture, 'b-trigger-2').id,
      ];
      const panelIds = [
        getByTestId<HTMLElement>(fixture, 'a-panel-1').id,
        getByTestId<HTMLElement>(fixture, 'a-panel-2').id,
        getByTestId<HTMLElement>(fixture, 'b-panel-1').id,
        getByTestId<HTMLElement>(fixture, 'b-panel-2').id,
      ];

      expect(new Set(triggerIds).size).toBe(triggerIds.length);
      expect(new Set(panelIds).size).toBe(panelIds.length);
    });
  });

  describe('L) Nested accordions & interactive content', () => {
    it('nested accordion inside a panel does not break outer accordion navigation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [NestedAccordionHostComponent],
      }).createComponent(NestedAccordionHostComponent);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'outer-trigger-1'));
      fixture.detectChanges();

      const outerFirst = getByTestId<HTMLButtonElement>(fixture, 'outer-trigger-1');
      const outerSecond = getByTestId<HTMLButtonElement>(fixture, 'outer-trigger-2');
      outerFirst.focus();
      keydown(outerFirst, 'ArrowDown');

      expect(document.activeElement).toBe(outerSecond);
    });

    it('Arrow-key navigation affects only triggers within the current accordion scope', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [NestedAccordionHostComponent],
      }).createComponent(NestedAccordionHostComponent);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'outer-trigger-1'));
      fixture.detectChanges();

      const innerA = getByTestId<HTMLButtonElement>(fixture, 'inner-trigger-a');
      const innerB = getByTestId<HTMLButtonElement>(fixture, 'inner-trigger-b');
      innerA.focus();
      keydown(innerA, 'ArrowDown');

      expect(document.activeElement).toBe(innerB);
    });

    it('interactive content inside the panel (inputs/links/buttons) remains operable and does not toggle the accordion', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      const action = getByTestId<HTMLButtonElement>(fixture, 'panel-action-one');
      action.focus();
      click(action);
      fixture.detectChanges();

      expect(document.activeElement).toBe(action);
      expect(getByTestId<HTMLElement>(fixture, 'panel-one').hasAttribute('hidden')).toBe(false);
    });
  });

  describe('M) Animation and event ordering (if animated)', () => {
    it('emits `openStart` before an expand animation begins (if provided)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(fixture.componentInstance.openStarts).toEqual(['one']);
      expect(fixture.componentInstance.openedEvents).toEqual(['one']);
    });

    it('emits `opened` after expand animation completes (if provided)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();
      expect(fixture.componentInstance.openedEvents.at(-1)).toBe('one');
    });

    it('emits `closeStart` before a collapse animation begins (if provided)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(fixture.componentInstance.closeStarts).toEqual(['one']);
      expect(fixture.componentInstance.closedEvents).toEqual(['one']);
    });

    it('emits `closed` after collapse animation completes (if provided)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();
      expect(fixture.componentInstance.closedEvents.at(-1)).toBe('one');
    });

    it('non-animated path emits `openStart→opened` in the same tick/order (if provided)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(fixture.componentInstance.openStarts[0]).toBe('one');
      expect(fixture.componentInstance.openedEvents[0]).toBe('one');
    });

    it('non-animated path emits `closeStart→closed` in the same tick/order (if provided)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.defaultValue.set('one');
      fixture.detectChanges();

      click(getByTestId<HTMLElement>(fixture, 'trigger-one'));
      fixture.detectChanges();

      expect(fixture.componentInstance.closeStarts[0]).toBe('one');
      expect(fixture.componentInstance.closedEvents[0]).toBe('one');
    });
  });

  describe('N) Accessibility & edge cases', () => {
    it('does not set invalid ARIA attributes when IDs are missing or items are empty', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLElement>(fixture, 'trigger-one');
      const panel = getByTestId<HTMLElement>(fixture, 'panel-one');

      expect(trigger.id).toBeTruthy();
      expect(panel.id).toBeTruthy();
      expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
      expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
    });

    it('handles an accordion with all triggers disabled without throwing', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.componentInstance.items.set([
        { value: 'one', label: 'One', disabled: true },
        { value: 'two', label: 'Two', disabled: true },
      ]);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLElement>(fixture, 'trigger-one');
      expect(() => keydown(trigger, 'ArrowDown')).not.toThrow();
      expect(() => keydown(trigger, 'Enter')).not.toThrow();
    });

    it('handles very large panel content without blocking focus navigation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);

      fixture.componentInstance.items.set([
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
      ]);
      fixture.detectChanges();

      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      const second = getByTestId<HTMLButtonElement>(fixture, 'trigger-two');
      first.focus();
      keydown(first, 'ArrowDown');

      expect(document.activeElement).toBe(second);
    });

    it('destroying the accordion during in-flight events does not log errors or update DOM after destroy', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AccordionHarnessHostComponent],
      }).createComponent(AccordionHarnessHostComponent);
      fixture.detectChanges();

      const first = getByTestId<HTMLButtonElement>(fixture, 'trigger-one');
      first.focus();
      keydown(first, 'ArrowDown');
      fixture.destroy();

      expect(() => keydown(first, 'ArrowDown')).not.toThrow();
    });
  });
});
