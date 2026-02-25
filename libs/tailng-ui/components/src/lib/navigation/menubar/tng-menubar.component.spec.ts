import { describe, expect, it } from 'vitest';
import { TngMenubarComponent } from './tng-menubar.component';

describe('tng-menubar component', () => {
  it('exports the menubar component', () => {
    expect(typeof TngMenubarComponent).toBe('function');
  });
});
