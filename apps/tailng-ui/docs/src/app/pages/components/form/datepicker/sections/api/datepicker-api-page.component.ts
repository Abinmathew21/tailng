import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-datepicker-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './datepicker-api-page.component.html',
  styleUrl: './datepicker-api-page.component.css',
})
export class DatepickerApiPageComponent {
  protected readonly wrapperAttachCode = [
    '<tng-datepicker',
    '  [defaultValue]="\'2024-04-22\'"',
    '  [minDate]="\'2024-04-01\'"',
    '  [maxDate]="\'2026-03-31\'"',
    '></tng-datepicker>',
    '',
  ].join('\n');

  protected readonly controllerAttachCode = [
    'readonly controller = createDatepickerController<Date>({',
    "  ownerDocument: document,",
    "  value: '2024-04-22',",
    "  today: '2024-04-18',",
    '  trapFocus: true,',
    '});',
    '',
    'const outputs = controller.getOutputs();',
    '',
  ].join('\n');
}
