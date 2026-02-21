# TailNG Charts Plan (`@tailng-ui/charts`)

## Source of Truth (Apache ECharts)

- Series catalog (official cheat sheet): https://echarts.apache.org/v4/en/cheat-sheet.html
- Feature overview (official): https://echarts.apache.org/en/feature.html
- Custom series (v6, registerable custom series): https://echarts.apache.org/handbook/en/how-to/custom-series

---

## Complete Built-in ECharts Series List (Core)

> Below is the full built-in series set from Apache ECharts cheat sheet (core package).

- [x] `bar` (Bar)
- [x] `line` (Line)
- [ ] `pie` (Pie)
- [ ] `scatter` (Scatter)
- [ ] `effectScatter` (Effect Scatter)
- [ ] `candlestick` (Candlestick / K-line)
- [ ] `radar` (Radar)
- [ ] `heatmap` (Heatmap)
- [ ] `tree` (Tree)
- [ ] `treemap` (Treemap)
- [ ] `sunburst` (Sunburst)
- [ ] `map` (Map)
- [ ] `lines` (Lines)
- [ ] `graph` (Graph / Relationship)
- [ ] `boxplot` (Boxplot)
- [ ] `parallel` (Parallel)
- [ ] `gauge` (Gauge)
- [ ] `funnel` (Funnel)
- [ ] `sankey` (Sankey)
- [ ] `themeRiver` (Theme River)
- [ ] `pictorialBar` (Pictorial Bar)
- [ ] `custom` (Custom Series)

---

## Optional Extension Families (Not Core, Decide Later)

- [ ] `echarts-gl` (3D charts like `scatter3D`, `bar3D`, `line3D`, surface, globe)
- [ ] Word cloud extension
- [ ] Liquid fill extension
- [ ] Geo map data packs / specialized map toolchains

---

## TailNG Rollout Plan

## Phase 0: Foundation

- [x] Create publishable `@tailng-ui/charts` library.
- [x] Add base `tng-chart` standalone component.
- [x] Add runtime lazy-loader API (`loadTngEchartsRuntime` + custom loader).
- [x] Add core type contracts (`TngChartOption`, runtime types).
- [x] Add base unit tests for loader + component helpers.

## Phase 1: First-Class Common Charts

- [x] Line chart preset API + demo.
- [x] Bar chart preset API + demo.
- [ ] Pie chart preset API + demo.
- [ ] Scatter chart preset API + demo.
- [ ] Area chart presets (line/bar variants) + demo.
- [ ] Theme token mapping guide for chart colors/typography.

## Phase 2: Analytical/Business Charts

- [ ] Candlestick
- [ ] Boxplot
- [ ] Heatmap
- [ ] Radar
- [ ] Gauge
- [ ] Funnel
- [ ] Sankey
- [ ] ThemeRiver
- [ ] Parallel

## Phase 3: Hierarchy/Relationship/Geo

- [ ] Tree
- [ ] Treemap
- [ ] Sunburst
- [ ] Graph
- [ ] Lines
- [ ] Map

## Phase 4: Visual Enrichment

- [ ] EffectScatter
- [ ] PictorialBar
- [ ] Custom series adapter API
- [ ] Registerable custom-series package integration path (`@echarts-x/*`)

---

## Wrapper API Strategy

- [ ] Keep one low-level primitive wrapper: `<tng-chart>`.
- [ ] Add optional preset builders (pure functions) per chart type.
- [ ] Keep config passthrough for full ECharts power (`option` not restricted).
- [ ] Keep strict typing where stable; avoid over-constraining ECharts options.
- [ ] Do not couple chart behavior to Tailwind or specific CSS frameworks.

---

## Demo & Docs Plan

- [ ] Tailwind playground charts page.
- [ ] Vanilla playground charts page.
- [ ] Docs page for install + quickstart + accessibility notes.
- [ ] Examples for responsive resize, loading, empty/error state.
- [ ] Examples for large dataset/performance mode.

---

## Testing Plan

- [ ] Unit: option patching, merge/notMerge, runtime loader failure handling.
- [ ] Unit: resize observer attach/detach and disposal lifecycle.
- [ ] Unit: loading state forwarding to ECharts API.
- [ ] Integration: render smoke tests in playground apps.
- [ ] Snapshot tests for preset option builders.

---

## Accessibility Plan

- [ ] Expose `aria-label`/`aria-describedby` guidance in wrappers.
- [ ] Provide “data table fallback” recipe for critical charts.
- [ ] Ensure keyboard focus affordance for chart container actions.
- [ ] Document screen-reader limitations of canvas/SVG charts.

---

## Packaging & Release Plan

- [ ] Keep `echarts` as peer dependency.
- [ ] Publish `@tailng-ui/charts` with semver aligned to TailNG release cadence.
- [ ] Add `test:charts` into CI gates.
- [ ] Add docs changelog entry when each chart type ships.
