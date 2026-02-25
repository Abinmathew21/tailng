import { describe, expect, it } from 'vitest';
import { TngContextMenuComponent } from './tng-context-menu.component';

describe('tng-context-menu component', () => {
  it('exports the context-menu component', () => {
    expect(typeof TngContextMenuComponent).toBe('function');
  });
});
