# @tailng-ui/charts — Codex Agent Update Plan

## Current Status

The following are already implemented and passing:

- Folder/public API structure
- ECharts loader setup
- Base chart component lifecycle
- Canvas/SVG renderer support
- Line/Bar/Area/Pie/Scatter/Heatmap charts
- Theme resolver
- External legend
- Empty/loading states
- Option override support
- Event adapter normalization
- Accessibility baseline
- Core performance baseline
- Build/lint/test pipeline

The remaining work should focus on:

1. Finishing pending tests
2. Hardening architecture
3. Introducing semi-headless chart composition
4. Improving performance safety
5. Tightening ECharts isolation
6. Preventing long-term technical debt

---

# High Priority Tasks

## 1. Finish Remaining Pending Tests

### Line Chart Tests

- [x] `tng-line-chart` should require `xField` input

### Bar Chart Tests

- [x] `tng-bar-chart` should require `xField` input

### Pie Chart Tests

- [x] `tng-pie-chart` should require `nameField` input
- [x] `tng-pie-chart` should require `valueField` input

### Option Override Tests

- [x] Errors inside `optionOverride` should be handled or surfaced clearly

### Performance Tests

- [x] Large line dataset should still generate option without excessive transformation cost
- [x] Large scatter dataset should still generate option without excessive transformation cost
- [x] Resize events should be throttled or safely handled if needed

### Build and Lint Tests

- [x] Internal ECharts-specific types should stay inside `echarts/` where possible
- [x] No circular imports should be introduced

---

# New Architecture Work

## Goal

Move `@tailng-ui/charts` toward a semi-headless architecture while keeping ECharts as the rendering backbone.

The architecture should become:

```txt
Headless state + composition
        ↓
TailNG chart surface
        ↓
Apache ECharts renderer
```

The goal is NOT to build a full chart engine.

The goal IS:
- TailNG-owned APIs
- TailNG-owned composition
- TailNG-owned state
- TailNG-owned legend/toolbars
- ECharts isolated internally

---

# New Folder Structure Direction

Current structure is acceptable.

Refine toward:

```txt
charts/src/lib/
├── core/
│   ├── chart.types.ts
│   ├── chart.tokens.ts
│   ├── chart.utils.ts
│   ├── chart-theme.ts
│   ├── chart-context.ts
│   └── chart-events.ts
│
├── echarts/
│   ├── echarts.loader.ts
│   ├── echarts.types.ts
│   ├── echarts-option.ts
│   ├── echarts-theme.ts
│   ├── echarts-event-adapter.ts
│   └── echarts-engine.service.ts
│
├── components/
│   ├── chart/
│   ├── legend/
│   ├── empty-state/
│   ├── loading-state/
│   ├── chart-root/
│   └── chart-surface/
│
├── series/
│   ├── line/
│   ├── bar/
│   ├── area/
│   ├── pie/
│   ├── scatter/
│   └── heatmap/
│
└── index.ts
```

---

# Semi-Headless Architecture

## New Components

### `TngChartRootComponent`

Responsibilities:
- Own chart state
- Own visible series state
- Own legend state
- Own option generation
- Provide chart context
- Coordinate child components

### `TngChartSurfaceComponent`

Responsibilities:
- Initialize ECharts
- Render ECharts option
- Resize handling
- Event forwarding
- Dispose ECharts instance

This component should remain low-level and isolated.

### `TngChartLegendComponent`

Responsibilities:
- Render TailNG legend UI
- Toggle visible series
- Reflect hidden state
- Stay independent from ECharts legend

---

# Context Token Pattern

Introduce:

```ts
TNG_CHART_CONTEXT
```

Purpose:
- Headless composition
- Shared chart state
- Avoid prop drilling
- Enable future toolbar/tooltip components

Example architecture:

```html
<tng-chart-root>
  <tng-chart-toolbar />
  <tng-chart-surface />
  <tng-chart-legend />
</tng-chart-root>
```

---

# Codex Implementation Tasks

## 1. Create Chart Context

Create:

```txt
core/chart-context.ts
```

Include:
- `TNG_CHART_CONTEXT`
- chart context interface
- visible series APIs
- option signal
- legend items signal

---

## 2. Create `TngChartRootComponent`

Create:

```txt
components/chart-root/
```

Responsibilities:
- manage visible series
- compute generated option
- provide chart context
- own computed signals

Use:
- Angular signals
- `computed`
- `signal`
- `input.required`

Do NOT:
- initialize ECharts here

---

## 3. Create `TngChartSurfaceComponent`

Create:

```txt
components/chart-surface/
```

Responsibilities:
- ECharts init
- ResizeObserver
- setOption
- renderer handling
- event binding
- cleanup

Use:
- Canvas as default renderer
- SVG opt-in only

---

## 4. Move ECharts Logic into `echarts/`

Codex should ensure:
- no ECharts imports inside `series/`
- no ECharts imports inside `core/`

Only:
```txt
echarts/
```

should contain direct ECharts usage.

---

## 5. Introduce Option Factory Separation

Create:

```txt
echarts/echarts-option.ts
```

Responsibilities:
- generate base ECharts option
- apply theme
- apply tooltip config
- apply legend config
- apply axis config

Goal:
- avoid duplicated option generation inside chart components

---

## 6. Add Performance Hardening

### Resize Handling

Implement:
- resize throttling
OR
- requestAnimationFrame scheduling

Avoid:
- unbounded ResizeObserver resize loops

### Large Dataset Safety

Ensure:
- no unnecessary `.map()` duplication
- avoid repeated array recreation
- avoid deep cloning options

Large datasets:
- 10k+ line points
- 10k+ scatter points

should remain reasonably performant.

---

## 7. Improve Option Override Safety

Codex should:
- wrap `optionOverride` in try/catch
- surface useful error
OR
- fail safely

Do NOT silently swallow errors.

---

## 8. Add Circular Dependency Safety

Codex should:
- verify no circular imports
- keep `core/` independent
- keep `series/` depending only on:
  - core
  - components
  - echarts option factories

---

# New Test Cases

## Headless Architecture Tests

- [x] `TngChartRootComponent` should provide `TNG_CHART_CONTEXT`
- [x] `TngChartRootComponent` should expose computed legend items
- [x] `TngChartRootComponent` should expose generated option signal
- [x] `TngChartRootComponent` should toggle visible series correctly
- [x] `TngChartSurfaceComponent` should consume `TNG_CHART_CONTEXT`
- [x] `TngChartSurfaceComponent` should render computed option
- [x] `TngChartLegendComponent` should update visible series through chart context
- [x] External legend should update chart without recreating ECharts instance

## ECharts Isolation Tests

- [x] `series/` folder should not directly import from `echarts`
- [x] `core/` folder should not directly import from `echarts`
- [x] only `echarts/` folder should contain direct ECharts imports

## Performance Safety Tests

- [x] ResizeObserver callback should not trigger excessive resize calls
- [x] Updating legend visibility should not recreate ECharts instance
- [ ] Large datasets should not allocate excessive intermediate arrays
- [ ] Chart updates should reuse option structure where practical

## Renderer Stability Tests

- [ ] Renderer switching should fully dispose previous ECharts instance
- [ ] Canvas renderer should remain default across all chart wrappers
- [ ] SVG renderer should still support theme resolution

---

# Important Constraints

## Do NOT Do These

- [ ] Do not expose raw ECharts option as primary API
- [ ] Do not build giant chart abstraction layer
- [ ] Do not create inheritance-heavy architecture
- [ ] Do not expose ECharts internals publicly
- [ ] Do not tightly couple legend UI to ECharts built-in legend
- [ ] Do not make SVG default
- [ ] Do not deep clone large datasets unnecessarily

---

# Architectural Direction

The target architecture is:

```txt
TailNG owns:
- APIs
- state
- composition
- legend
- loading
- empty state
- themes
- event normalization

Apache ECharts owns:
- rendering
- animation
- hit testing
- canvas/svg drawing
```

This is the intended long-term direction for:

```txt
@tailng-ui/charts
```

---

# Final Notes for Codex

- Keep implementation incremental.
- Keep implementation typed.
- Keep implementation signal-first.
- Prefer composition over inheritance.
- Prefer small utilities over giant abstractions.
- Prefer ECharts isolation.
- Prefer TailNG-owned APIs.
- Keep Canvas as default.
- Keep SVG optional.
- Keep Tailwind/theme-token integration clean.
