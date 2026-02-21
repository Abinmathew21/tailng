import { describe, expect, it } from 'vitest';
import { TngToolbar } from './tng-toolbar.component';

describe('tng-toolbar component', () => {
  it('exports the toolbar component', () => {
    expect(typeof TngToolbar).toBe('function');
  });
});
