import { describe, expect, it } from 'vitest';
import { selectRegistryItem } from './select.registry';

describe('select registry item', () => {
  it('contains expected metadata', () => {
    expect(selectRegistryItem.name).toBe('select');
    expect(selectRegistryItem.dependencies).toEqual([]);
    expect(selectRegistryItem.files).toHaveLength(5);
  });

  it('generates local select source files', () => {
    const componentFile = selectRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/select/tng-select.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-select'");

    const primitiveFile = selectRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/select/tng-select-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngSelect]'");
  });
});
