import { describe, expect, it } from 'vitest';
import { collapsibleRegistryItem } from './collapsible.registry';

describe('collapsible registry item', () => {
  it('contains expected metadata', () => {
    expect(collapsibleRegistryItem.name).toBe('collapsible');
    expect(collapsibleRegistryItem.dependencies).toEqual([]);
    expect(collapsibleRegistryItem.files).toHaveLength(5);
  });

  it('generates local collapsible source files', () => {
    const componentFile = collapsibleRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/collapsible/tng-collapsible.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-collapsible'");

    const primitiveFile = collapsibleRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/collapsible/tng-collapsible-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngCollapsible]'");
  });
});
