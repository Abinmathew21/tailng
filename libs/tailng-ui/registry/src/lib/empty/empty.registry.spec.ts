import { describe, expect, it } from 'vitest';
import { emptyRegistryItem } from './empty.registry';

describe('empty registry item', () => {
  it('contains expected metadata', () => {
    expect(emptyRegistryItem.name).toBe('empty');
    expect(emptyRegistryItem.dependencies).toEqual([]);
    expect(emptyRegistryItem.files).toHaveLength(9);
  });

  it('generates local empty-state source files', () => {
    const componentFile = emptyRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/empty/tng-empty.ts'),
    );
    expect(componentFile?.content).toContain('export class TngEmpty');
    expect(componentFile?.content).toContain('export class TngEmptyActions');

    const primitiveFile = emptyRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/empty/tng-empty-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain('export class TngEmptyPrimitive');
    expect(primitiveFile?.content).toContain('export class TngEmptyActionsPrimitive');

    const indexFile = emptyRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/empty/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-empty';");
    expect(indexFile?.content).toContain("export * from './tng-empty-primitive';");
  });
});
