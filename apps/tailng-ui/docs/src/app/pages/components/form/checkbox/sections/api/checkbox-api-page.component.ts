import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-checkbox-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './checkbox-api-page.component.html',
  styleUrl: './checkbox-api-page.component.css',
})
export class CheckboxApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<label>',
    '  <input tngCheckbox [checked]="true" />',
    '  <span>Enable alerts</span>',
    '</label>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-checkbox [checked]="checked" (checkedChange)="checked = $event">',
    '  Enable alerts',
    '</tng-checkbox>',
    '',
  ].join('\n');

  protected readonly reactiveFormCode = [
    "readonly releaseControl = new FormControl<boolean | 'mixed'>(false);",
    '',
    '<form [formGroup]="form">',
    '  <tng-checkbox formControlName="releaseReady">Release ready</tng-checkbox>',
    '</form>',
    '',
  ].join('\n');
}
