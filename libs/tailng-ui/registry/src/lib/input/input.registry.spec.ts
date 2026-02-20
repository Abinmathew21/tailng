import { describe, expect, it } from 'vitest';
import { inputRegistryItem } from './input.registry';

describe('input registry item', () => {
  it('contains expected metadata', () => {
    expect(inputRegistryItem.name).toBe('input');
    expect(inputRegistryItem.dependencies).toEqual([]);
    expect(inputRegistryItem.files).toHaveLength(5);
  });

  it('generates local input source files', () => {
    const componentFile = inputRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/input/tng-input.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain('export class TngInput');
    expect(componentFile?.content).toContain('valueChange = output<string>()');

    const primitiveFile = inputRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/input/tng-input-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain('export class TngInputPrimitive');

    const indexFile = inputRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/input/index.ts'),
    );
    expect(indexFile).toBeDefined();
    expect(indexFile?.content).toContain("export * from './tng-input';");
  });
});
