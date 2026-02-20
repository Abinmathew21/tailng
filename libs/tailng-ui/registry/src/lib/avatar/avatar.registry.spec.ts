import { describe, expect, it } from 'vitest';
import { avatarRegistryItem } from './avatar.registry';

describe('avatar registry item', () => {
  it('contains expected metadata', () => {
    expect(avatarRegistryItem.name).toBe('avatar');
    expect(avatarRegistryItem.dependencies).toEqual([]);
    expect(avatarRegistryItem.files).toHaveLength(5);
  });

  it('generates local avatar source files', () => {
    const componentFile = avatarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/avatar/tng-avatar.ts'),
    );
    expect(componentFile?.content).toContain('export class TngAvatar');
    expect(componentFile?.content).toContain('toTngAvatarFallbackText');

    const primitiveFile = avatarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/avatar/tng-avatar-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain('export class TngAvatarPrimitive');
    expect(primitiveFile?.content).toContain('export class TngAvatarFallbackPrimitive');

    const indexFile = avatarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/avatar/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-avatar';");
    expect(indexFile?.content).toContain("export * from './tng-avatar-primitive';");
  });
});
