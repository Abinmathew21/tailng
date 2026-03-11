# Card

Headless card primitive for grouped content with optional header, body, footer, and media.

## Overview

Card is a headless layout container that groups content into logical sections: header (with optional title and description), main content, footer, and optional media (image or other). It is used for content blocks, list items, dashboards, and product tiles. Styling (outline, filled, elevated, padding, interactive state) is left to the consumer or styled components.

This component exposes structure and slots only; it has no interactive behavior unless composed with buttons or links.

## Supported states

- Structural only: presence of header, content, footer, media, actions, divider, link
- Optional: interactive state (hover/focus) when card or card link is focusable

## Common use cases

- Content blocks with title and description
- Product or list item tiles
- Dashboard widgets
- Composing with button, link, or list inside
- Cards with optional image/media and actions

## Headless component goals

- Provide clear section structure (header, content, footer, media)
- Support optional title, description, actions, divider, and link slots
- Expose data attributes for styling variants
- Compose with interactive elements (button, link) inside

## Required headless features

### Core behavior

- Root container (e.g. `tngCard`)
- Optional sections: header, title, description, content, footer, media, actions, divider, link
- No built-in interaction; composition with focusable children as needed

### Accessibility

- Semantic HTML where appropriate (e.g. `<article>`, `<header>`, `<footer>`, `<section>`)
- Card link (if present) should be focusable and keyboard activatable
- Ensure heading hierarchy (e.g. card title as heading level consistent with page)

### Composition

- Card root
- Card header, title, description
- Card content, footer, media, actions, divider, link
- Composes with button, link, list, or custom content

### State exposure

- `data-slot` or similar for each part (card, card-header, card-title, card-description, card-content, card-footer, card-media, card-actions, card-divider, card-link)

## Suggested primitives / parts

- `CardRoot` (e.g. `tngCard`)
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`
- `CardMedia`
- `CardActions`
- `CardDivider`
- `CardLink` (optional; for entire-card link)

## Suggested APIs

### Card root

- `id?: string`
- No state inputs; structure only

### Section parts

- Each part is a structural directive with optional inputs (e.g. `align` for actions)
- Card link: `href`, `target`, etc. (or routerLink when used with Angular)

### Angular API contract (required)

- `tngCard` and section directives expose Angular-style bindings where applicable (e.g. `tngCardActions` with `align` input)
- Card link should support `routerLink` / `href` and accessibility

## Keyboard interaction

- No direct keyboard behavior on card root
- Focusable children (buttons, card link) receive focus via Tab; Enter/Space activate as per element type

## Accessibility notes

- Use landmark or semantic elements as appropriate (article, section, header, footer)
- Card title should be a heading (e.g. h2/h3) or have appropriate aria for context
- If the whole card is clickable, use a single focusable link or button and ensure focus indicator is visible

## Open design decisions

- Whether card link is a primitive or consumer-composed
- Default element for root (div vs. article)
- Whether to support `data-variant` or similar for outline/filled/elevated (styling only)

## Test checklist

### Rendering

- [ ] Renders card root with correct element/semantics
- [ ] Renders header, title, description when used
- [ ] Renders content and footer when used
- [ ] Renders media and actions when used
- [ ] Renders divider and link when used
- [ ] Applies data-slot (or equivalent) for each part

### Accessibility

- [ ] Card root uses appropriate semantic element
- [ ] Card title has correct heading level or aria
- [ ] Card link is focusable and keyboard activatable when present

### Data attributes

- [ ] Applies expected data attributes for styling (e.g. data-slot per part)

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-card>` component created in `components`
6. [ ] Test cases created for `<tng-card>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add card`)
14. [ ] `tailng-cli` command generation added for card artifacts
15. [ ] CLI integration tests added for `tailng add card`

## Links

- Playground: `/card`
