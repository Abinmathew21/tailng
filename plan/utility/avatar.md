# Avatar

Headless avatar primitive for user or entity identity display (image with fallback).

## Overview

Avatar is a headless utility that displays a circular (or rounded) image with a fallback when the image is missing or loading. Fallback can be initials or an icon. It is used in headers, lists, comments, and profile cards. Optional size and shape (circle vs. rounded square) are supported. Composes with badge for status indicator.

This component should expose structure (root, image, fallback) and optional size/shape for styling while leaving visuals to the consumer.

## Supported states

- Image loaded / loading / error (fallback shown)
- Size: sm | md | lg (or custom)
- Shape: circle | rounded (or square)
- Fallback visible when no image or on error

## Common use cases

- User profile picture in header or list
- Entity or team avatar
- Fallback: initials or icon when no image
- Optional size and shape
- Composes with badge for status (e.g. online indicator)

## Headless component goals

- Provide structure: root, image, fallback
- Support image source with load/error handling (fallback on error or when no src)
- Support accessible alt text or initials for fallback
- Expose size and shape for styling (data-size, data-shape)
- No interactive behavior unless composed with link/button

## Required headless features

### Core behavior

- Avatar root (container; often span or div)
- Avatar image (img with src, alt; optional loading/error handling)
- Avatar fallback (shown when image not available or failed; initials or icon)
- Optional: size and shape inputs for data attributes
- Image load: show image; image error or no src: show fallback (and optionally hide image)

### Accessibility

- Image: meaningful alt text when image is content (e.g. user name); alt="" when decorative
- Fallback: when fallback is initials or text, ensure readable and sufficient contrast
- When avatar is link/button, use aria-label or visible text for accessible name
- Optional: role="img" on root with aria-label when avatar represents entity and no img alt

### Composition

- Avatar root
- Avatar image (img)
- Avatar fallback (span or div with initials/icon)
- Composes with badge directive for status overlay

### State exposure

- data-slot (avatar, avatar-image, avatar-fallback)
- data-size (sm, md, lg or custom)
- data-shape (circle, rounded)
- Optional: data-state (loaded, loading, error) for styling fallback vs. image

## Suggested primitives / parts

- `AvatarRoot` (e.g. tngAvatar)
- `AvatarImage` (e.g. img[tngAvatarImage])
- `AvatarFallback` (e.g. tngAvatarFallback)

## Suggested APIs

### Avatar root

- `size?: 'sm' | 'md' | 'lg'` or custom
- `shape?: 'circle' | 'rounded'`
- Structural; may hold loading/error state for image

### Avatar image

- `src?: string`, `alt?: string`
- Optional: loading strategy (eager, lazy)
- On load: hide fallback; on error: show fallback
- Optional: referrerPolicy, loading

### Avatar fallback

- Content projected: initials or icon
- Shown when image not present or on error
- Optional: delay before showing fallback (avoid flash for fast loads)

### Angular API contract (required)

- tngAvatar: inputs size, shape; data-slot and data-size, data-shape for styling
- tngAvatarImage: src, alt; load/error handling to coordinate with fallback
- tngAvatarFallback: content projection; visibility from root/image state
- Component (tng-avatar) may own image load state and pass to primitives

## Keyboard interaction

- None unless avatar is wrapped in button/link; then Tab to focus, Enter/Space to activate.

## Accessibility notes

- Prefer alt text on image when it conveys identity; use alt="" when avatar is decorative and context is provided elsewhere
- Fallback initials should be readable (contrast, font size)
- If avatar is the only indicator of user, ensure accessible name (aria-label or visible text)

## Open design decisions

- Whether fallback delay is configurable (avoid flash)
- Initials generation: in primitive vs. consumer (e.g. from name input)
- Role on root: only when avatar is standalone meaningful image (role="img" + aria-label)

## Test checklist

### Rendering

- [ ] Renders root with data-slot and data-size, data-shape
- [ ] Renders image when src provided and loaded
- [ ] Renders fallback when no src or image error
- [ ] Hides fallback when image loads successfully
- [ ] Applies data-slot on image and fallback

### Accessibility

- [ ] Image has alt (or alt="" when decorative)
- [ ] Fallback has sufficient contrast when visible
- [ ] When avatar is focusable, has accessible name

### Data attributes

- [ ] Applies data-slot, data-size, data-shape
- [ ] Optional data-state for loaded/loading/error

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-avatar>` component created in `components`
6. [ ] Test cases created for `<tng-avatar>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add avatar`)
14. [ ] `tailng-cli` command generation added for avatar artifacts
15. [ ] CLI integration tests added for `tailng add avatar`

## Links

- Playground: `/avatar`
