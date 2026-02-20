import { describe, expect, it } from 'vitest';
import {
  TngEmpty,
  TngEmptyActions,
  TngEmptyDescription,
  TngEmptyIcon,
  TngEmptyTitle,
} from './tng-empty.component';

describe('tng-empty component', () => {
  it('exports all public empty components', () => {
    expect(typeof TngEmpty).toBe('function');
    expect(typeof TngEmptyIcon).toBe('function');
    expect(typeof TngEmptyTitle).toBe('function');
    expect(typeof TngEmptyDescription).toBe('function');
    expect(typeof TngEmptyActions).toBe('function');
  });
});
