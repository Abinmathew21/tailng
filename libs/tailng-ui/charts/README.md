# @tailng-ui/charts

Angular wrappers for Apache ECharts with TailNG-friendly APIs.

## Install

```bash
pnpm add @tailng-ui/charts echarts
```

## Usage

### Generic Host

```ts
import { Component } from '@angular/core';
import { TngChart, type TngChartOption } from '@tailng-ui/charts';

@Component({
  standalone: true,
  selector: 'app-chart-demo',
  imports: [TngChart],
  template: `<tng-chart [option]="option" style="height:320px;display:block;" />`,
})
export class ChartDemoComponent {
  public readonly option: TngChartOption = {
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [12, 18, 9, 23, 16] }],
  };
}
```

### Bar Wrapper

```ts
import { Component } from '@angular/core';
import { TngBarChart, type TngChartData } from '@tailng-ui/charts';

@Component({
  standalone: true,
  selector: 'app-bar-chart-demo',
  imports: [TngBarChart],
  template: `<tng-bar-chart [data]="data" xField="country" yField="population" />`,
})
export class BarChartDemoComponent {
  public readonly data: TngChartData = [
    { country: 'India', population: 1428.6 },
    { country: 'China', population: 1410.7 },
    { country: 'USA', population: 339.7 },
  ];
}
```

### Line Wrapper

```ts
import { Component } from '@angular/core';
import { TngLineChart, type TngChartData } from '@tailng-ui/charts';

@Component({
  standalone: true,
  selector: 'app-line-chart-demo',
  imports: [TngLineChart],
  template: `<tng-line-chart [data]="data" xField="quarter" yField="revenue" smooth />`,
})
export class LineChartDemoComponent {
  public readonly data: TngChartData = [
    { quarter: 'Q1', revenue: 18 },
    { quarter: 'Q2', revenue: 24 },
    { quarter: 'Q3', revenue: 21 },
    { quarter: 'Q4', revenue: 30 },
  ];
}
```

### v1 Wrappers

`@tailng-ui/charts` exports first-class wrappers for line, bar, area, pie, scatter, and heatmap charts. Each wrapper accepts TailNG-owned inputs and an `optionOverride` escape hatch for advanced ECharts tweaks.

## Notes

- `echarts` stays a peer dependency.
- The default ECharts loader registers only the v1 chart modules and Canvas/SVG renderers.
- Canvas is the default renderer; set `renderer="svg"` to opt into SVG.
- A custom runtime loader can be provided for advanced bundle control.
