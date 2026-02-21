# TailNG Angular ARIA Wrapper Plan

## 0. Naming Decisions

1. Use `plain-css` in user-facing names/docs (`playground-plain-css`) instead of `vanilla`.

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

## 6. Deduplicated Component Status and Phased Roadmap

### 6.1 Available Now in TailNG

- [x] Accordion
- [x] Autocomplete
- [x] Avatar
- [x] Badge
- [x] Bottom Sheet
- [x] Breadcrumb
- [x] Button
- [x] Button Toggle
- [x] Card
- [x] Checkbox
- [x] Chips
- [x] Collapsible
- [x] Combobox
- [x] Context Menu
- [x] Dialog
- [x] Drawer / Sheet
- [x] Dropdown Menu
- [x] Empty
- [x] Grid
- [x] Icon
- [x] Input
- [x] Input OTP
- [x] Label
- [x] Menu
- [x] Menubar
- [x] Multiselect
- [x] Navigation Menu
- [x] Popover
- [x] Progress Bar
- [x] Progress Spinner
- [x] Radio Button
- [x] Select
- [x] Separator
- [x] Skeleton
- [x] Slider
- [x] Stepper
- [x] Switch
- [x] Tabs
- [x] Textarea
- [x] Toggle Group
- [x] Toolbar
- [x] Tree

### 6.2 Need to Develop

- [ ] Alert
- [ ] Alert Dialog
- [ ] Aspect Ratio
- [ ] Calendar
- [ ] Carousel
- [ ] Command
- [ ] Data Table
- [ ] Date Picker
- [ ] Field / Form Field
- [ ] Form
- [ ] Grid List
- [ ] Hover Card
- [ ] Input Group
- [ ] Item
- [ ] Kbd
- [ ] List
- [ ] Listbox
- [ ] Pagination / Paginator
- [ ] Radio Group
- [ ] Resizable
- [ ] Scroll Area
- [ ] Sidenav / Sidebar
- [ ] Slide Toggle
- [ ] Sort Header
- [ ] Table
- [ ] Timepicker
- [ ] Toast (Snackbar / Sonner)
- [ ] Toggle (standalone)
- [ ] Tooltip

### 6.3 Phase Plan (P0 / P1 / P2)

#### P0 (foundation and high re-use)

- [ ] Listbox
- [ ] Tooltip
- [ ] Table
- [ ] Data Table
- [ ] Pagination / Paginator
- [ ] Field / Form Field
- [ ] Input Group
- [ ] Radio Group
- [ ] Slide Toggle
- [ ] Sidenav / Sidebar
- [ ] Toast (Snackbar / Sonner)
- [ ] Copy Button

#### P1 (form and date/time productivity)

- [ ] Alert
- [ ] Alert Dialog
- [ ] Date Picker
- [ ] Timepicker
- [ ] Calendar
- [ ] Command
- [ ] Scroll Area
- [ ] Resizable
- [ ] Toggle (standalone)

#### P2 (layout and enhancement patterns)

- [ ] Aspect Ratio
- [ ] Carousel
- [ ] Grid List
- [ ] Hover Card
- [ ] Item
- [ ] Kbd
- [ ] List
- [ ] Sort Header
- [ ] Form

## 7. Copy Component Plan

### 7.1 APIs (primitive + wrapper)

- Primitive directive: `[tngCopy]`
- Wrapper component: `<tng-copy-button>`
- Inputs:
  - `tngCopyText` (direct source text)
  - `tngCopyFrom` (read text from target element/reference)
  - `tngCopyIgnoreSelectors` (exclude DOM parts like line numbers)
- Outputs:
  - `tngCopied`
  - `tngCopyError`

### 7.2 Code Block Copy Rules (line numbers)

1. Preferred strategy: use source-of-truth text via `tngCopyText` (raw code string without line numbers).
2. Fallback strategy: use `tngCopyFrom` + `tngCopyIgnoreSelectors` to clone DOM, remove ignored nodes, and copy cleaned `textContent`.
