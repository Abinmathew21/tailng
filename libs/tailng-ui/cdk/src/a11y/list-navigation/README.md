# @tailng-ui/cdk -- List Navigation

## Overview

`list-navigation` is a framework-agnostic keyboard navigation resolver
designed for ARIA composite patterns such as:

-   Listbox
-   Menu
-   Tabs
-   Toolbar
-   Tree

It converts keyboard events into **pure navigation actions** without
mutating DOM, managing focus, or performing selection directly.

This makes it ideal as a foundational primitive inside CDK-level pattern
controllers.

------------------------------------------------------------------------

## Design Principles

- Pure and deterministic
- No DOM dependency
- No internal state
- Extensible via custom resolvers
- Multi-select aware
- RTL-aware
- Orientation-aware

------------------------------------------------------------------------

## Core API

### `resolveListNavigationKeyAction()`

``` ts
resolveListNavigationKeyAction(
  event: TngListNavigationKeyboardEvent,
  options?: TngListNavigationOptions,
  resolvers?: readonly TngListNavigationActionResolver[]
): TngListNavigationAction | null
```

### Parameters

#### `event`

Minimal keyboard event shape:

``` ts
type TngListNavigationKeyboardEvent = {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};
```

#### `options` (optional)

``` ts
type TngListNavigationOptions = {
  direction?: 'ltr' | 'rtl';
  multiSelect?: boolean;
  orientation?: 'both' | 'horizontal' | 'vertical';
  behavior?: 'listbox' | 'menu' | 'tabs';
};
```

Defaults: - direction: `'ltr'` - multiSelect: `false` - orientation:
`'vertical'` - behavior: `'listbox'`

#### `resolvers` (optional)

Custom resolver chain. Defaults to `defaultListNavigationResolvers`.

------------------------------------------------------------------------

## Returned Action

``` ts
type TngListNavigationAction = {
  type:
    | 'exit'
    | 'move-first'
    | 'move-last'
    | 'move-next'
    | 'move-prev'
    | 'select-active'
    | 'select-all'
    | 'toggle-active';
  preventDefault: boolean;
  extendSelection: boolean;
};
```

If no matching key is found, returns `null`.

------------------------------------------------------------------------

## Default Key Mappings

### Navigation

  Key          Action
  ------------ -----------------
  ArrowDown    move-next
  ArrowUp      move-prev
  ArrowRight   move-next (LTR)
  ArrowLeft    move-prev (LTR)
  Home         move-first
  End          move-last
  Tab          exit

### Selection

  Key      Mode     Action
  -------- -------- ---------------
  Enter    Any      select-active
  Space    Single   select-active
  Space    Multi    toggle-active
  Ctrl+A   Multi    select-all

------------------------------------------------------------------------

## Usage Example

``` ts
const action = resolveListNavigationKeyAction(event, {
  orientation: 'vertical',
  multiSelect: true,
});

if (action) {
  if (action.preventDefault) {
    event.preventDefault();
  }

  dispatch(action);
}
```

------------------------------------------------------------------------

## Extending Behavior

You can inject custom resolvers:

``` ts
import {
  resolveListNavigationKeyAction,
  defaultListNavigationResolvers,
} from '@tailng-ui/cdk/a11y/list-navigation';

const escapeResolver = (event) => {
  if (event.key === 'Escape') {
    return {
      type: 'exit',
      preventDefault: true,
      extendSelection: false,
    };
  }
  return null;
};

const action = resolveListNavigationKeyAction(
  event,
  {},
  [escapeResolver, ...defaultListNavigationResolvers]
);
```

Resolvers are executed in order until one returns a non-null action.

------------------------------------------------------------------------

## Integration Pattern

Recommended pattern:

    KeyboardEvent
       ↓
    resolveListNavigationKeyAction
       ↓
    dispatch(action)
       ↓
    reduce(state, action)
       ↓
    apply focus / selection effects

`list-navigation` never: - Moves focus - Changes selection - Mutates
state - Prevents default directly

It only describes intent.

------------------------------------------------------------------------

## Best Practices

-   Always handle `preventDefault`
-   Keep navigation pure; perform selection in higher-level controller
-   Use `multiSelect` carefully to enable shift-extend logic
-   Prefer extending via resolver injection instead of modifying core

------------------------------------------------------------------------

## Stability Guarantees

-   Existing behavior is backward-compatible
-   All extension points are additive
-   No breaking changes introduced by adding new behaviors

------------------------------------------------------------------------

## License

Part of @tailng-ui CDK infrastructure.
