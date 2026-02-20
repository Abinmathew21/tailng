import { describe, expect, it } from 'vitest';
import { radioRegistryItem } from './radio.registry';

describe('radio registry item', () => {
  it('contains expected metadata', () => {
    expect(radioRegistryItem.name).toBe('radio');
    expect(radioRegistryItem.dependencies).toEqual([]);
    expect(radioRegistryItem.files).toHaveLength(5);
  });

  it('generates local radio source files', () => {
    const componentFile = radioRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/radio/tng-radio.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain('export class TngRadio');
    expect(componentFile?.content).toContain('checkedChange = output<boolean>()');

    const primitiveFile = radioRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/radio/tng-radio-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain('export class TngRadioPrimitive');

    const indexFile = radioRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/radio/index.ts'),
    );
    expect(indexFile).toBeDefined();
    expect(indexFile?.content).toContain("export * from './tng-radio';");
  });
});
