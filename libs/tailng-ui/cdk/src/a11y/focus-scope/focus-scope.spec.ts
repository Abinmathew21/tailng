import { describe, expect, it } from 'vitest';
import { createFocusScope } from './focus-scope';

describe('createFocusScope', () => {
  it('activates and deactivates scope', () => {
    const scope = createFocusScope();

    scope.activate();
    expect(scope.getState().active).toBe(true);

    scope.deactivate();
    expect(scope.getState().active).toBe(false);
  });

  it('records last focused id', () => {
    const scope = createFocusScope();

    scope.recordFocus('field-1');
    expect(scope.getState().lastFocusedId).toBe('field-1');
  });
});
