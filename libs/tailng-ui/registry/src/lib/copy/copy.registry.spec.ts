import { describe, expect, it } from 'vitest';
import { copyRegistryItem } from './copy.registry';

describe('copy registry item', () => {
  it('contains expected metadata', () => {
    expect(copyRegistryItem.name).toBe('copy');
    expect(copyRegistryItem.dependencies).toEqual([]);
    expect(copyRegistryItem.files).toHaveLength(5);
  });

  it('generates local copy source files', () => {
    const componentFile = copyRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/copy/tng-copy-button.ts'),
    );
    expect(componentFile?.content).toContain('export class TngCopyButton');

    const primitiveFile = copyRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/copy/tng-copy-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain("selector: '[tngCopy]'");

    const indexFile = copyRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/copy/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-copy-button';");
    expect(indexFile?.content).toContain(
      "export { TngCopyButton as TngCopy } from './tng-copy-button';",
    );
    expect(indexFile?.content).toContain("export * from './tng-copy-primitive';");
  });
});
