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

### Line

- [ ] Basic Line
- [ ] Smoothed Line
- [ ] Stacked Line
- [ ] Step Line
- [ ] Log Axis Line
- [ ] Time Series Line
- [ ] Dynamic Line
- [ ] Line Race
- [ ] Line with Mark Lines
- [ ] Multi Axis Line
- [ ] Polar Line
- [ ] Interactive Line
- [ ] Large Scale Line
- [ ] Sparkline

### Area

- [ ] Basic Area
- [ ] Stacked Area
- [ ] Gradient Area
- [ ] Large Scale Area
- [ ] Confidence Band
- [ ] Area Pieces
- [ ] Time Series Area

### Bar

- [ ] Basic Bar
- [ ] Horizontal Bar
- [ ] Stacked Bar
- [ ] Normalized Stacked Bar
- [ ] Grouped Bar
- [ ] Rounded Bar
- [ ] Negative Bar
- [ ] Waterfall Bar
- [ ] Large Scale Bar
- [ ] Dynamic Bar
- [ ] Bar Race
- [ ] Drilldown Bar
- [ ] Polar Bar
- [ ] Radial Bar
- [ ] Sorted Bar

### Pie

- [ ] Basic Pie
- [ ] Donut
- [ ] Half Donut
- [ ] Rounded Donut
- [ ] Nightingale
- [ ] Nested Pie
- [ ] Scrollable Legend Pie
- [ ] Pie on Calendar
- [ ] Pie on GEO Map

### Scatter

- [ ] Basic Scatter
- [ ] Effect Scatter
- [ ] Bubble Chart
- [ ] Large Scatter
- [ ] Jitter Scatter
- [ ] Regression Scatter
- [ ] Scatter Matrix
- [ ] Calendar Scatter
- [ ] Geo Scatter
- [ ] Single Axis Scatter

### Heatmap

- [ ] Cartesian Heatmap
- [ ] Large Heatmap
- [ ] Discrete Color Heatmap
- [ ] Calendar Heatmap
- [ ] Matrix Heatmap

### GEO/Map

Folder: `geo-map`

- [ ] Geo Map
- [ ] Choropleth Map
- [ ] SVG Map
- [ ] Geo Scatter
- [ ] Geo Lines
- [ ] Map to Bar Morph
- [ ] Hexagonal Binning

### Candlestick

- [ ] Basic Candlestick
- [ ] OHLC
- [ ] Large Scale Candlestick
- [ ] Candlestick with Brush
- [ ] Intraday Candlestick

### Radar

- [ ] Basic Radar
- [ ] Customized Radar
- [ ] Multiple Radar

### Boxplot

- [ ] Basic Boxplot
- [ ] Aggregated Boxplot
- [ ] Multi Category Boxplot

### Graph

- [ ] Basic Graph
- [ ] Force Graph
- [ ] Graph on Cartesian
- [ ] Dynamic Graph
- [ ] Geo Graph
- [ ] Calendar Graph

### Lines

- [ ] Geo Lines
- [ ] Large Scale Lines

### Tree

- [ ] Basic Tree
- [ ] Horizontal Tree
- [ ] Vertical Tree
- [ ] Radial Tree
- [ ] Polyline Tree

### Treemap

- [ ] Basic Treemap
- [ ] Disk Usage Treemap
- [ ] Parent Label Treemap
- [ ] Gradient Treemap

### Sunburst

- [ ] Basic Sunburst
- [ ] Rounded Sunburst
- [ ] Rotated Label Sunburst
- [ ] Monochrome Sunburst
- [ ] VisualMap Sunburst

### Parallel

- [ ] Basic Parallel
- [ ] AQI Parallel
- [ ] Nutrients Parallel

### Sankey

- [ ] Basic Sankey
- [ ] Vertical Sankey
- [ ] Styled Sankey
- [ ] Level Sankey
- [ ] Gradient Edge Sankey
- [ ] Node Aligned Sankey

### Chord

- [ ] Basic Chord
- [ ] Chord minAngle
- [ ] Chord lineStyle.color
- [ ] Styled Chord

### Funnel

- [ ] Basic Funnel
- [ ] Compare Funnel
- [ ] Customized Funnel
- [ ] Multiple Funnel

### Gauge

- [ ] Basic Gauge
- [ ] Speed Gauge
- [ ] Progress Gauge
- [ ] Grade Gauge
- [ ] Multi Title Gauge
- [ ] Temperature Gauge
- [ ] Ring Gauge
- [ ] Barometer Gauge
- [ ] Clock Gauge

### PictorialBar

Folder: `pictorial-bar`

- [ ] Basic Pictorial Bar
- [ ] Symbol Pictorial Bar
- [ ] Dotted Pictorial Bar
- [ ] Image/SVG Pictorial Bar

### ThemeRiver

Folder: `theme-river`

- [ ] Basic ThemeRiver

### Calendar

- [ ] Basic Calendar
- [ ] Calendar Heatmap
- [ ] Calendar Graph
- [ ] Calendar Pie
- [ ] Calendar Icon

### Matrix

- [ ] Basic Matrix
- [ ] Correlation Matrix
- [ ] Covariance Matrix
- [ ] Confusion Matrix
- [ ] Graph Matrix
- [ ] Pie Matrix
- [ ] Responsive Matrix Layout

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

