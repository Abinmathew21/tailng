import { describe, expect, it } from 'vitest';
import { TngChartLoadingStateComponent } from './tng-chart-loading-state.component';

describe('tng-chart-loading-state component', () => {
  it('exports the loading state component', () => {
    expect(typeof TngChartLoadingStateComponent).toBe('function');
  });
});
