# TailNG UI Charts - ECharts Catalog Component Plan

Source catalog: `plan/charts/echarts.json`

## Goal

Implement the requested ECharts catalog as TailNG chart components.

- Create one folder for each chart category.
- Create one standalone Angular component for each chart listed in the catalog.
- Keep TailNG semi-headless architecture, theme resolution, canvas default, and ECharts isolation.
- Reuse shared option builders per category so each chart variant is a small typed wrapper, not a copy-pasted implementation.

Catalog size:

- 24 categories
- 143 chart components

## Target Folder Shape

```txt
libs/tailng-ui/charts/src/lib/series/
  line/
    shared/
      line-option-presets.ts
      line.types.ts
    basic-line/
      tng-basic-line-chart.component.ts
      tng-basic-line-chart.component.html
      tng-basic-line-chart.component.css
      tng-basic-line-chart.component.spec.ts
      basic-line-option.factory.ts
      basic-line-option.factory.spec.ts
      basic-line.types.ts
    smoothed-line/
      ...
  bar/
    shared/
    basic-bar/
    horizontal-bar/
    ...
  geo-map/
    shared/
    geo-map/
    choropleth-map/
    ...
```

Existing category folders such as `line`, `bar`, `pie`, `scatter`, `area`, and `heatmap` stay in place. The current broad components should remain as compatibility components, while new catalog-specific components live in child folders.

## Naming Rules

Folder names:

- Category folders use kebab case: `line`, `area`, `bar`, `geo-map`, `pictorial-bar`, `theme-river`.
- Chart folders use kebab case from the catalog name: `basic-line`, `smoothed-line`, `normalized-stacked-bar`, `calendar-heatmap`.

Component names:

- Class: `TngBasicLineChartComponent`
- Selector: `tng-basic-line-chart`
- Export alias: `TngBasicLineChart`
- Option factory: `createTngBasicLineChartOption`
- Input type: `TngBasicLineChartOptionInput`

Examples:

```ts
export class TngBasicLineChartComponent {}
export function createTngBasicLineChartOption(input: TngBasicLineChartOptionInput): TngChartOption;
```

```html
<tng-basic-line-chart [data]="data" xField="month" yField="revenue" />
```

## Component Contract

Every catalog component should use the same outer TailNG component contract unless the chart type needs specialized data.

Common inputs:

- `data`
- `height`
- `loading`
- `legend`
- `tooltip`
- `renderer`
- `runtimeLoader`
- `theme`
- `merge`
- `optionOverride`

Common outputs:

- `ready`
- `chartReady`
- `runtimeError`
- `pointClick`
- `pointHover`

Every component should compose:

```txt
tng-chart-root
  tng-chart-surface
  tng-chart-legend
  tng-chart-empty-state
  tng-chart-loading-state
```

## Option Builder Strategy

Use three levels of option creation:

1. Core shared chart utilities
   - data access
   - legend item creation
   - option override merge
   - hidden series filtering
   - TailNG source datum tagging

2. Category shared builders
   - `line/shared`
   - `bar/shared`
   - `geo-map/shared`
   - `sankey/shared`
   - etc.

3. Chart-specific option factories
   - small preset wrappers around category builders
   - custom only when the chart has unique behavior

Example:

```ts
createTngBasicLineChartOption(input)
  -> createTngLineSeriesOption(input, { smooth: false })

createTngSmoothedLineChartOption(input)
  -> createTngLineSeriesOption(input, { smooth: true })

createTngLineRaceChartOption(input)
  -> category builder + animation/race settings
```

## Category Inventory

### Line ✅ overview

- [x] Basic Line
- [x] Smoothed Line
- [x] Stacked Line
- [x] Step Line
- [x] Log Axis Line
- [x] Time Series Line
- [x] Dynamic Line
- [x] Line Race
- [x] Line with Mark Lines
- [x] Multi Axis Line
- [x] Polar Line
- [x] Interactive Line
- [x] Large Scale Line
- [x] Sparkline

### Area ✅ overview

- [x] Basic Area
- [x] Stacked Area
- [x] Gradient Area
- [x] Large Scale Area
- [x] Confidence Band
- [x] Area Pieces
- [x] Time Series Area

### Bar ✅ overview

- [x] Basic Bar
- [x] Horizontal Bar
- [x] Stacked Bar
- [x] Normalized Stacked Bar
- [x] Grouped Bar
- [x] Rounded Bar
- [x] Negative Bar
- [x] Waterfall Bar
- [x] Large Scale Bar
- [x] Dynamic Bar
- [x] Bar Race
- [x] Drilldown Bar
- [x] Polar Bar
- [x] Radial Bar
- [x] Sorted Bar

### Pie ✅ overview

- [x] Basic Pie
- [x] Donut
- [x] Half Donut
- [x] Rounded Donut
- [x] Nightingale
- [x] Nested Pie
- [x] Scrollable Legend Pie
- [x] Pie on Calendar
- [x] Pie on GEO Map

### Scatter ✅ overview

- [x] Basic Scatter
- [x] Effect Scatter
- [x] Bubble Chart
- [x] Large Scatter
- [x] Jitter Scatter
- [x] Regression Scatter
- [x] Scatter Matrix
- [x] Calendar Scatter
- [x] Geo Scatter
- [x] Single Axis Scatter

### Heatmap ✅ overview

- [x] Cartesian Heatmap
- [x] Large Heatmap
- [x] Discrete Color Heatmap
- [x] Calendar Heatmap
- [x] Matrix Heatmap

### GEO/Map ✅ overview

Folder: `geo-map`

- [x] Geo Map
- [x] Choropleth Map
- [x] SVG Map
- [x] Geo Scatter
- [x] Geo Lines
- [x] Map to Bar Morph
- [x] Hexagonal Binning

### Candlestick ✅ overview

- [x] Basic Candlestick
- [x] OHLC
- [x] Large Scale Candlestick
- [x] Candlestick with Brush
- [x] Intraday Candlestick

### Radar ✅ overview

- [x] Basic Radar
- [x] Customized Radar
- [x] Multiple Radar

### Boxplot ✅ overview

- [x] Basic Boxplot
- [x] Aggregated Boxplot
- [x] Multi Category Boxplot

### Graph ✅ overview

- [x] Basic Graph
- [x] Force Graph
- [x] Graph on Cartesian
- [x] Dynamic Graph
- [x] Geo Graph
- [x] Calendar Graph

### Lines ✅ overview

- [x] Geo Lines
- [x] Large Scale Lines

### Tree ✅ overview

- [x] Basic Tree
- [x] Horizontal Tree
- [x] Vertical Tree
- [x] Radial Tree
- [x] Polyline Tree

### Treemap ✅ overview

- [x] Basic Treemap
- [x] Disk Usage Treemap
- [x] Parent Label Treemap
- [x] Gradient Treemap

### Sunburst ✅ overview

- [x] Basic Sunburst
- [x] Rounded Sunburst
- [x] Rotated Label Sunburst
- [x] Monochrome Sunburst
- [x] VisualMap Sunburst

### Parallel ✅ overview

- [x] Basic Parallel
- [x] AQI Parallel
- [x] Nutrients Parallel

### Sankey ✅ overview

- [x] Basic Sankey
- [x] Vertical Sankey
- [x] Styled Sankey
- [x] Level Sankey
- [x] Gradient Edge Sankey
- [x] Node Aligned Sankey

### Chord ✅ overview

- [x] Basic Chord
- [x] Chord minAngle
- [x] Chord lineStyle.color
- [x] Styled Chord

### Funnel ✅ overview

- [x] Basic Funnel
- [x] Compare Funnel
- [x] Customized Funnel
- [x] Multiple Funnel

### Gauge ✅ overview

- [x] Basic Gauge
- [x] Speed Gauge
- [x] Progress Gauge
- [x] Grade Gauge
- [x] Multi Title Gauge
- [x] Temperature Gauge
- [x] Ring Gauge
- [x] Barometer Gauge
- [x] Clock Gauge

### PictorialBar ✅ overview

Folder: `pictorial-bar`

- [x] Basic Pictorial Bar
- [x] Symbol Pictorial Bar
- [x] Dotted Pictorial Bar
- [x] Image/SVG Pictorial Bar

### ThemeRiver ✅ overview

Folder: `theme-river`

- [x] Basic ThemeRiver

### Calendar ✅ overview

- [x] Basic Calendar
- [x] Calendar Heatmap
- [x] Calendar Graph
- [x] Calendar Pie
- [x] Calendar Icon

### Matrix ✅ overview

- [x] Basic Matrix
- [x] Correlation Matrix
- [x] Covariance Matrix
- [x] Confusion Matrix
- [x] Graph Matrix
- [x] Pie Matrix
- [x] Responsive Matrix Layout

## Implementation Phases

### Phase 1 - Catalog Infrastructure

- Add catalog metadata helpers:
  - `core/chart-catalog.types.ts`
  - `core/chart-catalog.ts`
- Add shared component wrapper helpers to reduce repeated root/surface/legend boilerplate.
- Add export organization rules in `src/index.ts`.
- Add architecture test:
  - every catalog component has a matching folder
  - every folder exports a component
  - selectors are unique
  - no direct ECharts imports outside the `echarts` adapter

### Phase 2 - Cartesian Core

Implement the highest-value chart families first.

- Line
- Area
- Bar
- Scatter
- Heatmap

Use existing factories as the base, then split variants into separate components.

### Phase 3 - Circular and Radial Charts

- Pie
- Radar
- Gauge
- Funnel
- Sunburst

These mostly need specialized option presets and compact input models.

### Phase 4 - Hierarchy, Flow, and Network

- Tree
- Treemap
- Graph
- Sankey
- Chord

These need specialized node/link/tree input types.

### Phase 5 - Financial, Coordinate, and Advanced Layout

- Candlestick
- Boxplot
- Parallel
- Calendar
- Matrix
- Lines
- GEO/Map
- PictorialBar
- ThemeRiver

These should be implemented after the shared option contracts are stable because they need more ECharts coordinate-system support.

### Phase 6 - Docs and Examples

- Add one docs page per category.
- Add a gallery index generated from catalog metadata.
- Add examples for:
  - default theme
  - dark theme
  - SVG renderer
  - option override
  - loading/empty state

## Public API Plan

Keep exports grouped by category in `libs/tailng-ui/charts/src/index.ts`.

Example:

```ts
export {
  TngBasicLineChartComponent,
  TngBasicLineChartComponent as TngBasicLineChart,
} from './lib/series/line/basic-line/tng-basic-line-chart.component';

export { createTngBasicLineChartOption } from './lib/series/line/basic-line/basic-line-option.factory';
export type { TngBasicLineChartOptionInput } from './lib/series/line/basic-line/basic-line.types';
```

For compatibility, keep existing exports:

- `TngLineChartComponent`
- `TngBarChartComponent`
- `TngPieChartComponent`
- `TngScatterChartComponent`
- `TngAreaChartComponent`
- `TngHeatmapChartComponent`

## Testing Plan

Every chart component:

- component export smoke test
- selector uniqueness test
- empty state test where relevant
- option factory test
- option override preservation test
- TailNG theme application test through `createTngEchartsOption`

Category-level tests:

- shared builder creates expected ECharts `series.type`
- legend visibility filters series without recreating chart
- SVG renderer remains opt-in
- canvas renderer remains default

Advanced chart tests:

- maps and geo charts validate coordinate/map inputs
- graph/sankey/chord validate node/link inputs
- calendar/matrix charts validate coordinate system options
- large-scale variants set progressive/large/performance flags where ECharts supports them

## Important Implementation Rules

- Do not expose raw ECharts theme objects as the main API.
- Do not copy ECharts demo data into the library.
- Do not duplicate the full root/surface/legend shell in 143 separate ways.
- Do not make SVG the default renderer.
- Do not introduce a direct dependency from core chart utilities to ECharts.
- Prefer typed TailNG inputs plus `optionOverride` as the escape hatch.
- Keep existing broad components working for backwards compatibility.

