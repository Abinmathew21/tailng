import { describe, expect, it } from 'vitest';
import { separatorRegistryItem } from './separator.registry';

describe('separator registry item', () => {
  it('contains expected metadata', () => {
    expect(separatorRegistryItem.name).toBe('separator');
    expect(separatorRegistryItem.dependencies).toEqual([]);
    expect(separatorRegistryItem.files).toHaveLength(5);
  });

  it('generates local separator source files', () => {
    const componentFile = separatorRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/separator/tng-separator.ts'),
    );
    expect(componentFile?.content).toContain('export class TngSeparator');

    const primitiveFile = separatorRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/separator/tng-separator-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain('export class TngSeparatorPrimitive');

    const indexFile = separatorRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/separator/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-separator';");
    expect(indexFile?.content).toContain("export * from './tng-separator-primitive';");
  });
});
