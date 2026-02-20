import { describe, expect, it } from 'vitest';
import { switchRegistryItem } from './switch.registry';

describe('switch registry item', () => {
  it('contains expected metadata', () => {
    expect(switchRegistryItem.name).toBe('switch');
    expect(switchRegistryItem.dependencies).toEqual([]);
    expect(switchRegistryItem.files).toHaveLength(5);
  });

  it('generates local switch source files', () => {
    const componentFile = switchRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/switch/tng-switch.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-switch'");

    const primitiveFile = switchRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/switch/tng-switch-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: 'button[tngSwitch]'");
  });
});
