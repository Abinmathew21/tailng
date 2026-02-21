import { describe, expect, it } from 'vitest';
import { checkboxRegistryItem } from './checkbox.registry';

describe('checkbox registry item', () => {
  it('contains expected metadata', () => {
    expect(checkboxRegistryItem.name).toBe('checkbox');
    expect(checkboxRegistryItem.dependencies).toEqual([]);
    expect(checkboxRegistryItem.files).toHaveLength(5);
  });

  it('generates local checkbox source files', () => {
    const componentFile = checkboxRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/checkbox/tng-checkbox.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain('export class TngCheckbox');
    expect(componentFile?.content).toContain('indeterminateChange = output<boolean>()');

    const primitiveFile = checkboxRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/checkbox/tng-checkbox-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain('resolveTngCheckboxAriaChecked');

    const indexFile = checkboxRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/checkbox/index.ts'),
    );
    expect(indexFile).toBeDefined();
    expect(indexFile?.content).toContain("export * from './tng-checkbox';");
  });
});
