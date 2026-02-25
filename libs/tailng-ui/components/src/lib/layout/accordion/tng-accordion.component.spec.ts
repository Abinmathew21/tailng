import { describe, expect, it } from 'vitest';
import {
  getEnabledAccordionTriggers,
  resolveAccordionTriggerTargetIndex,
  TngAccordionComponent,
} from './tng-accordion.component';

describe('tng-accordion component', () => {
  it('exports the accordion component', () => {
    expect(typeof TngAccordionComponent).toBe('function');
  });

  it('resolves roving target indices for arrow/home/end keys', () => {
    expect(resolveAccordionTriggerTargetIndex(0, 3, 'ArrowDown')).toBe(1);
    expect(resolveAccordionTriggerTargetIndex(2, 3, 'ArrowDown')).toBe(0);
    expect(resolveAccordionTriggerTargetIndex(2, 3, 'ArrowUp')).toBe(1);
    expect(resolveAccordionTriggerTargetIndex(0, 3, 'ArrowUp')).toBe(2);
    expect(resolveAccordionTriggerTargetIndex(2, 3, 'Home')).toBe(0);
    expect(resolveAccordionTriggerTargetIndex(0, 3, 'End')).toBe(2);
    expect(resolveAccordionTriggerTargetIndex(1, 3, 'Tab')).toBeNull();
  });

  it('collects enabled accordion triggers in DOM order', () => {
    const host = document.createElement('div');

    const first = document.createElement('button');
    first.setAttribute('data-tng-accordion-trigger', '');

    const second = document.createElement('button');
    second.setAttribute('data-tng-accordion-trigger', '');
    second.disabled = true;

    const third = document.createElement('button');
    third.setAttribute('data-tng-accordion-trigger', '');

    host.append(first, second, third);

    const triggers = getEnabledAccordionTriggers(host);
    expect(triggers).toEqual([first, third]);
  });
});
