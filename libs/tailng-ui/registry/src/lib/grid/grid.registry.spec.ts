import { describe, expect, it } from 'vitest';
import { gridRegistryItem } from './grid.registry';

describe('grid registry item', () => {
  it('contains expected metadata', () => {
    expect(gridRegistryItem.name).toBe('grid');
    expect(gridRegistryItem.dependencies).toEqual([]);
    expect(gridRegistryItem.files).toHaveLength(5);
  });

  it('generates local grid source files', () => {
    const componentFile = gridRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/grid/tng-grid.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-grid'");

    const primitiveFile = gridRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/grid/tng-grid-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngGrid]'");
  });
});
