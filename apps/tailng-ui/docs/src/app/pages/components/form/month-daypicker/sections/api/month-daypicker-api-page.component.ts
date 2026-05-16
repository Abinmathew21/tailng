import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type ApiRow = Readonly<{
  default?: string;
  details: string;
  name: string;
  type?: string;
}>;

type ApiGroup = Readonly<{
  description?: string;
  rows: readonly ApiRow[];
  title: string;
}>;

@Component({
  selector: 'app-month-daypicker-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './month-daypicker-api-page.component.html',
  styleUrl: './month-daypicker-api-page.component.css',
})
export class MonthDaypickerApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly wrapperAttachCode = [
    '<tng-month-daypicker',
    '  [defaultValue]="{ month: 12, day: 25 }"',
    '  [year]="2024"',
    '  placeholder="MM-DD"',
    '></tng-month-daypicker>',
    '',
  ].join('\n');

  protected readonly valueTypeCode = [
    'type TngMonthDayValue = Readonly<{',
    '  day: number;   // 1–31',
    '  month: number; // 1–12',
    '}>;',
    '',
  ].join('\n');

  protected readonly wrapperInputGroups: readonly ApiGroup[] = Object.freeze([
    {
      title: 'Selection and value',
      rows: [
        {
          name: 'value',
          type: 'TngMonthDayValue | undefined',
          default: 'undefined',
          details: 'Controlled month-day value. When set, the component reflects this value and emits valueChange on user interaction.',
        },
        {
          name: 'defaultValue',
          type: 'TngMonthDayValue',
          default: '{ day: 1, month: 1 }',
          details: 'Uncontrolled initial month-day value used when no value input is provided.',
        },
        {
          name: 'year',
          type: 'number | string',
          default: 'currentYear()',
          details: 'The reference year used for internal date arithmetic, calendar bounds, and leap-year day validation. Accepts a string that coerces to a number.',
        },
      ],
    },
    {
      title: 'Interaction and behavior',
      rows: [
        {
          name: 'allowManualInput',
          type: 'boolean',
          default: 'true',
          details: 'Allows typing directly into the field. The adapter parses MM-DD format on commit.',
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          details: 'Sets the uncontrolled initial open state of the calendar popup.',
        },
        {
          name: 'readonly',
          type: 'boolean',
          default: 'false',
          details: 'Makes the text field read-only while still allowing calendar-based selection.',
        },
        {
          name: 'restoreFocus',
          type: 'boolean',
          default: 'true',
          details: 'Returns focus to the trigger input after the popup closes.',
        },
      ],
    },
    {
      title: 'Accessibility and presentation',
      rows: [
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          details: 'Disables the field and all calendar interaction.',
        },
        {
          name: 'fullWidth',
          type: 'boolean',
          default: 'true',
          details: 'Makes the host fill the available inline size.',
        },
        {
          name: 'invalid',
          type: 'boolean | string',
          default: 'false',
          details: 'Forces invalid styling in addition to manual input validation state. Accepts a boolean attribute.',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: "'MM-DD'",
          details: 'Hint text shown in the input when no value is selected.',
        },
        {
          name: 'required',
          type: 'boolean | string',
          default: 'false',
          details: 'Marks the field as required in form-field contexts. Accepts a boolean attribute.',
        },
      ],
    },
  ]);

  protected readonly wrapperOutputRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'valueChange',
      type: 'TngMonthDayValue',
      details: 'Emits the selected { month, day } object after a calendar click or successful manual input commit.',
    },
    {
      name: 'openChange',
      type: 'boolean',
      details: 'Emits whenever the popup opens or closes.',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
