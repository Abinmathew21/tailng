import { describe, expect, it } from 'vitest';
import { breadcrumbRegistryItem } from './breadcrumb.registry';

describe('breadcrumb registry item', () => {
  it('contains expected metadata', () => {
    expect(breadcrumbRegistryItem.name).toBe('breadcrumb');
    expect(breadcrumbRegistryItem.dependencies).toEqual([]);
    expect(breadcrumbRegistryItem.files).toHaveLength(5);
  });

  it('generates local breadcrumb source files', () => {
    const componentFile = breadcrumbRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/breadcrumb/tng-breadcrumb.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-breadcrumb'");

    const primitiveFile = breadcrumbRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/breadcrumb/tng-breadcrumb-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngBreadcrumb]'");
  });
});
