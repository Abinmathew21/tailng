import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';

import * as primitives from '../../../../index';
import {
  TngButtonToggle,
  TngButtonToggleChangeEvent,
  TngButtonToggleFocusChangeEvent,
  TngButtonToggleGroup,
  resolveTngButtonToggleAriaPressed,
  resolveTngButtonToggleDataState,
} from '../tng-button-toggle';

interface ToggleConfig {
  readonly value: string;
  readonly label: string;
  readonly disabled: boolean;
  readonly id?: string;
  readonly rogue?: boolean;
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

@Component({
  imports: [TngButtonToggleGroup, TngButtonToggle],
  template: `
    <section tngButtonToggleGroup data-testid="group">
      <button tngButtonToggle data-testid="toggle-a" tngButtonToggleValue="a" value="a">A</button>
      <button tngButtonToggle data-testid="toggle-b" tngButtonToggleValue="b" value="b">B</button>
    </section>
  `,
})
class MinimalButtonToggleHostComponent {}

@Component({
  imports: [TngButtonToggleGroup, TngButtonToggle],
  template: `
    <section tngButtonToggleGroup data-testid="group"></section>
  `,
})
class ZeroToggleHostComponent {}

@Component({
  imports: [TngButtonToggleGroup, TngButtonToggle],
  template: `
    <section tngButtonToggleGroup data-testid="group" tngButtonToggleDefaultValue="strike">
      <button tngButtonToggle data-testid="toggle-bold" tngButtonToggleValue="bold" value="bold">Bold</button>
      <button tngButtonToggle data-testid="toggle-italic" tngButtonToggleValue="italic" value="italic">Italic</button>
      <button tngButtonToggle data-testid="toggle-strike" tngButtonToggleValue="strike" value="strike">Strike</button>
    </section>
  `,
})
class ButtonToggleSingleDefaultHostComponent {}

@Component({
  imports: [TngButtonToggleGroup, TngButtonToggle],
  template: `
    <button type="button" data-testid="before">Before</button>

    @if (renderGroup()) {
      <section
        tngButtonToggleGroup
        #groupRef="tngButtonToggleGroup"
        data-testid="group"
        [type]="type()"
        [tngButtonToggleValue]="valueAttr()"
        [tngButtonToggleValues]="valuesAttr()"
        [tngButtonToggleDefaultValue]="defaultValueAttr()"
        [tngButtonToggleDefaultValues]="defaultValuesAttr()"
        [allowEmpty]="allowEmpty()"
        [disabled]="groupDisabled()"
        [orientation]="orientation()"
        [loop]="loop()"
        [activation]="activation()"
        [dir]="dir()"
        (valueChange)="valueChanges.push($event)"
        (valuesChange)="valuesChanges.push($event)"
        (toggleChange)="toggleChanges.push($event)"
        (focusChange)="focusChanges.push($event)"
      >
        <div data-testid="plain-child">Plain child</div>

        @for (toggle of toggles(); track toggle.value) {
          @if (!toggle.rogue) {
            <button
              tngButtonToggle
              [attr.data-testid]="'toggle-' + toggle.value"
              [tngButtonToggleValue]="toggle.value"
              [attr.value]="toggle.value"
              [disabled]="toggle.disabled"
              [attr.id]="toggle.id ?? null"
            >
              <span>{{ toggle.label }}</span>
            </button>
          } @else {
            <button type="button" [attr.data-testid]="'rogue-' + toggle.value">{{ toggle.label }}</button>
          }
        }
      </section>
    }

    <button type="button" data-testid="after">After</button>
  `,
})
class ButtonToggleHarnessHostComponent {
  readonly type = signal<'single' | 'multiple'>('single');
  readonly valueAttr = signal<string | null | undefined>(undefined);
  readonly valuesAttr = signal<readonly string[] | undefined>(undefined);
  readonly defaultValueAttr = signal<string | null | undefined>(undefined);
  readonly defaultValuesAttr = signal<readonly string[]>([]);
  readonly allowEmpty = signal(false);
  readonly groupDisabled = signal(false);
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  readonly loop = signal(true);
  readonly activation = signal<'auto' | 'manual'>('auto');
  readonly dir = signal<'ltr' | 'rtl' | 'auto'>('ltr');
  readonly renderGroup = signal(true);

  readonly toggles = signal<readonly ToggleConfig[]>([
    { value: 'bold', label: 'Bold', disabled: false, id: 'provided-bold-id' },
    { value: 'italic', label: 'Italic', disabled: false },
    { value: 'underline', label: 'Underline', disabled: true },
    { value: 'strike', label: 'Strike', disabled: false },
  ]);

  readonly valueChanges: Array<string | null> = [];
  readonly valuesChanges: Array<readonly string[]> = [];
  readonly toggleChanges: TngButtonToggleChangeEvent[] = [];
  readonly focusChanges: TngButtonToggleFocusChangeEvent[] = [];

  @ViewChild('groupRef', { static: false }) groupRef?: TngButtonToggleGroup;

  resetEvents(): void {
    this.valueChanges.length = 0;
    this.valuesChanges.length = 0;
    this.toggleChanges.length = 0;
    this.focusChanges.length = 0;
  }

  setNoIds(): void {
    this.toggles.update((toggles) => toggles.map((toggle) => ({ ...toggle, id: undefined })));
  }
}

@Component({
  imports: [TngButtonToggleGroup, TngButtonToggle],
  template: `
    <section tngButtonToggleGroup data-testid="group-a">
      <button tngButtonToggle data-testid="a-one" tngButtonToggleValue="a-one" value="a-one">A One</button>
      <button tngButtonToggle data-testid="a-two" tngButtonToggleValue="a-two" value="a-two">A Two</button>
    </section>

    <section
      tngButtonToggleGroup
      data-testid="group-b"
      type="multiple"
      [tngButtonToggleDefaultValues]="['b-two']"
    >
      <button tngButtonToggle data-testid="b-one" tngButtonToggleValue="b-one" value="b-one">B One</button>
      <button tngButtonToggle data-testid="b-two" tngButtonToggleValue="b-two" value="b-two">B Two</button>
    </section>
  `,
})
class ButtonToggleIsolationHostComponent {}

@Component({
  imports: [TngButtonToggleGroup, TngButtonToggle],
  template: `
    <section
      tngButtonToggleGroup
      #groupRef="tngButtonToggleGroup"
      data-testid="group"
      [type]="type"
      [activation]="activation"
    >
      <button tngButtonToggle data-testid="toggle-account" tngButtonToggleValue="account" value="account">Account</button>
      <button tngButtonToggle data-testid="toggle-security" tngButtonToggleValue="security" value="security">Security</button>
      <button tngButtonToggle data-testid="toggle-billing" tngButtonToggleValue="billing" value="billing">Billing</button>
    </section>
  `,
})
class ButtonToggleProgrammaticHostComponent {
  type: 'single' | 'multiple' = 'single';
  activation: 'auto' | 'manual' = 'auto';

  @ViewChild('groupRef', { static: true }) groupRef!: TngButtonToggleGroup;
}

@Component({
  imports: [TngButtonToggleGroup, TngButtonToggle],
  template: `
    <section tngButtonToggleGroup data-testid="group">
      <button tngButtonToggle data-testid="toggle-rich" tngButtonToggleValue="rich" value="rich">
        <span data-testid="nested-focusable" tabindex="0">Nested</span>
      </button>
      <button tngButtonToggle data-testid="toggle-plain" tngButtonToggleValue="plain" value="plain">
        Plain
      </button>
    </section>
  `,
})
class ButtonToggleNestedContentHostComponent {}

@Component({
  imports: [TngButtonToggleGroup, TngButtonToggle],
  template: `
    <section tngButtonToggleGroup data-testid="group-a">
      @for (item of togglesA(); track item) {
        <button
          tngButtonToggle
          [attr.data-testid]="'a-' + item"
          [tngButtonToggleValue]="item"
          [attr.value]="item"
        >
          {{ item }}
        </button>
      }
    </section>

    <section tngButtonToggleGroup data-testid="group-b" tngButtonToggleDefaultValue="b-two">
      @for (item of togglesB(); track item) {
        <button
          tngButtonToggle
          [attr.data-testid]="'b-' + item"
          [tngButtonToggleValue]="item"
          [attr.value]="item"
        >
          {{ item }}
        </button>
      }
    </section>
  `,
})
class ButtonToggleDynamicIsolationHostComponent {
  readonly togglesA = signal<readonly string[]>(['a-one', 'a-two']);
  readonly togglesB = signal<readonly string[]>(['b-one', 'b-two']);
}

function getByTestId<T extends HTMLElement>(fixture: { nativeElement: HTMLElement }, id: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as T | null;
  expect(element).not.toBeNull();
  return element as T;
}

function getToggles(fixture: { nativeElement: HTMLElement }): HTMLButtonElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('button[tngButtonToggle]')) as HTMLButtonElement[];
}

function getSelectedValues(fixture: { nativeElement: HTMLElement }): string[] {
  return getToggles(fixture)
    .filter((toggle) => toggle.getAttribute('data-selected') === 'true')
    .map((toggle) => toggle.getAttribute('value') || toggle.value || toggle.id);
}

describe('tng-button-toggle primitives', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('A) Exports & basic structure', () => {
    it('exports the button-toggle primitives (group + item)', () => {
      const exported = primitives as Record<string, unknown>;

      expect(typeof exported['TngButtonToggleGroup']).toBe('function');
      expect(typeof exported['TngButtonToggle']).toBe('function');
    });

    it('renders a valid toggle group with toggles without optional inputs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MinimalButtonToggleHostComponent],
      }).createComponent(MinimalButtonToggleHostComponent);

      fixture.detectChanges();

      const group = getByTestId<HTMLElement>(fixture, 'group');
      const toggles = getToggles(fixture);

      expect(group.getAttribute('data-slot')).toBe('button-toggle-group');
      expect(group.getAttribute('role')).toBe('radiogroup');
      expect(toggles).toHaveLength(2);
    });

    it('does not throw when rendered with zero toggles', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ZeroToggleHostComponent],
      }).createComponent(ZeroToggleHostComponent);

      expect(() => fixture.detectChanges()).not.toThrow();
      expect(getToggles(fixture)).toHaveLength(0);
    });

    it('cleans up registrations on destroy without runtime errors', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MinimalButtonToggleHostComponent],
      }).createComponent(MinimalButtonToggleHostComponent);

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

    it('resolves aria/data state utility helpers', () => {
      expect(resolveTngButtonToggleAriaPressed(true)).toBe('true');
      expect(resolveTngButtonToggleAriaPressed(false)).toBe('false');
      expect(resolveTngButtonToggleDataState(true)).toBe('on');
      expect(resolveTngButtonToggleDataState(false)).toBe('off');
    });
  });

  describe('B) ARIA roles & state attributes', () => {
    it('applies radiogroup/radio/aria-checked in single mode', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const group = getByTestId<HTMLElement>(fixture, 'group');
      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');

      expect(group.getAttribute('role')).toBe('radiogroup');
      expect(bold.getAttribute('role')).toBe('radio');
      expect(italic.getAttribute('role')).toBe('radio');
      expect(bold.getAttribute('aria-checked')).toBe('true');
      expect(italic.getAttribute('aria-checked')).toBe('false');
      expect(bold.getAttribute('aria-pressed')).toBeNull();
    });

    it('applies group role and aria-pressed in multiple mode', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.detectChanges();

      const group = getByTestId<HTMLElement>(fixture, 'group');
      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      click(italic);
      fixture.detectChanges();

      expect(group.getAttribute('role')).toBe('group');
      expect(bold.getAttribute('role')).toBeNull();
      expect(bold.getAttribute('aria-checked')).toBeNull();
      expect(bold.getAttribute('aria-pressed')).toBe('false');
      expect(italic.getAttribute('aria-pressed')).toBe('true');
    });

    it('applies aria-disabled on disabled toggles and keeps them out of tab stop', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const disabled = getByTestId<HTMLButtonElement>(fixture, 'toggle-underline');
      expect(disabled.getAttribute('aria-disabled')).toBe('true');
      expect(disabled.getAttribute('tabindex')).toBe('-1');
    });

    it('does not assign toggle role to non-toggle elements in the group', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const plainChild = getByTestId<HTMLElement>(fixture, 'plain-child');
      expect(plainChild.getAttribute('role')).toBeNull();
      expect(plainChild.getAttribute('aria-checked')).toBeNull();
      expect(plainChild.getAttribute('aria-pressed')).toBeNull();
    });

    it('preserves provided IDs and generates unique IDs for others', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.setNoIds();
      fixture.detectChanges();

      const toggles = getToggles(fixture);
      const ids = toggles.map((toggle) => toggle.id);

      expect(ids.every((id) => id.length > 0)).toBe(true);
      expect(new Set(ids).size).toBe(ids.length);

      fixture.componentInstance.toggles.set([
        { value: 'bold', label: 'Bold', disabled: false, id: 'provided-bold-id' },
        { value: 'italic', label: 'Italic', disabled: false },
      ]);
      fixture.detectChanges();

      const provided = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      expect(provided.id).toBe('provided-bold-id');
    });
  });

  describe('C) Controlled vs uncontrolled selection', () => {
    it('single mode selects first enabled by default when uncontrolled and allowEmpty is false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      expect(getSelectedValues(fixture)).toEqual(['bold']);
    });

    it('single mode respects defaultValue on initial uncontrolled render', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleSingleDefaultHostComponent],
      }).createComponent(ButtonToggleSingleDefaultHostComponent);
      fixture.detectChanges();

      expect(getSelectedValues(fixture)).toEqual(['strike']);
    });

    it('single mode respects controlled value', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();
      fixture.componentInstance.valueAttr.set('strike');
      fixture.detectChanges();
      fixture.detectChanges();

      expect(getSelectedValues(fixture)).toEqual(['strike']);
    });

    it('multiple mode respects controlled values', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();
      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.valuesAttr.set(['italic', 'strike']);
      fixture.detectChanges();
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['italic', 'strike']);
    });

    it('does not mutate controlled single selection internally on click', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.valueAttr.set('bold');
      fixture.detectChanges();

      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');
      click(strike);
      fixture.detectChanges();

      expect(getSelectedValues(fixture)).toEqual(['bold']);
      expect(fixture.componentInstance.valueChanges.at(-1)).toBe('strike');
      expect(fixture.componentInstance.toggleChanges.at(-1)?.trigger).toBe('pointer');
    });

    it('does not emit duplicate valueChange events when selection does not change', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();
      fixture.componentInstance.resetEvents();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      click(bold);
      fixture.detectChanges();

      expect(fixture.componentInstance.valueChanges).toHaveLength(0);
      expect(fixture.componentInstance.toggleChanges).toHaveLength(0);
    });
  });

  describe('D) Roving tabindex & focus entry', () => {
    it('keeps exactly one enabled toggle at tabindex=0', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const tabStops = getToggles(fixture).filter((toggle) => toggle.getAttribute('tabindex') === '0');
      expect(tabStops).toHaveLength(1);
      expect(tabStops[0]?.getAttribute('value')).toBe('bold');
    });

    it('uses selected toggle as initial tab stop', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleSingleDefaultHostComponent],
      }).createComponent(ButtonToggleSingleDefaultHostComponent);
      fixture.detectChanges();

      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');
      expect(strike.getAttribute('tabindex')).toBe('0');
      expect(strike.getAttribute('data-selected')).toBe('true');
    });

    it('updates tab stop when selection changes', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');
      click(strike);
      fixture.detectChanges();

      expect(strike.getAttribute('tabindex')).toBe('0');
      expect(strike.getAttribute('data-focused')).toBe('true');
    });
  });

  describe('E) Pointer interactions', () => {
    it('clicking enabled toggle selects it in single mode and keeps focus', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      click(italic);
      fixture.detectChanges();

      expect(getSelectedValues(fixture)).toEqual(['italic']);
      expect(document.activeElement).toBe(italic);
    });

    it('clicking disabled toggle does not change selection', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const disabled = getByTestId<HTMLButtonElement>(fixture, 'toggle-underline');
      click(disabled);
      fixture.detectChanges();

      expect(getSelectedValues(fixture)).toEqual(['bold']);
    });

    it('clicking toggles value on/off in multiple mode', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      click(bold);
      fixture.detectChanges();

      click(italic);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold', 'italic']);

      click(italic);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold']);
    });

    it('emits pointer trigger metadata on toggleChange', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();
      fixture.componentInstance.resetEvents();

      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');
      click(strike);
      fixture.detectChanges();

      expect(fixture.componentInstance.toggleChanges.at(-1)).toMatchObject({
        value: 'strike',
        selected: true,
        trigger: 'pointer',
      });
    });
  });

  describe('F) Keyboard navigation — horizontal', () => {
    it('ArrowRight/ArrowLeft move focus and selection in auto single mode', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      bold.focus();

      keydown(bold, 'ArrowRight');
      fixture.detectChanges();

      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      expect(document.activeElement).toBe(italic);
      expect(getSelectedValues(fixture)).toEqual(['italic']);

      keydown(italic, 'ArrowLeft');
      fixture.detectChanges();

      expect(document.activeElement).toBe(bold);
      expect(getSelectedValues(fixture)).toEqual(['bold']);
    });

    it('Home and End move to first/last enabled toggle', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      italic.focus();

      keydown(italic, 'End');
      fixture.detectChanges();
      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');
      expect(document.activeElement).toBe(strike);

      keydown(strike, 'Home');
      fixture.detectChanges();
      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      expect(document.activeElement).toBe(bold);
    });

    it('skips disabled toggles and supports loop true/false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      italic.focus();
      keydown(italic, 'ArrowRight');
      fixture.detectChanges();

      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');
      expect(document.activeElement).toBe(strike);

      keydown(strike, 'ArrowRight');
      fixture.detectChanges();
      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      expect(document.activeElement).toBe(bold);

      fixture.componentInstance.loop.set(false);
      fixture.detectChanges();
      strike.focus();
      keydown(strike, 'ArrowRight');
      fixture.detectChanges();
      expect(document.activeElement).toBe(strike);
    });
  });

  describe('G) Keyboard navigation — vertical + H) RTL', () => {
    it('ArrowDown/ArrowUp move in vertical orientation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.orientation.set('vertical');
      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      bold.focus();
      keydown(bold, 'ArrowDown');
      fixture.detectChanges();

      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      expect(document.activeElement).toBe(italic);

      keydown(italic, 'ArrowUp');
      fixture.detectChanges();
      expect(document.activeElement).toBe(bold);
    });

    it('supports Home/End/skip-disabled/wrap in vertical orientation', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.orientation.set('vertical');
      fixture.componentInstance.loop.set(true);
      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');

      italic.focus();
      keydown(italic, 'ArrowDown');
      fixture.detectChanges();
      expect(document.activeElement).toBe(strike);

      keydown(strike, 'ArrowDown');
      fixture.detectChanges();
      expect(document.activeElement).toBe(bold);

      keydown(strike, 'Home');
      fixture.detectChanges();
      expect(document.activeElement).toBe(bold);

      keydown(bold, 'End');
      fixture.detectChanges();
      expect(document.activeElement).toBe(strike);
    });

    it('mirrors horizontal ArrowLeft/ArrowRight behavior in RTL', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.dir.set('rtl');
      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      bold.focus();

      keydown(bold, 'ArrowLeft');
      fixture.detectChanges();
      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      expect(document.activeElement).toBe(italic);

      fixture.componentInstance.dir.set('ltr');
      fixture.detectChanges();
      keydown(italic, 'ArrowLeft');
      fixture.detectChanges();
      expect(document.activeElement).toBe(bold);
    });

    it('changing direction does not mutate selected values', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();
      fixture.componentInstance.dir.set('rtl');
      fixture.detectChanges();

      expect(getSelectedValues(fixture)).toEqual(['bold']);
    });
  });

  describe('I) Activation mode + J) allowEmpty + K) Tab key', () => {
    it('manual activation keeps arrow navigation focus-only until Enter/Space', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.activation.set('manual');
      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      bold.focus();
      keydown(bold, 'ArrowRight');
      fixture.detectChanges();

      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      expect(document.activeElement).toBe(italic);
      expect(getSelectedValues(fixture)).toEqual(['bold']);

      keydown(italic, 'Enter');
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['italic']);

      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.defaultValuesAttr.set(['italic']);
      fixture.detectChanges();

      keydown(italic, ' ');
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual([]);
    });

    it('auto activation in multiple mode keeps arrow navigation focus-only', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.defaultValuesAttr.set(['bold']);
      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      bold.focus();
      keydown(bold, 'ArrowRight');
      fixture.detectChanges();

      expect(getSelectedValues(fixture)).toEqual(['bold']);
      expect(document.activeElement).toBe(getByTestId<HTMLButtonElement>(fixture, 'toggle-italic'));
    });

    it('manual activation with Space selects focused toggle in single mode', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.activation.set('manual');
      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      bold.focus();
      keydown(bold, 'ArrowRight');
      fixture.detectChanges();
      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');

      keydown(italic, ' ');
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['italic']);
    });

    it('manual activation with Enter toggles focused toggle in multiple mode', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.activation.set('manual');
      fixture.componentInstance.defaultValuesAttr.set(['bold']);
      fixture.detectChanges();

      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      italic.focus();
      keydown(italic, 'Enter');
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold', 'italic']);
    });

    it('manual activation does not toggle when disabled toggle receives Enter/Space', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.activation.set('manual');
      fixture.componentInstance.valuesAttr.set(['underline']);
      fixture.detectChanges();
      fixture.componentInstance.resetEvents();

      const disabled = getByTestId<HTMLButtonElement>(fixture, 'toggle-underline');
      keydown(disabled, 'Enter');
      keydown(disabled, ' ');
      fixture.detectChanges();

      expect(fixture.componentInstance.valuesChanges).toHaveLength(0);
      expect(fixture.componentInstance.toggleChanges).toHaveLength(0);
      expect(getSelectedValues(fixture)).toEqual([]);
    });

    it('allowEmpty=false prevents deselecting selected value; allowEmpty=true allows it', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      click(bold);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold']);

      fixture.componentInstance.allowEmpty.set(true);
      fixture.detectChanges();
      click(bold);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual([]);

      keydown(bold, ' ');
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold']);

      keydown(bold, ' ');
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual([]);
    });

    it('allowEmpty=false ignores programmatic deselect of selected value', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();
      const singleGroup = fixture.componentInstance.groupRef as TngButtonToggleGroup;
      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');

      click(strike);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['strike']);

      singleGroup.deselect('strike');
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['strike']);
    });

    it('does not prevent Tab / Shift+Tab default behavior', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      const tabEvent = keydown(bold, 'Tab');
      const shiftTabEvent = keydown(bold, 'Tab', { shiftKey: true });

      expect(tabEvent.defaultPrevented).toBe(false);
      expect(shiftTabEvent.defaultPrevented).toBe(false);
    });
  });

  describe('L) Disabled behavior + M/N) dynamic + deterministic ordering', () => {
    it('group disabled blocks pointer/keyboard selection and preserves current state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();
      fixture.componentInstance.groupDisabled.set(true);
      fixture.detectChanges();

      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      click(italic);
      keydown(italic, 'ArrowRight');
      fixture.detectChanges();

      expect(getSelectedValues(fixture)).toEqual(['bold']);
      expect(fixture.componentInstance.valueChanges).toHaveLength(0);
    });

    it('disabling selected single toggle moves selection based on allowEmpty', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();
      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');
      click(strike);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['strike']);

      fixture.componentInstance.toggles.update((toggles) =>
        toggles.map((toggle) =>
          toggle.value === 'strike' ? { ...toggle, disabled: true } : toggle,
        ),
      );
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold']);

      fixture.componentInstance.allowEmpty.set(true);
      fixture.componentInstance.toggles.set([
        { value: 'bold', label: 'Bold', disabled: false },
        { value: 'italic', label: 'Italic', disabled: false },
        { value: 'strike', label: 'Strike', disabled: false },
      ]);
      fixture.detectChanges();

      const italicEnabled = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      click(italicEnabled);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['italic']);

      fixture.componentInstance.toggles.update((toggles) =>
        toggles.map((toggle) =>
          toggle.value === 'italic' ? { ...toggle, disabled: true } : toggle,
        ),
      );
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual([]);
    });

    it('disabling selected value in multiple mode removes it and re-enable restores navigation target', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.defaultValuesAttr.set(['bold', 'italic']);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold', 'italic']);

      fixture.componentInstance.toggles.update((toggles) =>
        toggles.map((toggle) =>
          toggle.value === 'italic' ? { ...toggle, disabled: true } : toggle,
        ),
      );
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold']);

      fixture.componentInstance.toggles.update((toggles) =>
        toggles.map((toggle) =>
          toggle.value === 'italic' ? { ...toggle, disabled: false } : toggle,
        ),
      );
      fixture.detectChanges();

      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      bold.focus();
      keydown(bold, 'ArrowRight');
      fixture.detectChanges();
      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      expect(document.activeElement).toBe(italic);
    });

    it('adding/removing/reordering toggles preserves deterministic behavior', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold']);

      fixture.componentInstance.toggles.update((toggles) => [
        ...toggles,
        { value: 'code', label: 'Code', disabled: false },
      ]);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold']);

      fixture.componentInstance.toggles.update((toggles) =>
        toggles.filter((toggle) => toggle.value !== 'bold'),
      );
      fixture.detectChanges();
      const selectedAfterRemoval = getSelectedValues(fixture);
      expect(selectedAfterRemoval).toHaveLength(1);
      expect(['italic', 'strike', 'code']).toContain(selectedAfterRemoval[0] ?? '');

      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.defaultValuesAttr.set(['italic', 'strike']);
      fixture.componentInstance.toggles.set([
        { value: 'strike', label: 'Strike', disabled: false },
        { value: 'italic', label: 'Italic', disabled: false },
      ]);
      fixture.detectChanges();

      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');
      click(italic);
      fixture.detectChanges();
      expect(fixture.componentInstance.valuesChanges.at(-1)).toEqual(['strike']);

      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');
      keydown(strike, 'ArrowRight');
      fixture.detectChanges();
      expect(document.activeElement).toBe(italic);
    });

    it('removing non-selected toggle preserves selection and removing selected toggle in allowEmpty single clears value', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.defaultValueAttr.set('strike');
      fixture.componentInstance.allowEmpty.set(true);
      fixture.detectChanges();

      fixture.componentInstance.toggles.update((toggles) =>
        toggles.filter((toggle) => toggle.value !== 'italic'),
      );
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['strike']);

      fixture.componentInstance.toggles.update((toggles) =>
        toggles.filter((toggle) => toggle.value !== 'strike'),
      );
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual([]);
    });

    it('removing selected toggle in multiple mode removes it from selected set', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.defaultValuesAttr.set(['bold', 'italic']);
      fixture.detectChanges();

      fixture.componentInstance.toggles.update((toggles) =>
        toggles.filter((toggle) => toggle.value !== 'italic'),
      );
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold']);
    });

    it('emits multiple selection values in DOM order and keeps order deterministic after reorder', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.defaultValuesAttr.set([]);
      fixture.componentInstance.toggles.set([
        { value: 'bold', label: 'Bold', disabled: false },
        { value: 'italic', label: 'Italic', disabled: false },
        { value: 'strike', label: 'Strike', disabled: false },
      ]);
      fixture.detectChanges();
      fixture.componentInstance.resetEvents();

      const strike = getByTestId<HTMLButtonElement>(fixture, 'toggle-strike');
      const bold = getByTestId<HTMLButtonElement>(fixture, 'toggle-bold');
      const italic = getByTestId<HTMLButtonElement>(fixture, 'toggle-italic');

      click(strike);
      fixture.detectChanges();
      click(bold);
      fixture.detectChanges();
      click(italic);
      fixture.detectChanges();

      expect(fixture.componentInstance.valuesChanges.at(-1)).toEqual(['bold', 'italic', 'strike']);

      fixture.componentInstance.toggles.set([
        { value: 'strike', label: 'Strike', disabled: false },
        { value: 'bold', label: 'Bold', disabled: false },
        { value: 'italic', label: 'Italic', disabled: false },
      ]);
      fixture.detectChanges();
      fixture.componentInstance.resetEvents();

      click(bold);
      fixture.detectChanges();
      click(bold);
      fixture.detectChanges();

      expect(fixture.componentInstance.valuesChanges.at(-1)).toEqual(['strike', 'bold', 'italic']);
    });
  });

  describe('O) Programmatic API', () => {
    it('supports focus/next/prev in single mode', () => {
      const singleFixture = TestBed.configureTestingModule({
        imports: [ButtonToggleProgrammaticHostComponent],
      }).createComponent(ButtonToggleProgrammaticHostComponent);

      singleFixture.componentInstance.activation = 'manual';
      singleFixture.detectChanges();

      const singleGroup = singleFixture.componentInstance.groupRef;
      const security = getByTestId<HTMLButtonElement>(singleFixture, 'toggle-security');

      singleGroup.focus('security');
      singleFixture.detectChanges();
      expect(document.activeElement).toBe(security);

      singleGroup.next();
      singleFixture.detectChanges();
      const billing = getByTestId<HTMLButtonElement>(singleFixture, 'toggle-billing');
      expect(document.activeElement).toBe(billing);

      singleGroup.prev();
      singleFixture.detectChanges();
      expect(document.activeElement).toBe(security);
    });

    it('supports select/toggle, ignores missing values, and emits programmatic trigger metadata', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.detectChanges();
      const group = fixture.componentInstance.groupRef;
      expect(group).toBeDefined();
      const groupRef = group as TngButtonToggleGroup;

      fixture.componentInstance.resetEvents();
      groupRef.select('strike');
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['strike']);
      expect(fixture.componentInstance.valueChanges.at(-1)).toBe('strike');
      expect(fixture.componentInstance.toggleChanges.at(-1)?.trigger).toBe('programmatic');

      fixture.componentInstance.resetEvents();
      groupRef.select('missing');
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['strike']);
      expect(fixture.componentInstance.valueChanges).toHaveLength(0);
      expect(fixture.componentInstance.toggleChanges).toHaveLength(0);

      fixture.componentInstance.type.set('multiple');
      fixture.componentInstance.defaultValuesAttr.set(['bold']);
      fixture.detectChanges();
      fixture.componentInstance.resetEvents();

      groupRef.toggle('italic');
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['bold', 'italic']);
      expect(fixture.componentInstance.valuesChanges.at(-1)).toEqual(['bold', 'italic']);
      expect(fixture.componentInstance.toggleChanges.at(-1)?.trigger).toBe('programmatic');
    });
  });

  describe('P) Multiple group isolation', () => {
    it('keeps focus and selection independent across groups', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleIsolationHostComponent],
      }).createComponent(ButtonToggleIsolationHostComponent);

      fixture.detectChanges();

      const aOne = getByTestId<HTMLButtonElement>(fixture, 'a-one');
      const aTwo = getByTestId<HTMLButtonElement>(fixture, 'a-two');
      const bOne = getByTestId<HTMLButtonElement>(fixture, 'b-one');
      const bTwo = getByTestId<HTMLButtonElement>(fixture, 'b-two');

      aOne.focus();
      keydown(aOne, 'ArrowRight');
      fixture.detectChanges();
      expect(document.activeElement).toBe(aTwo);

      click(bOne);
      fixture.detectChanges();
      expect(bOne.getAttribute('data-selected')).toBe('true');
      expect(bTwo.getAttribute('data-selected')).toBe('true');
      expect(aTwo.getAttribute('data-selected')).toBe('true');

      const ids = [aOne.id, aTwo.id, bOne.id, bTwo.id];
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('dynamic add/remove in one group does not affect selection in another group', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleDynamicIsolationHostComponent],
      }).createComponent(ButtonToggleDynamicIsolationHostComponent);

      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['a-one', 'b-two']);

      fixture.componentInstance.togglesA.update((items) => [...items, 'a-three']);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['a-one', 'b-two']);

      fixture.componentInstance.togglesA.update((items) =>
        items.filter((item) => item !== 'a-one'),
      );
      fixture.detectChanges();

      const selectedAfterRemoval = getSelectedValues(fixture);
      expect(selectedAfterRemoval.includes('b-two')).toBe(true);
      expect(selectedAfterRemoval.filter((value) => value.startsWith('a-'))).toHaveLength(1);
    });
  });

  describe('Q) Robustness & edge cases', () => {
    it('nested focusable content click does not toggle, but arrow key on host still navigates', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleNestedContentHostComponent],
      }).createComponent(ButtonToggleNestedContentHostComponent);

      fixture.detectChanges();

      const rich = getByTestId<HTMLButtonElement>(fixture, 'toggle-rich');
      const plain = getByTestId<HTMLButtonElement>(fixture, 'toggle-plain');
      const nested = getByTestId<HTMLElement>(fixture, 'nested-focusable');

      nested.focus();
      click(nested);
      fixture.detectChanges();
      expect(getSelectedValues(fixture)).toEqual(['rich']);
      expect(document.activeElement).toBe(nested);

      rich.focus();
      keydown(rich, 'ArrowRight');
      fixture.detectChanges();
      expect(document.activeElement).toBe(plain);
    });

    it('recreating toggles does not produce duplicate ids or duplicate aria-selected=true', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ButtonToggleHarnessHostComponent],
      }).createComponent(ButtonToggleHarnessHostComponent);

      fixture.componentInstance.setNoIds();
      fixture.detectChanges();

      const firstIds = getToggles(fixture).map((toggle) => toggle.id);
      expect(new Set(firstIds).size).toBe(firstIds.length);

      fixture.componentInstance.renderGroup.set(false);
      fixture.detectChanges();
      fixture.componentInstance.renderGroup.set(true);
      fixture.detectChanges();

      const secondToggles = getToggles(fixture);
      const secondIds = secondToggles.map((toggle) => toggle.id);
      expect(new Set(secondIds).size).toBe(secondIds.length);
      expect(secondToggles.filter((toggle) => toggle.getAttribute('aria-checked') === 'true')).toHaveLength(1);
    });
  });
});
