import { describe, expect, it } from 'vitest';
import { labelRegistryItem } from './label.registry';

describe('label registry item', () => {
  it('contains expected metadata', () => {
    expect(labelRegistryItem.name).toBe('label');
    expect(labelRegistryItem.dependencies).toEqual([]);
    expect(labelRegistryItem.files).toHaveLength(5);
  });

  it('generates local label source files', () => {
    const componentFile = labelRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/label/tng-label.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-label'");

    const primitiveFile = labelRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/label/tng-label-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: 'label[tngLabel]'");
  });
});
