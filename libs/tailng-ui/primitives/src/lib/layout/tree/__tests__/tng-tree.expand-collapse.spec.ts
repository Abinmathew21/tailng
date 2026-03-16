import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { clickElement, createTreeHarnessFixture, dispatchKeydown, getItem } from './tng-tree.test-harness';

describe('tng-tree primitive expand/collapse behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('toggles expanded state when an expandable item is clicked', () => {
    const fixture = createTreeHarnessFixture();
    const rootA = getItem(fixture, 'root-a');

    expect(rootA.getAttribute('aria-expanded')).toBe('false');

    clickElement(rootA);
    fixture.detectChanges();
    expect(rootA.getAttribute('aria-expanded')).toBe('true');

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

  it('toggles expansion from Enter/Space on focused expandable item', () => {
    const fixture = createTreeHarnessFixture();
    const rootA = getItem(fixture, 'root-a');

    rootA.focus();
    fixture.detectChanges();

    const enterEvent = dispatchKeydown(rootA, 'Enter');
    fixture.detectChanges();
    expect(enterEvent.defaultPrevented).toBe(true);
    expect(rootA.getAttribute('aria-expanded')).toBe('true');

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
