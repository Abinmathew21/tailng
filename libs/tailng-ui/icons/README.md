<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="96"
    alt="TailNG logo"
  />
</div>

# @tailng-ui/icons

Icon abstraction layer for TailNG.
`tng-icon` is rendered using `@ng-icons/core` internally.

## Defaults

- Built-in packs: `lucide`, `bootstrap`
- Default pack: `lucide`
- `defaultPack` is optional in `provideTngIcons`

## Usage

```ts
import { provideTngIcons } from '@tailng-ui/icons';

export const appConfig = {
  providers: [
    provideTngIcons({
      defaultPack: 'bootstrap',
      packs: [
        {
          name: 'customPack1',
          icons: {
            bell: async () => '<svg viewBox="0 0 24 24"></svg>',
          },
        },
      ],
    }),
  ],
};
```

Built-in pack names are reserved (`lucide`, `bootstrap`) unless
`allowBuiltinOverride: true` is explicitly set.
