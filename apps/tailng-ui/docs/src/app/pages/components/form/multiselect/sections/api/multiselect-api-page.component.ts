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
}
