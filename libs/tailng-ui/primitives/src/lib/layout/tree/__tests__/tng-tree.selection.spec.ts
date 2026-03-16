import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { clickElement, createTreeHarnessFixture, dispatchKeydown, getItem } from './tng-tree.test-harness';

describe('tng-tree primitive selection behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('does not select or emit value changes in none mode', () => {
    const fixture = createTreeHarnessFixture();
    const rootA = getItem(fixture, 'root-a');

    clickElement(rootA);
    fixture.detectChanges();

    expect(rootA.getAttribute('aria-selected')).toBeNull();
    expect(fixture.componentInstance.valueChanges).toEqual([]);
  });

  it('supports single-selection toggling and emits selected value/null', () => {
    const fixture = createTreeHarnessFixture({ selectionMode: 'single' });

    const rootA = getItem(fixture, 'root-a');
    const rootB = getItem(fixture, 'root-b');

    clickElement(rootA);
    fixture.detectChanges();
    expect(rootA.getAttribute('aria-selected')).toBe('true');
    expect(fixture.componentInstance.valueChanges).toEqual(['root-a']);

    clickElement(rootA);
    fixture.detectChanges();
    expect(rootA.getAttribute('aria-selected')).toBe('false');
    expect(fixture.componentInstance.valueChanges).toEqual(['root-a', null]);

    clickElement(rootB);
    fixture.detectChanges();
    expect(rootA.getAttribute('aria-selected')).toBe('false');
    expect(rootB.getAttribute('aria-selected')).toBe('true');
    expect(fixture.componentInstance.valueChanges).toEqual(['root-a', null, 'root-b']);
  });

  it('supports multiple selection add/remove with deterministic emitted arrays', () => {
    const fixture = createTreeHarnessFixture({ selectionMode: 'multiple' });

    const rootA = getItem(fixture, 'root-a');
    const rootB = getItem(fixture, 'root-b');

    clickElement(rootA);
    fixture.detectChanges();
    expect(fixture.componentInstance.valueChanges).toEqual([['root-a']]);

    clickElement(rootB);
    fixture.detectChanges();
    expect(fixture.componentInstance.valueChanges).toEqual([['root-a'], ['root-a', 'root-b']]);

    clickElement(rootA);
    fixture.detectChanges();
    expect(fixture.componentInstance.valueChanges).toEqual([
      ['root-a'],
      ['root-a', 'root-b'],
      ['root-b'],
    ]);
    expect(rootA.getAttribute('aria-selected')).toBe('false');
    expect(rootB.getAttribute('aria-selected')).toBe('true');
  });

  it('ignores disabled item selection in multiple mode', () => {
    const fixture = createTreeHarnessFixture({ selectionMode: 'multiple', rootExpanded: true });

    const disabledNode = getItem(fixture, 'a-2');
    clickElement(disabledNode);
    fixture.detectChanges();

    expect(disabledNode.getAttribute('data-disabled')).toBe('true');
    expect(disabledNode.getAttribute('aria-selected')).toBe('false');
    expect(fixture.componentInstance.valueChanges).toEqual([]);
  });

  it('toggles selection from keyboard Enter/Space on the focused item', () => {
    const fixture = createTreeHarnessFixture({ selectionMode: 'single' });

    const rootB = getItem(fixture, 'root-b');
    rootB.focus();
    fixture.detectChanges();

    const enterEvent = dispatchKeydown(rootB, 'Enter');
    fixture.detectChanges();
    expect(enterEvent.defaultPrevented).toBe(true);
    expect(rootB.getAttribute('aria-selected')).toBe('true');
    expect(fixture.componentInstance.valueChanges).toEqual(['root-b']);

    const spaceEvent = dispatchKeydown(rootB, ' ');
    fixture.detectChanges();
    expect(spaceEvent.defaultPrevented).toBe(true);
    expect(rootB.getAttribute('aria-selected')).toBe('false');
    expect(fixture.componentInstance.valueChanges).toEqual(['root-b', null]);
  });
});
