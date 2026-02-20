import { describe, expect, it } from 'vitest';
import { contextmenuRegistryItem } from './context-menu.registry';

describe('context-menu registry item', () => {
  it('contains expected metadata', () => {
    expect(contextmenuRegistryItem.name).toBe('context-menu');
    expect(contextmenuRegistryItem.dependencies).toEqual([]);
    expect(contextmenuRegistryItem.files).toHaveLength(5);
  });

  it('generates local context-menu source files', () => {
    const componentFile = contextmenuRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/context-menu/tng-context-menu.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-context-menu'");

    const primitiveFile = contextmenuRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/context-menu/tng-context-menu-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngContextMenu]'");
  });
});
