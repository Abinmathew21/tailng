import { describe, expect, it } from 'vitest';
import { toggleRegistryItem } from './toggle.registry';

describe('toggle registry item', () => {
  it('contains expected metadata', () => {
    expect(toggleRegistryItem.name).toBe('toggle');
    expect(toggleRegistryItem.dependencies).toEqual([]);
    expect(toggleRegistryItem.files).toHaveLength(5);
  });

  it('generates local toggle source files', () => {
    const componentFile = toggleRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/toggle/tng-toggle.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-toggle'");

    const primitiveFile = toggleRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/toggle/tng-toggle-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: 'button[tngToggle]'");
  });
});
