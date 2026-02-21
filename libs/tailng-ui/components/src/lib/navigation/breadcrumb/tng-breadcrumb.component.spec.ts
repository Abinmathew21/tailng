import { describe, expect, it } from 'vitest';
import { TngBreadcrumb } from './tng-breadcrumb.component';

describe('tng-breadcrumb component', () => {
  it('exports the breadcrumb component', () => {
    expect(typeof TngBreadcrumb).toBe('function');
  });
});
