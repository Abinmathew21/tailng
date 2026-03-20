import { describe, expect, it, vi } from 'vitest';
import { createTheme } from '../../engine/create-theme';
import { defaultThemePreset } from '../../presets/default.preset';
import { darkSemanticTokens } from '../../tokens/semantic/dark';
import { applyTailngTheme } from './provide-tailng-theme';

function createTargetSpy(): Readonly<{
  setPropertySpy: ReturnType<typeof vi.fn>;
  target: {
    style: {
      setProperty: CSSStyleDeclaration['setProperty'];
    };
  };
}> {
  const setPropertySpy = vi.fn();
  const setProperty: CSSStyleDeclaration['setProperty'] = (property, value, priority): void => {
    setPropertySpy(property, value, priority);
  };

  return {
    setPropertySpy,
    target: {
      style: {
        setProperty,
      },
    },
  };
}

describe('applyTailngTheme', () => {
  it('writes CSS variables and color-scheme by default', () => {
    const { setPropertySpy, target } = createTargetSpy();
    const theme = createTheme(defaultThemePreset, {
      meta: { mode: 'dark' },
      tokens: { semantic: darkSemanticTokens },
    });

    applyTailngTheme(theme, { target });

    const keys = setPropertySpy.mock.calls.map((entry) => entry[0] as string);
    expect(keys).toContain('--tng-color-primary500');
    expect(keys).toContain('--tng-semantic-background-canvas');
    expect(keys).toContain('color-scheme');
  });

  it('skips color-scheme when applyColorScheme is false', () => {
    const { setPropertySpy, target } = createTargetSpy();

    applyTailngTheme(defaultThemePreset, { applyColorScheme: false, target });

    const keys = setPropertySpy.mock.calls.map((entry) => entry[0] as string);
    expect(keys).not.toContain('color-scheme');
  });
});
