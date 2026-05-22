import type { TngCatalogChartPreset } from './catalog-chart.types';

export const TNG_CATALOG_CHART_PRESETS = [
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Basic Line",
    "selector": "tng-basic-line-chart",
    "seriesType": "line",
    "slug": "basic-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [
      "smooth"
    ],
    "name": "Smoothed Line",
    "selector": "tng-smoothed-line-chart",
    "seriesType": "line",
    "slug": "smoothed-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [
      "stacked"
    ],
    "name": "Stacked Line",
    "selector": "tng-stacked-line-chart",
    "seriesType": "line",
    "slug": "stacked-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [
      "step"
    ],
    "name": "Step Line",
    "selector": "tng-step-line-chart",
    "seriesType": "line",
    "slug": "step-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [
      "logAxis"
    ],
    "name": "Log Axis Line",
    "selector": "tng-log-axis-line-chart",
    "seriesType": "line",
    "slug": "log-axis-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [
      "timeAxis"
    ],
    "name": "Time Series Line",
    "selector": "tng-time-series-line-chart",
    "seriesType": "line",
    "slug": "time-series-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [
      "dynamic"
    ],
    "name": "Dynamic Line",
    "selector": "tng-dynamic-line-chart",
    "seriesType": "line",
    "slug": "dynamic-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [
      "race"
    ],
    "name": "Line Race",
    "selector": "tng-line-race-chart",
    "seriesType": "line",
    "slug": "line-race"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [
      "markLine"
    ],
    "name": "Line with Mark Lines",
    "selector": "tng-line-with-mark-lines-chart",
    "seriesType": "line",
    "slug": "line-with-mark-lines"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [
      "multiAxis"
    ],
    "name": "Multi Axis Line",
    "selector": "tng-multi-axis-line-chart",
    "seriesType": "line",
    "slug": "multi-axis-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "polar",
    "features": [
      "polar"
    ],
    "name": "Polar Line",
    "selector": "tng-polar-line-chart",
    "seriesType": "line",
    "slug": "polar-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Interactive Line",
    "selector": "tng-interactive-line-chart",
    "seriesType": "line",
    "slug": "interactive-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [
      "large"
    ],
    "name": "Large Scale Line",
    "selector": "tng-large-scale-line-chart",
    "seriesType": "line",
    "slug": "large-scale-line"
  },
  {
    "category": "Line",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Sparkline",
    "selector": "tng-sparkline-chart",
    "seriesType": "line",
    "slug": "sparkline"
  },
  {
    "category": "Area",
    "coordinateSystem": "cartesian2d",
    "features": [
      "area"
    ],
    "name": "Basic Area",
    "selector": "tng-basic-area-chart",
    "seriesType": "line",
    "slug": "basic-area"
  },
  {
    "category": "Area",
    "coordinateSystem": "cartesian2d",
    "features": [
      "area",
      "stacked"
    ],
    "name": "Stacked Area",
    "selector": "tng-stacked-area-chart",
    "seriesType": "line",
    "slug": "stacked-area"
  },
  {
    "category": "Area",
    "coordinateSystem": "cartesian2d",
    "features": [
      "area",
      "gradient"
    ],
    "name": "Gradient Area",
    "selector": "tng-gradient-area-chart",
    "seriesType": "line",
    "slug": "gradient-area"
  },
  {
    "category": "Area",
    "coordinateSystem": "cartesian2d",
    "features": [
      "area",
      "large"
    ],
    "name": "Large Scale Area",
    "selector": "tng-large-scale-area-chart",
    "seriesType": "line",
    "slug": "large-scale-area"
  },
  {
    "category": "Area",
    "coordinateSystem": "cartesian2d",
    "features": [
      "area",
      "confidenceBand"
    ],
    "name": "Confidence Band",
    "selector": "tng-confidence-band-chart",
    "seriesType": "line",
    "slug": "confidence-band"
  },
  {
    "category": "Area",
    "coordinateSystem": "cartesian2d",
    "features": [
      "area"
    ],
    "name": "Area Pieces",
    "selector": "tng-area-pieces-chart",
    "seriesType": "line",
    "slug": "area-pieces"
  },
  {
    "category": "Area",
    "coordinateSystem": "cartesian2d",
    "features": [
      "area",
      "timeAxis"
    ],
    "name": "Time Series Area",
    "selector": "tng-time-series-area-chart",
    "seriesType": "line",
    "slug": "time-series-area"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Basic Bar",
    "selector": "tng-basic-bar-chart",
    "seriesType": "bar",
    "slug": "basic-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "horizontal"
    ],
    "name": "Horizontal Bar",
    "selector": "tng-horizontal-bar-chart",
    "seriesType": "bar",
    "slug": "horizontal-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "stacked"
    ],
    "name": "Stacked Bar",
    "selector": "tng-stacked-bar-chart",
    "seriesType": "bar",
    "slug": "stacked-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "normalized",
      "stacked"
    ],
    "name": "Normalized Stacked Bar",
    "selector": "tng-normalized-stacked-bar-chart",
    "seriesType": "bar",
    "slug": "normalized-stacked-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Grouped Bar",
    "selector": "tng-grouped-bar-chart",
    "seriesType": "bar",
    "slug": "grouped-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "rounded"
    ],
    "name": "Rounded Bar",
    "selector": "tng-rounded-bar-chart",
    "seriesType": "bar",
    "slug": "rounded-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "negative"
    ],
    "name": "Negative Bar",
    "selector": "tng-negative-bar-chart",
    "seriesType": "bar",
    "slug": "negative-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "waterfall"
    ],
    "name": "Waterfall Bar",
    "selector": "tng-waterfall-bar-chart",
    "seriesType": "bar",
    "slug": "waterfall-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "large"
    ],
    "name": "Large Scale Bar",
    "selector": "tng-large-scale-bar-chart",
    "seriesType": "bar",
    "slug": "large-scale-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "dynamic"
    ],
    "name": "Dynamic Bar",
    "selector": "tng-dynamic-bar-chart",
    "seriesType": "bar",
    "slug": "dynamic-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "race"
    ],
    "name": "Bar Race",
    "selector": "tng-bar-race-chart",
    "seriesType": "bar",
    "slug": "bar-race"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "drilldown"
    ],
    "name": "Drilldown Bar",
    "selector": "tng-drilldown-bar-chart",
    "seriesType": "bar",
    "slug": "drilldown-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "polar",
    "features": [
      "polar"
    ],
    "name": "Polar Bar",
    "selector": "tng-polar-bar-chart",
    "seriesType": "bar",
    "slug": "polar-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "polar",
    "features": [
      "radial"
    ],
    "name": "Radial Bar",
    "selector": "tng-radial-bar-chart",
    "seriesType": "bar",
    "slug": "radial-bar"
  },
  {
    "category": "Bar",
    "coordinateSystem": "cartesian2d",
    "features": [
      "sorted"
    ],
    "name": "Sorted Bar",
    "selector": "tng-sorted-bar-chart",
    "seriesType": "bar",
    "slug": "sorted-bar"
  },
  {
    "category": "Pie",
    "coordinateSystem": "none",
    "features": [],
    "name": "Basic Pie",
    "selector": "tng-basic-pie-chart",
    "seriesType": "pie",
    "slug": "basic-pie"
  },
  {
    "category": "Pie",
    "coordinateSystem": "none",
    "features": [
      "ring"
    ],
    "name": "Donut",
    "selector": "tng-donut-chart",
    "seriesType": "pie",
    "slug": "donut"
  },
  {
    "category": "Pie",
    "coordinateSystem": "none",
    "features": [
      "half",
      "ring"
    ],
    "name": "Half Donut",
    "selector": "tng-half-donut-chart",
    "seriesType": "pie",
    "slug": "half-donut"
  },
  {
    "category": "Pie",
    "coordinateSystem": "none",
    "features": [
      "ring",
      "rounded"
    ],
    "name": "Rounded Donut",
    "selector": "tng-rounded-donut-chart",
    "seriesType": "pie",
    "slug": "rounded-donut"
  },
  {
    "category": "Pie",
    "coordinateSystem": "none",
    "features": [
      "nightingale"
    ],
    "name": "Nightingale",
    "selector": "tng-nightingale-chart",
    "seriesType": "pie",
    "slug": "nightingale"
  },
  {
    "category": "Pie",
    "coordinateSystem": "none",
    "features": [
      "nested"
    ],
    "name": "Nested Pie",
    "selector": "tng-nested-pie-chart",
    "seriesType": "pie",
    "slug": "nested-pie"
  },
  {
    "category": "Pie",
    "coordinateSystem": "none",
    "features": [
      "scrollLegend"
    ],
    "name": "Scrollable Legend Pie",
    "selector": "tng-scrollable-legend-pie-chart",
    "seriesType": "pie",
    "slug": "scrollable-legend-pie"
  },
  {
    "category": "Pie",
    "coordinateSystem": "calendar",
    "features": [
      "calendar"
    ],
    "name": "Pie on Calendar",
    "selector": "tng-pie-on-calendar-chart",
    "seriesType": "pie",
    "slug": "pie-on-calendar"
  },
  {
    "category": "Pie",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "Pie on GEO Map",
    "selector": "tng-pie-on-geo-map-chart",
    "seriesType": "pie",
    "slug": "pie-on-geo-map"
  },
  {
    "category": "Scatter",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Basic Scatter",
    "selector": "tng-basic-scatter-chart",
    "seriesType": "scatter",
    "slug": "basic-scatter"
  },
  {
    "category": "Scatter",
    "coordinateSystem": "cartesian2d",
    "features": [
      "effect"
    ],
    "name": "Effect Scatter",
    "selector": "tng-effect-scatter-chart",
    "seriesType": "effectScatter",
    "slug": "effect-scatter"
  },
  {
    "category": "Scatter",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Bubble Chart",
    "selector": "tng-bubble-chart-chart",
    "seriesType": "scatter",
    "slug": "bubble-chart"
  },
  {
    "category": "Scatter",
    "coordinateSystem": "cartesian2d",
    "features": [
      "large"
    ],
    "name": "Large Scatter",
    "selector": "tng-large-scatter-chart",
    "seriesType": "scatter",
    "slug": "large-scatter"
  },
  {
    "category": "Scatter",
    "coordinateSystem": "cartesian2d",
    "features": [
      "jitter"
    ],
    "name": "Jitter Scatter",
    "selector": "tng-jitter-scatter-chart",
    "seriesType": "scatter",
    "slug": "jitter-scatter"
  },
  {
    "category": "Scatter",
    "coordinateSystem": "cartesian2d",
    "features": [
      "regression"
    ],
    "name": "Regression Scatter",
    "selector": "tng-regression-scatter-chart",
    "seriesType": "scatter",
    "slug": "regression-scatter"
  },
  {
    "category": "Scatter",
    "coordinateSystem": "matrix",
    "features": [
      "matrix"
    ],
    "name": "Scatter Matrix",
    "selector": "tng-scatter-matrix-chart",
    "seriesType": "scatter",
    "slug": "scatter-matrix"
  },
  {
    "category": "Scatter",
    "coordinateSystem": "calendar",
    "features": [
      "calendar"
    ],
    "name": "Calendar Scatter",
    "selector": "tng-calendar-scatter-chart",
    "seriesType": "scatter",
    "slug": "calendar-scatter"
  },
  {
    "category": "Scatter",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "Geo Scatter",
    "selector": "tng-scatter-geo-scatter-chart",
    "seriesType": "scatter",
    "slug": "geo-scatter"
  },
  {
    "category": "Scatter",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Single Axis Scatter",
    "selector": "tng-single-axis-scatter-chart",
    "seriesType": "scatter",
    "slug": "single-axis-scatter"
  },
  {
    "category": "Heatmap",
    "coordinateSystem": "geo",
    "features": [],
    "name": "Cartesian Heatmap",
    "selector": "tng-cartesian-heatmap-chart",
    "seriesType": "heatmap",
    "slug": "cartesian-heatmap"
  },
  {
    "category": "Heatmap",
    "coordinateSystem": "geo",
    "features": [
      "large"
    ],
    "name": "Large Heatmap",
    "selector": "tng-large-heatmap-chart",
    "seriesType": "heatmap",
    "slug": "large-heatmap"
  },
  {
    "category": "Heatmap",
    "coordinateSystem": "geo",
    "features": [
      "discreteVisualMap"
    ],
    "name": "Discrete Color Heatmap",
    "selector": "tng-discrete-color-heatmap-chart",
    "seriesType": "heatmap",
    "slug": "discrete-color-heatmap"
  },
  {
    "category": "Heatmap",
    "coordinateSystem": "calendar",
    "features": [
      "calendar"
    ],
    "name": "Calendar Heatmap",
    "selector": "tng-heatmap-calendar-heatmap-chart",
    "seriesType": "heatmap",
    "slug": "calendar-heatmap"
  },
  {
    "category": "Heatmap",
    "coordinateSystem": "geo",
    "features": [
      "matrix"
    ],
    "name": "Matrix Heatmap",
    "selector": "tng-matrix-heatmap-chart",
    "seriesType": "heatmap",
    "slug": "matrix-heatmap"
  },
  {
    "category": "GEO/Map",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "Geo Map",
    "selector": "tng-geo-map-chart",
    "seriesType": "map",
    "slug": "geo-map"
  },
  {
    "category": "GEO/Map",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "Choropleth Map",
    "selector": "tng-choropleth-map-chart",
    "seriesType": "map",
    "slug": "choropleth-map"
  },
  {
    "category": "GEO/Map",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "SVG Map",
    "selector": "tng-svg-map-chart",
    "seriesType": "map",
    "slug": "svg-map"
  },
  {
    "category": "GEO/Map",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "Geo Scatter",
    "selector": "tng-geo-map-geo-scatter-chart",
    "seriesType": "scatter",
    "slug": "geo-scatter"
  },
  {
    "category": "GEO/Map",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "Geo Lines",
    "selector": "tng-geo-map-geo-lines-chart",
    "seriesType": "lines",
    "slug": "geo-lines"
  },
  {
    "category": "GEO/Map",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "Map to Bar Morph",
    "selector": "tng-map-to-bar-morph-chart",
    "seriesType": "bar",
    "slug": "map-to-bar-morph"
  },
  {
    "category": "GEO/Map",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "Hexagonal Binning",
    "selector": "tng-hexagonal-binning-chart",
    "seriesType": "custom",
    "slug": "hexagonal-binning"
  },
  {
    "category": "Candlestick",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Basic Candlestick",
    "selector": "tng-basic-candlestick-chart",
    "seriesType": "candlestick",
    "slug": "basic-candlestick"
  },
  {
    "category": "Candlestick",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "OHLC",
    "selector": "tng-ohlc-chart",
    "seriesType": "candlestick",
    "slug": "ohlc"
  },
  {
    "category": "Candlestick",
    "coordinateSystem": "cartesian2d",
    "features": [
      "large"
    ],
    "name": "Large Scale Candlestick",
    "selector": "tng-large-scale-candlestick-chart",
    "seriesType": "candlestick",
    "slug": "large-scale-candlestick"
  },
  {
    "category": "Candlestick",
    "coordinateSystem": "cartesian2d",
    "features": [
      "brush"
    ],
    "name": "Candlestick with Brush",
    "selector": "tng-candlestick-with-brush-chart",
    "seriesType": "candlestick",
    "slug": "candlestick-with-brush"
  },
  {
    "category": "Candlestick",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Intraday Candlestick",
    "selector": "tng-intraday-candlestick-chart",
    "seriesType": "candlestick",
    "slug": "intraday-candlestick"
  },
  {
    "category": "Radar",
    "coordinateSystem": "radar",
    "features": [],
    "name": "Basic Radar",
    "selector": "tng-basic-radar-chart",
    "seriesType": "radar",
    "slug": "basic-radar"
  },
  {
    "category": "Radar",
    "coordinateSystem": "radar",
    "features": [],
    "name": "Customized Radar",
    "selector": "tng-customized-radar-chart",
    "seriesType": "radar",
    "slug": "customized-radar"
  },
  {
    "category": "Radar",
    "coordinateSystem": "radar",
    "features": [],
    "name": "Multiple Radar",
    "selector": "tng-multiple-radar-chart",
    "seriesType": "radar",
    "slug": "multiple-radar"
  },
  {
    "category": "Boxplot",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Basic Boxplot",
    "selector": "tng-basic-boxplot-chart",
    "seriesType": "boxplot",
    "slug": "basic-boxplot"
  },
  {
    "category": "Boxplot",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Aggregated Boxplot",
    "selector": "tng-aggregated-boxplot-chart",
    "seriesType": "boxplot",
    "slug": "aggregated-boxplot"
  },
  {
    "category": "Boxplot",
    "coordinateSystem": "cartesian2d",
    "features": [],
    "name": "Multi Category Boxplot",
    "selector": "tng-multi-category-boxplot-chart",
    "seriesType": "boxplot",
    "slug": "multi-category-boxplot"
  },
  {
    "category": "Graph",
    "coordinateSystem": "none",
    "features": [],
    "name": "Basic Graph",
    "selector": "tng-basic-graph-chart",
    "seriesType": "graph",
    "slug": "basic-graph"
  },
  {
    "category": "Graph",
    "coordinateSystem": "none",
    "features": [],
    "name": "Force Graph",
    "selector": "tng-force-graph-chart",
    "seriesType": "graph",
    "slug": "force-graph"
  },
  {
    "category": "Graph",
    "coordinateSystem": "none",
    "features": [],
    "name": "Graph on Cartesian",
    "selector": "tng-graph-on-cartesian-chart",
    "seriesType": "graph",
    "slug": "graph-on-cartesian"
  },
  {
    "category": "Graph",
    "coordinateSystem": "none",
    "features": [
      "dynamic"
    ],
    "name": "Dynamic Graph",
    "selector": "tng-dynamic-graph-chart",
    "seriesType": "graph",
    "slug": "dynamic-graph"
  },
  {
    "category": "Graph",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "Geo Graph",
    "selector": "tng-geo-graph-chart",
    "seriesType": "graph",
    "slug": "geo-graph"
  },
  {
    "category": "Graph",
    "coordinateSystem": "calendar",
    "features": [
      "calendar"
    ],
    "name": "Calendar Graph",
    "selector": "tng-graph-calendar-graph-chart",
    "seriesType": "graph",
    "slug": "calendar-graph"
  },
  {
    "category": "Lines",
    "coordinateSystem": "geo",
    "features": [
      "geo"
    ],
    "name": "Geo Lines",
    "selector": "tng-lines-geo-lines-chart",
    "seriesType": "lines",
    "slug": "geo-lines"
  },
  {
    "category": "Lines",
    "coordinateSystem": "none",
    "features": [
      "large"
    ],
    "name": "Large Scale Lines",
    "selector": "tng-large-scale-lines-chart",
    "seriesType": "lines",
    "slug": "large-scale-lines"
  },
  {
    "category": "Tree",
    "coordinateSystem": "none",
    "features": [],
    "name": "Basic Tree",
    "selector": "tng-basic-tree-chart",
    "seriesType": "tree",
    "slug": "basic-tree"
  },
  {
    "category": "Tree",
    "coordinateSystem": "none",
    "features": [
      "horizontal"
    ],
    "name": "Horizontal Tree",
    "selector": "tng-horizontal-tree-chart",
    "seriesType": "tree",
    "slug": "horizontal-tree"
  },
  {
    "category": "Tree",
    "coordinateSystem": "none",
    "features": [
      "vertical"
    ],
    "name": "Vertical Tree",
    "selector": "tng-vertical-tree-chart",
    "seriesType": "tree",
    "slug": "vertical-tree"
  },
  {
    "category": "Tree",
    "coordinateSystem": "polar",
    "features": [
      "radial"
    ],
    "name": "Radial Tree",
    "selector": "tng-radial-tree-chart",
    "seriesType": "tree",
    "slug": "radial-tree"
  },
  {
    "category": "Tree",
    "coordinateSystem": "none",
    "features": [],
    "name": "Polyline Tree",
    "selector": "tng-polyline-tree-chart",
    "seriesType": "tree",
    "slug": "polyline-tree"
  },
  {
    "category": "Treemap",
    "coordinateSystem": "geo",
    "features": [],
    "name": "Basic Treemap",
    "selector": "tng-basic-treemap-chart",
    "seriesType": "treemap",
    "slug": "basic-treemap"
  },
  {
    "category": "Treemap",
    "coordinateSystem": "geo",
    "features": [],
    "name": "Disk Usage Treemap",
    "selector": "tng-disk-usage-treemap-chart",
    "seriesType": "treemap",
    "slug": "disk-usage-treemap"
  },
  {
    "category": "Treemap",
    "coordinateSystem": "geo",
    "features": [],
    "name": "Parent Label Treemap",
    "selector": "tng-parent-label-treemap-chart",
    "seriesType": "treemap",
    "slug": "parent-label-treemap"
  },
  {
    "category": "Treemap",
    "coordinateSystem": "geo",
    "features": [
      "gradient"
    ],
    "name": "Gradient Treemap",
    "selector": "tng-gradient-treemap-chart",
    "seriesType": "treemap",
    "slug": "gradient-treemap"
  },
  {
    "category": "Sunburst",
    "coordinateSystem": "none",
    "features": [],
    "name": "Basic Sunburst",
    "selector": "tng-basic-sunburst-chart",
    "seriesType": "sunburst",
    "slug": "basic-sunburst"
  },
  {
    "category": "Sunburst",
    "coordinateSystem": "none",
    "features": [
      "rounded"
    ],
    "name": "Rounded Sunburst",
    "selector": "tng-rounded-sunburst-chart",
    "seriesType": "sunburst",
    "slug": "rounded-sunburst"
  },
  {
    "category": "Sunburst",
    "coordinateSystem": "none",
    "features": [],
    "name": "Rotated Label Sunburst",
    "selector": "tng-rotated-label-sunburst-chart",
    "seriesType": "sunburst",
    "slug": "rotated-label-sunburst"
  },
  {
    "category": "Sunburst",
    "coordinateSystem": "none",
    "features": [],
    "name": "Monochrome Sunburst",
    "selector": "tng-monochrome-sunburst-chart",
    "seriesType": "sunburst",
    "slug": "monochrome-sunburst"
  },
  {
    "category": "Sunburst",
    "coordinateSystem": "geo",
    "features": [
      "visualMap"
    ],
    "name": "VisualMap Sunburst",
    "selector": "tng-visual-map-sunburst-chart",
    "seriesType": "sunburst",
    "slug": "visual-map-sunburst"
  },
  {
    "category": "Parallel",
    "coordinateSystem": "parallel",
    "features": [],
    "name": "Basic Parallel",
    "selector": "tng-basic-parallel-chart",
    "seriesType": "parallel",
    "slug": "basic-parallel"
  },
  {
    "category": "Parallel",
    "coordinateSystem": "parallel",
    "features": [],
    "name": "AQI Parallel",
    "selector": "tng-aqi-parallel-chart",
    "seriesType": "parallel",
    "slug": "aqi-parallel"
  },
  {
    "category": "Parallel",
    "coordinateSystem": "parallel",
    "features": [],
    "name": "Nutrients Parallel",
    "selector": "tng-nutrients-parallel-chart",
    "seriesType": "parallel",
    "slug": "nutrients-parallel"
  },
  {
    "category": "Sankey",
    "coordinateSystem": "none",
    "features": [],
    "name": "Basic Sankey",
    "selector": "tng-basic-sankey-chart",
    "seriesType": "sankey",
    "slug": "basic-sankey"
  },
  {
    "category": "Sankey",
    "coordinateSystem": "none",
    "features": [
      "vertical"
    ],
    "name": "Vertical Sankey",
    "selector": "tng-vertical-sankey-chart",
    "seriesType": "sankey",
    "slug": "vertical-sankey"
  },
  {
    "category": "Sankey",
    "coordinateSystem": "none",
    "features": [],
    "name": "Styled Sankey",
    "selector": "tng-styled-sankey-chart",
    "seriesType": "sankey",
    "slug": "styled-sankey"
  },
  {
    "category": "Sankey",
    "coordinateSystem": "none",
    "features": [
      "level"
    ],
    "name": "Level Sankey",
    "selector": "tng-level-sankey-chart",
    "seriesType": "sankey",
    "slug": "level-sankey"
  },
  {
    "category": "Sankey",
    "coordinateSystem": "none",
    "features": [
      "gradient"
    ],
    "name": "Gradient Edge Sankey",
    "selector": "tng-gradient-edge-sankey-chart",
    "seriesType": "sankey",
    "slug": "gradient-edge-sankey"
  },
  {
    "category": "Sankey",
    "coordinateSystem": "none",
    "features": [],
    "name": "Node Aligned Sankey",
    "selector": "tng-node-aligned-sankey-chart",
    "seriesType": "sankey",
    "slug": "node-aligned-sankey"
  },
  {
    "category": "Chord",
    "coordinateSystem": "none",
    "features": [],
    "name": "Basic Chord",
    "selector": "tng-basic-chord-chart",
    "seriesType": "chord",
    "slug": "basic-chord"
  },
  {
    "category": "Chord",
    "coordinateSystem": "none",
    "features": [],
    "name": "Chord minAngle",
    "selector": "tng-chord-min-angle-chart",
    "seriesType": "chord",
    "slug": "chord-min-angle"
  },
  {
    "category": "Chord",
    "coordinateSystem": "none",
    "features": [],
    "name": "Chord lineStyle.color",
    "selector": "tng-chord-line-style-color-chart",
    "seriesType": "chord",
    "slug": "chord-line-style-color"
  },
  {
    "category": "Chord",
    "coordinateSystem": "none",
    "features": [],
    "name": "Styled Chord",
    "selector": "tng-styled-chord-chart",
    "seriesType": "chord",
    "slug": "styled-chord"
  },
  {
    "category": "Funnel",
    "coordinateSystem": "none",
    "features": [],
    "name": "Basic Funnel",
    "selector": "tng-basic-funnel-chart",
    "seriesType": "funnel",
    "slug": "basic-funnel"
  },
  {
    "category": "Funnel",
    "coordinateSystem": "none",
    "features": [],
    "name": "Compare Funnel",
    "selector": "tng-compare-funnel-chart",
    "seriesType": "funnel",
    "slug": "compare-funnel"
  },
  {
    "category": "Funnel",
    "coordinateSystem": "none",
    "features": [],
    "name": "Customized Funnel",
    "selector": "tng-customized-funnel-chart",
    "seriesType": "funnel",
    "slug": "customized-funnel"
  },
  {
    "category": "Funnel",
    "coordinateSystem": "none",
    "features": [],
    "name": "Multiple Funnel",
    "selector": "tng-multiple-funnel-chart",
    "seriesType": "funnel",
    "slug": "multiple-funnel"
  },
  {
    "category": "Gauge",
    "coordinateSystem": "none",
    "features": [],
    "name": "Basic Gauge",
    "selector": "tng-basic-gauge-chart",
    "seriesType": "gauge",
    "slug": "basic-gauge"
  },
  {
    "category": "Gauge",
    "coordinateSystem": "none",
    "features": [
      "progress"
    ],
    "name": "Speed Gauge",
    "selector": "tng-speed-gauge-chart",
    "seriesType": "gauge",
    "slug": "speed-gauge"
  },
  {
    "category": "Gauge",
    "coordinateSystem": "none",
    "features": [
      "progress"
    ],
    "name": "Progress Gauge",
    "selector": "tng-progress-gauge-chart",
    "seriesType": "gauge",
    "slug": "progress-gauge"
  },
  {
    "category": "Gauge",
    "coordinateSystem": "none",
    "features": [
      "progress"
    ],
    "name": "Grade Gauge",
    "selector": "tng-grade-gauge-chart",
    "seriesType": "gauge",
    "slug": "grade-gauge"
  },
  {
    "category": "Gauge",
    "coordinateSystem": "none",
    "features": [],
    "name": "Multi Title Gauge",
    "selector": "tng-multi-title-gauge-chart",
    "seriesType": "gauge",
    "slug": "multi-title-gauge"
  },
  {
    "category": "Gauge",
    "coordinateSystem": "none",
    "features": [
      "progress"
    ],
    "name": "Temperature Gauge",
    "selector": "tng-temperature-gauge-chart",
    "seriesType": "gauge",
    "slug": "temperature-gauge"
  },
  {
    "category": "Gauge",
    "coordinateSystem": "none",
    "features": [
      "ring"
    ],
    "name": "Ring Gauge",
    "selector": "tng-ring-gauge-chart",
    "seriesType": "gauge",
    "slug": "ring-gauge"
  },
  {
    "category": "Gauge",
    "coordinateSystem": "none",
    "features": [
      "barometer"
    ],
    "name": "Barometer Gauge",
    "selector": "tng-barometer-gauge-chart",
    "seriesType": "gauge",
    "slug": "barometer-gauge"
  },
  {
    "category": "Gauge",
    "coordinateSystem": "none",
    "features": [
      "clock"
    ],
    "name": "Clock Gauge",
    "selector": "tng-clock-gauge-chart",
    "seriesType": "gauge",
    "slug": "clock-gauge"
  },
  {
    "category": "PictorialBar",
    "coordinateSystem": "none",
    "features": [],
    "name": "Basic Pictorial Bar",
    "selector": "tng-basic-pictorial-bar-chart",
    "seriesType": "pictorialBar",
    "slug": "basic-pictorial-bar"
  },
  {
    "category": "PictorialBar",
    "coordinateSystem": "none",
    "features": [],
    "name": "Symbol Pictorial Bar",
    "selector": "tng-symbol-pictorial-bar-chart",
    "seriesType": "pictorialBar",
    "slug": "symbol-pictorial-bar"
  },
  {
    "category": "PictorialBar",
    "coordinateSystem": "none",
    "features": [],
    "name": "Dotted Pictorial Bar",
    "selector": "tng-dotted-pictorial-bar-chart",
    "seriesType": "pictorialBar",
    "slug": "dotted-pictorial-bar"
  },
  {
    "category": "PictorialBar",
    "coordinateSystem": "none",
    "features": [],
    "name": "Image/SVG Pictorial Bar",
    "selector": "tng-image-svg-pictorial-bar-chart",
    "seriesType": "pictorialBar",
    "slug": "image-svg-pictorial-bar"
  },
  {
    "category": "ThemeRiver",
    "coordinateSystem": "none",
    "features": [],
    "name": "Basic ThemeRiver",
    "selector": "tng-basic-theme-river-chart",
    "seriesType": "themeRiver",
    "slug": "basic-theme-river"
  },
  {
    "category": "Calendar",
    "coordinateSystem": "calendar",
    "features": [
      "calendar"
    ],
    "name": "Basic Calendar",
    "selector": "tng-basic-calendar-chart",
    "seriesType": "custom",
    "slug": "basic-calendar"
  },
  {
    "category": "Calendar",
    "coordinateSystem": "calendar",
    "features": [
      "calendar"
    ],
    "name": "Calendar Heatmap",
    "selector": "tng-calendar-calendar-heatmap-chart",
    "seriesType": "heatmap",
    "slug": "calendar-heatmap"
  },
  {
    "category": "Calendar",
    "coordinateSystem": "calendar",
    "features": [
      "calendar"
    ],
    "name": "Calendar Graph",
    "selector": "tng-calendar-calendar-graph-chart",
    "seriesType": "graph",
    "slug": "calendar-graph"
  },
  {
    "category": "Calendar",
    "coordinateSystem": "calendar",
    "features": [
      "calendar"
    ],
    "name": "Calendar Pie",
    "selector": "tng-calendar-pie-chart",
    "seriesType": "pie",
    "slug": "calendar-pie"
  },
  {
    "category": "Calendar",
    "coordinateSystem": "calendar",
    "features": [
      "calendar"
    ],
    "name": "Calendar Icon",
    "selector": "tng-calendar-icon-chart",
    "seriesType": "custom",
    "slug": "calendar-icon"
  },
  {
    "category": "Matrix",
    "coordinateSystem": "matrix",
    "features": [
      "matrix"
    ],
    "name": "Basic Matrix",
    "selector": "tng-basic-matrix-chart",
    "seriesType": "heatmap",
    "slug": "basic-matrix"
  },
  {
    "category": "Matrix",
    "coordinateSystem": "matrix",
    "features": [
      "matrix"
    ],
    "name": "Correlation Matrix",
    "selector": "tng-correlation-matrix-chart",
    "seriesType": "heatmap",
    "slug": "correlation-matrix"
  },
  {
    "category": "Matrix",
    "coordinateSystem": "matrix",
    "features": [
      "matrix"
    ],
    "name": "Covariance Matrix",
    "selector": "tng-covariance-matrix-chart",
    "seriesType": "heatmap",
    "slug": "covariance-matrix"
  },
  {
    "category": "Matrix",
    "coordinateSystem": "matrix",
    "features": [
      "matrix"
    ],
    "name": "Confusion Matrix",
    "selector": "tng-confusion-matrix-chart",
    "seriesType": "heatmap",
    "slug": "confusion-matrix"
  },
  {
    "category": "Matrix",
    "coordinateSystem": "matrix",
    "features": [
      "matrix"
    ],
    "name": "Graph Matrix",
    "selector": "tng-graph-matrix-chart",
    "seriesType": "graph",
    "slug": "graph-matrix"
  },
  {
    "category": "Matrix",
    "coordinateSystem": "matrix",
    "features": [
      "matrix"
    ],
    "name": "Pie Matrix",
    "selector": "tng-pie-matrix-chart",
    "seriesType": "pie",
    "slug": "pie-matrix"
  },
  {
    "category": "Matrix",
    "coordinateSystem": "matrix",
    "features": [
      "matrix"
    ],
    "name": "Responsive Matrix Layout",
    "selector": "tng-responsive-matrix-layout-chart",
    "seriesType": "heatmap",
    "slug": "responsive-matrix-layout"
  }
] as const satisfies readonly TngCatalogChartPreset[];
