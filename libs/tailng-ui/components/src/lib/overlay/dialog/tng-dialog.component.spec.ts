import { describe, expect, it } from 'vitest';
import { TngDialogComponent } from './tng-dialog.component';

describe('tng-dialog component', () => {
  it('exports the dialog component', () => {
    expect(typeof TngDialogComponent).toBe('function');
  });
});
