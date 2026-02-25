import { describe, expect, it } from 'vitest';
import { TngToolbarComponent } from './tng-toolbar.component';

describe('tng-toolbar component', () => {
  it('exports the toolbar component', () => {
    expect(typeof TngToolbarComponent).toBe('function');
  });
});
