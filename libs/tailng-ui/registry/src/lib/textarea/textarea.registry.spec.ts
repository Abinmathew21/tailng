import { describe, expect, it } from 'vitest';
import { textareaRegistryItem } from './textarea.registry';

describe('textarea registry item', () => {
  it('contains expected metadata', () => {
    expect(textareaRegistryItem.name).toBe('textarea');
    expect(textareaRegistryItem.dependencies).toEqual([]);
    expect(textareaRegistryItem.files).toHaveLength(5);
  });

  it('generates local textarea source files', () => {
    const componentFile = textareaRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/textarea/tng-textarea.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain('export class TngTextarea');
    expect(componentFile?.content).toContain('valueChange = output<string>()');

    const primitiveFile = textareaRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/textarea/tng-textarea-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain('coerceTngTextareaNullableBoolean');

    const indexFile = textareaRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/textarea/index.ts'),
    );
    expect(indexFile).toBeDefined();
    expect(indexFile?.content).toContain("export * from './tng-textarea';");
  });
});
