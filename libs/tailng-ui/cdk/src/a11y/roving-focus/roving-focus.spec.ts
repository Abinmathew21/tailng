import { describe, expect, it } from 'vitest';
import { createRovingFocusController } from './roving-focus';

describe('createRovingFocusController', () => {
  it('moves forward through enabled ids', () => {
    const controller = createRovingFocusController({ itemIds: ['a', 'b', 'c'] });

    expect(controller.getActiveId()).toBe('a');
    expect(controller.moveNext()).toBe('b');
  });

  it('loops when enabled', () => {
    const controller = createRovingFocusController({
      itemIds: ['a', 'b'],
      loop: true,
    });

    controller.end();
    expect(controller.moveNext()).toBe('a');
  });
});
