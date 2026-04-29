import { Component, ViewChild, signal } from '@angular/core';
import { expect } from 'vitest';

import {
  TngStepper,
  TngStepperConnector,
  TngStepperDescription,
  TngStepperItem,
  TngStepperLabel,
  TngStepperPanel,
  TngStepperTrigger,
} from '../tng-stepper';

export type StepConfig = Readonly<{
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

export function getByTestId<T extends HTMLElement>(fixture: TestFixtureLike, id: string): T {
  const element = fixture.nativeElement.querySelector<T>(`[data-testid="${id}"]`);
  expect(element).not.toBeNull();
  return element!;
}

export function getTriggers(fixture: TestFixtureLike): readonly HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll<HTMLElement>('[data-slot="stepper-trigger"]'));
}

export function getCurrentTrigger(fixture: TestFixtureLike): HTMLElement | null {
  return fixture.nativeElement.querySelector<HTMLElement>('[data-slot="stepper-trigger"][aria-current="step"]');
}

export function keydown(el: HTMLElement, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  el.dispatchEvent(event);
  return event;
}

export function click(el: HTMLElement): MouseEvent {
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
export class StepperHostComponent {
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
