import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-input-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-api-page.component.html',
  styleUrl: './input-api-page.component.css',
})
export class InputApiPageComponent {
  protected readonly componentTemplateCode = [
    '<tng-input type="email" placeholder="team@tailng.dev"></tng-input>',
    '',
  ].join('\n');

  protected readonly formFieldTemplateCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search docs" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly directiveAttachCode = [
    '<input tngInput type="text" />',
    '',
  ].join('\n');
}
