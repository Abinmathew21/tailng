import { describe, expect, it } from 'vitest';
import { TngBreadcrumbComponent } from './tng-breadcrumb.component';

describe('tng-breadcrumb component', () => {
  it('exports the breadcrumb component', () => {
    expect(typeof TngBreadcrumbComponent).toBe('function');
  });
});
