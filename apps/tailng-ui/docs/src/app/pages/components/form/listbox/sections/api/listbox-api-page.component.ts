import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-listbox-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './listbox-api-page.component.html',
  styleUrl: './listbox-api-page.component.css',
})
export class ListboxApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<div',
    '  tngListbox',
    '  tabindex="0"',
    '  [multiple]="true"',
    '  [value]="selectedValues()"',
    '  (valueChange)="selectedValues.set(toArray($event))"',
    '>',
    '  @for (option of options; track option.id) {',
    '    <div tngOption [tngValue]="option.id" [disabled]="option.disabled === true">',
    '      {{ option.label }}',
    '    </div>',
    '  }',
    '</div>',
    '',
  ].join('\n');

  protected readonly wrapperStatusCode = [
    '// There is no dedicated <tng-listbox> wrapper today.',
    '// Use tngListbox + tngOption for always-open selection surfaces.',
    '// Use <tng-select>, <tng-multiselect>, <tng-autocomplete>,',
    '// or <tng-multi-autocomplete> when you want an owned overlay wrapper.',
    '',
  ].join('\n');
}
