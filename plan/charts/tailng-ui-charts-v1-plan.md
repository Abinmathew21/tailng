# @tailng-ui/charts v1 Implementation Plan

## Goal

Build `@tailng-ui/charts` as a semi-headless Angular chart package using **Apache ECharts** as the rendering engine.

Initial v1 chart scope:

```txt
line, bar, area, pie, scatter, heatmap
```

Primary goals:

- Canvas-first performance for dashboards with 10–12 charts
- Angular signals-first APIs
- TailNG-owned public API, not raw ECharts passthrough
- Tailwind/TailNG styling for shell, legend, toolbar, empty/loading states
- TailNG CSS variables mapped into ECharts theme/options
- ECharts kept inside an adapter layer
- `optionOverride` escape hatch for advanced users

---

## Renderer Decision

Use **Canvas by default**.

```ts
export type TngChartRenderer = 'canvas' | 'svg';

readonly renderer = input<TngChartRenderer>('canvas');
```

Why:

- Better for dashboards with many charts
- Better for large datasets
- Better for animations, zoom/pan, live updates
- Avoids SVG DOM node explosion

SVG should be allowed as an opt-in:

```html
<tng-line-chart renderer="svg" />
```

Use SVG only for small/simple/static charts, print/export-focused charts, or DOM-inspection needs.

---

## Current Folder Structure

Current structure:

```txt
libs/tailng-ui/charts/
├── src/
│   ├── lib/
│   │   ├── series/
│   │   │   ├── bar/
│   │   │   ├── line/
│   │   │   └── pie/
│   │   ├── chart.types.ts
│   │   ├── echarts.loader.ts
│   │   ├── echarts.loader.spec.ts
│   │   ├── tng-chart.component.css
│   │   ├── tng-chart.component.html
│   │   ├── tng-chart.component.spec.ts
│   │   └── tng-chart.component.ts
│   └── index.ts
├── package.json
├── project.json
├── README.md
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.spec.json
└── vitest.config.ts
```

---

## Recommended Folder Structure

Alter only the subfolders inside `charts/src/lib`.

```txt
libs/tailng-ui/charts/src/lib/
├── core/
│   ├── chart.types.ts
│   ├── chart.tokens.ts
│   ├── chart-theme.types.ts
│   ├── chart-event.types.ts
│   ├── chart-series.types.ts
│   ├── chart-axis.types.ts
│   ├── chart-tooltip.types.ts
│   └── chart.utils.ts
│
├── echarts/
│   ├── echarts.loader.ts
│   ├── echarts.loader.spec.ts
│   ├── echarts.types.ts
│   ├── echarts-option.factory.ts
│   ├── echarts-option.factory.spec.ts
│   ├── echarts-theme.factory.ts
│   ├── echarts-theme.factory.spec.ts
│   └── echarts-event.adapter.ts
│
├── components/
│   ├── chart/
│   │   ├── tng-chart.component.ts
│   │   ├── tng-chart.component.html
│   │   ├── tng-chart.component.css
│   │   └── tng-chart.component.spec.ts
│   │
│   ├── legend/
│   │   ├── tng-chart-legend.component.ts
│   │   ├── tng-chart-legend.component.html
│   │   ├── tng-chart-legend.component.css
│   │   └── tng-chart-legend.component.spec.ts
│   │
│   ├── empty-state/
│   │   ├── tng-chart-empty-state.component.ts
│   │   ├── tng-chart-empty-state.component.html
│   │   ├── tng-chart-empty-state.component.css
│   │   └── tng-chart-empty-state.component.spec.ts
│   │
│   └── loading-state/
│       ├── tng-chart-loading-state.component.ts
│       ├── tng-chart-loading-state.component.html
│       ├── tng-chart-loading-state.component.css
│       └── tng-chart-loading-state.component.spec.ts
│
├── series/
│   ├── line/
│   │   ├── tng-line-chart.component.ts
│   │   ├── tng-line-chart.component.spec.ts
│   │   ├── line-chart.types.ts
│   │   └── line-option.factory.ts
│   │
│   ├── bar/
│   │   ├── tng-bar-chart.component.ts
│   │   ├── tng-bar-chart.component.spec.ts
│   │   ├── bar-chart.types.ts
│   │   └── bar-option.factory.ts
│   │
│   ├── area/
│   │   ├── tng-area-chart.component.ts
│   │   ├── tng-area-chart.component.spec.ts
│   │   ├── area-chart.types.ts
│   │   └── area-option.factory.ts
│   │
│   ├── pie/
│   │   ├── tng-pie-chart.component.ts
│   │   ├── tng-pie-chart.component.spec.ts
│   │   ├── pie-chart.types.ts
│   │   └── pie-option.factory.ts
│   │
│   ├── scatter/
│   │   ├── tng-scatter-chart.component.ts
│   │   ├── tng-scatter-chart.component.spec.ts
│   │   ├── scatter-chart.types.ts
│   │   └── scatter-option.factory.ts
│   │
│   └── heatmap/
│       ├── tng-heatmap-chart.component.ts
│       ├── tng-heatmap-chart.component.spec.ts
│       ├── heatmap-chart.types.ts
│       └── heatmap-option.factory.ts
│
└── index.ts
```

---

## Migration From Current Structure

Move existing files:

```txt
chart.types.ts                  → core/chart.types.ts
echarts.loader.ts               → echarts/echarts.loader.ts
echarts.loader.spec.ts          → echarts/echarts.loader.spec.ts
tng-chart.component.ts          → components/chart/tng-chart.component.ts
tng-chart.component.html        → components/chart/tng-chart.component.html
tng-chart.component.css         → components/chart/tng-chart.component.css
tng-chart.component.spec.ts     → components/chart/tng-chart.component.spec.ts
```

Keep existing series folders:

```txt
series/bar
series/line
series/pie
```

Add new series folders:

```txt
series/area
series/scatter
series/heatmap
```

---

## Package Dependency Strategy

Use `echarts` as a `peerDependency` and `devDependency`.

```json
{
  "peerDependencies": {
    "echarts": "^6.0.0",
    "@angular/core": "^20.0.0",
    "@angular/common": "^20.0.0"
  },
  "devDependencies": {
    "echarts": "^6.0.0"
  }
}
```

If the project is still targeting ECharts 5 initially, use:

```json
{
  "peerDependencies": {
    "echarts": "^5.5.0 || ^6.0.0"
  },
  "devDependencies": {
    "echarts": "^6.0.0"
  }
}
```

Consumer install:

```bash
yarn add @tailng-ui/charts echarts
```

---

## ECharts Modules Needed for v1

The ECharts loader should register only the modules needed by v1.

Required charts:

```txt
LineChart
BarChart
PieChart
ScatterChart
HeatmapChart
```

Required components:

```txt
GridComponent
TooltipComponent
LegendComponent
DatasetComponent
TransformComponent
VisualMapComponent
TitleComponent
```

Required features/renderers:

```txt
LabelLayout
UniversalTransition
CanvasRenderer
SVGRenderer
```

Default renderer should remain `canvas`.

---

## Public Components

### 1. `tng-line-chart`

Use for trend and time-series charts.

Suggested inputs:

```ts
readonly data = input.required<readonly Record<string, unknown>[]>();
readonly xField = input.required<string>();
readonly yField = input<string | null>(null);
readonly series = input<readonly TngChartSeries[] | null>(null);
readonly smooth = input(false);
readonly renderer = input<TngChartRenderer>('canvas');
readonly loading = input(false);
readonly legend = input(true);
readonly tooltip = input(true);
readonly height = input<number | string>(320);
readonly optionOverride = input<TngChartOptionOverride | null>(null);
```

### 2. `tng-bar-chart`

Use for category comparison.

Suggested inputs:

```ts
readonly data = input.required<readonly Record<string, unknown>[]>();
readonly xField = input.required<string>();
readonly yField = input<string | null>(null);
readonly series = input<readonly TngChartSeries[] | null>(null);
readonly orientation = input<'vertical' | 'horizontal'>('vertical');
readonly stacked = input(false);
readonly renderer = input<TngChartRenderer>('canvas');
readonly loading = input(false);
readonly legend = input(true);
readonly tooltip = input(true);
readonly height = input<number | string>(320);
readonly optionOverride = input<TngChartOptionOverride | null>(null);
```

### 3. `tng-area-chart`

Use for filled trend charts.

Suggested inputs:

```ts
readonly data = input.required<readonly Record<string, unknown>[]>();
readonly xField = input.required<string>();
readonly yField = input<string | null>(null);
readonly series = input<readonly TngChartSeries[] | null>(null);
readonly stacked = input(false);
readonly smooth = input(false);
readonly renderer = input<TngChartRenderer>('canvas');
readonly loading = input(false);
readonly legend = input(true);
readonly tooltip = input(true);
readonly height = input<number | string>(320);
readonly optionOverride = input<TngChartOptionOverride | null>(null);
```

### 4. `tng-pie-chart`

Use for part-to-whole charts.

Suggested inputs:

```ts
readonly data = input.required<readonly Record<string, unknown>[]>();
readonly nameField = input.required<string>();
readonly valueField = input.required<string>();
readonly donut = input(false);
readonly innerRadius = input<string | number>('45%');
readonly outerRadius = input<string | number>('70%');
readonly renderer = input<TngChartRenderer>('canvas');
readonly loading = input(false);
readonly legend = input(true);
readonly tooltip = input(true);
readonly height = input<number | string>(320);
readonly optionOverride = input<TngChartOptionOverride | null>(null);
```

### 5. `tng-scatter-chart`

Use for correlation and point distribution.

Suggested inputs:

```ts
readonly data = input.required<readonly Record<string, unknown>[]>();
readonly xField = input.required<string>();
readonly yField = input.required<string>();
readonly sizeField = input<string | null>(null);
readonly colorField = input<string | null>(null);
readonly renderer = input<TngChartRenderer>('canvas');
readonly loading = input(false);
readonly legend = input(true);
readonly tooltip = input(true);
readonly height = input<number | string>(320);
readonly optionOverride = input<TngChartOptionOverride | null>(null);
```

### 6. `tng-heatmap-chart`

Use for matrix/density charts.

Suggested inputs:

```ts
readonly data = input.required<readonly Record<string, unknown>[]>();
readonly xField = input.required<string>();
readonly yField = input.required<string>();
readonly valueField = input.required<string>();
readonly visualMap = input(true);
readonly renderer = input<TngChartRenderer>('canvas');
readonly loading = input(false);
readonly legend = input(false);
readonly tooltip = input(true);
readonly height = input<number | string>(360);
readonly optionOverride = input<TngChartOptionOverride | null>(null);
```

---

## Common Core Types

### `TngChartRenderer`

```ts
export type TngChartRenderer = 'canvas' | 'svg';
```

### `TngChartDatum`

```ts
export type TngChartDatum = Record<string, unknown>;
export type TngChartData = readonly TngChartDatum[];
```

### `TngChartSeries`

```ts
export interface TngChartSeries {
  key: string;
  label?: string;
  type?: 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'heatmap';
  xField?: string;
  yField?: string;
  valueField?: string;
  categoryField?: string;
  color?: string | null;
  stack?: string | null;
  hidden?: boolean;
  smooth?: boolean;
}
```

### `TngChartOptionOverride`

```ts
import type { EChartsOption } from 'echarts';

export type TngChartOptionOverride = (option: EChartsOption) => EChartsOption;
```

### `TngChartPointEvent`

```ts
export interface TngChartPointEvent {
  seriesKey: string | null;
  seriesName: string | null;
  datum: Record<string, unknown> | null;
  value: unknown;
  index: number | null;
  nativeEvent: unknown;
}
```

---

## Base Chart Component

`TngChartComponent` should be the low-level reusable ECharts host.

Responsibilities:

- Create and dispose ECharts instance
- Accept `option`
- Accept `renderer`
- Accept `height`
- Resize using `ResizeObserver`
- Call `setOption`
- Bind chart events
- Emit normalized TailNG events
- Support theme refresh
- Avoid exposing raw ECharts instance unless needed through `chartReady`

Suggested selector:

```txt
tng-chart
```

Suggested class:

```ts
export class TngChartComponent {}
```

Suggested inputs:

```ts
readonly option = input.required<EChartsOption>();
readonly renderer = input<TngChartRenderer>('canvas');
readonly height = input<number | string>(320);
readonly loading = input(false);
```

Suggested outputs:

```ts
readonly chartReady = output<unknown>();
readonly pointClick = output<TngChartPointEvent>();
readonly pointHover = output<TngChartPointEvent>();
```

---

## TailNG-Owned UI Components

### `TngChartLegendComponent`

Use Tailwind/TailNG UI, not ECharts built-in legend UI where possible.

Responsibilities:

- Render legend items
- Toggle series visibility
- Support hidden/disabled states
- Use TailNG classes and theme tokens

### `TngChartEmptyStateComponent`

Responsibilities:

- Show empty data state
- Accept message
- Keep styling minimal and reusable

### `TngChartLoadingStateComponent`

Responsibilities:

- Show loading state/skeleton
- Avoid layout shift
- Keep styling consistent with TailNG components

---

## Theme Strategy

Canvas cannot be styled directly with Tailwind classes. Use this flow:

```txt
TailNG CSS variables
        ↓
getComputedStyle(hostElement)
        ↓
resolve TailNG chart theme
        ↓
generate ECharts option/theme
        ↓
render on canvas
```

Suggested TailNG CSS variables to read:

```txt
--color-primary
--color-success
--color-warning
--color-danger
--color-info
--color-fg
--color-muted
--color-border
--color-surface
--color-bg
```

Map those into ECharts:

```txt
color palette
textStyle.color
xAxis.axisLabel.color
yAxis.axisLabel.color
xAxis.splitLine.lineStyle.color
yAxis.splitLine.lineStyle.color
tooltip.backgroundColor
tooltip.borderColor
tooltip.textStyle.color
visualMap colors
```

Do not rely on Tailwind classes to style the actual chart pixels.

---

## Option Factory Strategy

Each chart type should have a small option factory.

Example files:

```txt
series/line/line-option.factory.ts
series/bar/bar-option.factory.ts
series/area/area-option.factory.ts
series/pie/pie-option.factory.ts
series/scatter/scatter-option.factory.ts
series/heatmap/heatmap-option.factory.ts
```

Each factory should:

- Accept typed TailNG inputs
- Generate a valid `EChartsOption`
- Apply theme values
- Disable built-in legend if TailNG external legend is used
- Enable tooltip based on input
- Apply `optionOverride` last

General flow:

```txt
inputs + data + theme
        ↓
base ECharts option
        ↓
chart-specific option
        ↓
optionOverride
        ↓
tng-chart renders it
```

---

## Implementation Order

### Phase 1: Foundation

- [ ] Move existing `chart.types.ts` to `core/chart.types.ts`
- [ ] Move existing `echarts.loader.ts` to `echarts/echarts.loader.ts`
- [ ] Move existing `tng-chart.component.*` to `components/chart/`
- [ ] Update all imports after file moves
- [ ] Add `TngChartRenderer` type
- [ ] Add `TngChartDatum` and `TngChartData` types
- [ ] Add `TngChartSeries` type
- [ ] Add `TngChartPointEvent` type
- [ ] Add `TngChartOptionOverride` type
- [ ] Update `index.ts` exports
- [ ] Ensure package builds after structure changes

### Phase 2: ECharts Adapter

- [ ] Keep ECharts imports isolated in `echarts/`
- [ ] Register only v1 ECharts chart modules
- [ ] Register `CanvasRenderer`
- [ ] Register `SVGRenderer`
- [ ] Ensure default renderer is `canvas`
- [ ] Add `echarts-theme.factory.ts`
- [ ] Add `echarts-option.factory.ts` only if shared option generation is needed
- [ ] Add `echarts-event.adapter.ts`
- [ ] Normalize ECharts click events into `TngChartPointEvent`
- [ ] Normalize ECharts mouseover events into `TngChartPointEvent`

### Phase 3: Base Chart Host

- [ ] Update `TngChartComponent` to accept `option`
- [ ] Update `TngChartComponent` to accept `renderer`
- [ ] Update `TngChartComponent` to accept `height`
- [ ] Update `TngChartComponent` to accept `loading`
- [ ] Initialize ECharts after view init
- [ ] Dispose ECharts on destroy
- [ ] Resize chart on host resize
- [ ] Apply `setOption` when option changes
- [ ] Apply `lazyUpdate` where appropriate
- [ ] Emit `chartReady`
- [ ] Emit normalized `pointClick`
- [ ] Emit normalized `pointHover`

### Phase 4: Public Series Components

- [ ] Implement `tng-line-chart`
- [ ] Implement `line-option.factory.ts`
- [ ] Implement `tng-bar-chart`
- [ ] Implement `bar-option.factory.ts`
- [ ] Implement `tng-pie-chart`
- [ ] Implement `pie-option.factory.ts`
- [ ] Implement `tng-area-chart`
- [ ] Implement `area-option.factory.ts`
- [ ] Implement `tng-scatter-chart`
- [ ] Implement `scatter-option.factory.ts`
- [ ] Implement `tng-heatmap-chart`
- [ ] Implement `heatmap-option.factory.ts`
- [ ] Export all public chart components from `index.ts`

### Phase 5: TailNG UI Composition

- [ ] Implement `TngChartLegendComponent`
- [ ] Implement `TngChartEmptyStateComponent`
- [ ] Implement `TngChartLoadingStateComponent`
- [ ] Use Tailwind/TailNG classes for chart shell
- [ ] Use Tailwind/TailNG classes for legend
- [ ] Use Tailwind/TailNG classes for empty state
- [ ] Use Tailwind/TailNG classes for loading state
- [ ] Keep built-in ECharts legend disabled when using TailNG external legend

### Phase 6: Theming

- [ ] Read TailNG CSS variables from chart host
- [ ] Map CSS vars into ECharts text colors
- [ ] Map CSS vars into ECharts axis colors
- [ ] Map CSS vars into ECharts grid line colors
- [ ] Map CSS vars into ECharts tooltip colors
- [ ] Map CSS vars into ECharts series palette
- [ ] Map CSS vars into heatmap visualMap colors
- [ ] Re-render or refresh chart when theme changes if applicable

---

## Test Cases

### Folder and Public API Tests

- [x] Build should pass after moving chart files into `core`, `echarts`, `components`, and `series`
- [x] Public `index.ts` should export `TngChartComponent`
- [x] Public `index.ts` should export `TngLineChartComponent`
- [x] Public `index.ts` should export `TngBarChartComponent`
- [x] Public `index.ts` should export `TngAreaChartComponent`
- [x] Public `index.ts` should export `TngPieChartComponent`
- [x] Public `index.ts` should export `TngScatterChartComponent`
- [x] Public `index.ts` should export `TngHeatmapChartComponent`
- [x] Public `index.ts` should export common chart types
- [x] Public imports should not require importing from internal `echarts/` paths

### ECharts Loader Tests

- [x] ECharts loader should register `LineChart`
- [x] ECharts loader should register `BarChart`
- [x] ECharts loader should register `PieChart`
- [x] ECharts loader should register `ScatterChart`
- [x] ECharts loader should register `HeatmapChart`
- [x] ECharts loader should register `GridComponent`
- [x] ECharts loader should register `TooltipComponent`
- [x] ECharts loader should register `LegendComponent`
- [x] ECharts loader should register `DatasetComponent`
- [x] ECharts loader should register `VisualMapComponent`
- [x] ECharts loader should register `CanvasRenderer`
- [x] ECharts loader should register `SVGRenderer`
- [x] ECharts loader should be safe to call more than once
- [x] ECharts loader should not import all ECharts modules unnecessarily

### Base Chart Component Tests

- [x] `TngChartComponent` should create an ECharts instance after view init
- [x] `TngChartComponent` should dispose the ECharts instance on destroy
- [x] `TngChartComponent` should call `setOption` when option input changes
- [x] `TngChartComponent` should use `canvas` renderer by default
- [x] `TngChartComponent` should use `svg` renderer when `renderer="svg"`
- [x] `TngChartComponent` should apply numeric height as pixel height
- [x] `TngChartComponent` should apply string height as provided
- [x] `TngChartComponent` should resize when ResizeObserver fires
- [x] `TngChartComponent` should emit `chartReady` after instance creation
- [x] `TngChartComponent` should emit normalized `pointClick`
- [x] `TngChartComponent` should emit normalized `pointHover`
- [x] `TngChartComponent` should handle empty option safely if allowed
- [x] `TngChartComponent` should not recreate the instance on every option change
- [x] `TngChartComponent` should not leak event listeners after destroy

### Renderer Tests

- [x] Default renderer should be `canvas`
- [x] Canvas renderer should be passed to ECharts init
- [x] SVG renderer should be passed to ECharts init when selected
- [x] Renderer change should recreate the chart instance if required by ECharts
- [x] Invalid renderer values should be prevented by TypeScript

### Line Chart Tests

- [x] `tng-line-chart` should require `data` input
- [ ] `tng-line-chart` should require `xField` input
- [x] `tng-line-chart` should generate a line series from `xField` and `yField`
- [x] `tng-line-chart` should generate multiple line series from `series` input
- [x] `tng-line-chart` should enable smooth line when `smooth=true`
- [x] `tng-line-chart` should disable smooth line when `smooth=false`
- [x] `tng-line-chart` should enable tooltip when `tooltip=true`
- [x] `tng-line-chart` should disable tooltip when `tooltip=false`
- [x] `tng-line-chart` should pass generated option to `tng-chart`
- [x] `tng-line-chart` should apply `optionOverride` last

### Bar Chart Tests

- [x] `tng-bar-chart` should require `data` input
- [ ] `tng-bar-chart` should require `xField` input
- [x] `tng-bar-chart` should generate a bar series from `xField` and `yField`
- [x] `tng-bar-chart` should generate multiple bar series from `series` input
- [x] `tng-bar-chart` should support vertical orientation
- [x] `tng-bar-chart` should support horizontal orientation
- [x] `tng-bar-chart` should apply stack key when `stacked=true`
- [x] `tng-bar-chart` should not stack when `stacked=false`
- [x] `tng-bar-chart` should enable tooltip when `tooltip=true`
- [x] `tng-bar-chart` should disable tooltip when `tooltip=false`
- [x] `tng-bar-chart` should apply `optionOverride` last

### Area Chart Tests

- [x] `tng-area-chart` should require `data` input
- [x] `tng-area-chart` should require `xField` input
- [x] `tng-area-chart` should generate a line series with `areaStyle`
- [x] `tng-area-chart` should generate multiple area series from `series` input
- [x] `tng-area-chart` should support stacked area mode
- [x] `tng-area-chart` should support non-stacked area mode
- [x] `tng-area-chart` should support smooth area lines
- [x] `tng-area-chart` should pass generated option to `tng-chart`
- [x] `tng-area-chart` should apply `optionOverride` last

### Pie Chart Tests

- [x] `tng-pie-chart` should require `data` input
- [ ] `tng-pie-chart` should require `nameField` input
- [ ] `tng-pie-chart` should require `valueField` input
- [x] `tng-pie-chart` should generate pie data from `nameField` and `valueField`
- [x] `tng-pie-chart` should render normal pie when `donut=false`
- [x] `tng-pie-chart` should render donut pie when `donut=true`
- [x] `tng-pie-chart` should use `innerRadius` for donut charts
- [x] `tng-pie-chart` should use `outerRadius`
- [x] `tng-pie-chart` should enable tooltip when `tooltip=true`
- [x] `tng-pie-chart` should disable tooltip when `tooltip=false`
- [x] `tng-pie-chart` should apply `optionOverride` last

### Scatter Chart Tests

- [x] `tng-scatter-chart` should require `data` input
- [x] `tng-scatter-chart` should require `xField` input
- [x] `tng-scatter-chart` should require `yField` input
- [x] `tng-scatter-chart` should generate scatter data points from `xField` and `yField`
- [x] `tng-scatter-chart` should use `sizeField` when provided
- [x] `tng-scatter-chart` should ignore `sizeField` when not provided
- [x] `tng-scatter-chart` should use `colorField` when provided if supported in v1
- [x] `tng-scatter-chart` should enable tooltip when `tooltip=true`
- [x] `tng-scatter-chart` should disable tooltip when `tooltip=false`
- [x] `tng-scatter-chart` should apply `optionOverride` last

### Heatmap Chart Tests

- [x] `tng-heatmap-chart` should require `data` input
- [x] `tng-heatmap-chart` should require `xField` input
- [x] `tng-heatmap-chart` should require `yField` input
- [x] `tng-heatmap-chart` should require `valueField` input
- [x] `tng-heatmap-chart` should generate heatmap data from `xField`, `yField`, and `valueField`
- [x] `tng-heatmap-chart` should generate x-axis categories from data
- [x] `tng-heatmap-chart` should generate y-axis categories from data
- [x] `tng-heatmap-chart` should enable visualMap when `visualMap=true`
- [x] `tng-heatmap-chart` should disable visualMap when `visualMap=false`
- [x] `tng-heatmap-chart` should enable tooltip when `tooltip=true`
- [x] `tng-heatmap-chart` should disable tooltip when `tooltip=false`
- [x] `tng-heatmap-chart` should apply `optionOverride` last

### Theme Tests

- [x] Theme resolver should read `--color-primary`
- [x] Theme resolver should read `--color-success`
- [x] Theme resolver should read `--color-warning`
- [x] Theme resolver should read `--color-danger`
- [x] Theme resolver should read `--color-info`
- [x] Theme resolver should read `--color-fg`
- [x] Theme resolver should read `--color-muted`
- [x] Theme resolver should read `--color-border`
- [x] Theme resolver should read `--color-surface`
- [x] Theme resolver should fallback when CSS variables are missing
- [x] ECharts options should use theme palette for series colors
- [x] ECharts options should use theme text color for axis labels
- [x] ECharts options should use theme border color for grid lines
- [x] ECharts options should use theme surface color for tooltip background
- [x] Heatmap visualMap should use theme-compatible colors

### Legend Tests

- [x] Legend component should render all visible series items
- [x] Legend component should show series label when available
- [x] Legend component should fallback to series key when label is missing
- [x] Legend component should emit toggle event when item is clicked
- [x] Legend component should show hidden state when series is hidden
- [x] Legend component should not emit toggle event for disabled legend item
- [x] Chart component should update visible series when legend item is toggled
- [x] Built-in ECharts legend should be disabled when TailNG external legend is enabled

### Empty and Loading State Tests

- [x] Empty state should render when data is empty and loading is false
- [x] Empty state should not render when data exists
- [x] Empty state should not render while loading
- [x] Loading state should render when loading is true
- [x] Chart surface should not render while loading if that is the chosen behavior
- [x] Loading state should preserve chart container height
- [x] Custom empty text should be displayed when provided

### Option Override Tests

- [x] `optionOverride` should receive generated ECharts option
- [x] `optionOverride` should be applied after base option generation
- [x] `optionOverride` should be able to modify axis options
- [x] `optionOverride` should be able to modify series options
- [x] Chart should render original option when `optionOverride` is null
- [ ] Errors inside `optionOverride` should be handled or surfaced clearly

### Event Adapter Tests

- [x] ECharts click event should be converted to `TngChartPointEvent`
- [x] ECharts mouseover event should be converted to `TngChartPointEvent`
- [x] Event adapter should preserve original native event
- [x] Event adapter should include series key when available
- [x] Event adapter should include series name when available
- [x] Event adapter should include datum when available
- [x] Event adapter should handle missing data safely

### Accessibility Tests

- [x] Chart wrapper should allow `aria-label`
- [x] Chart wrapper should allow `aria-labelledby`
- [x] Empty state should be readable text
- [x] Loading state should expose loading status if required
- [x] Legend buttons should be keyboard-focusable
- [x] Legend buttons should use `button` elements
- [x] Legend hidden state should be exposed with `aria-pressed`
- [x] Chart should not trap keyboard focus
- [x] SVG renderer should not be required for basic accessibility support

### Performance Tests

- [x] Dashboard with 10 charts should initialize without creating duplicate ECharts module registrations
- [x] Multiple chart instances should not share mutable option objects incorrectly
- [x] Updating data should call `setOption` without recreating the chart instance
- [x] Destroying multiple charts should dispose all ECharts instances
- [x] Canvas renderer should be the default in all public chart components
- [ ] Large line dataset should still generate option without excessive transformation cost
- [ ] Large scatter dataset should still generate option without excessive transformation cost
- [ ] Resize events should be throttled or safely handled if needed

### Build and Lint Tests

- [x] `yarn lint` should pass
- [x] `yarn test` should pass
- [x] `yarn build` should pass
- [x] TypeScript should not use `any` unless unavoidable
- [x] Public APIs should have proper exported types
- [ ] Internal ECharts-specific types should stay inside `echarts/` where possible
- [ ] No circular imports should be introduced

---

## Notes for Codex Agent

- Keep the implementation small and incremental.
- Do not create a giant chart abstraction in v1.
- Do not expose raw ECharts option as the primary public API.
- Keep ECharts isolated inside the `echarts/` folder.
- Keep TailNG-owned APIs in `core/`.
- Keep public chart components in `series/`.
- Use Canvas as default.
- Keep SVG opt-in.
- Add `optionOverride` as the escape hatch.
- Use TailNG CSS variables for chart theming.
- Use external TailNG legend, empty state, and loading state where practical.
- Prefer simple typed utilities over complex inheritance.
- Prefer Angular signals and `input()` / `output()` APIs.
- Prefer standalone components.
