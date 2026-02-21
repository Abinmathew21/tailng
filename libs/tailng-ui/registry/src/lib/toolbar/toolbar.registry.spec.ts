import { describe, expect, it } from 'vitest';
import { toolbarRegistryItem } from './toolbar.registry';

describe('toolbar registry item', () => {
  it('contains expected metadata', () => {
    expect(toolbarRegistryItem.name).toBe('toolbar');
    expect(toolbarRegistryItem.dependencies).toEqual([]);
    expect(toolbarRegistryItem.files).toHaveLength(5);
  });

  it('generates local toolbar source files', () => {
    const componentFile = toolbarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/toolbar/tng-toolbar.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-toolbar'");

    const primitiveFile = toolbarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/toolbar/tng-toolbar-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngToolbar]'");
  });
});
