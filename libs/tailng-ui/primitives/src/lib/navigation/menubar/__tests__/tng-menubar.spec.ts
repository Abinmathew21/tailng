import { describe, expect, it } from 'vitest';
import { TngMenubar } from '../tng-menubar';

describe('tng-menubar primitive', () => {
  it('exports the menubar primitive', () => {
    expect(typeof TngMenubar).toBe('function');
  });
});
