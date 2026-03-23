import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-datepicker-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './datepicker-styling-page.component.html',
  styleUrl: './datepicker-styling-page.component.css',
})
export class DatepickerStylingPageComponent {
  protected readonly compactThemeCode = [
    '.booking-datepicker {',
    '  --tng-datepicker-radius: 0.9rem;',
    '  --tng-datepicker-field-height: 2.8rem;',
    '  --tng-datepicker-overlay-padding: 0.72rem;',
    '  --tng-datepicker-grid-gap: clamp(0.12rem, 1.15%, 0.28rem);',
    '  --tng-datepicker-day-cell-size: 2.15rem;',
    '  --tng-datepicker-picker-cell-size: 2.25rem;',
    '}',
    '',
  ].join('\n');
}
