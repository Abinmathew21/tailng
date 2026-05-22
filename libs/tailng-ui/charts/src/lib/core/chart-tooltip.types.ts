export type TngChartTooltipTrigger = 'axis' | 'item' | 'none';

export type TngChartTooltipConfig = Readonly<{
  enabled: boolean;
  trigger?: TngChartTooltipTrigger;
}>;
