import type { DocsExampleCodeTab } from '../../../../../shared/example-panel/docs-example-panel.component';

export const CHART_PILOT_TAILWIND_SHELL_CLASS = [
  'w-full min-h-[20rem] rounded-2xl border border-[var(--tng-semantic-border-subtle)]',
  'bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-background-surface)_8%),color-mix(in_srgb,var(--tng-semantic-background-base)_76%,var(--tng-semantic-background-surface)_24%))]',
  'p-4 text-[var(--tng-semantic-foreground-primary)]',
  'shadow-[0_10px_24px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]',
].join(' ');

export function createChartPilotCodeTabs(options: {
  baseName: string;
  tsCode: string;
  htmlCode: string;
  cssCode: string;
}): readonly DocsExampleCodeTab[] {
  const { baseName, tsCode, htmlCode, cssCode } = options;
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: tsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

export const CHART_PILOT_PLAIN_LAYOUT_CSS = [
  '/* Layout only; chart colors come from TailNG chart variables on the host. */',
  '',
  '.chart-pilot-example-preview {',
  '  display: grid;',
  '  gap: 0.85rem;',
  '  width: min(100%, 48rem);',
  '}',
  '',
  '.chart-pilot-example-chart--plain {',
  '  background: var(--tng-semantic-background-base);',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 0.75rem;',
  '  min-height: 20rem;',
  '  padding: 1rem;',
  '  width: 100%;',
  '}',
  '',
  '.chart-pilot-example-chart--themed tng-basic-line-chart,',
  '.chart-pilot-example-chart--themed tng-stacked-bar-chart,',
  '.chart-pilot-example-chart--themed tng-donut-chart {',
  '  --tng-chart-series-1: var(--tng-semantic-accent-brand);',
  '  --tng-chart-axis-label: var(--tng-semantic-foreground-secondary);',
  '  --tng-chart-grid-line: color-mix(in srgb, var(--tng-semantic-border-subtle) 72%, transparent);',
  '}',
  '',
].join('\n');

export const CHART_PILOT_TAILWIND_LAYOUT_CSS = [
  '/* Chart components use default styles; Tailwind owns the outer analytics shell only. */',
  '',
].join('\n');
