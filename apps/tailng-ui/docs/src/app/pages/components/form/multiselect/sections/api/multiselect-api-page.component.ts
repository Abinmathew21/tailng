import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-multiselect-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multiselect-api-page.component.html',
  styleUrl: './multiselect-api-page.component.css',
})
export class MultiselectApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<section tngMultiSelect [value]="selectedValues" (valueChange)="selectedValues = toValueArray($event)">',
    '  <button tngSelectTrigger type="button">',
    '    <span tngSelectValue>{{ selectedSummary }}</span>',
    '    <span tngSelectIcon aria-hidden="true">▾</span>',
    '  </button>',
    '  <div tngSelectContent>',
    '    <div tngSelectOverlay>',
    '      <ul tngMultiSelectListbox [multiple]="true">',
    '        @for (option of options; track option.value) {',
    '          <li tngMultiSelectOption [tngValue]="option.value">{{ option.label }}</li>',
    '        }',
    '      </ul>',
    '    </div>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly wrapperUsageCode = [
    '<tng-multiselect',
    '  [options]="options"',
    '  [value]="selectedValues"',
    '  (valueChange)="selectedValues = toValueArray($event)"',
    '  [getOptionValue]="getOptionValue"',
    '  [getOptionLabel]="getOptionLabel"',
    '  [isOptionDisabled]="isOptionDisabled"',
    '  placeholder="Select items"',
    '></tng-multiselect>',
    '',
  ].join('\n');

  protected readonly signalFormsCode = String.raw`import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngMultiSelectComponent } from '@tailng-ui/components';

type ReviewerOption = {
  readonly id: string;
  readonly label: string;
};

@Component({
  selector: 'app-reviewers-signal-form',
  standalone: true,
  imports: [FormField, TngMultiSelectComponent],
  template: \`
    <tng-multiselect
      [formField]="reviewForm.reviewers"
      [options]="reviewers"
      [getOptionValue]="getReviewerValue"
      [getOptionLabel]="getReviewerLabel"
      placeholder="Choose reviewers"
      aria-label="Reviewers"
    ></tng-multiselect>
  \`,
})
export class ReviewersSignalFormComponent {
  readonly reviewModel = signal({
    reviewers: ['alex'] as readonly string[],
  });
  readonly reviewForm = form(this.reviewModel);

  readonly reviewers: readonly ReviewerOption[] = [
    { id: 'alex', label: 'Alex' },
    { id: 'bri', label: 'Bri' },
    { id: 'chen', label: 'Chen' },
  ];

  readonly getReviewerValue = (reviewer: ReviewerOption) => reviewer.id;
  readonly getReviewerLabel = (reviewer: ReviewerOption) => reviewer.label;
}`;
}
