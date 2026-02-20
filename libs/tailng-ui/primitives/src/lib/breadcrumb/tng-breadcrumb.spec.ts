import { describe, expect, it } from 'vitest';
import {
  TngBreadcrumb,
  TngBreadcrumbItem,
  TngBreadcrumbLink,
  TngBreadcrumbList,
  TngBreadcrumbSeparator,
} from './tng-breadcrumb';

describe('tng-breadcrumb primitives', () => {
  it('exports breadcrumb directives', () => {
    expect(typeof TngBreadcrumb).toBe('function');
    expect(typeof TngBreadcrumbList).toBe('function');
    expect(typeof TngBreadcrumbItem).toBe('function');
    expect(typeof TngBreadcrumbLink).toBe('function');
    expect(typeof TngBreadcrumbSeparator).toBe('function');
  });
});
