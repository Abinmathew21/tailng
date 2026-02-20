import { describe, expect, it } from 'vitest';
import { TngDialog } from './tng-dialog.component';

describe('tng-dialog component', () => {
  it('exports the dialog component', () => {
    expect(typeof TngDialog).toBe('function');
  });
});
