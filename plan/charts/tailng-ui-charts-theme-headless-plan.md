# @tailng-ui/charts — Theme Architecture & Headless ECharts Plan

## Objective

Build a modern charting package for:

```txt
@tailng-ui/charts
```

using:
- Apache ECharts v6
- TailNG theme variables
- Angular signals
- standalone components
- Canvas as default renderer
- semi-headless architecture

---

# Core Architecture

```txt
TailNG Theme Variables
        ↓
Theme Resolver
        ↓
ECharts Option/Theme Generator
        ↓
Canvas/SVG Rendering via Apache ECharts
```

---

# Rendering Strategy

## Default Renderer

```txt
canvas
```

Reason:
- better dashboard performance
- avoids SVG DOM explosion
- supports 10–12 charts efficiently
- better for large datasets

## SVG Support

Keep as opt-in only:

```html
<tng-line-chart renderer="svg" />
```

SVG should NOT be default.

---

# Theme Ownership

TailNG owns the theme system.

ECharts should adapt to TailNG.

Do NOT:
- ship static ECharts themes
- expose ECharts themes publicly
- require users to learn ECharts theming

Instead:

```txt
TailNG CSS variables
        ↓
Theme resolver
        ↓
Generated ECharts theme
```

---

# Theme Token Strategy

## Use Existing TailNG Theme Variables

Expected CSS variables:

```css
:root {
  --color-primary: #2563eb;
  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-danger: #dc2626;
  --color-info: #0891b2;

  --color-fg: #111827;
  --color-muted: #6b7280;

  --color-border: #d1d5db;
  --color-surface: #ffffff;
}
```

---

# Theme Resolver

## Create

```txt
core/chart-theme.ts
```

Responsibilities:
- read TailNG CSS variables
- provide fallbacks
- generate semantic chart palette
- expose normalized chart theme object

---

# Theme Model

## Create

```txt
core/chart-theme.model.ts
```

## Interface

```ts
export interface TngResolvedChartTheme {
  palette: string[];

  textColor: string;
  mutedTextColor: string;

  borderColor: string;
  surfaceColor: string;

  axisLineColor: string;
  axisLabelColor: string;
  gridLineColor: string;

  tooltipBackgroundColor: string;
  tooltipBorderColor: string;

  heatmapLowColor: string;
  heatmapMidColor: string;
  heatmapHighColor: string;
}
```

---

# CSS Variable Reader

## Create

```txt
core/read-chart-css-vars.ts
```

Responsibilities:
- use getComputedStyle
- read CSS variables
- trim values
- fallback safely
- avoid repeated DOM reads where possible

---

# ECharts Theme Mapping

## Create

```txt
echarts/echarts-theme.ts
```

Responsibilities:
- map TailNG chart theme into ECharts colors
- axis styling
- tooltip styling
- split line styling
- visualMap colors

---

# Heatmap Theme Strategy

Use TailNG semantic palette:

```ts
visualMap: {
  inRange: {
    color: [
      theme.heatmapLowColor,
      theme.heatmapMidColor,
      theme.heatmapHighColor,
    ],
  },
}
```

Do NOT hardcode ECharts demo palettes.

---

# Semi-Headless Architecture

TailNG should own:
- state
- composition
- themes
- legend
- loading state
- empty state
- event normalization

ECharts should own:
- rendering
- animation
- hit testing
- canvas/svg drawing

---

# New Components

## TngChartRootComponent

Responsibilities:
- own chart state
- own visible series state
- generate chart option
- provide chart context
- expose computed signals

Do NOT initialize ECharts here.

---

## TngChartSurfaceComponent

Responsibilities:
- initialize ECharts
- render ECharts option
- resize handling
- event forwarding
- cleanup/dispose

This component should remain low-level.

---

## TngChartLegendComponent

Responsibilities:
- TailNG UI legend
- series visibility toggle
- hidden state visualization
- keyboard accessibility

Do NOT use built-in ECharts legend when TailNG legend is enabled.

---

# Context Token Pattern

## Create

```txt
core/chart-context.ts
```

Responsibilities:
- provide option signal
- provide legend items signal
- provide visible series APIs
- avoid prop drilling

---

# Example Composition

```html
<tng-chart-root>
  <tng-chart-toolbar />
  <tng-chart-surface />
  <tng-chart-legend />
</tng-chart-root>
```

---

# Folder Structure

```txt
charts/src/lib/
├── core/
│   ├── chart.types.ts
│   ├── chart-context.ts
│   ├── chart-theme.ts
│   ├── chart-theme.model.ts
│   ├── read-chart-css-vars.ts
│   └── chart-events.ts
│
├── echarts/
│   ├── echarts.loader.ts
│   ├── echarts-theme.ts
│   ├── echarts-option.ts
│   ├── echarts-engine.service.ts
│   └── echarts-event-adapter.ts
│
├── components/
│   ├── chart/
│   ├── chart-root/
│   ├── chart-surface/
│   ├── legend/
│   ├── empty-state/
│   └── loading-state/
│
├── series/
│   ├── line/
│   ├── area/
│   ├── bar/
│   ├── pie/
│   ├── scatter/
│   └── heatmap/
│
└── index.ts
```

---

# ECharts Isolation

Only:

```txt
echarts/
```

should directly import Apache ECharts.

Avoid ECharts imports inside:
- series/
- core/

---

# Public API Philosophy

## DO

- expose TailNG APIs
- expose typed inputs
- expose semantic chart configuration
- expose optionOverride

## DO NOT

- expose raw ECharts option as primary API
- expose ECharts internals publicly
- tightly couple API to ECharts terminology

---

# Recommended Public API

```html
<tng-line-chart
  [data]="sales()"
  xField="month"
  yField="revenue"
  [smooth]="true"
  [tooltip]="true"
/>
```

NOT:

```html
<tng-chart [option]="massiveRawEchartsObject" />
```

---

# Escape Hatch

Keep:

```ts
optionOverride
```

Purpose:
- advanced customization
- last-mile control
- avoid API explosion

---

# Test Cases

## Theme Tests

- [x] Theme resolver should read --color-primary
- [x] Theme resolver should read --color-success
- [x] Theme resolver should read --color-warning
- [x] Theme resolver should read --color-danger
- [x] Theme resolver should read --color-info
- [x] Theme resolver should read --color-fg
- [x] Theme resolver should read --color-muted
- [x] Theme resolver should read --color-border
- [x] Theme resolver should read --color-surface
- [x] Theme resolver should fallback safely when CSS variables are missing
- [x] ECharts theme should use TailNG palette
- [x] Axis labels should use TailNG muted color
- [x] Grid lines should use TailNG border color
- [x] Tooltip background should use TailNG surface color
- [x] Heatmap visualMap should use TailNG heatmap colors
- [x] Theme switching should update chart colors correctly
- [ ] Light and dark themes should render correctly

## Headless Architecture Tests

- [x] TngChartRootComponent should provide chart context
- [x] TngChartRootComponent should expose computed legend items
- [x] TngChartRootComponent should expose generated option signal
- [x] TngChartRootComponent should manage visible series state
- [x] TngChartSurfaceComponent should consume chart context
- [x] TngChartSurfaceComponent should render computed option
- [x] TngChartLegendComponent should toggle visible series
- [x] External legend should update chart without recreating chart instance

## Renderer Tests

- [x] Canvas renderer should remain default
- [x] SVG renderer should remain opt-in
- [ ] SVG renderer should still support TailNG themes
- [ ] Renderer switch should recreate ECharts instance safely

## Performance Tests

- [ ] Dashboard with 10 charts should initialize efficiently
- [ ] Multiple chart instances should not duplicate ECharts registration
- [ ] Large datasets should avoid excessive array allocations
- [x] Resize handling should avoid excessive resize calls
- [x] Updating legend visibility should not recreate ECharts instance
- [x] Updating theme should not recreate ECharts instance unnecessarily

---

# Final Notes for Codex

- Keep implementation incremental.
- Keep implementation signal-first.
- Keep implementation typed.
- Prefer composition over inheritance.
- Prefer small utilities over abstractions.
- Prefer TailNG-owned APIs.
- Prefer ECharts isolation.
- Keep Canvas as default renderer.
- Keep SVG optional.
- Use TailNG CSS variables as the source of truth.
- Avoid static ECharts themes.
