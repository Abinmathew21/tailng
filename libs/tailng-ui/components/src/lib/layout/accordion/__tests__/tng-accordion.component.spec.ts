import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
} from '../tng-accordion.component';

function getByTestId<T extends Element>(fixture: { nativeElement: HTMLElement }, testId: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as T | null;
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

@Component({
  imports: [
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
  ],
  template: `
    <tng-accordion
      ariaLabel="Project sections"
      data-testid="accordion"
      [type]="type"
      [defaultValue]="defaultValue"
      (valueChange)="valueChanges.push($event)"
      (valuesChange)="valuesChanges.push($event)"
    >
      <tng-accordion-item value="overview" data-testid="item-overview">
        <tng-accordion-trigger data-testid="trigger-overview">Overview</tng-accordion-trigger>
        <tng-accordion-panel data-testid="panel-overview">Overview panel</tng-accordion-panel>
      </tng-accordion-item>
      <tng-accordion-item value="api" data-testid="item-api">
        <tng-accordion-trigger data-testid="trigger-api">API</tng-accordion-trigger>
        <tng-accordion-panel data-testid="panel-api">API panel</tng-accordion-panel>
      </tng-accordion-item>
    </tng-accordion>
  `,
})
class AccordionWrapperHostComponent {
  type: 'single' | 'multiple' = 'single';
  defaultValue: string | string[] | null = null;
  readonly valueChanges: Array<string | readonly string[] | null> = [];
  readonly valuesChanges: Array<readonly string[]> = [];
}

describe('tng-accordion component wrappers', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports accordion wrapper components', () => {
    expect(typeof TngAccordionComponent).toBe('function');
    expect(typeof TngAccordionItemComponent).toBe('function');
    expect(typeof TngAccordionTriggerComponent).toBe('function');
    expect(typeof TngAccordionPanelComponent).toBe('function');
  });

  it('attaches primitive accordion behavior to projected item/trigger/panel wrappers', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AccordionWrapperHostComponent],
    }).createComponent(AccordionWrapperHostComponent);
    fixture.detectChanges();

    const accordion = getByTestId<HTMLElement>(fixture, 'accordion');
    const item = getByTestId<HTMLElement>(fixture, 'item-overview');
    const trigger = getByTestId<HTMLElement>(fixture, 'trigger-overview');
    const panel = getByTestId<HTMLElement>(fixture, 'panel-overview');

    expect(accordion.getAttribute('data-slot')).toBe('accordion');
    expect(accordion.getAttribute('aria-label')).toBe('Project sections');
    expect(item.getAttribute('data-slot')).toBe('accordion-item');
    expect(trigger.getAttribute('data-slot')).toBe('accordion-trigger');
    expect(panel.getAttribute('data-slot')).toBe('accordion-panel');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
  });

  it('toggles panel visibility when trigger is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AccordionWrapperHostComponent],
    }).createComponent(AccordionWrapperHostComponent);
    fixture.detectChanges();

    const trigger = getByTestId<HTMLElement>(fixture, 'trigger-overview');
    const panel = getByTestId<HTMLElement>(fixture, 'panel-overview');

    expect(panel.hasAttribute('hidden')).toBe(true);
    click(trigger);
    fixture.detectChanges();
    expect(panel.hasAttribute('hidden')).toBe(false);
    click(trigger);
    fixture.detectChanges();
    expect(panel.hasAttribute('hidden')).toBe(true);
  });

  it('supports multiple mode and emits valuesChange from wrapper output forwarding', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AccordionWrapperHostComponent],
    }).createComponent(AccordionWrapperHostComponent);
    fixture.componentInstance.type = 'multiple';
    fixture.detectChanges();

    click(getByTestId<HTMLElement>(fixture, 'trigger-overview'));
    click(getByTestId<HTMLElement>(fixture, 'trigger-api'));
    fixture.detectChanges();

    expect(fixture.componentInstance.valuesChanges.at(-1)).toEqual(['overview', 'api']);
  });
});
