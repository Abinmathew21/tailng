import { describe, expect, it } from 'vitest';
import { chipsRegistryItem } from './chips.registry';

describe('chips registry item', () => {
  it('contains expected metadata', () => {
    expect(chipsRegistryItem.name).toBe('chips');
    expect(chipsRegistryItem.dependencies).toEqual([]);
    expect(chipsRegistryItem.files).toHaveLength(5);
  });

  it('generates local chips source files', () => {
    const componentFile = chipsRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/chips/tng-chips.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-chips'");

    const primitiveFile = chipsRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/chips/tng-chips-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngChips]'");
  });
});
