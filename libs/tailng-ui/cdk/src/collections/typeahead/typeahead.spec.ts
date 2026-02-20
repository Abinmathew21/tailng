import { describe, expect, it } from 'vitest';
import { createTypeaheadController } from './typeahead';

describe('createTypeaheadController', () => {
  it('matches item by typed prefix', () => {
    const controller = createTypeaheadController({
      items: [
        { id: 'alpha', text: 'Alpha' },
        { id: 'beta', text: 'Beta' },
      ],
    });

    expect(controller.handleKey('a').activeId).toBe('alpha');
  });

  it('resets buffer after timeout', () => {
    const controller = createTypeaheadController({
      bufferResetMs: 10,
      items: [
        { id: 'alpha', text: 'Alpha' },
        { id: 'beta', text: 'Beta' },
      ],
    });

    controller.handleKey('a', 1);
    const state = controller.handleKey('b', 100);

    expect(state.buffer).toBe('b');
    expect(state.activeId).toBe('beta');
  });
});
