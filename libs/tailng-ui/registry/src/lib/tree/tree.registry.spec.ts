import { describe, expect, it } from 'vitest';
import { treeRegistryItem } from './tree.registry';

describe('tree registry item', () => {
  it('contains expected metadata', () => {
    expect(treeRegistryItem.name).toBe('tree');
    expect(treeRegistryItem.dependencies).toEqual([]);
    expect(treeRegistryItem.files).toHaveLength(5);
  });

  it('generates local tree source files', () => {
    const componentFile = treeRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/tree/tng-tree.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-tree'");

    const primitiveFile = treeRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/tree/tng-tree-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngTree]'");
  });
});
