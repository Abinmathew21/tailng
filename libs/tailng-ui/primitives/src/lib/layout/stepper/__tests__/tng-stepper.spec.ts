import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import * as primitives from '../../../../index';
import {
  TngStepper,
  TngStepperConnector,
  TngStepperDescription,
  TngStepperItem,
  TngStepperLabel,
  TngStepperPanel,
  TngStepperTrigger,
} from '../tng-stepper';

type StepConfig = Readonly<{
  readonly value: string;
  readonly label: string;
  readonly completed?: boolean;
  readonly optional?: boolean;
  readonly disabled?: boolean;
  readonly error?: boolean;
  readonly trackBy?: string;
}>;

type TestFixtureLike = Readonly<{
  nativeElement: HTMLElement;
}>;

function getByTestId<T extends HTMLElement>(fixture: TestFixtureLike, id: string): T {
  const element = fixture.nativeElement.querySelector<T>(`[data-testid="${id}"]`);
  expect(element).not.toBeNull();
  return element!;
}

function getTriggers(fixture: TestFixtureLike): readonly HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll<HTMLElement>('[data-slot="stepper-trigger"]'));
}

function getCurrentTrigger(fixture: TestFixtureLike): HTMLElement | null {
  return fixture.nativeElement.querySelector<HTMLElement>('[data-slot="stepper-trigger"][aria-current="step"]');
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
  imports: [
    TngStepper,
    TngStepperConnector,
    TngStepperDescription,
    TngStepperItem,
    TngStepperLabel,
    TngStepperPanel,
    TngStepperTrigger,
  ],
  template: `
    <section
      tngStepper
      #stepperRef="tngStepper"
      data-testid="stepper"
      [ariaLabel]="ariaLabel()"
      [ariaLabelledby]="ariaLabelledby()"
      [value]="value()"
      [defaultValue]="defaultValue()"
      [orientation]="orientation()"
      [linear]="linear()"
      [loopFocus]="loopFocus()"
      (valueChange)="valueChanges.push($event)"
      (stepChange)="stepChanges.push($event)"
    >
      <ol>
        @for (step of steps(); track step.trackBy ?? step.value) {
          <li
            tngStepperItem
            [attr.data-testid]="'item-' + step.value"
            [value]="step.value"
            [label]="step.label"
            [description]="step.label + ' details'"
            [completed]="step.completed ?? false"
            [optional]="step.optional ?? false"
            [disabled]="step.disabled ?? false"
            [error]="step.error ?? false"
          >
            <button tngStepperTrigger [attr.data-testid]="'trigger-' + step.value">
              <span tngStepperLabel>{{ step.label }}</span>
              <small tngStepperDescription>{{ step.label }} details</small>
            </button>
            <span tngStepperConnector [attr.data-testid]="'connector-' + step.value"></span>
            <section tngStepperPanel [attr.data-testid]="'panel-' + step.value">
              {{ step.label }} panel
            </section>
          </li>
        }
      </ol>
    </section>
  `,
})
class StepperHostComponent {
  public readonly steps = signal<readonly StepConfig[]>([
    { value: 'cart', label: 'Cart', completed: true },
    { value: 'shipping', label: 'Shipping' },
    { value: 'payment', label: 'Payment', optional: true },
    { value: 'review', label: 'Review', disabled: true },
  ]);
  public readonly value = signal<string | null | undefined>(undefined);
  public readonly defaultValue = signal<string | null | undefined>(undefined);
  public readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  public readonly linear = signal(false);
  public readonly loopFocus = signal(true);
  public readonly ariaLabel = signal<string | null | undefined>('Checkout progress');
  public readonly ariaLabelledby = signal<string | null | undefined>(undefined);
  public readonly valueChanges: unknown[] = [];
  public readonly stepChanges: unknown[] = [];

  @ViewChild('stepperRef', { static: true }) public stepperRef!: TngStepper;
}

describe('TngStepper', () => {
  it('exports the public stepper primitives', () => {
    expect(primitives.TngStepper).toBe(TngStepper);
    expect(primitives.TngStepperItem).toBe(TngStepperItem);
    expect(primitives.TngStepperTrigger).toBe(TngStepperTrigger);
    expect(primitives.TngStepperPanel).toBe(TngStepperPanel);
  });

  describe('A) Rendering and structure', () => {
    it('renders root and ordered triggers with orientation and state hooks', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('shipping');
      fixture.detectChanges();

      const stepper = getByTestId<HTMLElement>(fixture, 'stepper');
      const triggerTestIds = getTriggers(fixture).map((trigger) => trigger.getAttribute('data-testid'));

      expect(triggerTestIds).toEqual(['trigger-cart', 'trigger-shipping', 'trigger-payment', 'trigger-review']);
      expect(stepper.getAttribute('data-slot')).toBe('stepper');
      expect(stepper.getAttribute('data-orientation')).toBe('horizontal');
      expect(stepper.hasAttribute('data-linear')).toBe(false);
      expect(getByTestId(fixture, 'trigger-shipping').getAttribute('aria-current')).toBe('step');
      expect(fixture.nativeElement.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
      expect(getByTestId(fixture, 'trigger-cart').getAttribute('data-state')).toBe('completed');
      expect(getByTestId(fixture, 'trigger-shipping').getAttribute('data-state')).toBe('current');
      expect(getByTestId(fixture, 'trigger-payment').getAttribute('data-state')).toBe('upcoming');
      expect(getByTestId(fixture, 'trigger-review').getAttribute('data-state')).toBe('disabled');
      expect(getByTestId(fixture, 'trigger-payment').hasAttribute('data-optional')).toBe(true);
      expect(getByTestId(fixture, 'item-payment').getAttribute('data-step-index')).toBe('2');
    });
  });

  describe('B) Accessibility', () => {
    it('exposes accessible names, current marker, disabled state, position, and state text', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.ariaLabel.set(undefined);
      fixture.componentInstance.ariaLabelledby.set('checkout-heading');
      fixture.componentInstance.defaultValue.set('shipping');
      fixture.componentInstance.steps.set([
        { value: 'cart', label: 'Cart', completed: true },
        { value: 'shipping', label: 'Shipping' },
        { value: 'payment', label: 'Payment', optional: true },
        { value: 'billing', label: 'Billing', error: true },
        { value: 'review', label: 'Review', disabled: true },
      ]);
      fixture.detectChanges();

      const root = getByTestId(fixture, 'stepper');
      const cart = getByTestId(fixture, 'trigger-cart');
      const shipping = getByTestId(fixture, 'trigger-shipping');
      const payment = getByTestId(fixture, 'trigger-payment');
      const billing = getByTestId(fixture, 'trigger-billing');
      const review = getByTestId(fixture, 'trigger-review');

      expect(root.getAttribute('aria-labelledby')).toBe('checkout-heading');
      expect(root.hasAttribute('aria-label')).toBe(false);
      expect(shipping.getAttribute('aria-current')).toBe('step');
      expect(cart.hasAttribute('aria-current')).toBe(false);
      expect(review.getAttribute('aria-disabled')).toBe('true');
      expect(payment.getAttribute('aria-label')).toContain('Step 3 of 5');
      expect(payment.getAttribute('aria-label')).toContain('Optional');
      expect(billing.getAttribute('aria-label')).toContain('Error');
      expect(cart.getAttribute('aria-label')).toContain('Completed');
    });
  });

  describe('C) Focus and roving tabindex', () => {
    it('keeps one trigger tabbable and lets Tab leave the trigger row naturally', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('shipping');
      fixture.detectChanges();

      expect(getTriggers(fixture).map((trigger) => trigger.getAttribute('tabindex'))).toEqual([
        '-1',
        '0',
        '-1',
        '-1',
      ]);

      const tabEvent = keydown(getByTestId(fixture, 'trigger-shipping'), 'Tab');
      const shiftTabEvent = keydown(getByTestId(fixture, 'trigger-shipping'), 'Tab', { shiftKey: true });
      expect(tabEvent.defaultPrevented).toBe(false);
      expect(shiftTabEvent.defaultPrevented).toBe(false);
    });

    it('moves focus with arrows, Home, End, RTL, and skips disabled triggers', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('cart');
      fixture.detectChanges();

      const cart = getByTestId<HTMLButtonElement>(fixture, 'trigger-cart');
      const payment = getByTestId<HTMLButtonElement>(fixture, 'trigger-payment');
      cart.focus();
      keydown(cart, 'ArrowRight');
      fixture.detectChanges();

      expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));
      expect(getByTestId(fixture, 'trigger-shipping').getAttribute('tabindex')).toBe('0');

      keydown(getByTestId(fixture, 'trigger-shipping'), 'End');
      fixture.detectChanges();
      expect(document.activeElement).toBe(payment);

      fixture.componentInstance.orientation.set('vertical');
      fixture.detectChanges();
      keydown(payment, 'ArrowUp');
      fixture.detectChanges();
      expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));

      getByTestId(fixture, 'stepper').setAttribute('dir', 'rtl');
      fixture.componentInstance.orientation.set('horizontal');
      fixture.detectChanges();
      keydown(getByTestId(fixture, 'trigger-shipping'), 'ArrowRight');
      fixture.detectChanges();
      expect(document.activeElement).toBe(cart);
    });
  });

  describe('D) Activation behavior', () => {
    it('activates allowed steps with click, Enter, and Space', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('cart');
      fixture.detectChanges();

      click(getByTestId(fixture, 'trigger-shipping'));
      keydown(getByTestId(fixture, 'trigger-payment'), 'Enter');
      keydown(getByTestId(fixture, 'trigger-cart'), ' ');
      fixture.detectChanges();

      expect(fixture.componentInstance.valueChanges).toEqual(['shipping', 'payment', 'cart']);
      expect(fixture.componentInstance.stepChanges.map((event) => (event as { trigger: string }).trigger)).toEqual([
        'pointer',
        'keyboard',
        'keyboard',
      ]);
    });

    it('does not activate disabled steps with click or keyboard', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('cart');
      fixture.detectChanges();

      click(getByTestId(fixture, 'trigger-review'));
      keydown(getByTestId(fixture, 'trigger-review'), 'Enter');
      keydown(getByTestId(fixture, 'trigger-review'), ' ');
      fixture.detectChanges();

      expect(fixture.componentInstance.valueChanges).toEqual([]);
      expect(getByTestId(fixture, 'trigger-cart').getAttribute('aria-current')).toBe('step');
    });
  });

  describe('E) Linear mode behavior', () => {
    it('blocks future incomplete steps and does not emit for blocked activation', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('shipping');
      fixture.componentInstance.linear.set(true);
      fixture.detectChanges();

      click(getByTestId(fixture, 'trigger-payment'));
      keydown(getByTestId(fixture, 'trigger-payment'), 'Enter');
      fixture.detectChanges();

      expect(fixture.componentInstance.valueChanges).toEqual([]);
      expect(getByTestId(fixture, 'trigger-shipping').getAttribute('aria-current')).toBe('step');
    });

    it('allows previous completed steps in linear mode and any enabled step in non-linear mode', () => {
      const linearFixture = TestBed.createComponent(StepperHostComponent);
      linearFixture.componentInstance.defaultValue.set('shipping');
      linearFixture.componentInstance.linear.set(true);
      linearFixture.detectChanges();

      click(getByTestId(linearFixture, 'trigger-cart'));
      linearFixture.detectChanges();
      expect(linearFixture.componentInstance.valueChanges).toEqual(['cart']);

      const nonLinearFixture = TestBed.createComponent(StepperHostComponent);
      nonLinearFixture.componentInstance.defaultValue.set('cart');
      nonLinearFixture.detectChanges();

      click(getByTestId(nonLinearFixture, 'trigger-payment'));
      nonLinearFixture.detectChanges();
      expect(nonLinearFixture.componentInstance.valueChanges).toEqual(['payment']);
    });
  });

  describe('F) Controlled behavior', () => {
    it('drives current step from value and emits without visually changing until host updates', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.value.set('cart');
      fixture.detectChanges();

      click(getByTestId(fixture, 'trigger-payment'));
      fixture.detectChanges();

      expect(fixture.componentInstance.valueChanges).toEqual(['payment']);
      expect(getByTestId(fixture, 'trigger-cart').getAttribute('aria-current')).toBe('step');

      fixture.componentInstance.value.set('payment');
      fixture.detectChanges();
      expect(getByTestId(fixture, 'trigger-payment').getAttribute('aria-current')).toBe('step');
    });
  });

  describe('G) Uncontrolled behavior', () => {
    it('uses defaultValue, selects first enabled by default, and updates internally on activation', () => {
      const defaultFixture = TestBed.createComponent(StepperHostComponent);
      defaultFixture.componentInstance.defaultValue.set('payment');
      defaultFixture.detectChanges();
      expect(getByTestId(defaultFixture, 'trigger-payment').getAttribute('aria-current')).toBe('step');

      const firstEnabledFixture = TestBed.createComponent(StepperHostComponent);
      firstEnabledFixture.componentInstance.steps.set([
        { value: 'blocked', label: 'Blocked', disabled: true },
        { value: 'first', label: 'First enabled' },
        { value: 'second', label: 'Second enabled' },
      ]);
      firstEnabledFixture.detectChanges();
      expect(getByTestId(firstEnabledFixture, 'trigger-first').getAttribute('aria-current')).toBe('step');

      click(getByTestId(firstEnabledFixture, 'trigger-second'));
      firstEnabledFixture.detectChanges();
      expect(getByTestId(firstEnabledFixture, 'trigger-second').getAttribute('aria-current')).toBe('step');
    });
  });

  describe('H) Dynamic children', () => {
    it('falls back to nearest enabled step when current step is removed or disabled', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('payment');
      fixture.detectChanges();

      fixture.componentInstance.steps.update((steps) => steps.filter((step) => step.value !== 'payment'));
      fixture.detectChanges();
      expect(getByTestId(fixture, 'trigger-shipping').getAttribute('aria-current')).toBe('step');

      fixture.componentInstance.steps.update((steps) =>
        steps.map((step) => (step.value === 'shipping' ? { ...step, disabled: true } : step)),
      );
      fixture.detectChanges();
      expect(getByTestId(fixture, 'trigger-cart').getAttribute('aria-current')).toBe('step');
    });

    it('preserves selection by value on reorder and warns for duplicate values', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('payment');
      fixture.detectChanges();

      fixture.componentInstance.steps.set([
        { value: 'payment', label: 'Payment', optional: true },
        { value: 'cart', label: 'Cart', completed: true },
        { value: 'shipping', label: 'Shipping' },
        { value: 'review', label: 'Review', disabled: true },
      ]);
      fixture.detectChanges();

      expect(getByTestId(fixture, 'trigger-payment').getAttribute('aria-current')).toBe('step');
      expect(getByTestId(fixture, 'trigger-payment').getAttribute('data-step-index')).toBe('0');

      fixture.componentInstance.value.set('payment');
      fixture.componentInstance.steps.set([
        { value: 'cart', label: 'Cart', trackBy: 'cart' },
        { value: 'payment', label: 'Payment', completed: true, error: true, trackBy: 'payment-a' },
        { value: 'payment', label: 'Duplicate payment', trackBy: 'payment-b' },
      ]);
      fixture.detectChanges();

      expect(getByTestId(fixture, 'trigger-payment').getAttribute('data-state')).toBe('error');
      expect(warn).toHaveBeenCalledWith('TngStepper: duplicate step value "payment" registered.');
      warn.mockRestore();
    });
  });

  describe('I) Orientation and RTL', () => {
    it('uses horizontal LTR/RTL and vertical Up/Down semantics', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('cart');
      fixture.componentInstance.loopFocus.set(false);
      fixture.detectChanges();

      const cart = getByTestId<HTMLButtonElement>(fixture, 'trigger-cart');
      cart.focus();
      keydown(cart, 'ArrowLeft');
      expect(document.activeElement).toBe(cart);

      keydown(cart, 'ArrowRight');
      expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));

      fixture.componentInstance.orientation.set('vertical');
      fixture.detectChanges();
      keydown(getByTestId(fixture, 'trigger-shipping'), 'ArrowLeft');
      expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));
      keydown(getByTestId(fixture, 'trigger-shipping'), 'ArrowDown');
      expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-payment'));

      getByTestId(fixture, 'stepper').setAttribute('dir', 'rtl');
      fixture.componentInstance.orientation.set('horizontal');
      fixture.detectChanges();
      keydown(getByTestId(fixture, 'trigger-payment'), 'ArrowRight');
      expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));
    });
  });

  describe('J) Data attributes', () => {
    it('updates orientation, linear, state, optional, and index attributes reactively', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('cart');
      fixture.detectChanges();

      fixture.componentInstance.orientation.set('vertical');
      fixture.componentInstance.linear.set(true);
      fixture.componentInstance.steps.set([
        { value: 'shipping', label: 'Shipping' },
        { value: 'cart', label: 'Cart', completed: true },
        { value: 'payment', label: 'Payment', optional: true },
      ]);
      fixture.detectChanges();

      expect(getByTestId(fixture, 'stepper').getAttribute('data-orientation')).toBe('vertical');
      expect(getByTestId(fixture, 'stepper').hasAttribute('data-linear')).toBe(true);
      expect(getByTestId(fixture, 'trigger-cart').getAttribute('data-state')).toBe('current');
      expect(getByTestId(fixture, 'trigger-payment').hasAttribute('data-optional')).toBe(true);
      expect(getByTestId(fixture, 'trigger-cart').getAttribute('data-step-index')).toBe('1');
    });
  });

  describe('K) Panel integration', () => {
    it('tracks active panel visibility and links panels with triggers', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('cart');
      fixture.detectChanges();

      const cartTrigger = getByTestId(fixture, 'trigger-cart');
      const cartPanel = getByTestId(fixture, 'panel-cart');
      const paymentPanel = getByTestId(fixture, 'panel-payment');

      expect(cartPanel.hasAttribute('hidden')).toBe(false);
      expect(paymentPanel.hasAttribute('hidden')).toBe(true);
      expect(cartPanel.getAttribute('aria-labelledby')).toBe(cartTrigger.id);
      expect(cartTrigger.getAttribute('aria-controls')).toBe(cartPanel.id);

      click(getByTestId(fixture, 'trigger-payment'));
      fixture.detectChanges();

      expect(cartPanel.hasAttribute('hidden')).toBe(true);
      expect(paymentPanel.hasAttribute('hidden')).toBe(false);
      expect(paymentPanel.getAttribute('aria-labelledby')).toBe(getByTestId(fixture, 'trigger-payment').id);
    });
  });

  describe('L) Edge cases', () => {
    it('handles zero and single step scenarios without throwing', () => {
      const zeroFixture = TestBed.createComponent(StepperHostComponent);
      zeroFixture.componentInstance.steps.set([]);
      expect(() => zeroFixture.detectChanges()).not.toThrow();
      expect(getCurrentTrigger(zeroFixture)).toBeNull();

      const singleFixture = TestBed.createComponent(StepperHostComponent);
      singleFixture.componentInstance.steps.set([{ value: 'only', label: 'Only' }]);
      singleFixture.detectChanges();

      const only = getByTestId<HTMLButtonElement>(singleFixture, 'trigger-only');
      expect(only.getAttribute('aria-current')).toBe('step');
      expect(only.getAttribute('tabindex')).toBe('0');
      only.focus();
      keydown(only, 'ArrowRight');
      expect(document.activeElement).toBe(only);
    });

    it('falls back for invalid controlled values and tolerates rapid updates', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.value.set('missing');
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(getByTestId(fixture, 'trigger-cart').getAttribute('aria-current')).toBe('step');

      expect(() => {
        fixture.componentInstance.value.set('payment');
        fixture.componentInstance.orientation.set('vertical');
        fixture.componentInstance.linear.set(true);
        fixture.componentInstance.steps.update((steps) =>
          steps.map((step) => (step.value === 'payment' ? { ...step, error: true } : step)),
        );
        fixture.detectChanges();
        fixture.componentInstance.value.set('shipping');
        fixture.componentInstance.orientation.set('horizontal');
        fixture.componentInstance.linear.set(false);
        fixture.detectChanges();
      }).not.toThrow();

      expect(getByTestId(fixture, 'trigger-shipping').getAttribute('aria-current')).toBe('step');
    });

    it('exposes programmatic select and focus helpers through exportAs', () => {
      const fixture = TestBed.createComponent(StepperHostComponent);
      fixture.componentInstance.defaultValue.set('cart');
      fixture.detectChanges();

      fixture.componentInstance.stepperRef.select('payment');
      fixture.detectChanges();
      expect(getByTestId(fixture, 'trigger-payment').getAttribute('aria-current')).toBe('step');

      fixture.componentInstance.stepperRef.focus('shipping');
      fixture.detectChanges();
      expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));
    });
  });
});
