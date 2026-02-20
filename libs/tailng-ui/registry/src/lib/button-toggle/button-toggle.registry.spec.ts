import { describe, expect, it } from 'vitest';
import { buttontoggleRegistryItem } from './button-toggle.registry';

describe('button-toggle registry item', () => {
  it('contains expected metadata', () => {
    expect(buttontoggleRegistryItem.name).toBe('button-toggle');
    expect(buttontoggleRegistryItem.dependencies).toEqual([]);
    expect(buttontoggleRegistryItem.files).toHaveLength(8);
  });

  it('generates local button-toggle source files', () => {
    const componentFile = buttontoggleRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/button-toggle/tng-button-toggle.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-button-toggle'");

    const primitiveFile = buttontoggleRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/button-toggle/tng-button-toggle-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: 'button[tngButtonToggle]'");
  });
});
