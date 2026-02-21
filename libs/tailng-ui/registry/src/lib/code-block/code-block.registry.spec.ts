import { describe, expect, it } from 'vitest';
import { codeBlockRegistryItem } from './code-block.registry';

describe('code-block registry item', () => {
  it('contains expected metadata', () => {
    expect(codeBlockRegistryItem.name).toBe('code-block');
    expect(codeBlockRegistryItem.dependencies).toEqual([]);
    expect(codeBlockRegistryItem.files).toHaveLength(6);
  });

  it('generates local code-block source files', () => {
    const componentFile = codeBlockRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/code-block/tng-code-block.ts'),
    );
    expect(componentFile?.content).toContain('export class TngCodeBlock');

    const primitiveFile = codeBlockRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/code-block/tng-code-block-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain('export class TngCodeBlockPrimitive');

    const highlightingFile = codeBlockRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/code-block/tng-code-highlighting.ts'),
    );
    expect(highlightingFile?.content).toContain('createTngCodeHighlighterAdapter');

    const indexFile = codeBlockRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/code-block/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-code-block';");
    expect(indexFile?.content).toContain("export * from './tng-code-highlighting';");
  });
});
