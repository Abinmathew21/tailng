import { describe, expect, it } from 'vitest';
import { inputOtpRegistryItem } from './input-otp.registry';

describe('input-otp registry item', () => {
  it('contains expected metadata', () => {
    expect(inputOtpRegistryItem.name).toBe('input-otp');
    expect(inputOtpRegistryItem.dependencies).toEqual([]);
    expect(inputOtpRegistryItem.files).toHaveLength(5);
  });

  it('generates local input-otp source files', () => {
    const componentFile = inputOtpRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/input-otp/tng-input-otp.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-input-otp'");

    const primitiveFile = inputOtpRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/input-otp/tng-input-otp-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngInputOtp]'");
  });
});
