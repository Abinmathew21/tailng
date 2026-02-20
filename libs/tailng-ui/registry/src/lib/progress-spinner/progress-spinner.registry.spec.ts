import { describe, expect, it } from 'vitest';
import { progressSpinnerRegistryItem } from './progress-spinner.registry';

describe('progress-spinner registry item', () => {
  it('contains expected metadata', () => {
    expect(progressSpinnerRegistryItem.name).toBe('progress-spinner');
    expect(progressSpinnerRegistryItem.dependencies).toEqual([]);
    expect(progressSpinnerRegistryItem.files).toHaveLength(5);
  });

  it('generates local progress spinner source files', () => {
    const componentFile = progressSpinnerRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/progress-spinner/tng-progress-spinner.ts'),
    );
    expect(componentFile?.content).toContain('export class TngProgressSpinner');
    expect(componentFile?.content).toContain('toTngProgressSpinnerDashOffset');

    const primitiveFile = progressSpinnerRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/progress-spinner/tng-progress-spinner-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain('export class TngProgressSpinnerPrimitive');

    const indexFile = progressSpinnerRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/progress-spinner/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-progress-spinner';");
    expect(indexFile?.content).toContain("export * from './tng-progress-spinner-primitive';");
  });
});
