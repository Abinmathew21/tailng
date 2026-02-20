# TailNG Angular ARIA Wrapper Plan

## 1. Public Import Contract

| Component | Unstyled (npm) | Styled (npm) | Registry CLI |
|---|---|---|---|
| Accordion | `@tailng-ui/primitives` (`TngAccordion`, `TngAccordionItem`, `TngAccordionTrigger`, `TngAccordionContent`) | `@tailng-ui/components` (same names) | `npx tailng add accordion` |
| Autocomplete | `@tailng-ui/primitives` (`TngAutocomplete`, `TngAutocompleteInput`, `TngAutocompletePanel`, `TngAutocompleteOption`) | `@tailng-ui/components` | `npx tailng add autocomplete` |
| Combobox | `@tailng-ui/primitives` (`TngCombobox`, `TngComboboxInput`, `TngComboboxPanel`, `TngComboboxOption`) | `@tailng-ui/components` | `npx tailng add combobox` |
| Grid | `@tailng-ui/primitives` (`TngGrid`, `TngGridRow`, `TngGridCell`) | `@tailng-ui/components` | `npx tailng add grid` |
| Listbox | `@tailng-ui/primitives` (`TngListbox`, `TngListboxOption`) | `@tailng-ui/components` | `npx tailng add listbox` |
| Menu | `@tailng-ui/primitives` (`TngMenu`, `TngMenuTrigger`, `TngMenuItem`) | `@tailng-ui/components` | `npx tailng add menu` |
| Menubar | `@tailng-ui/primitives` (`TngMenubar`, `TngMenubarItem`, `TngMenubarTrigger`) | `@tailng-ui/components` | `npx tailng add menubar` |
| Multiselect | `@tailng-ui/primitives` (`TngMultiselect`, `TngMultiselectOption`) | `@tailng-ui/components` | `npx tailng add multiselect` |
| Select | `@tailng-ui/primitives` (`TngSelect`, `TngSelectTrigger`, `TngSelectOption`) | `@tailng-ui/components` | `npx tailng add select` |
| Tabs | `@tailng-ui/primitives` (`TngTabs`, `TngTabList`, `TngTab`, `TngTabPanel`) | `@tailng-ui/components` | `npx tailng add tabs` |
| Toolbar | `@tailng-ui/primitives` (`TngToolbar`, `TngToolbarItem`) | `@tailng-ui/components` | `npx tailng add toolbar` |
| Tree | `@tailng-ui/primitives` (`TngTree`, `TngTreeItem`) | `@tailng-ui/components` | `npx tailng add tree` |

## 2. Internal Structure (per component)

- Primitives source: `/Users/prince/Tociva/Projects/tailng/tailng3/tailng3/libs/tailng-ui/primitives/src/lib/<component>/`
- Components source: `/Users/prince/Tociva/Projects/tailng/tailng3/tailng3/libs/tailng-ui/components/src/lib/<component>/`
- Registry source templates: `/Users/prince/Tociva/Projects/tailng/tailng3/tailng3/libs/tailng-ui/registry/src/lib/<component>/`
- CLI wiring: `/Users/prince/Tociva/Projects/tailng/tailng3/tailng3/libs/tailng/cli/src/`
- Barrel exports:
  - `/Users/prince/Tociva/Projects/tailng/tailng3/tailng3/libs/tailng-ui/primitives/src/index.ts`
  - `/Users/prince/Tociva/Projects/tailng/tailng3/tailng3/libs/tailng-ui/components/src/index.ts`
  - `/Users/prince/Tociva/Projects/tailng/tailng3/tailng3/libs/tailng-ui/registry/src/index.ts`

## 3. Angular ARIA Adapter Rule

- Each primitive gets one adapter file: `aria-adapter.ts`.
- Only `aria-adapter.ts` imports `@angular/aria` (exact subpaths finalized from package exports).
- Wrapper components never implement keyboard/focus/role logic directly.

## 4. Execution Order

1. Accordion
2. Tabs
3. Menu
4. Toolbar
5. Menubar
6. Listbox
7. Select
8. Combobox
9. Autocomplete
10. Multiselect
11. Grid
12. Tree

## 5. Definition of Done (each component)

1. Primitive wrapper complete (ARIA delegated, no custom a11y engine).
2. Styled component complete (theme hooks + variants only).
3. Registry templates added (`npx tailng add <component>` works).
4. Playground pages added in tailwind + vanilla apps.
5. Tests added for primitives, components, registry, CLI generation.
6. `pnpm lint` and `pnpm test` pass with zero warnings.
