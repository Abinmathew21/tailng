import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { createTreeHarnessFixture, dispatchKeydown, getItem, getTreeHost } from './tng-tree.test-harness';

describe('tng-tree primitive keyboard behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('moves focus with ArrowUp/ArrowDown and skips disabled visible items', () => {
    const fixture = createTreeHarnessFixture({ rootExpanded: true });

    const rootA = getItem(fixture, 'root-a');
    rootA.focus();
    fixture.detectChanges();

    dispatchKeydown(rootA, 'ArrowDown');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getItem(fixture, 'a-1'));

    dispatchKeydown(getItem(fixture, 'a-1'), 'ArrowDown');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getItem(fixture, 'a-3'));

    dispatchKeydown(getItem(fixture, 'a-3'), 'ArrowDown');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getItem(fixture, 'root-b'));

    dispatchKeydown(getItem(fixture, 'root-b'), 'ArrowUp');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getItem(fixture, 'a-3'));
  });

  it('supports Home/End focus movement across currently visible items', () => {
    const fixture = createTreeHarnessFixture({ rootExpanded: true });

    const rootA = getItem(fixture, 'root-a');
    rootA.focus();
    fixture.detectChanges();

    dispatchKeydown(rootA, 'End');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getItem(fixture, 'root-b'));

    dispatchKeydown(getItem(fixture, 'root-b'), 'Home');
    fixture.detectChanges();
    expect(document.activeElement).toBe(rootA);
  });

  it('keeps collapsed descendants out of ArrowUp/ArrowDown traversal', () => {
    const fixture = createTreeHarnessFixture();
    fixture.detectChanges();

    const rootA = getItem(fixture, 'root-a');
    rootA.focus();
    fixture.detectChanges();

    dispatchKeydown(rootA, 'ArrowDown');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getItem(fixture, 'root-b'));
  });

  it('maintains current tabindex contract for root and active item', () => {
    const fixture = createTreeHarnessFixture();
    const tree = getTreeHost(fixture);
    const rootA = getItem(fixture, 'root-a');
    const rootB = getItem(fixture, 'root-b');
    const disabled = getItem(fixture, 'a-2');

    expect(tree.getAttribute('tabindex')).toBe('0');
    expect(rootA.getAttribute('tabindex')).toBe('0');
    expect(rootB.getAttribute('tabindex')).toBe('-1');
    expect(disabled.getAttribute('tabindex')).toBe('-1');

    rootA.focus();
    fixture.detectChanges();
    expect(tree.getAttribute('tabindex')).toBe('-1');
    expect(rootA.getAttribute('tabindex')).toBe('0');

    dispatchKeydown(rootA, 'ArrowDown');
    fixture.detectChanges();
    expect(document.activeElement).toBe(rootB);
    expect(rootA.getAttribute('tabindex')).toBe('-1');
    expect(rootB.getAttribute('tabindex')).toBe('0');
  });

  it('moves focus from tree host to the first enabled root item on focus', () => {
    const fixture = createTreeHarnessFixture();
    const tree = getTreeHost(fixture);

    tree.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(getItem(fixture, 'root-a'));
  });
});
