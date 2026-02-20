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

## Contract

- Built-in packs are always available internally: `lucide`.
- Zero-config default pack is `lucide`.
- `defaultPack` is optional in `provideTngIcons`.
- Custom packs can be added without re-registering built-in packs.
- Built-ins are sourced from `@ng-icons/lucide` via generated loaders (no inline SVG constants).
- No implicit icon aliases are provided. Use the real icon names from each pack.
- Pack name `lucide` is reserved unless `allowBuiltinOverride: true`.
- Built-in pack references are normalized case-insensitively:
  - `Lucide:bell` resolves as `lucide:bell`

## Usage

### Zero config

```html
<tng-icon icon="bell" />
```

This resolves to `lucide:bell`.

### Custom default pack + extra packs

```ts
import { createTngIconPack, provideTngIcons } from '@tailng-ui/icons';

export const appConfig = {
  providers: [
    provideTngIcons({
      // Optional: if omitted, default is "lucide"
      defaultPack: 'customPack1',
      packs: [customPack1, customPack2],
    }),
  ],
};

const customPack1 = createTngIconPack('customPack1', {
  bell: async () => '<svg viewBox="0 0 24 24"></svg>',
});

const customPack2 = createTngIconPack('customPack2', {
  check: async () => '<svg viewBox="0 0 24 24"></svg>',
});
```

### Add Bootstrap as custom pack

```ts
import { createTngIconPack, provideTngIcons } from '@tailng-ui/icons';
import { bootstrapBell } from '@ng-icons/bootstrap-icons';

const bootstrap = createTngIconPack('bootstrap', {
  bell: async () => bootstrapBell,
});

export const appConfig = {
  providers: [provideTngIcons({ packs: [bootstrap] })],
};
```

## Regenerate Built-In Loader Maps

```bash
pnpm icons:generate
```
