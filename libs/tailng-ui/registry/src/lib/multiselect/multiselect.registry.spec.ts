import { describe, expect, it } from 'vitest';
import { multiselectRegistryItem } from './multiselect.registry';

describe('multiselect registry item', () => {
  it('contains expected metadata', () => {
    expect(multiselectRegistryItem.name).toBe('multiselect');
    expect(multiselectRegistryItem.dependencies).toEqual([]);
    expect(multiselectRegistryItem.files).toHaveLength(5);
  });

  it('generates local multiselect source files', () => {
    const componentFile = multiselectRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/multiselect/tng-multiselect.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-multiselect'");

    const primitiveFile = multiselectRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/multiselect/tng-multiselect-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngMultiselect]'");
  });
});
