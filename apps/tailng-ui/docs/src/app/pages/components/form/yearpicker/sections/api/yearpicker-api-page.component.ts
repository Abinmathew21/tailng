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
  selector: 'app-yearpicker-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './yearpicker-api-page.component.html',
  styleUrl: './yearpicker-api-page.component.css',
})
export class YearpickerApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly wrapperAttachCode = [
    '<tng-yearpicker',
    '  [defaultValue]="2024"',
    '  [minYear]="2000"',
    '  [maxYear]="2030"',
    '  placeholder="YYYY"',
    '></tng-yearpicker>',
    '',
  ].join('\n');

  protected readonly wrapperInputGroups: readonly ApiGroup[] = Object.freeze([
    {
      title: 'Selection and value',
      rows: [
        {
          name: 'value',
          type: 'number | string | undefined',
          default: 'undefined',
          details: 'Controlled year value. When set, the component reflects this year and emits valueChange on user interaction. Strings are coerced to integers.',
        },
        {
          name: 'defaultValue',
          type: 'number | string',
          default: 'currentYear()',
          details: 'Uncontrolled initial year used when no value input is provided. Defaults to the current calendar year.',
        },
        {
          name: 'minYear',
          type: 'number | string | undefined',
          default: 'undefined',
          details: 'Minimum selectable year. Disables earlier years in the grid and constrains keyboard navigation.',
        },
        {
          name: 'maxYear',
          type: 'number | string | undefined',
          default: 'undefined',
          details: 'Maximum selectable year. Disables later years in the grid and constrains keyboard navigation.',
        },
        {
          name: 'fixedMonth',
          type: 'number | string',
          default: '0',
          details: 'Month index (0-based) used for the internal anchor date. Useful when the downstream system expects a full Date but only cares about the year.',
        },
        {
          name: 'fixedDay',
          type: 'number | string',
          default: '1',
          details: 'Day used for the internal anchor date alongside fixedMonth.',
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
          details: 'Allows typing a four-digit year directly into the field. Invalid input is discarded on blur.',
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          details: 'Sets the uncontrolled initial open state of the year grid popup.',
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
        {
          name: 'yearPageSize',
          type: 'number | string',
          default: '24',
          details: 'Controls how many years are shown per page in the year grid. Minimum value is 4.',
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
          details: 'Disables the field and all year grid interaction.',
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
          details: 'Forces invalid styling. Accepts a boolean attribute.',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: "'YYYY'",
          details: 'Hint text shown in the input when no year is selected.',
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
      type: 'number',
      details: 'Emits the selected year as a plain number after a grid click or successful manual input commit.',
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
