import { describe, expect, it } from 'vitest';
import { stepperRegistryItem } from './stepper.registry';

describe('stepper registry item', () => {
  it('contains expected metadata', () => {
    expect(stepperRegistryItem.name).toBe('stepper');
    expect(stepperRegistryItem.dependencies).toEqual([]);
    expect(stepperRegistryItem.files).toHaveLength(5);
  });

  it('generates local stepper source files', () => {
    const componentFile = stepperRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/stepper/tng-stepper.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-stepper'");

    const primitiveFile = stepperRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/stepper/tng-stepper-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngStepper]'");
  });
});
