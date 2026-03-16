import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTreeHarnessFixture, dispatchKeydown, getItem } from './tng-tree.test-harness';

describe('tng-tree primitive typeahead behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('moves focus to the next matching visible node on printable key input', () => {
    const fixture = createTreeHarnessFixture({ rootExpanded: true });
    const rootA = getItem(fixture, 'root-a');

    rootA.focus();
    fixture.detectChanges();

    const event = dispatchKeydown(rootA, 'b');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(getItem(fixture, 'root-b'));
  });

  it('skips disabled candidates when resolving typeahead matches', () => {
    const fixture = createTreeHarnessFixture({ rootExpanded: true });
    const rootA = getItem(fixture, 'root-a');

    rootA.focus();
    fixture.detectChanges();

    dispatchKeydown(rootA, 'b');
    fixture.detectChanges();

    const disabled = getItem(fixture, 'a-2');
    expect(disabled.getAttribute('data-disabled')).toBe('true');
    expect(document.activeElement).toBe(getItem(fixture, 'root-b'));
  });

  it('resets buffered characters after timeout and matches by fresh key', () => {
    const fixture = createTreeHarnessFixture({ rootExpanded: true });
    const rootA = getItem(fixture, 'root-a');

    const nowSpy = vi.spyOn(Date, 'now');
    nowSpy.mockReturnValueOnce(100);
    nowSpy.mockReturnValueOnce(120);
    nowSpy.mockReturnValueOnce(900);

    rootA.focus();
    fixture.detectChanges();

    const first = dispatchKeydown(rootA, 'a');
    fixture.detectChanges();
    expect(first.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(getItem(fixture, 'a-1'));

    const second = dispatchKeydown(getItem(fixture, 'a-1'), 'b');
    fixture.detectChanges();
    expect(second.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(getItem(fixture, 'a-1'));

    const third = dispatchKeydown(getItem(fixture, 'a-1'), 'b');
    fixture.detectChanges();
    expect(third.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(getItem(fixture, 'root-b'));
  });
});
