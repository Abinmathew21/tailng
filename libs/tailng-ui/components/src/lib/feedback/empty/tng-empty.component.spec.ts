import { describe, expect, it } from 'vitest';
import {
  TngEmptyComponent,
  TngEmptyActionsComponent,
  TngEmptyDescriptionComponent,
  TngEmptyIconComponent,
  TngEmptyTitleComponent,
} from './tng-empty.component';

describe('tng-empty component', () => {
  it('exports all public empty components', () => {
    expect(typeof TngEmptyComponent).toBe('function');
    expect(typeof TngEmptyIconComponent).toBe('function');
    expect(typeof TngEmptyTitleComponent).toBe('function');
    expect(typeof TngEmptyDescriptionComponent).toBe('function');
    expect(typeof TngEmptyActionsComponent).toBe('function');
  });
});
