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
import { TngBarChart, type TngBarChartInput } from '@tailng-ui/charts';

@Component({
  standalone: true,
  selector: 'app-bar-chart-demo',
  imports: [TngBarChart],
  template: `<tng-bar-chart [data]="data" kind="bar" style="height:320px;display:block;" />`,
})
export class BarChartDemoComponent {
  public readonly data: TngBarChartInput = {
    categories: ['India', 'China', 'USA'],
    series: [{ name: 'Population', values: [1428.6, 1410.7, 339.7] }],
    unitLabel: 'millions',
    yAxisLabel: 'Population',
  };
}
```

### Line Wrapper

```ts
import { Component } from '@angular/core';
import { TngLineChart, type TngLineChartInput } from '@tailng-ui/charts';

@Component({
  standalone: true,
  selector: 'app-line-chart-demo',
  imports: [TngLineChart],
  template: `<tng-line-chart [data]="data" style="height:320px;display:block;" />`,
})
export class LineChartDemoComponent {
  public readonly data: TngLineChartInput = {
    categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [{ name: 'Revenue', values: [18, 24, 21, 30], fillArea: true }],
    unitLabel: 'USD million',
    yAxisLabel: 'Revenue',
  };
}
```

## Notes

- `echarts` stays a peer dependency.
- The component lazy-loads runtime ECharts by default.
- A custom runtime loader can be provided for advanced bundle control.
