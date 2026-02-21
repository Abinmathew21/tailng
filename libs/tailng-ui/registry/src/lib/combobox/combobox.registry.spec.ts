import { describe, expect, it } from 'vitest';
import { comboboxRegistryItem } from './combobox.registry';

describe('combobox registry item', () => {
  it('contains expected metadata', () => {
    expect(comboboxRegistryItem.name).toBe('combobox');
    expect(comboboxRegistryItem.dependencies).toEqual([]);
    expect(comboboxRegistryItem.files).toHaveLength(5);
  });

  it('generates local combobox source files', () => {
    const componentFile = comboboxRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/combobox/tng-combobox.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-combobox'");

    const primitiveFile = comboboxRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/combobox/tng-combobox-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngCombobox]'");
  });
});
