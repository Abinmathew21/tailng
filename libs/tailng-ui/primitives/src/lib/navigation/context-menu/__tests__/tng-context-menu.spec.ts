import { describe, expect, it } from 'vitest';
import { TngContextMenu } from '../tng-context-menu';

describe('tng-context-menu primitive', () => {
  it('exports the context-menu primitive', () => {
    expect(typeof TngContextMenu).toBe('function');
  });
});
