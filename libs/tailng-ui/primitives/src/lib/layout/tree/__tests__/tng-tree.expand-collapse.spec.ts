import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { clickElement, createTreeHarnessFixture, dispatchKeydown, getItem } from './tng-tree.test-harness';

describe('tng-tree primitive expand/collapse behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('toggles expanded state when the indicator is clicked', () => {
    const fixture = createTreeHarnessFixture();
    const rootA = getItem(fixture, 'root-a');
    const indicator = rootA.querySelector('[data-slot="tree-indicator"]') as HTMLElement;

    expect(rootA.getAttribute('aria-expanded')).toBe('false');

    clickElement(indicator);
    fixture.detectChanges();
    expect(rootA.getAttribute('aria-expanded')).toBe('true');

    clickElement(indicator);
    fixture.detectChanges();
    expect(rootA.getAttribute('aria-expanded')).toBe('false');
  });

  it('clicking the item label does not toggle expansion', () => {
    const fixture = createTreeHarnessFixture();
    const rootA = getItem(fixture, 'root-a');

    expect(rootA.getAttribute('aria-expanded')).toBe('false');

    clickElement(rootA);
    fixture.detectChanges();
    expect(rootA.getAttribute('aria-expanded')).toBe('false');
  });

  it('handles ArrowRight/ArrowLeft parent-child traversal and collapse', () => {
    const fixture = createTreeHarnessFixture();
    const rootA = getItem(fixture, 'root-a');

    rootA.focus();
    fixture.detectChanges();

    dispatchKeydown(rootA, 'ArrowRight');
    fixture.detectChanges();
    expect(rootA.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(rootA);

    dispatchKeydown(rootA, 'ArrowRight');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getItem(fixture, 'a-1'));

    dispatchKeydown(getItem(fixture, 'a-1'), 'ArrowLeft');
    fixture.detectChanges();
    expect(document.activeElement).toBe(rootA);

    dispatchKeydown(rootA, 'ArrowLeft');
    fixture.detectChanges();
    expect(rootA.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(rootA);
  });

  it('Enter/Space selects without toggling expansion', () => {
    const fixture = createTreeHarnessFixture({ selectionMode: 'single' });
    const rootA = getItem(fixture, 'root-a');

    rootA.focus();
    fixture.detectChanges();

    expect(rootA.getAttribute('aria-expanded')).toBe('false');

    const enterEvent = dispatchKeydown(rootA, 'Enter');
    fixture.detectChanges();
    expect(enterEvent.defaultPrevented).toBe(true);
    expect(rootA.getAttribute('aria-expanded')).toBe('false');
    expect(rootA.getAttribute('data-selected')).toBe('true');

    const spaceEvent = dispatchKeydown(rootA, ' ');
    fixture.detectChanges();
    expect(spaceEvent.defaultPrevented).toBe(true);
    expect(rootA.getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps leaf nodes non-expandable and without aria-expanded', () => {
    const fixture = createTreeHarnessFixture();
    const rootB = getItem(fixture, 'root-b');

    expect(rootB.getAttribute('aria-expanded')).toBeNull();

    clickElement(rootB);
    fixture.detectChanges();

    expect(rootB.getAttribute('aria-expanded')).toBeNull();
  });
});
