# Codeblock

Headless codeblock primitive for displaying code snippets with optional highlighting and line metadata.

## Overview

Codeblock is a headless utility that displays code snippets with optional syntax highlighting, line numbers, copy button, and configurable language/theme. Highlighting is provided via pluggable adapters (e.g. plain text, Shiki). Optional header (title, language badge, copy button), line-number gutter, and caption are supported. The component exposes structure and slots; actual highlighting is typically delegated to an adapter or service (e.g. `provideTngCodeHighlighting`).

This component should expose structure (root, header, body, gutter, code) and integration points for adapters while leaving theme and styling to the consumer.

## Supported states

- Structural: presence of header, body, gutter, code
- Optional: line numbers on/off, word wrap, language/theme (from adapter)
- Copy: delegated to copy button when present
- Loading/error state for async highlighting (if in scope)

## Common use cases

- Documentation code examples
- README or blog code snippets
- Optional header (title, language badge, copy button)
- Line numbers and caption
- Pluggable highlighter (plain, Shiki, or custom adapter)

## Headless component goals

- Provide clear structure: root, header, body, gutter (line numbers), code
- Support optional header with title, language badge, copy button slot
- Support line-number gutter (aria-hidden when decorative)
- Expose data attributes for styling and adapter integration
- Integrate with code highlighting adapter API (language, theme, highlighted output)
- Optional: line metadata (e.g. highlighted lines, line numbers)

## Required headless features

### Core behavior

- CodeBlock root (container)
- CodeBlock header (optional; title, language, copy button)
- CodeBlock body (wraps gutter + code)
- CodeBlock gutter (line numbers; aria-hidden when decorative)
- CodeBlock code (the actual code element or container for highlighted HTML)
- Source string and optional language/theme passed to adapter or component
- No built-in highlighting; adapter provides highlighted content or component uses it

### Accessibility

- Gutter with line numbers: aria-hidden="true" when purely decorative
- Code block: ensure sufficient contrast and optional role="region" with aria-label if needed
- Copy button (when present): accessible label (e.g. "Copy code")
- Optional: announce language for screen readers (e.g. "TypeScript code block")

### Composition

- CodeBlock root, header, body, gutter, code
- Header composes with copy button (tngCopyButton) and optional title/language badge
- Body composes with gutter and code; code may receive innerHTML from highlighter

### State exposure

- data-slot for each part (code-block, code-block-header, code-block-body, code-block-gutter, code-block-code)
- Optional: data-language, data-theme for styling
- Optional: data-line-numbers for gutter visibility

## Suggested primitives / parts

- `CodeBlockRoot` (e.g. tngCodeBlock)
- `CodeBlockHeader` (e.g. tngCodeBlockHeader)
- `CodeBlockBody` (e.g. tngCodeBlockBody)
- `CodeBlockGutter` (e.g. tngCodeBlockGutter)
- `CodeBlockCode` (e.g. tngCodeBlockCode)

## Suggested APIs

### CodeBlock root

- Optional: `language?: string`, `theme?: string` (hints for adapter or styling)
- Optional: `lineNumbers?: boolean`, `wrap?: boolean`
- Structural only in headless; component may hold code string and call adapter

### CodeBlock header

- Structural; slots for title, language badge, copy button

### CodeBlock gutter

- Optional: `ariaHidden?: boolean` (default true for line numbers)
- Line range or count from component/adapter

### CodeBlock code

- Receives highlighted HTML or text from component/adapter
- Optional: language for syntax (e.g. data-language)

### Angular API contract (required)

- tngCodeBlock and parts expose structural directives; component (tng-code-block or similar) holds code input, language, theme, and uses highlighting adapter
- provideTngCodeHighlighting({ adapters, defaultAdapter }) for app-level config
- Copy button in header uses tngCopyButton with text from code payload

## Keyboard interaction

- No direct keyboard behavior on codeblock root
- Copy button: focusable, Enter/Space to copy
- Code content may be focusable for selection (user selects text as usual)

## Accessibility notes

- Line numbers are decorative; use aria-hidden on gutter
- Ensure code contrast meets WCAG; avoid low-contrast themes by default
- If code block has a title, associate with aria-labelledby or caption
- Copy button must have clear accessible name and success/error feedback (e.g. live region or copybutton announce)

## Open design decisions

- Whether line metadata (highlighted lines, diff) is in headless or component only
- Adapter API: sync vs. async highlighting; who owns loading/error state
- Whether codeblock primitive holds code/language or only structure (current: structure only; component holds code + adapter)

## Test checklist

### Rendering

- [ ] Renders root, header, body, gutter, code parts
- [ ] Renders line numbers when configured
- [ ] Renders code content (plain or highlighted from adapter)
- [ ] Applies data-slot for each part
- [ ] Header can contain title, language badge, copy button

### Accessibility

- [ ] Gutter has aria-hidden when line numbers are decorative
- [ ] Copy button has accessible name and feedback
- [ ] Code block has sufficient contrast (or theme configurable)

### Data attributes

- [ ] Applies data-slot on all parts
- [ ] Optional data-language, data-theme when provided

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-code-block>` component created in `components`
6. [ ] Test cases created for `<tng-code-block>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add code-block`)
14. [ ] `tailng-cli` command generation added for code-block artifacts
15. [ ] CLI integration tests added for `tailng add code-block`

## Links

- Docs route: `/components/utility/codeblock`
- Playground: `/codeblock` (if present)
