import { describe, expect, it } from 'vitest';
import { TngMenubar } from './tng-menubar.component';

describe('tng-menubar component', () => {
  it('exports the menubar component', () => {
    expect(typeof TngMenubar).toBe('function');
  });
});
