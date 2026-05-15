import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons';
import {
  bindTngDateRangePicker,
  createDateRangePickerController,
  defaultDateRangePickerDateAdapter,
  TngDateRangePickerDayCell,
  TngDateRangePickerDayGrid,
  TngDateRangePickerHost,
  TngDateRangePickerInput,
  TngDateRangePickerMonthGrid,
  TngDateRangePickerMonthOption,
  TngDateRangePickerNextButton,
  TngDateRangePickerOverlay,
  TngDateRangePickerPeriodButton,
  TngDateRangePickerPrevButton,
  TngDateRangePickerTrigger,
  TngDateRangePickerYearGrid,
  TngDateRangePickerYearOption,
  type TngDateAdapter,
} from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../date-range-picker.util';

type ExampleBindingNames = {
  adapter: string;
  anchorRef: string;
  controller: string;
  dateRangePicker: string;
};

type ExampleClassNames = {
  anchor: string;
  cell: string;
  dayGrid: string;
  demo: string;
  field: string;
  header: string;
  headerRow: string;
  input: string;
  nav: string;
  overlay: string;
  period: string;
  periodChevron: string;
  periodTitle: string;
  pickerCell: string;
  pickerGrid: string;
  shell: string;
  trigger: string;
  triggerChevron: string;
  triggerIcon: string;
  weekdays: string;
};

function createSnippetKey(name: string): string {
  return name.replace(/^headless-/, '');
}

function createExampleBindingNames(name: string): ExampleBindingNames {
  const base = toCamelCase(createSnippetKey(name));
  return {
    adapter: `${base}Adapter`,
    anchorRef: `${base}AnchorShell`,
    controller: `${base}Controller`,
    dateRangePicker: `${base}DateRangePicker`,
  };
}

function createExampleClassNames(name: string): ExampleClassNames {
  const base = `${createSnippetKey(name)}-date-range-picker`;
  return {
    anchor: `${base}-anchor`,
    cell: `${base}-cell`,
    dayGrid: `${base}-day-grid`,
    demo: `${base}-demo`,
    field: `${base}-field`,
    header: `${base}-header`,
    headerRow: `${base}-header-row`,
    input: `${base}-input`,
    nav: `${base}-nav`,
    overlay: `${base}-overlay`,
    period: `${base}-period`,
    periodChevron: `${base}-period-chevron`,
    periodTitle: `${base}-period-title`,
    pickerCell: `${base}-picker-cell`,
    pickerGrid: `${base}-picker-grid`,
    shell: `${base}-shell`,
    trigger: `${base}-trigger`,
    triggerChevron: `${base}-trigger-chevron`,
    triggerIcon: `${base}-trigger-icon`,
    weekdays: `${base}-weekdays`,
  };
}

function createScopedSharedCssCode(classes: ExampleClassNames): string {
  return [
    `.${classes.demo} {`,
    '  display: block;',
    '  inline-size: 18.5rem;',
    '  max-inline-size: 100%;',
    '  --tng-date-range-picker-radius: 1.1rem;',
    '  --tng-date-range-picker-field-height: 2.95rem;',
    '  --tng-date-range-picker-overlay-gap: 0.56rem;',
    '  --tng-date-range-picker-day-cell-size: 2.2rem;',
    '  --tng-date-range-picker-picker-cell-size: 2.3rem;',
    '  --tng-date-range-picker-grid-gap: clamp(0.14rem, 1.15%, 0.28rem);',
    '  --tng-date-range-picker-inline-gap: 0.36rem;',
    '  --tng-date-range-picker-overlay-padding: 0.72rem;',
    '  --tng-date-range-picker-nav-size: 1.95rem;',
    '  --tng-date-range-picker-shadow:',
    '    0 22px 40px rgba(15, 23, 42, 0.14),',
    '    0 10px 18px rgba(15, 23, 42, 0.08);',
    '}',
    `.${classes.anchor} {`,
    '  position: relative;',
    '}',
    `.${classes.field} {`,
    '  display: grid;',
    '  gap: 0.2rem;',
    '}',
    `.${classes.shell} {`,
    '  display: flex;',
    '  align-items: stretch;',
    '  min-inline-size: 0;',
    '  inline-size: 100%;',
    '  min-height: var(--tng-date-range-picker-field-height);',
    '  overflow: hidden;',
    '  box-sizing: border-box;',
    '  border: 1px solid color-mix(in srgb, var(--tng-date-range-picker-border) 84%, var(--tng-date-range-picker-canvas) 16%);',
    '  border-radius: var(--tng-date-range-picker-radius);',
    '  background:',
    '    linear-gradient(',
    '      180deg,',
    '      color-mix(in srgb, var(--tng-date-range-picker-canvas) 58%, var(--tng-date-range-picker-surface) 42%),',
    '      color-mix(in srgb, var(--tng-date-range-picker-canvas) 74%, var(--tng-date-range-picker-surface) 26%)',
    '    );',
    '  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);',
    '  transition:',
    '    border-color 150ms ease,',
    '    box-shadow 150ms ease,',
    '    background-color 150ms ease;',
    '}',
    `.${classes.shell}[data-open="true"] {`,
    '  border-color: color-mix(in srgb, var(--tng-date-range-picker-brand) 72%, var(--tng-date-range-picker-border) 28%);',
    '  box-shadow: var(--tng-date-range-picker-focus-shadow);',
    '}',
    `.${classes.shell}:focus-within {`,
    '  border-color: color-mix(in srgb, var(--tng-date-range-picker-brand) 62%, var(--tng-date-range-picker-border) 38%);',
    '  box-shadow: var(--tng-date-range-picker-focus-shadow);',
    '}',
    `.${classes.shell}[data-invalid="true"] {`,
    '  border-color: color-mix(in srgb, #dc2626 70%, var(--tng-date-range-picker-border) 30%);',
    '  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.14);',
    '}',
    `.${classes.demo} [data-slot="date-range-picker-input"] {`,
    '  appearance: none;',
    '  -webkit-appearance: none;',
    '  box-sizing: border-box;',
    '  border: 0;',
    '  box-shadow: none;',
    '  flex: 1 1 auto;',
    '  min-height: 100%;',
    '  min-inline-size: 0;',
    '  background: transparent;',
    '  color: var(--tng-date-range-picker-fg);',
    '  caret-color: var(--tng-date-range-picker-brand);',
    '  font: inherit;',
    '  font-size: 0.98rem;',
    '  font-weight: 600;',
    '  line-height: 1.35;',
    '  letter-spacing: 0.01em;',
    '  outline: none;',
    '  padding: 0.72rem 0.96rem;',
    '}',
    `.${classes.demo} [data-slot="date-range-picker-input"]:focus,`,
    `.${classes.demo} [data-slot="date-range-picker-input"]:focus-visible {`,
    '  outline: none;',
    '  box-shadow: none;',
    '}',
    `.${classes.demo} [data-slot="date-range-picker-input"]::placeholder {`,
    '  color: color-mix(in srgb, var(--tng-date-range-picker-muted) 82%, transparent);',
    '  font-weight: 500;',
    '  opacity: 1;',
    '}',
    `.${classes.demo} [data-slot="date-range-picker-trigger"],`,
    `.${classes.nav},`,
    `.${classes.period},`,
    `.${classes.cell},`,
    `.${classes.pickerCell} {`,
    '  font: inherit;',
    '}',
    `.${classes.demo} [data-slot="date-range-picker-trigger"] {`,
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 0.28rem;',
    '  color: var(--tng-date-range-picker-fg);',
    '}',
    `.${classes.demo} [data-slot="date-range-picker-trigger"]:hover {`,
    '  background: color-mix(in srgb, var(--tng-date-range-picker-brand) 9%, var(--tng-date-range-picker-surface));',
    '}',
    `.${classes.trigger} {`,
    '  flex: 0 0 auto;',
    '  min-width: calc(var(--tng-date-range-picker-nav-size) + 1.02rem);',
    '  padding-inline: 0.78rem;',
    '  border: 0;',
    '  border-inline-start: 1px solid color-mix(in srgb, var(--tng-date-range-picker-border) 72%, var(--tng-date-range-picker-canvas) 28%);',
    '  background: var(--tng-date-range-picker-bg);',
    '  cursor: pointer;',
    '  appearance: none;',
    '  -webkit-appearance: none;',
    '  box-sizing: border-box;',
    '  min-height: 100%;',
    '  gap: 0.34rem;',
    '  transition:',
    '    background-color 150ms ease,',
    '    color 150ms ease;',
    '}',
    `.${classes.trigger}:focus,`,
    `.${classes.trigger}:focus-visible {`,
    '  outline: none;',
    '  box-shadow: none;',
    '  background: color-mix(in srgb, var(--tng-date-range-picker-brand) 9%, var(--tng-date-range-picker-surface));',
    '}',
    `.${classes.triggerIcon} {`,
    '  width: 1.05rem;',
    '  height: 1.05rem;',
    '  flex-shrink: 0;',
    '}',
    `.${classes.triggerChevron},`,
    `.${classes.periodChevron} {`,
    '  color: var(--tng-date-range-picker-muted);',
    '  font-size: 0.68rem;',
    '  line-height: 1;',
    '}',
    `.${classes.overlay} {`,
    '  inline-size: min(20rem, calc(100vw - 2rem));',
    '  display: grid;',
    '  gap: 0.68rem;',
    '  border: 1px solid color-mix(in srgb, var(--tng-date-range-picker-border) 86%, var(--tng-date-range-picker-canvas) 14%);',
    '  border-radius: calc(var(--tng-date-range-picker-radius) + 0.18rem);',
    '  background:',
    '    linear-gradient(',
    '      180deg,',
    '      color-mix(in srgb, var(--tng-date-range-picker-surface) 95%, var(--tng-date-range-picker-canvas) 5%),',
    '      color-mix(in srgb, var(--tng-date-range-picker-surface) 98%, var(--tng-date-range-picker-canvas) 2%)',
    '    );',
    '  color: var(--tng-date-range-picker-fg);',
    '  padding: var(--tng-date-range-picker-overlay-padding);',
    '  box-sizing: border-box;',
    '  box-shadow: var(--tng-date-range-picker-shadow);',
    '}',
    `.${classes.header} {`,
    '  color: var(--tng-date-range-picker-fg);',
    '  display: grid;',
    '  gap: 0.5rem;',
    '}',
    `.${classes.headerRow} {`,
    '  display: grid;',
    '  grid-template-columns: var(--tng-date-range-picker-nav-size) minmax(0, 1fr) var(--tng-date-range-picker-nav-size);',
    '  gap: 0.34rem;',
    '  align-items: center;',
    '}',
    `.${classes.nav},`,
    `.${classes.period} {`,
    '  appearance: none;',
    '  -webkit-appearance: none;',
    '  box-sizing: border-box;',
    '  border: 1px solid color-mix(in srgb, var(--tng-date-range-picker-border) 84%, var(--tng-date-range-picker-canvas) 16%);',
    '  border-radius: 0.82rem;',
    '  background: color-mix(in srgb, var(--tng-date-range-picker-canvas) 78%, var(--tng-date-range-picker-surface) 22%);',
    '  color: var(--tng-date-range-picker-fg);',
    '  cursor: pointer;',
    '  padding: 0;',
    '  transition:',
    '    border-color 150ms ease,',
    '    box-shadow 150ms ease,',
    '    background-color 150ms ease,',
    '    color 150ms ease;',
    '}',
    `.${classes.nav}:hover,`,
    `.${classes.period}:hover {`,
    '  background: color-mix(in srgb, var(--tng-date-range-picker-brand) 7%, var(--tng-date-range-picker-surface));',
    '}',
    `.${classes.nav} {`,
    '  inline-size: var(--tng-date-range-picker-nav-size);',
    '  min-height: var(--tng-date-range-picker-nav-size);',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  padding: 0;',
    '  font-size: 1.1rem;',
    '  line-height: 1;',
    '}',
    `.${classes.period} {`,
    '  min-height: var(--tng-date-range-picker-nav-size);',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 0.24rem;',
    '  min-inline-size: 0;',
    '  width: 100%;',
    '  padding-inline: 0.72rem;',
    '  font-weight: 600;',
    '}',
    `.${classes.periodTitle} {`,
    '  overflow: hidden;',
    '  text-overflow: ellipsis;',
    '  white-space: nowrap;',
    '}',
    `.${classes.weekdays} [data-slot="date-range-picker-weekday"] {`,
    '  color: color-mix(in srgb, var(--tng-date-range-picker-muted) 92%, var(--tng-date-range-picker-canvas) 8%);',
    '  font-size: 0.68rem;',
    '  font-weight: 600;',
    '  letter-spacing: 0.02em;',
    '  text-align: center;',
    '}',
    `.${classes.weekdays},`,
    `.${classes.dayGrid} {`,
    '  display: grid;',
    '  grid-template-columns: repeat(7, minmax(0, 1fr));',
    '  gap: var(--tng-date-range-picker-grid-gap);',
    '}',
    `.${classes.pickerGrid} {`,
    '  display: grid;',
    '  grid-template-columns: repeat(4, minmax(0, 1fr));',
    '  gap: var(--tng-date-range-picker-grid-gap);',
    '}',
    `.${classes.cell},`,
    `.${classes.pickerCell} {`,
    '  appearance: none;',
    '  -webkit-appearance: none;',
    '  box-sizing: border-box;',
    '  border: 1px solid color-mix(in srgb, var(--tng-date-range-picker-border) 84%, var(--tng-date-range-picker-canvas) 16%);',
    '  border-radius: 0.82rem;',
    '  background: color-mix(in srgb, var(--tng-date-range-picker-canvas) 78%, var(--tng-date-range-picker-surface) 22%);',
    '  color: var(--tng-date-range-picker-fg);',
    '  cursor: pointer;',
    '  transition:',
    '    border-color 150ms ease,',
    '    box-shadow 150ms ease,',
    '    background-color 150ms ease,',
    '    color 150ms ease;',
    '  min-height: var(--tng-date-range-picker-day-cell-size);',
    '  padding: 0;',
    '  font: inherit;',
    '  line-height: 1;',
    '}',
    `.${classes.pickerCell} {`,
    '  min-height: var(--tng-date-range-picker-picker-cell-size);',
    '}',
    `.${classes.cell}[data-active],`,
    `.${classes.pickerCell}[data-active],`,
    `.${classes.overlay} [data-slot="date-range-picker-month"][data-active],`,
    `.${classes.overlay} [data-slot="date-range-picker-year"][data-active] {`,
    '  border-color: color-mix(in srgb, var(--tng-date-range-picker-brand) 36%, var(--tng-date-range-picker-border) 64%);',
    '  background: color-mix(in srgb, var(--tng-date-range-picker-brand) 9%, var(--tng-date-range-picker-surface) 91%);',
    '  box-shadow: 0 0 0 1px color-mix(in srgb, var(--tng-date-range-picker-brand) 14%, transparent);',
    '}',
    `.${classes.cell}[data-selected],`,
    `.${classes.pickerCell}[data-selected],`,
    `.${classes.overlay} [data-slot="date-range-picker-month"][data-selected],`,
    `.${classes.overlay} [data-slot="date-range-picker-year"][data-selected] {`,
    '  border-color: color-mix(in srgb, var(--tng-date-range-picker-brand) 44%, var(--tng-date-range-picker-border) 56%);',
    '  background: color-mix(in srgb, var(--tng-date-range-picker-brand) 18%, var(--tng-date-range-picker-canvas) 82%);',
    '  color: color-mix(in srgb, var(--tng-date-range-picker-brand) 78%, var(--tng-date-range-picker-fg) 22%);',
    '}',
    `.${classes.cell}[data-selected][data-active],`,
    `.${classes.pickerCell}[data-selected][data-active],`,
    `.${classes.overlay} [data-slot="date-range-picker-month"][data-selected][data-active],`,
    `.${classes.overlay} [data-slot="date-range-picker-year"][data-selected][data-active] {`,
    '  border-color: color-mix(in srgb, var(--tng-date-range-picker-brand) 62%, var(--tng-date-range-picker-border) 38%);',
    '  background: color-mix(in srgb, var(--tng-date-range-picker-brand) 24%, var(--tng-date-range-picker-canvas) 76%);',
    '  box-shadow:',
    '    inset 0 1px 0 color-mix(in srgb, var(--tng-date-range-picker-canvas) 42%, transparent),',
    '    0 0 0 1px color-mix(in srgb, var(--tng-date-range-picker-brand) 18%, transparent);',
    '}',
    `.${classes.cell}[aria-current="date"]:not([data-selected]) {`,
    '  border-color: color-mix(in srgb, var(--tng-date-range-picker-brand) 30%, var(--tng-date-range-picker-border) 70%);',
    '  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tng-date-range-picker-brand) 12%, transparent);',
    '}',
    `.${classes.cell}:not([data-in-month]) {`,
    '  color: color-mix(in srgb, var(--tng-date-range-picker-muted) 84%, var(--tng-date-range-picker-canvas) 16%);',
    '  opacity: 0.58;',
    '}',
    `.${classes.cell}[data-disabled],`,
    `.${classes.pickerCell}[data-disabled],`,
    `.${classes.overlay} [data-slot="date-range-picker-month"][data-disabled],`,
    `.${classes.overlay} [data-slot="date-range-picker-year"][data-disabled] {`,
    '  opacity: 0.48;',
    '  box-shadow: none;',
    '}',
    `.${classes.cell}[data-disabled],`,
    `.${classes.pickerCell}[data-disabled] {`,
    '  cursor: not-allowed;',
    '}',
    '',
  ].join('\n');
}

function createThemeCss(selector: string, accent: 'brand' | 'success'): string {
  const accentToken =
    accent === 'brand'
      ? 'var(--tng-semantic-accent-brand)'
      : 'var(--tng-semantic-accent-success)';
  return [
    `${selector} {`,
    '  --tng-date-range-picker-bg: var(--tng-semantic-background-surface);',
    '  --tng-date-range-picker-border: var(--tng-semantic-border-default);',
    `  --tng-date-range-picker-brand: ${accentToken};`,
    '  --tng-date-range-picker-canvas: var(--tng-semantic-background-canvas);',
    `  --tng-date-range-picker-focus-shadow: 0 0 0 3px color-mix(in srgb, ${accentToken} 22%, transparent);`,
    '  --tng-date-range-picker-fg: var(--tng-semantic-foreground-primary);',
    '  --tng-date-range-picker-muted: var(--tng-semantic-foreground-secondary);',
    `  --tng-date-range-picker-surface: color-mix(in srgb, ${accentToken} 14%, var(--tng-semantic-background-surface));`,
    '  --tng-date-range-picker-shadow: 0 22px 38px rgba(15, 23, 42, 0.12), 0 10px 20px rgba(15, 23, 42, 0.08);',
    '}',
    '',
  ].join('\n');
}

const customFormatAdapter: TngDateAdapter<Date> = Object.freeze({
  ...defaultDateRangePickerDateAdapter,
  format: (date, format, locale) => {
    if (format === 'input') {
      const day = defaultDateRangePickerDateAdapter.getDate(date).toString().padStart(2, '0');
      const month = (defaultDateRangePickerDateAdapter.getMonth(date) + 1)
        .toString()
        .padStart(2, '0');
      const year = defaultDateRangePickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${day}.${month}.${year}`;
    }

    if (format === 'month-year') {
      const month = defaultDateRangePickerDateAdapter
        .format(date, 'month-short', locale)
        .toUpperCase();
      const year = defaultDateRangePickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${year} · ${month}`;
    }

    return defaultDateRangePickerDateAdapter.format(date, format, locale);
  },
  parse: (text, locale) => {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text.trim());
    if (match !== null) {
      const day = Number(match[1]);
      const month = Number(match[2]) - 1;
      const year = Number(match[3]);
      const date = defaultDateRangePickerDateAdapter.createDate(year, month, day);
      return defaultDateRangePickerDateAdapter.isValid(date) &&
        defaultDateRangePickerDateAdapter.getYear(date) === year &&
        defaultDateRangePickerDateAdapter.getMonth(date) === month &&
        defaultDateRangePickerDateAdapter.getDate(date) === day
        ? date
        : null;
    }

    return defaultDateRangePickerDateAdapter.parse(text, locale);
  },
});

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
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

function toPascalCase(value: string): string {
  return value
    .split('-')
    .filter((part) => part.length > 0)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join('');
}

function toCamelCase(value: string): string {
  const pascalCase = toPascalCase(value);
  return pascalCase[0]!.toLowerCase() + pascalCase.slice(1);
}

function createHeadlessTsCode(
  name: string,
  configLines: readonly string[],
  includeAdapter = false,
): string {
  const bindings = createExampleBindingNames(name);
  const adapterLines = includeAdapter
    ? [
        "import { defaultDateRangePickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';",
        '',
        `const ${bindings.adapter}: TngDateAdapter<Date> = {`,
        '  ...defaultDateRangePickerDateAdapter,',
        "  format: (date, format, locale) => format === 'input' ? '22.04.2024' : defaultDateRangePickerDateAdapter.format(date, format, locale),",
        '  parse: (text, locale) => defaultDateRangePickerDateAdapter.parse(text, locale),',
        '};',
        '',
      ]
    : [];

  return [
    "import { Component, type OnDestroy } from '@angular/core';",
    "import { TngIcon } from '@tailng-ui/icons';",
    'import {',
    '  bindTngDateRangePicker,',
    '  createDateRangePickerController,',
    '  TngDateRangePickerDayCell,',
    '  TngDateRangePickerDayGrid,',
    '  TngDateRangePickerHost,',
    '  TngDateRangePickerInput,',
    '  TngDateRangePickerMonthGrid,',
    '  TngDateRangePickerMonthOption,',
    '  TngDateRangePickerNextButton,',
    '  TngDateRangePickerOverlay,',
    '  TngDateRangePickerPeriodButton,',
    '  TngDateRangePickerPrevButton,',
    '  TngDateRangePickerTrigger,',
    '  TngDateRangePickerYearGrid,',
    '  TngDateRangePickerYearOption,',
    "} from '@tailng-ui/primitives';",
    '',
    ...adapterLines,
    '@Component({',
    '  standalone: true,',
    '  imports: [',
    '    TngIcon,',
    '    TngDateRangePickerHost,',
    '    TngDateRangePickerInput,',
    '    TngDateRangePickerTrigger,',
    '    TngDateRangePickerOverlay,',
    '    TngDateRangePickerPrevButton,',
    '    TngDateRangePickerPeriodButton,',
    '    TngDateRangePickerNextButton,',
    '    TngDateRangePickerDayGrid,',
    '    TngDateRangePickerDayCell,',
    '    TngDateRangePickerMonthGrid,',
    '    TngDateRangePickerMonthOption,',
    '    TngDateRangePickerYearGrid,',
    '    TngDateRangePickerYearOption,',
    '  ],',
    `  templateUrl: './${name}.component.html',`,
    `  styleUrl: './${name}.component.css',`,
    '})',
    `export class ${toPascalCase(name)}Component implements OnDestroy {`,
    `  protected readonly ${bindings.controller} = createDateRangePickerController<Date>({`,
    ...(includeAdapter ? [`    adapter: ${bindings.adapter},`] : []),
    ...configLines.map((line) => `    ${line}`),
    '  });',
    '',
    `  protected readonly ${bindings.dateRangePicker} = bindTngDateRangePicker(this.${bindings.controller});`,
    '',
    '  public ngOnDestroy(): void {',
    `    this.${bindings.controller}.destroy();`,
    '  }',
    '}',
    '',
  ].join('\n');
}

function createHeadlessHtmlCode(options: {
  containerClose: string;
  containerOpen: string;
  copyLine: string;
  inputAriaLabel: string;
  kickerLine: string;
  name: string;
  placeholder: string;
  triggerLabel: string;
}): string {
  const bindings = createExampleBindingNames(options.name);
  const classes = createExampleClassNames(options.name);
  return [
    options.containerOpen,
    `  ${options.kickerLine}`,
    `  ${options.copyLine}`,
    `  <section class="${classes.demo}" [tngDateRangePickerHost]="${bindings.controller}">`,
    `    <div class="${classes.field}" data-slot="date-range-picker-field">`,
    `      <div #${bindings.anchorRef} class="${classes.anchor}">`,
    '        <div',
    `          class="${classes.shell}"`,
    '          data-slot="date-range-picker-input-shell"',
    `          [attr.data-invalid]="${bindings.dateRangePicker}.outputs().validationError !== null ? 'true' : null"`,
    `          [attr.data-open]="${bindings.dateRangePicker}.outputs().getTriggerAttributes()['data-open']"`,
    '        >',
    '          <input',
    `            class="${classes.input}"`,
    `            [tngDateRangePickerInput]="${bindings.controller}"`,
    '            type="text"',
    '            inputmode="numeric"',
    `            placeholder="${options.placeholder}"`,
    `            aria-label="${options.inputAriaLabel}"`,
    '          />',
    '',
    '          <button',
    `            class="${classes.trigger}"`,
    `            [tngDateRangePickerTrigger]="${bindings.controller}"`,
    '            type="button"',
    '            tabindex="-1"',
    `            aria-label="${options.triggerLabel}"`,
    '          >',
    `            <tng-icon icon="calendar-days" class="${classes.triggerIcon}" />`,
    `            <span class="${classes.triggerChevron}" aria-hidden="true">▾</span>`,
    '          </button>',
    '        </div>',
    '',
    '        <section',
    `          class="${classes.overlay}"`,
    `          [tngDateRangePickerOverlay]="${bindings.controller}"`,
    `          [tngDateRangePickerOverlayAnchor]="${bindings.anchorRef}"`,
    '        >',
    `          <header class="${classes.header}" data-slot="date-range-picker-header">`,
    `            <div class="${classes.headerRow}">`,
    `              <button class="${classes.nav}" [tngDateRangePickerPrevButton]="${bindings.controller}" type="button">‹</button>`,
    `              <button class="${classes.period}" [tngDateRangePickerPeriodButton]="${bindings.controller}" type="button">`,
    `                <span class="${classes.periodTitle}">{{ ${bindings.dateRangePicker}.periodLabel() }}</span>`,
    `                @if (${bindings.dateRangePicker}.outputs().view !== 'year') {`,
    `                  <span class="${classes.periodChevron}" aria-hidden="true">▾</span>`,
    '                }',
    '              </button>',
    `              <button class="${classes.nav}" [tngDateRangePickerNextButton]="${bindings.controller}" type="button">›</button>`,
    '            </div>',
    '          </header>',
    '',
    `          @if (${bindings.dateRangePicker}.outputs().view === 'day') {`,
    `            <div class="${classes.weekdays}" data-slot="date-range-picker-weekdays" aria-hidden="true">`,
    `              @for (label of ${bindings.dateRangePicker}.outputs().weekdayLabels; track label) {`,
    '                <span data-slot="date-range-picker-weekday">{{ label }}</span>',
    '              }',
    '            </div>',
    '',
    `            <div class="${classes.dayGrid}" [tngDateRangePickerDayGrid]="${bindings.controller}">`,
    `              @for (cell of ${bindings.dateRangePicker}.outputs().cells; track cell.id) {`,
    `                <button class="${classes.cell}" [tngDateRangePickerDayCell]="cell" type="button">`,
    '                  {{ cell.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '',
    `          @if (${bindings.dateRangePicker}.outputs().view === 'month') {`,
    `            <div class="${classes.pickerGrid}" [tngDateRangePickerMonthGrid]="${bindings.controller}">`,
    `              @for (option of ${bindings.dateRangePicker}.outputs().monthOptions; track option.id) {`,
    `                <button class="${classes.pickerCell}" [tngDateRangePickerMonthOption]="option" type="button">`,
    '                  {{ option.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '',
    `          @if (${bindings.dateRangePicker}.outputs().view === 'year') {`,
    `            <div class="${classes.pickerGrid}" [tngDateRangePickerYearGrid]="${bindings.controller}">`,
    `              @for (option of ${bindings.dateRangePicker}.outputs().yearOptions; track option.id) {`,
    `                <button class="${classes.pickerCell}" [tngDateRangePickerYearOption]="option" type="button">`,
    '                  {{ option.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '        </section>',
    '      </div>',
    '    </div>',
    '  </section>',
    options.containerClose,
    '',
  ].join('\n');
}

function createHeadlessTailwindHtmlCode(options: {
  brandHover: string;
  containerClose: string;
  containerOpen: string;
  copyLine: string;
  inputAriaLabel: string;
  kickerLine: string;
  name: string;
  placeholder: string;
  triggerLabel: string;
  variant: 'booking' | 'reporting';
}): string {
  const bindings = createExampleBindingNames(options.name);
  const shellOpenLight =
    options.variant === 'booking'
      ? 'data-[open=true]:border-blue-600 data-[open=true]:shadow-[0_0_0_3px_rgba(37,99,235,0.16)]'
      : 'data-[open=true]:border-teal-700 data-[open=true]:shadow-[0_0_0_3px_rgba(15,118,110,0.16)]';
  const shellDark =
    'dark:border-slate-700/90 dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_100%)] dark:focus-within:border-slate-500 dark:focus-within:shadow-[0_0_0_3px_rgba(100,116,139,0.20)]';
  const shellOpenDark =
    options.variant === 'booking'
      ? 'dark:data-[open=true]:border-blue-500 dark:data-[open=true]:shadow-[0_0_0_3px_rgba(59,130,246,0.20)]'
      : 'dark:data-[open=true]:border-teal-500 dark:data-[open=true]:shadow-[0_0_0_3px_rgba(45,212,191,0.20)]';
  const shellInvalidDark =
    'dark:data-[invalid=true]:border-rose-500 dark:data-[invalid=true]:shadow-[0_0_0_3px_rgba(251,113,133,0.20)]';
  const triggerDark =
    options.variant === 'booking'
      ? 'dark:border-slate-700/90 dark:bg-[linear-gradient(180deg,#0f172a_0%,#1e3a8a_100%)] dark:text-slate-100 dark:hover:bg-blue-900/40'
      : 'dark:border-slate-700/90 dark:bg-[linear-gradient(180deg,#0f172a_0%,#042f2e_100%)] dark:text-slate-100 dark:hover:bg-teal-900/40';
  const overlayDark =
    options.variant === 'booking'
      ? 'dark:border-slate-700/90 dark:bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_100%)] dark:text-slate-100 dark:shadow-[0_26px_44px_rgba(2,6,23,0.62),0_10px_22px_rgba(2,6,23,0.38)]'
      : 'dark:border-slate-700/90 dark:bg-[linear-gradient(180deg,#0f172a_0%,#022c22_100%)] dark:text-slate-100 dark:shadow-[0_26px_44px_rgba(2,6,23,0.62),0_10px_22px_rgba(2,6,23,0.38)]';
  const navDark =
    options.variant === 'booking'
      ? 'dark:border-slate-600/90 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-blue-900/40'
      : 'dark:border-slate-600/90 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-teal-900/40';
  const cellDark =
    options.variant === 'booking'
      ? 'dark:border-transparent dark:bg-slate-900/55 dark:text-slate-100 dark:hover:border-slate-600/90 dark:hover:bg-slate-800/90 dark:data-[active=true]:border-blue-500/80 dark:data-[active=true]:bg-blue-900/35 dark:data-[active=true]:shadow-[0_0_0_1px_rgba(59,130,246,0.25)] dark:data-[selected=true]:border-blue-400 dark:data-[selected=true]:bg-blue-700/35 dark:data-[selected=true]:text-blue-100'
      : 'dark:border-transparent dark:bg-slate-900/55 dark:text-slate-100 dark:hover:border-slate-600/90 dark:hover:bg-slate-800/90 dark:data-[active=true]:border-teal-500/80 dark:data-[active=true]:bg-teal-900/35 dark:data-[active=true]:shadow-[0_0_0_1px_rgba(45,212,191,0.25)] dark:data-[selected=true]:border-teal-400 dark:data-[selected=true]:bg-teal-700/35 dark:data-[selected=true]:text-teal-100';

  const inputShellClass = [
    'flex min-h-[2.95rem] min-w-0 w-full overflow-hidden rounded-[1.08rem] border border-slate-300/90',
    'bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
    'transition-[border-color,box-shadow,background-color] duration-150',
    'focus-within:border-slate-400 focus-within:shadow-[0_0_0_3px_rgba(148,163,184,0.14)]',
    shellOpenLight,
    'data-[invalid=true]:border-rose-600 data-[invalid=true]:shadow-[0_0_0_3px_rgba(225,29,72,0.16)]',
    shellDark,
    shellOpenDark,
    shellInvalidDark,
  ].join(' ');

  return [
    options.containerOpen,
    `  ${options.kickerLine}`,
    `  ${options.copyLine}`,
    `  <section class="block w-[18.5rem] max-w-full" [tngDateRangePickerHost]="${bindings.controller}">`,
    '    <div class="grid gap-[0.2rem]" data-slot="date-range-picker-field">',
    `      <div #${bindings.anchorRef} class="relative">`,
    '        <div',
    `          class="${inputShellClass}"`,
    '          data-slot="date-range-picker-input-shell"',
    `          [attr.data-invalid]="${bindings.dateRangePicker}.outputs().validationError !== null ? 'true' : null"`,
    `          [attr.data-open]="${bindings.dateRangePicker}.outputs().getTriggerAttributes()['data-open']"`,
    '        >',
    '          <input',
    '            class="min-h-full min-w-0 flex-1 appearance-none border-0 bg-transparent px-[0.96rem] py-[0.72rem] text-[0.98rem] font-semibold tracking-[0.01em] text-slate-950 outline-none ring-0 focus:outline-none focus:ring-0 placeholder:font-medium placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"',
    `            [tngDateRangePickerInput]="${bindings.controller}"`,
    '            type="text"',
    '            inputmode="numeric"',
    `            placeholder="${options.placeholder}"`,
    `            aria-label="${options.inputAriaLabel}"`,
    '          />',
    '',
    '          <button',
    '            type="button"',
    '            tabindex="-1"',
    `            class="inline-flex min-w-[3.25rem] shrink-0 items-center justify-center gap-[0.34rem] border-l border-slate-300/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-[0.78rem] text-slate-950 transition-colors duration-150 ${options.brandHover} ${triggerDark}"`,
    `            [tngDateRangePickerTrigger]="${bindings.controller}"`,
    `            aria-label="${options.triggerLabel}"`,
    '          >',
    '            <tng-icon icon="calendar-days" class="size-[1.05rem] shrink-0 text-slate-950 dark:text-slate-100" />',
    '            <span class="text-[0.68rem] leading-none text-slate-500 dark:text-slate-400" aria-hidden="true">▾</span>',
    '          </button>',
    '        </div>',
    '',
    '        <section',
    `          [tngDateRangePickerOverlay]="${bindings.controller}"`,
    `          [tngDateRangePickerOverlayAnchor]="${bindings.anchorRef}"`,
    `          class="grid w-[min(20rem,calc(100vw-2rem))] gap-[0.68rem] rounded-[1.26rem] border border-slate-300/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-[0.8rem] text-slate-950 shadow-[0_22px_38px_rgba(15,23,42,0.12),0_10px_20px_rgba(15,23,42,0.08)] ${overlayDark}"`,
    '        >',
    '          <header class="grid gap-[0.42rem]" data-slot="date-range-picker-header">',
    '            <div class="grid grid-cols-[1.9rem_minmax(0,1fr)_1.9rem] items-center gap-[0.4rem]">',
    `              <button [tngDateRangePickerPrevButton]="${bindings.controller}" type="button" class="inline-flex min-h-[2rem] items-center justify-center rounded-[0.82rem] border border-slate-300/90 bg-white/80 text-[1.05rem] leading-none text-slate-950 transition-colors duration-150 ${options.brandHover} ${navDark}">‹</button>`,
    `              <button [tngDateRangePickerPeriodButton]="${bindings.controller}" type="button" class="inline-flex min-h-[2rem] min-w-0 items-center justify-center gap-[0.24rem] rounded-[0.82rem] border border-slate-300/90 bg-white/80 px-[0.72rem] font-semibold text-slate-950 transition-colors duration-150 ${options.brandHover} ${navDark}">`,
    `                <span class="truncate">{{ ${bindings.dateRangePicker}.periodLabel() }}</span>`,
    `                @if (${bindings.dateRangePicker}.outputs().view !== 'year') {`,
    '                  <span class="text-[0.68rem] leading-none text-slate-500 dark:text-slate-400" aria-hidden="true">▾</span>',
    '                }',
    '              </button>',
    `              <button [tngDateRangePickerNextButton]="${bindings.controller}" type="button" class="inline-flex min-h-[2rem] items-center justify-center rounded-[0.82rem] border border-slate-300/90 bg-white/80 text-[1.05rem] leading-none text-slate-950 transition-colors duration-150 ${options.brandHover} ${navDark}">›</button>`,
    '            </div>',
    '          </header>',
    '',
    `          @if (${bindings.dateRangePicker}.outputs().view === 'day') {`,
    '            <div class="grid grid-cols-7 gap-[0.28rem]" data-slot="date-range-picker-weekdays" aria-hidden="true">',
    `              @for (label of ${bindings.dateRangePicker}.outputs().weekdayLabels; track label) {`,
    '                <span class="text-center text-[0.68rem] font-medium text-slate-500 dark:text-slate-400" data-slot="date-range-picker-weekday">{{ label }}</span>',
    '              }',
    '            </div>',
    '',
    `            <div class="grid grid-cols-7 gap-[0.28rem]" [tngDateRangePickerDayGrid]="${bindings.controller}">`,
    `              @for (cell of ${bindings.dateRangePicker}.outputs().cells; track cell.id) {`,
    '                <button',
    '                  [tngDateRangePickerDayCell]="cell"',
    '                  type="button"',
    `                  class="min-h-[2.28rem] rounded-[0.82rem] border border-transparent bg-slate-50 text-slate-950 transition-[border-color,box-shadow,background-color,color,opacity] duration-150 hover:border-slate-300/90 hover:bg-white data-[active=true]:border-slate-300/90 data-[active=true]:bg-white data-[active=true]:shadow-[0_0_0_1px_rgba(15,23,42,0.05)] data-[selected=true]:text-slate-950 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-45 ${cellDark}"`,
    '                >',
    '                  {{ cell.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '',
    `          @if (${bindings.dateRangePicker}.outputs().view === 'month') {`,
    `            <div class="grid grid-cols-4 gap-[0.28rem]" [tngDateRangePickerMonthGrid]="${bindings.controller}">`,
    `              @for (option of ${bindings.dateRangePicker}.outputs().monthOptions; track option.id) {`,
    '                <button',
    '                  [tngDateRangePickerMonthOption]="option"',
    '                  type="button"',
    `                  class="min-h-[2.38rem] rounded-[0.82rem] border border-transparent bg-slate-50 text-slate-950 transition-[border-color,box-shadow,background-color,color,opacity] duration-150 hover:border-slate-300/90 hover:bg-white data-[active=true]:border-slate-300/90 data-[active=true]:bg-white data-[active=true]:shadow-[0_0_0_1px_rgba(15,23,42,0.05)] data-[selected=true]:text-slate-950 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-45 ${cellDark}"`,
    '                >',
    '                  {{ option.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '',
    `          @if (${bindings.dateRangePicker}.outputs().view === 'year') {`,
    `            <div class="grid grid-cols-4 gap-[0.28rem]" [tngDateRangePickerYearGrid]="${bindings.controller}">`,
    `              @for (option of ${bindings.dateRangePicker}.outputs().yearOptions; track option.id) {`,
    '                <button',
    '                  [tngDateRangePickerYearOption]="option"',
    '                  type="button"',
    `                  class="min-h-[2.38rem] rounded-[0.82rem] border border-transparent bg-slate-50 text-slate-950 transition-[border-color,box-shadow,background-color,color,opacity] duration-150 hover:border-slate-300/90 hover:bg-white data-[active=true]:border-slate-300/90 data-[active=true]:bg-white data-[active=true]:shadow-[0_0_0_1px_rgba(15,23,42,0.05)] data-[selected=true]:text-slate-950 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-45 ${cellDark}"`,
    '                >',
    '                  {{ option.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '        </section>',
    '      </div>',
    '    </div>',
    '  </section>',
    options.containerClose,
    '',
  ].join('\n');
}

function createPlainCssCode(
  name: string,
  classes: {
    card: string;
    copy: string;
    kicker: string;
  },
  themeCss: string,
): string {
  return [
    createScopedSharedCssCode(createExampleClassNames(name)),
    themeCss,
    `.${classes.card} {`,
    '  display: grid;',
    '  gap: 0.8rem;',
    '  width: min(100%, 22rem);',
    '  margin-inline: auto;',
    '  padding: 1rem;',
    '  border: 1px solid color-mix(in srgb, var(--tng-semantic-border-default) 84%, var(--tng-semantic-background-canvas) 16%);',
    '  border-radius: 1.25rem;',
    '  background:',
    '    linear-gradient(',
    '      180deg,',
    '      color-mix(in srgb, var(--tng-semantic-background-canvas) 88%, var(--tng-semantic-background-surface) 12%) 0%,',
    '      color-mix(in srgb, var(--tng-semantic-background-canvas) 64%, var(--tng-semantic-background-surface) 36%) 100%',
    '    );',
    '  color: var(--tng-semantic-foreground-primary);',
    '  box-shadow: 0 14px 34px color-mix(in srgb, var(--tng-semantic-background-canvas) 68%, transparent);',
    '}',
    `.${classes.kicker} {`,
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.8rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.02em;',
    '}',
    `.${classes.copy} {`,
    '  margin: 0;',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  line-height: 1.6;',
    '}',
    '',
  ].join('\n');
}

@Component({
  selector: 'app-headless-date-range-picker-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngDateRangePickerHost,
    TngDateRangePickerInput,
    TngDateRangePickerTrigger,
    TngDateRangePickerOverlay,
    TngDateRangePickerPrevButton,
    TngDateRangePickerPeriodButton,
    TngDateRangePickerNextButton,
    TngDateRangePickerDayGrid,
    TngDateRangePickerDayCell,
    TngDateRangePickerMonthGrid,
    TngDateRangePickerMonthOption,
    TngDateRangePickerYearGrid,
    TngDateRangePickerYearOption,
    TngIcon,
  ],
  templateUrl: './date-range-picker-examples-page.component.html',
  styleUrl: './date-range-picker-examples-page.component.css',
})
export class HeadlessDateRangePickerExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly bookingPlainController = createDateRangePickerController<Date>({
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-05-18',
    trapFocus: true,
    value: { start: '2024-05-18', end: '2024-05-22' },
    minDate: '2024-05-10',
    maxDate: '2024-05-25',
  });

  protected readonly bookingTailwindController = createDateRangePickerController<Date>({
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-05-18',
    trapFocus: true,
    value: { start: '2024-05-18', end: '2024-05-22' },
    minDate: '2024-05-10',
    maxDate: '2024-05-25',
  });

  protected readonly reportingPlainController = createDateRangePickerController<Date>({
    adapter: customFormatAdapter,
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: { start: '2024-04-22', end: '2024-04-26' },
  });

  protected readonly reportingTailwindController = createDateRangePickerController<Date>({
    adapter: customFormatAdapter,
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: { start: '2024-04-22', end: '2024-04-26' },
  });

  protected readonly bookingPlain = bindTngDateRangePicker(this.bookingPlainController);
  protected readonly bookingTailwind = bindTngDateRangePicker(this.bookingTailwindController);
  protected readonly reportingPlain = bindTngDateRangePicker(this.reportingPlainController);
  protected readonly reportingTailwind = bindTngDateRangePicker(this.reportingTailwindController);

  protected readonly bookingPlainCodeTabs = createCodeTabs(
    'headless-booking-window-plain',
    createHeadlessTsCode('headless-booking-window-plain', [
      'ownerDocument: document,',
      "value: { start: '2024-05-18', end: '2024-05-22' },",
      "today: '2024-05-18',",
      "minDate: '2024-05-10',",
      "maxDate: '2024-05-25',",
      'closeOnSelect: true,',
      'trapFocus: true,',
      'showOutsideDays: true,',
    ]),
    createHeadlessHtmlCode({
      name: 'headless-booking-window-plain',
      containerOpen: '<section class="docs-headless-date-range-picker-examples-booking-plain-card">',
      kickerLine:
        '<span class="docs-headless-date-range-picker-examples-booking-plain-kicker">Booking window</span>',
      copyLine:
        '<p class="docs-headless-date-range-picker-examples-booking-plain-copy">Constrain the selectable booking window without giving up manual input.</p>',
      placeholder: 'MM-DD-YYYY - MM-DD-YYYY',
      inputAriaLabel: 'Booking date range',
      triggerLabel: 'Open booking calendar',
      containerClose: '</section>',
    }),
    createPlainCssCode(
      'headless-booking-window-plain',
      {
        card: 'docs-headless-date-range-picker-examples-booking-plain-card',
        kicker: 'docs-headless-date-range-picker-examples-booking-plain-kicker',
        copy: 'docs-headless-date-range-picker-examples-booking-plain-copy',
      },
      createThemeCss(`.${createExampleClassNames('headless-booking-window-plain').demo}`, 'brand'),
    ),
  );

  protected readonly bookingTailwindCodeTabs = createCodeTabs(
    'headless-booking-window-tailwind',
    createHeadlessTsCode('headless-booking-window-tailwind', [
      'ownerDocument: document,',
      "value: { start: '2024-05-18', end: '2024-05-22' },",
      "today: '2024-05-18',",
      "minDate: '2024-05-10',",
      "maxDate: '2024-05-25',",
      'closeOnSelect: true,',
      'trapFocus: true,',
      'showOutsideDays: true,',
    ]),
    createHeadlessTailwindHtmlCode({
      name: 'headless-booking-window-tailwind',
      variant: 'booking',
      containerOpen:
        '<section class="mx-auto grid w-full max-w-[22rem] gap-3 rounded-[1.5rem] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 text-slate-900 shadow-[0_18px_38px_rgba(15,23,42,0.10)] dark:border-slate-700/90 dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_100%)] dark:text-slate-100 dark:shadow-[0_22px_42px_rgba(2,6,23,0.62)]">',
      kickerLine:
        '<span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Booking window</span>',
      copyLine:
        '<p class="m-0 text-sm leading-6 text-slate-600 dark:text-slate-400">Constrain the selectable booking window without giving up manual input.</p>',
      brandHover: 'hover:bg-blue-50',
      placeholder: 'MM-DD-YYYY - MM-DD-YYYY',
      inputAriaLabel: 'Booking date range',
      triggerLabel: 'Open booking calendar',
      containerClose: '</section>',
    }),
    '/* No custom CSS required. Tailwind utilities fully style the field and overlay. */\n',
  );

  protected readonly reportingPlainCodeTabs = createCodeTabs(
    'headless-reporting-calendar-plain',
    createHeadlessTsCode(
      'headless-reporting-calendar-plain',
      [
        'ownerDocument: document,',
        "value: { start: '2024-04-22', end: '2024-04-26' },",
        "today: '2024-04-18',",
        'closeOnSelect: true,',
        'trapFocus: true,',
        'showOutsideDays: true,',
      ],
      true,
    ),
    createHeadlessHtmlCode({
      name: 'headless-reporting-calendar-plain',
      containerOpen: '<section class="docs-headless-date-range-picker-examples-reporting-plain-card">',
      kickerLine:
        '<span class="docs-headless-date-range-picker-examples-reporting-plain-kicker">Reporting calendar</span>',
      copyLine:
        '<p class="docs-headless-date-range-picker-examples-reporting-plain-copy">Swap in a reporting adapter when the field format and period label follow business conventions.</p>',
      placeholder: 'DD.MM.YYYY - DD.MM.YYYY',
      inputAriaLabel: 'Reporting period',
      triggerLabel: 'Open reporting calendar',
      containerClose: '</section>',
    }),
    createPlainCssCode(
      'headless-reporting-calendar-plain',
      {
        card: 'docs-headless-date-range-picker-examples-reporting-plain-card',
        kicker: 'docs-headless-date-range-picker-examples-reporting-plain-kicker',
        copy: 'docs-headless-date-range-picker-examples-reporting-plain-copy',
      },
      createThemeCss(`.${createExampleClassNames('headless-reporting-calendar-plain').demo}`, 'success'),
    ),
  );

  protected readonly reportingTailwindCodeTabs = createCodeTabs(
    'headless-reporting-calendar-tailwind',
    createHeadlessTsCode(
      'headless-reporting-calendar-tailwind',
      [
        'ownerDocument: document,',
        "value: { start: '2024-04-22', end: '2024-04-26' },",
        "today: '2024-04-18',",
        'closeOnSelect: true,',
        'trapFocus: true,',
        'showOutsideDays: true,',
      ],
      true,
    ),
    createHeadlessTailwindHtmlCode({
      name: 'headless-reporting-calendar-tailwind',
      variant: 'reporting',
      containerOpen:
        '<section class="mx-auto grid w-full max-w-[22rem] gap-3 rounded-[1.5rem] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 text-slate-900 shadow-[0_18px_38px_rgba(15,23,42,0.10)] dark:border-slate-700/90 dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_100%)] dark:text-slate-100 dark:shadow-[0_22px_42px_rgba(2,6,23,0.62)]">',
      kickerLine:
        '<span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Reporting calendar</span>',
      copyLine:
        '<p class="m-0 text-sm leading-6 text-slate-600 dark:text-slate-400">Swap in a reporting adapter when the field format and period label follow business conventions.</p>',
      brandHover: 'hover:bg-teal-50',
      placeholder: 'DD.MM.YYYY - DD.MM.YYYY',
      inputAriaLabel: 'Reporting period',
      triggerLabel: 'Open reporting calendar',
      containerClose: '</section>',
    }),
    '/* No custom CSS required. Tailwind utilities fully style the field and overlay. */\n',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
    this.bookingPlainController.destroy();
    this.bookingTailwindController.destroy();
    this.reportingPlainController.destroy();
    this.reportingTailwindController.destroy();
  }
}
