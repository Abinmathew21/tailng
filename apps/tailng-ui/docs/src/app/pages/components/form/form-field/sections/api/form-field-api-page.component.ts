import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-form-field-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './form-field-api-page.component.html',
  styleUrls: ['../../../input/sections/api/input-api-page.component.css'],
})
export class FormFieldApiPageComponent {
  protected readonly formFieldTemplateCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search docs" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly controlContractCode = [
    '<tng-form-field>',
    '  <input tngInput type="text" />',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly slotsCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">$</span>',
    '  <input tngInput type="text" />',
    '  <button tngSuffix type="button" aria-label="Clear value">Clear</button>',
    '</tng-form-field>',
    '',
  ].join('\n');
}
