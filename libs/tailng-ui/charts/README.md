# @tailng-ui/charts

Angular wrappers for Apache ECharts with TailNG-friendly APIs.

## Install

```bash
pnpm add @tailng-ui/charts echarts
```

## Usage

```ts
import { Component } from '@angular/core';
import { TngEchart, type TngChartOption } from '@tailng-ui/charts';

@Component({
  standalone: true,
  selector: 'app-chart-demo',
  imports: [TngEchart],
  template: `<tng-echart [option]="option" style="height:320px;display:block;" />`,
})
export class ChartDemoComponent {
  public readonly option: TngChartOption = {
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [12, 18, 9, 23, 16] }],
  };
}
```

## Notes

- `echarts` stays a peer dependency.
- The component lazy-loads runtime ECharts by default.
- A custom runtime loader can be provided for advanced bundle control.
