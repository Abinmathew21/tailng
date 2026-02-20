import { describe, expect, it } from 'vitest';
import { createDisclosureController } from './disclosure';

describe('createDisclosureController', () => {
  it('toggles open and close', () => {
    const disclosure = createDisclosureController();

    expect(disclosure.isOpen()).toBe(false);
    expect(disclosure.toggle()).toBe(true);
    expect(disclosure.toggle()).toBe(false);
  });

  it('honors defaultOpen and disabled behavior', () => {
    const disclosure = createDisclosureController({ defaultOpen: true });

    expect(disclosure.isOpen()).toBe(true);
    disclosure.setDisabled(true);
    expect(disclosure.isOpen()).toBe(false);
    expect(disclosure.open()).toBe(false);
  });

  it('returns immutable state snapshots', () => {
    const disclosure = createDisclosureController();
    const state = disclosure.getState();

    expect(state.open).toBe(false);
    expect(() => ((state as { open: boolean }).open = true)).toThrow();
  });
});
