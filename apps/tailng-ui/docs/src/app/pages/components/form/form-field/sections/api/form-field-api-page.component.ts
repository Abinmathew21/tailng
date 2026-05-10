import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-form-field-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './form-field-api-page.component.html',
})
export class FormFieldApiPageComponent {
  protected readonly importsCode = [
    "import { TngError, TngFormFieldComponent, TngFormFieldPrefix, TngFormFieldSuffix, TngHint, TngInputComponent, TngLabelComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly controlContractCode = [
    "import { TNG_FORM_FIELD_CONTROL, type TngFormFieldControl } from '@tailng-ui/components';",
    '',
    'providers: [{ provide: TNG_FORM_FIELD_CONTROL, useExisting: MyControl }]',
    '',
  ].join('\n');
}
