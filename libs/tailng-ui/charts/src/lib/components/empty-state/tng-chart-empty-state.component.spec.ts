import { describe, expect, it } from 'vitest';
import { TngChartEmptyStateComponent } from './tng-chart-empty-state.component';

describe('tng-chart-empty-state component', () => {
  it('exports the empty state component', () => {
    expect(typeof TngChartEmptyStateComponent).toBe('function');
  });
});
