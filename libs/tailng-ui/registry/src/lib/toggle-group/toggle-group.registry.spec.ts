import { describe, expect, it } from 'vitest';
import { togglegroupRegistryItem } from './toggle-group.registry';

describe('toggle-group registry item', () => {
  it('contains expected metadata', () => {
    expect(togglegroupRegistryItem.name).toBe('toggle-group');
    expect(togglegroupRegistryItem.dependencies).toEqual([]);
    expect(togglegroupRegistryItem.files).toHaveLength(5);
  });

  it('generates local toggle-group source files', () => {
    const componentFile = togglegroupRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/toggle-group/tng-toggle-group.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-toggle-group'");

    const primitiveFile = togglegroupRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/toggle-group/tng-toggle-group-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngToggleGroup]'");
  });
});
