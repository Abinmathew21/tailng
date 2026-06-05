# Design Consistency Plan — tailng-ui Component Library

## Goal

Make all components feel like they come from the same family: consistent border radius, control heights, typography, focus rings, transitions, and disabled states — while keeping the existing token → contract → component CSS architecture intact.

---

## Current Architecture (Good)

```
Primitive tokens  →  Semantic tokens  →  Component contracts (CSS vars)  →  Component CSS
(radius.ts, etc.)    (light.ts)          (form-field.css, menu.css, …)       (*.component.css)
```

The problem: **component contracts only exist for form controls**. Button, card, dialog, toast, tabs, accordion, tooltip, checkbox, switch, tag, and others hardcode values directly in their component CSS, bypassing the token system entirely.

---

## Audit: What Is Inconsistent

### 1. Border Radius

Every component uses its own hardcoded value. None reference the radius primitives.

| Component | Current | Notes |
|---|---|---|
| Button | `0.6rem` | |
| Form field / Input | `0.65rem` | |
| Input (standalone) | `0.6rem` | |
| Select trigger | `0.5rem` | |
| Tooltip | `0.5rem` | trigger + content |
| Tag (rounded shape) | `0.5rem` | |
| Menu item | `0.5rem` (computed) | `calc(0.75rem - 0.25rem)` |
| Menu panel / Accordion / Tabs | `0.75rem` | |
| Toast item | `0.85rem` | |
| Card | `1rem` | |
| Dialog panel | `1rem` | |

The primitive `radius` tokens (`sm=0.125rem`, `md=0.375rem`, `lg=0.5rem`) don't map to any of these values. The scale needs to be redesigned.

### 2. Control Heights (sm / md / lg)

| Component | sm | md | lg |
|---|---|---|---|
| Button | `2rem` | `2.5rem` | `3rem` |
| Form field | `2.25rem` | `2.625rem` | `3rem` |
| Input (standalone) | — | `2.5rem` | — |
| Select trigger | no default | — | — |
| Menu trigger | — | `2.75rem` | — |
| Menu item | — | `2.35rem` | — |
| Tooltip trigger | — | `2rem` | — |

Form field md (`2.625rem`) is taller than button md (`2.5rem`) — they look misaligned when placed side-by-side.

### 3. Font Sizes

Many components use non-standard values between the defined type scale (`textXs=0.75rem`, `textSm=0.875rem`).

| Component | Font size |
|---|---|
| Button, menu item, label | `0.875rem` ✓ |
| Checkbox label | `0.925rem` ✗ |
| Switch root | `0.95rem` ✗ |
| Form field hint/error | `0.8125rem` (between xs and sm) |
| Toast title | `0.83rem` ✗ |
| Toast message | `0.79rem` ✗ |
| Card description | `0.9rem` ✗ |
| Dialog description | `0.92rem` ✗ |
| Tooltip content | `0.75rem` ✓ |

### 4. Font Weight

| Component | Weight |
|---|---|
| Button, label, tag, card title | `600` |
| Menu item (default) | `500` |
| Dialog title, toast title | `700` |
| Menu item (active/checked) | `600` |

Dialog/toast titles don't need to be heavier than card/button — `600` everywhere is sufficient.

### 5. Focus Ring — Three Different Approaches

```css
/* Approach A — box-shadow ring (button, form-field, dialog close, tag close) */
box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring);
outline: none;

/* Approach B — outline (tooltip trigger, switch, toast action/close) */
outline: 2px solid var(--tng-semantic-accent-brand);
outline-offset: 2px;

/* Approach C — outline using focus-ring token (card link) */
outline: 2px solid var(--tng-semantic-accent-brand);
outline-offset: 2px;
```

`--tng-semantic-focus-ring` already exists but is only used inconsistently. Several components reference `--tng-semantic-accent-brand` directly for focus instead of the dedicated focus token.

### 6. Disabled Opacity

Five different values in use:

| Value | Components |
|---|---|
| `0.45` | Menu item |
| `0.5` | Select option |
| `0.55` | Button |
| `0.62` | Form field, tag |
| `0.65` | Checkbox, switch, card link |

### 7. Transition Duration/Easing

| Value | Components |
|---|---|
| `120ms ease` | Button, select |
| `150ms ease` | Switch, menu item |
| `160ms ease` | Card interactive |
| `150ms cubic-bezier(...)` | Menu trigger (via `--tng-menu-ease`) |

### 8. Hardcoded Hex Colors (Not Using Semantic Tokens)

| Component | Hardcoded value | Should be |
|---|---|---|
| Select (option hover/active/selected) | `#3b82f6` | `var(--tng-semantic-accent-brand)` |
| Select overlay | `#fff`, `#e2e8f0` | semantic surface/border tokens |
| Menu (component CSS) | `#3b82f6`, `#f8fafc` | semantic tokens (menu contract already uses them — component CSS duplicates raw values) |

---

## Solution

### Step 1 — Redesign Radius Primitives

Update `libs/tailng-ui/theme/src/lib/tokens/primitives/radius.ts` with a scale that matches what components actually need:

```ts
export const radiusPrimitives: TokenScale = {
  none: '0',
  xs:   '0.25rem',   // chips, badges
  sm:   '0.5rem',    // controls: inputs, selects, buttons, tooltips, tags
  md:   '0.75rem',   // panels: menus, accordions, tabs, popovers
  lg:   '1rem',      // surfaces: cards, dialogs, bottom-sheets
  full: '9999px',    // pills, avatars, switches
};
```

Map these to semantic CSS vars in the theme (as `--tng-radius-xs` … `--tng-radius-lg`, `--tng-radius-full`) alongside the existing semantic tokens.

### Step 2 — Add a Shared Controls Contract

Create a new file `libs/tailng-ui/theme/src/lib/component-contracts/shared/controls.css` and add it as the **first** import in `index.css`. This defines cross-cutting design tokens consumed by all other contracts and component CSS files.

```css
@layer tng.contracts {
  :root,
  [data-theme] {
    /* --- Radius --- */
    --tng-radius-control: var(--tng-radius-sm, 0.5rem);   /* buttons, inputs, selects, tooltips */
    --tng-radius-panel:   var(--tng-radius-md, 0.75rem);  /* menus, accordions, tabs */
    --tng-radius-surface: var(--tng-radius-lg, 1rem);     /* cards, dialogs */
    --tng-radius-item:    var(--tng-radius-xs, 0.25rem);  /* list items inside panels */

    /* --- Control Heights --- */
    --tng-control-height-sm: 2rem;
    --tng-control-height-md: 2.5rem;
    --tng-control-height-lg: 3rem;

    /* --- Typography --- */
    --tng-text-xs:   0.75rem;       /* tooltip content, menu group labels */
    --tng-text-sm:   0.8125rem;     /* hints, captions, toast messages */
    --tng-text-body: 0.875rem;      /* standard control text (button, input, label) */
    --tng-text-lg:   1rem;          /* section headings (card title) */
    --tng-text-xl:   1.1rem;        /* dialog title */

    --tng-font-weight-normal:   400;
    --tng-font-weight-medium:   500;
    --tng-font-weight-semibold: 600;
    --tng-font-weight-bold:     700;

    /* --- Focus Ring (unified box-shadow approach) --- */
    --tng-focus-ring-width:  3px;
    --tng-focus-ring-offset: 0px;
    --tng-focus-ring-color:  var(--tng-semantic-focus-ring);
    --tng-focus-ring: 0 0 0 var(--tng-focus-ring-width) var(--tng-focus-ring-color);

    /* --- States --- */
    --tng-disabled-opacity: 0.55;

    /* --- Transitions --- */
    --tng-duration-fast:   120ms;
    --tng-duration-normal: 150ms;
    --tng-easing:          ease;
    --tng-transition-colors:
      background-color var(--tng-duration-fast) var(--tng-easing),
      border-color     var(--tng-duration-fast) var(--tng-easing),
      color            var(--tng-duration-fast) var(--tng-easing),
      opacity          var(--tng-duration-fast) var(--tng-easing);
    --tng-transition-interactive:
      border-color var(--tng-duration-normal) var(--tng-easing),
      box-shadow   var(--tng-duration-normal) var(--tng-easing);
  }
}
```

### Step 3 — Add Missing Component Contracts

Create new contract files for each component that currently hardcodes values. Each contract maps the shared control tokens to component-specific CSS vars.

**New contracts to create** (same pattern as `form-field.css`):

| Contract file | Components covered |
|---|---|
| `utility/button.css` | `tng-button` |
| `utility/tag.css` | `tng-tag` |
| `utility/tooltip.css` | `tng-tooltip` |
| `form/checkbox.css` | `tng-checkbox` |
| `form/switch.css` | `tng-switch` |
| `layout/card.css` | `tng-card` |
| `layout/accordion.css` | `tng-accordion` |
| `layout/tabs.css` | `tng-tabs` |
| `overlay/dialog.css` | `tng-dialog` |
| `overlay/popover.css` | `tng-popover` |
| `feedback/toast.css` | `tng-toast` |

Example — `utility/button.css`:
```css
@layer tng.contracts {
  :where(tng-button, [tngButton]) {
    --tng-button-radius:       var(--tng-radius-control);
    --tng-button-height-sm:    var(--tng-control-height-sm);
    --tng-button-height-md:    var(--tng-control-height-md);
    --tng-button-height-lg:    var(--tng-control-height-lg);
    --tng-button-font-size:    var(--tng-text-body);
    --tng-button-font-weight:  var(--tng-font-weight-semibold);
    --tng-button-transition:   var(--tng-transition-colors);
    --tng-button-focus-ring:   var(--tng-focus-ring);
    --tng-button-disabled-opacity: var(--tng-disabled-opacity);
  }
}
```

### Step 4 — Update Component CSS Files

Update each component's `.component.css` to consume its contract tokens instead of hardcoded values. This is the bulk of the work.

**Changes per component:**

**Button** (`tng-button.component.css`)
- `border-radius: 0.6rem` → `var(--tng-button-radius)`
- `min-height: 2rem/2.5rem/3rem` → `var(--tng-button-height-sm/md/lg)`
- `font-size: 0.875rem` → `var(--tng-button-font-size)`
- `font-weight: 600` → `var(--tng-button-font-weight)`
- `transition: …120ms ease…` → `var(--tng-button-transition)`
- `:focus-visible { box-shadow: … }` → `var(--tng-button-focus-ring)`
- `opacity: 0.55` → `var(--tng-button-disabled-opacity)`

**Form field contract** (`form-field.css`)
- `--tng-form-field-frame-radius: 0.65rem` → `var(--tng-radius-control)`
- `--tng-form-field-frame-min-height: 2.625rem` → `var(--tng-control-height-md)` *(aligns with button md)*
- `--tng-form-field-label-font-size: 0.875rem` → `var(--tng-text-body)`
- `--tng-form-field-message-font-size: 0.8125rem` → `var(--tng-text-sm)`

**Select** (`tng-select.component.css`)
- Replace `#3b82f6` with `var(--tng-semantic-accent-brand)`
- Replace `#fff`, `#e2e8f0` with `var(--tng-semantic-background-surface)`, `var(--tng-semantic-border-subtle)`
- `border-radius: 0.5rem` → `var(--tng-select-radius, var(--tng-radius-control))`
- `transition: 120ms var(--tng-select-ease, ease)` → `var(--tng-transition-interactive)`

**Checkbox** (`tng-checkbox.component.css`)
- `font-size: 0.925rem` → `var(--tng-text-body)`
- `opacity: 0.65` → `var(--tng-disabled-opacity)`
- `:focus-visible` box-shadow → `var(--tng-focus-ring)`

**Switch** (`tng-switch.component.css`)
- `font-size: 0.95rem` → `var(--tng-text-body)`
- `opacity: 0.65` → `var(--tng-disabled-opacity)`
- `:focus-visible outline` → replace with `box-shadow: var(--tng-focus-ring)`
- `transition: 150ms ease` → `var(--tng-duration-normal) var(--tng-easing)`

**Card** (`tng-card.component.css`)
- `border-radius: 1rem` → `var(--tng-card-radius, var(--tng-radius-surface))`
- `font-size: 1rem` (title) → `var(--tng-text-lg)`
- `font-size: 0.9rem` (description) → `var(--tng-text-body)`
- Card link `:focus-visible outline` → `box-shadow: var(--tng-focus-ring)` (or outline if preferred, pick one globally)
- `opacity: 0.65` (link disabled) → `var(--tng-disabled-opacity)`
- `transition: 160ms ease` → `var(--tng-transition-interactive)`

**Dialog** (`tng-dialog.component.css`)
- `border-radius: 1rem` → `var(--tng-dialog-radius, var(--tng-radius-surface))`
- `font-size: 1.1rem` (title), `font-weight: 700` → `var(--tng-text-xl)`, `var(--tng-font-weight-semibold)`
- `font-size: 0.92rem` (description) → `var(--tng-text-body)`
- Dialog close `:focus-visible box-shadow` → `var(--tng-focus-ring)` *(already box-shadow, just token it)*

**Toast** (`tng-toast.component.css`)
- `border-radius: 0.85rem` → `var(--tng-toast-radius, var(--tng-radius-panel))`
- `font-size: 0.83rem` (title), `font-weight: 700` → `var(--tng-text-body)`, `var(--tng-font-weight-semibold)`
- `font-size: 0.79rem` (message) → `var(--tng-text-sm)`
- Toast action/close `:focus-visible outline` → `box-shadow: var(--tng-focus-ring)`, `outline: none`

**Tooltip** (`tng-tooltip.component.css`)
- `border-radius: 0.5rem` → `var(--tng-tooltip-radius, var(--tng-radius-control))`
- `min-height: 2rem` (trigger) → `var(--tng-control-height-sm)`
- Trigger `:focus-visible outline` → `box-shadow: var(--tng-focus-ring)`, `outline: none`
- `font-size: 0.75rem` (content) → `var(--tng-text-xs)`

**Accordion** (`tng-accordion.component.css`)
- `border-radius: 0.75rem` → `var(--tng-accordion-radius, var(--tng-radius-panel))`

**Tabs** (`tng-tabs.component.css`)
- `border-radius: 0.75rem` → `var(--tng-tabs-radius, var(--tng-radius-panel))`

**Tag** (`tng-tag.component.css`)
- `font-size: 0.78rem` → `var(--tng-text-xs)` (tags are compact UI, xs is appropriate)
- Tag close `:focus-visible box-shadow: 0 0 0 2px` → `var(--tng-focus-ring)` (standardise to 3px ring)

**Menu contract** (`menu.css`)
- `--tng-menu-radius: 0.75rem` → `var(--tng-radius-panel, 0.75rem)`
- `--tng-menu-trigger-min-height: 2.75rem` → consider aligning to `var(--tng-control-height-lg)` or `var(--tng-control-height-md)`
- `font-size: 0.875rem` (trigger, item) → `var(--tng-text-body)`
- `0.45` disabled opacity → `var(--tng-disabled-opacity)`
- Transition `150ms cubic-bezier(...)` → keep easing but use `var(--tng-duration-normal)`

---

## Unified Focus Ring Decision

Pick **one** approach library-wide. Recommendation: **box-shadow** (already used by button and form-field) because it works inside borders, respects border-radius automatically, and doesn't expand the layout.

```css
/* Standard focus ring — apply to all interactive controls */
:focus-visible {
  box-shadow: var(--tng-focus-ring);
  outline: none;
}
```

The two components using `outline` (switch, tooltip, toast, card link) switch to the box-shadow pattern.

---

## Unified Disabled Opacity

Standardise to `--tng-disabled-opacity: 0.55`. Current values range from 0.45 to 0.65 — pick the midpoint that renders clearly disabled without being invisible. Update all six occurrences.

---

## Aligned Control Heights

After changes, the md size of buttons, form fields, and other interactive controls will all be `2.5rem`. This ensures a button placed beside an input field sits flush.

| Size | Token | Value |
|---|---|---|
| sm | `--tng-control-height-sm` | `2rem` |
| md | `--tng-control-height-md` | `2.5rem` |
| lg | `--tng-control-height-lg` | `3rem` |

> Form field currently defaults to `2.625rem` — this changes to `2.5rem` to match buttons. Verify visually that the extra `0.125rem` removed does not look cramped for outlined form fields.

---

## Implementation Order

1. **`radius.ts`** — update primitive scale
2. **`shared/controls.css`** — create + add to `index.css` as first import
3. **Form-field contract** — update to use shared tokens (quick win, already exists)
4. **Menu contract** — update to use shared tokens (already well-structured)
5. **New contracts** (button, checkbox, switch, tag, tooltip, card, accordion, tabs, dialog, popover, toast)
6. **Component CSS files** — update one category at a time:
   - Utility (button, tag, tooltip)
   - Form (checkbox, switch)
   - Layout (card, accordion, tabs)
   - Overlay (dialog, popover, toast)

Each step can be done independently and verified in the docs playground without breaking anything already working.

---

## What Is Not Changing

- The semantic token names (`--tng-semantic-*`) — no breaking changes for existing theme overrides
- The component API (inputs, signals, outputs) — purely CSS
- The theme contract system itself — only extending it
- Dark mode tokens — semantic tokens are already split by mode; shared control tokens are mode-independent

---

## Files to Create

```
libs/tailng-ui/theme/src/lib/component-contracts/shared/controls.css
libs/tailng-ui/theme/src/lib/component-contracts/utility/button.css
libs/tailng-ui/theme/src/lib/component-contracts/utility/tag.css
libs/tailng-ui/theme/src/lib/component-contracts/utility/tooltip.css
libs/tailng-ui/theme/src/lib/component-contracts/form/checkbox.css
libs/tailng-ui/theme/src/lib/component-contracts/form/switch.css
libs/tailng-ui/theme/src/lib/component-contracts/layout/card.css
libs/tailng-ui/theme/src/lib/component-contracts/layout/accordion.css
libs/tailng-ui/theme/src/lib/component-contracts/layout/tabs.css
libs/tailng-ui/theme/src/lib/component-contracts/overlay/dialog.css
libs/tailng-ui/theme/src/lib/component-contracts/overlay/popover.css
libs/tailng-ui/theme/src/lib/component-contracts/feedback/toast.css
```

## Files to Modify

```
libs/tailng-ui/theme/src/lib/tokens/primitives/radius.ts
libs/tailng-ui/theme/src/lib/component-contracts/index.css
libs/tailng-ui/theme/src/lib/component-contracts/form/form-field.css
libs/tailng-ui/theme/src/lib/component-contracts/navigation/menu.css
libs/tailng-ui/components/src/lib/utility/button/tng-button.component.css
libs/tailng-ui/components/src/lib/utility/tag/tng-tag.component.css
libs/tailng-ui/components/src/lib/overlay/tooltip/tng-tooltip.component.css
libs/tailng-ui/components/src/lib/form/checkbox/tng-checkbox.component.css
libs/tailng-ui/components/src/lib/form/switch/tng-switch.component.css
libs/tailng-ui/components/src/lib/form/select/tng-select.component.css
libs/tailng-ui/components/src/lib/layout/card/tng-card.component.css
libs/tailng-ui/components/src/lib/layout/accordion/tng-accordion.component.css
libs/tailng-ui/components/src/lib/navigation/tabs/tng-tabs.component.css
libs/tailng-ui/components/src/lib/overlay/dialog/tng-dialog.component.css
libs/tailng-ui/components/src/lib/overlay/popover/tng-popover.component.css
libs/tailng-ui/components/src/lib/feedback/toast/tng-toast.component.css
```
