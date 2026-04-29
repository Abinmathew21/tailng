import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  TngStepperItem,
  TngStepperLabel,
  TngStepperTrigger,
} from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';
import { TngStepperComponent } from '../tng-stepper.component';

@Component({
  imports: [TngStepperComponent],
  template: `
    <tng-stepper [ariaLabel]="ariaLabel()" data-testid="wrapper">
      <ol data-testid="projected-list">
        <li>Draft</li>
        <li>Review</li>
      </ol>
    </tng-stepper>
  `,
})
class StepperWrapperHostComponent {
  public readonly ariaLabel = signal('Release flow');
}

@Component({
  imports: [TngStepperComponent],
  template: `
    <h2 id="release-heading">Release flow</h2>
    <tng-stepper [ariaLabelledby]="labelledby()" data-testid="wrapper-labelled">
      <ol>
        <li>Draft</li>
      </ol>
    </tng-stepper>
  `,
})
class StepperWrapperLabelledbyHostComponent {
  public readonly labelledby = signal('release-heading');
}

@Component({
  imports: [TngStepperComponent],
  template: `
    <tng-stepper data-testid="wrapper-default">
      <ol>
        <li>One</li>
      </ol>
    </tng-stepper>
  `,
})
class StepperWrapperDefaultHostComponent {}

@Component({
  imports: [TngStepperComponent, TngStepperItem, TngStepperLabel, TngStepperTrigger],
  template: `
    <tng-stepper
      data-testid="wrapper-headless"
      defaultValue="review"
      linear
      (valueChange)="valueChanges.push($event)"
    >
      <ol>
        <li tngStepperItem value="draft" label="Draft" completed>
          <button tngStepperTrigger data-testid="trigger-draft">
            <span tngStepperLabel>Draft</span>
          </button>
        </li>
        <li tngStepperItem value="review" label="Review">
          <button tngStepperTrigger data-testid="trigger-review">
            <span tngStepperLabel>Review</span>
          </button>
        </li>
        <li tngStepperItem value="publish" label="Publish">
          <button tngStepperTrigger data-testid="trigger-publish">
            <span tngStepperLabel>Publish</span>
          </button>
        </li>
      </ol>
    </tng-stepper>
  `,
})
class StepperWrapperHeadlessHostComponent {
  public readonly valueChanges: unknown[] = [];
}

function click(el: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

describe('tng-stepper component', () => {
  it('exports the stepper component', () => {
    expect(typeof TngStepperComponent).toBe('function');
  });

  it('applies wrapper class and primitive root hooks on the host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperWrapperHostComponent],
    }).createComponent(StepperWrapperHostComponent);
    fixture.detectChanges();

    const stepper = fixture.nativeElement.querySelector('[data-testid="wrapper"]') as HTMLElement | null;

    expect(stepper).toBeTruthy();
    expect(stepper?.classList.contains('tng-stepper')).toBe(true);
    expect(stepper?.getAttribute('data-slot')).toBe('stepper');
    expect(stepper?.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('uses "Stepper" as the default aria-label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperWrapperDefaultHostComponent],
    }).createComponent(StepperWrapperDefaultHostComponent);
    fixture.detectChanges();

    const stepper = fixture.nativeElement.querySelector('[data-testid="wrapper-default"]') as HTMLElement | null;

    expect(stepper).toBeTruthy();
    expect(stepper?.getAttribute('aria-label')).toBe('Stepper');
  });

  it('forwards ariaLabel input and updates when input signal changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperWrapperHostComponent],
    }).createComponent(StepperWrapperHostComponent);
    fixture.detectChanges();

    const stepper = fixture.nativeElement.querySelector('[data-testid="wrapper"]') as HTMLElement | null;
    expect(stepper).toBeTruthy();
    expect(stepper?.getAttribute('aria-label')).toBe('Release flow');

    fixture.componentInstance.ariaLabel.set('Checkout steps');
    fixture.detectChanges();

    expect(stepper?.getAttribute('aria-label')).toBe('Checkout steps');
  });

  it('forwards ariaLabelledby and suppresses default aria-label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperWrapperLabelledbyHostComponent],
    }).createComponent(StepperWrapperLabelledbyHostComponent);
    fixture.detectChanges();

    const stepper = fixture.nativeElement.querySelector('[data-testid="wrapper-labelled"]') as HTMLElement | null;
    expect(stepper).toBeTruthy();
    expect(stepper?.getAttribute('aria-labelledby')).toBe('release-heading');
    expect(stepper?.hasAttribute('aria-label')).toBe(false);
  });

  it('projects inner step markup into the wrapper', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperWrapperHostComponent],
    }).createComponent(StepperWrapperHostComponent);
    fixture.detectChanges();

    const projectedList = fixture.nativeElement.querySelector(
      '[data-testid="wrapper"] [data-testid="projected-list"]',
    ) as HTMLOListElement | null;

    expect(projectedList).toBeTruthy();
    expect(projectedList?.querySelectorAll('li').length).toBe(2);
    expect(projectedList?.textContent).toContain('Draft');
    expect(projectedList?.textContent).toContain('Review');
  });

  it('uses the headless stepper primitive for projected step items', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperWrapperHeadlessHostComponent],
    }).createComponent(StepperWrapperHeadlessHostComponent);
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('[data-testid="wrapper-headless"]') as HTMLElement | null;
    const draft = fixture.nativeElement.querySelector('[data-testid="trigger-draft"]') as HTMLButtonElement | null;
    const review = fixture.nativeElement.querySelector('[data-testid="trigger-review"]') as HTMLButtonElement | null;
    const publish = fixture.nativeElement.querySelector('[data-testid="trigger-publish"]') as HTMLButtonElement | null;

    expect(wrapper?.getAttribute('data-linear')).toBe('');
    expect(draft?.getAttribute('data-state')).toBe('completed');
    expect(review?.getAttribute('aria-current')).toBe('step');
    expect(review?.getAttribute('tabindex')).toBe('0');
    expect(publish?.getAttribute('aria-disabled')).toBe('true');

    click(publish!);
    fixture.detectChanges();
    expect(fixture.componentInstance.valueChanges).toEqual([]);

    click(draft!);
    fixture.detectChanges();
    expect(fixture.componentInstance.valueChanges).toEqual(['draft']);
  });
});
