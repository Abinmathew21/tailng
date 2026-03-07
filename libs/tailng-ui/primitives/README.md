<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="96"
    alt="TailNG logo"
  />
</div>

# @tailng-ui/primitives

Unstyled accessibility and behavior primitives for TailNG UI.

## TngPress

`TngPress` is a standalone directive that enhances native `button` and `a` elements:

- Defaults `button[tngPress]` to `type="button"` to avoid accidental form submission.
- Supports ARIA attributes for toggle/menu disclosure patterns.
- Handles disabled interaction for anchors and exposes `data-disabled` for styling.
- Applies button keyboard behavior to anchors without `href`.

### Usage

```ts
import { Component } from '@angular/core';
import { TngPress } from '@tailng-ui/primitives';

@Component({
  imports: [TngPress],
  template: `
    <button tngPress type="button">Action</button>
    <a tngPress [disabled]="true">Disabled Link Button</a>
  `,
})
export class ExampleComponent {}
```
